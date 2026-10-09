import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
const TIMEOUT_MS = 5000;
export async function executeCode(language, code, input = '') {
    const execId = uuidv4().slice(0, 8);
    const tempDir = path.join(os.tmpdir(), `vibeflow_exec_${execId}`);
    try {
        await fs.mkdir(tempDir, { recursive: true });
        if (language === 'python') {
            return await executePython(tempDir, code, input);
        }
        else if (language === 'cpp') {
            return await executeCpp(tempDir, code, input);
        }
        else if (language === 'javascript') {
            return await executeJavascript(tempDir, code, input);
        }
        else {
            return {
                id: execId,
                stdout: '',
                stderr: `Language "${language}" execution is not yet configured on this environment.`,
                exitCode: 1,
                executionTimeMs: 0,
                status: 'error',
            };
        }
    }
    catch (err) {
        return {
            id: execId,
            stdout: '',
            stderr: err.message || 'Execution failed due to an internal error.',
            exitCode: 1,
            executionTimeMs: 0,
            status: 'error',
        };
    }
    finally {
        // Attempt async cleanup
        fs.rm(tempDir, { recursive: true, force: true }).catch(() => { });
    }
}
async function executePython(tempDir, code, input) {
    const filePath = path.join(tempDir, 'script.py');
    await fs.writeFile(filePath, code, 'utf-8');
    return runProcess('python', ['-u', filePath], input, TIMEOUT_MS);
}
async function executeCpp(tempDir, code, input) {
    const sourcePath = path.join(tempDir, 'main.cpp');
    const exePath = path.join(tempDir, process.platform === 'win32' ? 'program.exe' : 'program');
    await fs.writeFile(sourcePath, code, 'utf-8');
    // Step 1: Compile
    const compileStart = Date.now();
    const compileResult = await runProcess('g++', ['-O2', sourcePath, '-o', exePath], '', 10000);
    if (compileResult.exitCode !== 0) {
        return {
            id: uuidv4().slice(0, 8),
            stdout: compileResult.stdout,
            stderr: compileResult.stderr || 'Compilation failed.',
            exitCode: compileResult.exitCode,
            executionTimeMs: Date.now() - compileStart,
            status: 'error',
        };
    }
    // Step 2: Execute compiled binary
    return runProcess(exePath, [], input, TIMEOUT_MS);
}
async function executeJavascript(tempDir, code, input) {
    const filePath = path.join(tempDir, 'script.js');
    await fs.writeFile(filePath, code, 'utf-8');
    return runProcess('node', [filePath], input, TIMEOUT_MS);
}
function runProcess(cmd, args, stdinInput, timeoutMs) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        let stdoutData = '';
        let stderrData = '';
        let isTimedOut = false;
        const child = spawn(cmd, args, {
            windowsHide: true,
            env: { ...process.env, PYTHONUNBUFFERED: '1' },
        });
        const timer = setTimeout(() => {
            isTimedOut = true;
            try {
                if (process.platform === 'win32') {
                    // Force kill process tree on Windows
                    spawn('taskkill', ['/pid', child.pid.toString(), '/f', '/t']);
                }
                else {
                    child.kill('SIGKILL');
                }
            }
            catch { }
        }, timeoutMs);
        if (stdinInput && child.stdin) {
            try {
                child.stdin.write(stdinInput);
                child.stdin.end();
            }
            catch { }
        }
        else if (child.stdin) {
            child.stdin.end();
        }
        child.stdout?.on('data', (data) => {
            stdoutData += data.toString();
        });
        child.stderr?.on('data', (data) => {
            stderrData += data.toString();
        });
        child.on('error', (err) => {
            clearTimeout(timer);
            resolve({
                id: uuidv4().slice(0, 8),
                stdout: stdoutData,
                stderr: stderrData + `\nProcess error: ${err.message}`,
                exitCode: 1,
                executionTimeMs: Date.now() - startTime,
                status: 'error',
            });
        });
        child.on('close', (code) => {
            clearTimeout(timer);
            const executionTime = Date.now() - startTime;
            if (isTimedOut) {
                resolve({
                    id: uuidv4().slice(0, 8),
                    stdout: stdoutData,
                    stderr: `\n[Execution Timeout]: Program exceeded the ${timeoutMs / 1000}-second execution limit. This may indicate an infinite loop or expensive computation.`,
                    exitCode: 124,
                    executionTimeMs: executionTime,
                    timedOut: true,
                    status: 'timeout',
                });
            }
            else {
                resolve({
                    id: uuidv4().slice(0, 8),
                    stdout: stdoutData,
                    stderr: stderrData,
                    exitCode: code ?? 0,
                    executionTimeMs: executionTime,
                    status: (code === 0) ? 'success' : 'error',
                });
            }
        });
    });
}
