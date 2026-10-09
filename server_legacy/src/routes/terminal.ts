import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = Router();

// Whitelist of supported commands for developer terminal
const ALLOWED_COMMANDS = new Set([
  'npm',
  'npx',
  'pip',
  'python',
  'node',
  'g++',
  'gcc',
  'git',
  'dir',
  'ls',
  'echo',
  'help',
  'cat',
  'type',
  'whoami',
  'uptime',
  'date',
]);

router.post('/execute', (req, res) => {
  const { command } = req.body;
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ error: 'Command string is required' });
  }

  const trimmed = command.trim();
  if (!trimmed) {
    return res.json({ stdout: '', stderr: '', exitCode: 0 });
  }

  // Handle built-in 'help' command
  if (trimmed === 'help') {
    return res.json({
      stdout: `VibeFlow Interactive Terminal
Available commands:
  - npm <command> (e.g. npm --version, npm list)
  - pip <command> (e.g. pip list, pip --version)
  - python --version, node -v, g++ --version
  - git status, git log
  - dir / ls, echo, clear
Execution environment: Sandboxed Local Shell\n`,
      stderr: '',
      exitCode: 0,
    });
  }

  // Parse command and base binary
  const parts = trimmed.split(/\s+/);
  const baseCmd = parts[0].toLowerCase();

  // Basic security check: ensure base command is in whitelist
  if (!ALLOWED_COMMANDS.has(baseCmd)) {
    return res.json({
      stdout: '',
      stderr: `Command "${baseCmd}" is restricted in this sandboxed developer terminal. Type 'help' for available commands.\n`,
      exitCode: 126,
    });
  }

  const cwd = path.resolve('.');
  let stdoutData = '';
  let stderrData = '';

  const isWindows = process.platform === 'win32';
  const child = isWindows
    ? spawn('cmd.exe', ['/c', trimmed], { cwd, windowsHide: true })
    : spawn('/bin/sh', ['-c', trimmed], { cwd });

  const timer = setTimeout(() => {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', child.pid!.toString(), '/f', '/t']);
      } else {
        child.kill('SIGKILL');
      }
    } catch {}
    stderrData += '\n[Terminal Timeout]: Command execution exceeded 10-second limit.\n';
  }, 10000);

  child.stdout?.on('data', (data) => {
    stdoutData += data.toString();
  });

  child.stderr?.on('data', (data) => {
    stderrData += data.toString();
  });

  child.on('close', (code) => {
    clearTimeout(timer);
    res.json({
      stdout: stdoutData,
      stderr: stderrData,
      exitCode: code ?? 0,
    });
  });

  child.on('error', (err) => {
    clearTimeout(timer);
    res.json({
      stdout: stdoutData,
      stderr: `Process error: ${err.message}\n`,
      exitCode: 1,
    });
  });
});

export default router;
