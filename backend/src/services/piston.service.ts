import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import { config } from '../config/env.js';

export interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

// Cached runtimes list
let cachedRuntimes: PistonRuntime[] = [
  { language: 'python', version: '3.10.0', aliases: ['py', 'python3'] },
  { language: 'c++', version: '10.2.0', aliases: ['cpp', 'g++'] },
  { language: 'c', version: '10.2.0', aliases: ['gcc'] },
  { language: 'javascript', version: '18.15.0', aliases: ['js', 'node'] },
  { language: 'java', version: '15.0.2', aliases: [] },
];

export async function fetchRuntimes(): Promise<PistonRuntime[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${config.pistonApiUrl}/runtimes`, { signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as PistonRuntime[];
      if (Array.isArray(data) && data.length > 0) {
        cachedRuntimes = data;
      }
    }
  } catch (err: any) {
    // Keep fallback list if Piston endpoint is unreachable
  }
  return cachedRuntimes;
}

export function getCachedRuntimes(): PistonRuntime[] {
  return cachedRuntimes;
}

/**
 * Executes code via Piston API if whitelisted/available,
 * or gracefully falls back to native local execution with child_process.
 */
export async function executeCode(
  language: string,
  code: string,
  version?: string,
  stdin: string = ''
): Promise<ExecutionResult> {
  const lang = language.toLowerCase();

  // Try Piston first if remote URL is configured
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const pistonRes = await fetch(`${config.pistonApiUrl}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang,
        version: version || '*',
        files: [{ content: code }],
        stdin,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (pistonRes.ok) {
      const data: any = await pistonRes.json();
      if (data.run) {
        return {
          stdout: data.run.stdout || '',
          stderr: (data.compile?.stderr ? data.compile.stderr + '\n' : '') + (data.run.stderr || ''),
          exitCode: data.run.code ?? (data.compile?.code || 0),
          durationMs: data.run.time ? Math.round(data.run.time * 1000) : 120,
        };
      }
    }
  } catch (pistonErr) {
    // Fall through to native local execution
  }

  // Native execution fallback for Python, C++, C, JavaScript
  return executeLocally(lang, code, stdin);
}

function executeLocally(
  lang: string,
  code: string,
  stdin: string = '',
  timeoutMs = 5000
): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const tempDir = path.join(os.tmpdir(), `vibeflow_exec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
    fs.mkdirSync(tempDir, { recursive: true });

    const startTime = Date.now();

    const cleanup = () => {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (e) {
        // ignore
      }
    };

    if (lang === 'python' || lang === 'py' || lang === 'python3') {
      const scriptPath = path.join(tempDir, 'solution.py');
      fs.writeFileSync(scriptPath, code, 'utf-8');

      const proc = spawn('python', [scriptPath], { cwd: tempDir, shell: true });
      let stdout = '';
      let stderr = '';
      let hasTimedOut = false;

      const timer = setTimeout(() => {
        hasTimedOut = true;
        proc.kill('SIGKILL');
      }, timeoutMs);

      if (stdin) {
        proc.stdin.write(stdin);
      }
      proc.stdin.end();

      proc.stdout.on('data', (d) => (stdout += d.toString()));
      proc.stderr.on('data', (d) => (stderr += d.toString()));

      proc.on('close', (code) => {
        clearTimeout(timer);
        cleanup();
        resolve({
          stdout,
          stderr: hasTimedOut ? stderr + '\n[Process timed out after 5 seconds]' : stderr,
          exitCode: hasTimedOut ? 124 : (code ?? 0),
          durationMs: Date.now() - startTime,
        });
      });

      proc.on('error', (err) => {
        clearTimeout(timer);
        cleanup();
        resolve({
          stdout,
          stderr: `Execution error: ${err.message}`,
          exitCode: 1,
          durationMs: Date.now() - startTime,
        });
      });
      return;
    }

    if (lang === 'c++' || lang === 'cpp') {
      const srcPath = path.join(tempDir, 'solution.cpp');
      const exePath = path.join(tempDir, 'solution.exe');
      fs.writeFileSync(srcPath, code, 'utf-8');

      // Compile with g++
      const compileProc = spawn('g++', ['-O2', srcPath, '-o', exePath], { cwd: tempDir, shell: true });
      let compileErr = '';

      compileProc.stderr.on('data', (d) => (compileErr += d.toString()));

      compileProc.on('close', (compileCode) => {
        if (compileCode !== 0) {
          cleanup();
          return resolve({
            stdout: '',
            stderr: compileErr || 'Compilation failed',
            exitCode: compileCode ?? 1,
            durationMs: Date.now() - startTime,
          });
        }

        // Run compiled binary
        const runProc = spawn(exePath, [], { cwd: tempDir, shell: true });
        let stdout = '';
        let stderr = '';
        let hasTimedOut = false;

        const timer = setTimeout(() => {
          hasTimedOut = true;
          runProc.kill('SIGKILL');
        }, timeoutMs);

        if (stdin) {
          runProc.stdin.write(stdin);
        }
        runProc.stdin.end();

        runProc.stdout.on('data', (d) => (stdout += d.toString()));
        runProc.stderr.on('data', (d) => (stderr += d.toString()));

        runProc.on('close', (runCode) => {
          clearTimeout(timer);
          cleanup();
          resolve({
            stdout,
            stderr: hasTimedOut ? stderr + '\n[Process timed out after 5 seconds]' : stderr,
            exitCode: hasTimedOut ? 124 : (runCode ?? 0),
            durationMs: Date.now() - startTime,
          });
        });

        runProc.on('error', (err) => {
          clearTimeout(timer);
          cleanup();
          resolve({
            stdout,
            stderr: `Runtime error: ${err.message}`,
            exitCode: 1,
            durationMs: Date.now() - startTime,
          });
        });
      });
      return;
    }

    if (lang === 'c') {
      const srcPath = path.join(tempDir, 'solution.c');
      const exePath = path.join(tempDir, 'solution.exe');
      fs.writeFileSync(srcPath, code, 'utf-8');

      const compileProc = spawn('gcc', ['-O2', srcPath, '-o', exePath], { cwd: tempDir, shell: true });
      let compileErr = '';
      compileProc.stderr.on('data', (d) => (compileErr += d.toString()));

      compileProc.on('close', (compileCode) => {
        if (compileCode !== 0) {
          cleanup();
          return resolve({
            stdout: '',
            stderr: compileErr || 'C Compilation failed',
            exitCode: compileCode ?? 1,
            durationMs: Date.now() - startTime,
          });
        }

        const runProc = spawn(exePath, [], { cwd: tempDir, shell: true });
        let stdout = '';
        let stderr = '';
        let hasTimedOut = false;

        const timer = setTimeout(() => {
          hasTimedOut = true;
          runProc.kill('SIGKILL');
        }, timeoutMs);

        if (stdin) {
          runProc.stdin.write(stdin);
        }
        runProc.stdin.end();

        runProc.stdout.on('data', (d) => (stdout += d.toString()));
        runProc.stderr.on('data', (d) => (stderr += d.toString()));

        runProc.on('close', (runCode) => {
          clearTimeout(timer);
          cleanup();
          resolve({
            stdout,
            stderr: hasTimedOut ? stderr + '\n[Process timed out after 5 seconds]' : stderr,
            exitCode: hasTimedOut ? 124 : (runCode ?? 0),
            durationMs: Date.now() - startTime,
          });
        });
      });
      return;
    }

    if (lang === 'javascript' || lang === 'js') {
      const scriptPath = path.join(tempDir, 'solution.js');
      fs.writeFileSync(scriptPath, code, 'utf-8');

      const proc = spawn('node', [scriptPath], { cwd: tempDir, shell: true });
      let stdout = '';
      let stderr = '';
      let hasTimedOut = false;

      const timer = setTimeout(() => {
        hasTimedOut = true;
        proc.kill('SIGKILL');
      }, timeoutMs);

      if (stdin) {
        proc.stdin.write(stdin);
      }
      proc.stdin.end();

      proc.stdout.on('data', (d) => (stdout += d.toString()));
      proc.stderr.on('data', (d) => (stderr += d.toString()));

      proc.on('close', (code) => {
        clearTimeout(timer);
        cleanup();
        resolve({
          stdout,
          stderr: hasTimedOut ? stderr + '\n[Process timed out after 5 seconds]' : stderr,
          exitCode: hasTimedOut ? 124 : (code ?? 0),
          durationMs: Date.now() - startTime,
        });
      });
      return;
    }

    // Default unsupported language
    cleanup();
    resolve({
      stdout: '',
      stderr: `Language "${lang}" is not supported for local compilation.`,
      exitCode: 1,
      durationMs: 0,
    });
  });
}
