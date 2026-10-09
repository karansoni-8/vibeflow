import { spawn, execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  status: 'success' | 'error' | 'timeout';
}

const EXEC_TIMEOUT = process.env.VIBE_EXEC_TIMEOUT ? parseInt(process.env.VIBE_EXEC_TIMEOUT, 10) : 5000;
const MAX_BUFFER = 1024 * 1024; // 1MB

export async function executeCode(language: string, code: string, stdin: string = '', timeoutMs: number = EXEC_TIMEOUT): Promise<ExecutionResult> {
  const runId = uuidv4();
  const tmpDir = path.join(os.tmpdir(), `vibeflow_${runId}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    if (language === 'cpp') {
      const srcFile = path.join(tmpDir, 'main.cpp');
      const binFile = path.join(tmpDir, os.platform() === 'win32' ? 'main.exe' : 'main');
      fs.writeFileSync(srcFile, code);
      
      const compileResult = await runProcess('g++', [srcFile, '-o', binFile], '', tmpDir, timeoutMs);
      if (compileResult.exitCode !== 0) {
        return compileResult;
      }
      return await runProcess(binFile, [], stdin, tmpDir, timeoutMs);
    } else if (language === 'python') {
      const srcFile = path.join(tmpDir, 'main.py');
      fs.writeFileSync(srcFile, code);
      const pyCmd = os.platform() === 'win32' ? 'python' : 'python3';
      return await runProcess(pyCmd, [srcFile], stdin, tmpDir, timeoutMs);
    } else if (language === 'javascript') {
      const srcFile = path.join(tmpDir, 'main.js');
      fs.writeFileSync(srcFile, code);
      return await runProcess('node', [srcFile], stdin, tmpDir, timeoutMs);
    } else if (language === 'java') {
      const srcFile = path.join(tmpDir, 'Main.java');
      fs.writeFileSync(srcFile, code);
      
      const compileResult = await runProcess('javac', ['Main.java'], '', tmpDir, timeoutMs);
      if (compileResult.exitCode !== 0) {
        return compileResult;
      }
      return await runProcess('java', ['Main'], stdin, tmpDir, timeoutMs);
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  } finally {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch (e) {
      console.error(`Failed to clean up tmp dir ${tmpDir}`, e);
    }
  }
}

function runProcess(cmd: string, args: string[], stdin: string, cwd: string, timeoutMs: number): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdoutData = '';
    let stderrData = '';
    
    // Strip environment except PATH
    const env = { PATH: process.env.PATH };

    const child = spawn(cmd, args, { cwd, env });
    let isFinished = false;

    const timeoutTimer = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        killProcessTree(child.pid!);
        resolve({
          stdout: stdoutData,
          stderr: stderrData + '\nExecution timed out.',
          exitCode: null,
          executionTimeMs: Date.now() - startTime,
          status: 'timeout'
        });
      }
    }, timeoutMs);

    if (stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }

    child.stdout.on('data', (data) => {
      if (stdoutData.length < MAX_BUFFER) {
        stdoutData += data.toString();
        if (stdoutData.length > MAX_BUFFER) stdoutData = stdoutData.substring(0, MAX_BUFFER) + '\n[Output truncated]';
      }
    });

    child.stderr.on('data', (data) => {
      if (stderrData.length < MAX_BUFFER) {
        stderrData += data.toString();
        if (stderrData.length > MAX_BUFFER) stderrData = stderrData.substring(0, MAX_BUFFER) + '\n[Output truncated]';
      }
    });

    child.on('error', (err) => {
      if (!isFinished) {
        isFinished = true;
        clearTimeout(timeoutTimer);
        resolve({
          stdout: stdoutData,
          stderr: stderrData + '\n' + err.message,
          exitCode: -1,
          executionTimeMs: Date.now() - startTime,
          status: 'error'
        });
      }
    });

    child.on('close', (code) => {
      if (!isFinished) {
        isFinished = true;
        clearTimeout(timeoutTimer);
        resolve({
          stdout: stdoutData,
          stderr: stderrData,
          exitCode: code,
          executionTimeMs: Date.now() - startTime,
          status: code === 0 ? 'success' : 'error'
        });
      }
    });
  });
}

function killProcessTree(pid: number) {
  try {
    if (os.platform() === 'win32') {
      execSync(`taskkill /pid ${pid} /f /t`);
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch (e) {
    // Ignore errors from process killing
  }
}
