import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * SECURITY NOTE:
 * Full shell access — for local development only.
 * Do not deploy this endpoint publicly without containerizing each session (e.g. gVisor, Docker per session).
 */
export function setupTerminalSocket(io: Server): void {
  const workspacesRoot = path.resolve(process.cwd(), 'workspaces');
  if (!fs.existsSync(workspacesRoot)) {
    fs.mkdirSync(workspacesRoot, { recursive: true });
  }

  io.on('connection', (socket: Socket) => {
    let ptyProcess: pty.IPty | null = null;
    let sessionDir: string = '';

    socket.on('terminal:init', ({ sessionId, cols, rows }: { sessionId?: string; cols?: number; rows?: number }) => {
      const id = sessionId || socket.id;
      sessionDir = path.join(workspacesRoot, id);

      if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
      }

      // Detect shell based on platform
      const isWindows = process.platform === 'win32';
      const shell = isWindows
        ? (process.env.COMSPEC || 'powershell.exe')
        : (process.env.SHELL || '/bin/bash');

      const shellArgs = isWindows && shell.includes('powershell') ? ['-NoLogo'] : [];

      try {
        ptyProcess = pty.spawn(shell, shellArgs, {
          name: 'xterm-256color',
          cols: cols || 80,
          rows: rows || 24,
          cwd: sessionDir,
          env: process.env as { [key: string]: string },
        });

        // Pipe PTY output to the socket
        ptyProcess.onData((data: string) => {
          socket.emit('terminal:output', data);
        });

        ptyProcess.onExit(({ exitCode, signal }) => {
          socket.emit('terminal:exit', { exitCode, signal });
          ptyProcess = null;
        });

        socket.emit('terminal:ready', {
          cwd: sessionDir,
          shell: path.basename(shell),
        });
      } catch (err: any) {
        console.error('Failed to spawn terminal PTY:', err);
        socket.emit('terminal:output', `\r\nError launching terminal: ${err.message}\r\n`);
      }
    });

    socket.on('terminal:input', (data: string) => {
      if (ptyProcess) {
        try {
          ptyProcess.write(data);
        } catch (err) {
          // ignore
        }
      }
    });

    socket.on('terminal:resize', ({ cols, rows }: { cols: number; rows: number }) => {
      if (ptyProcess && cols > 0 && rows > 0) {
        try {
          ptyProcess.resize(cols, rows);
        } catch (err) {
          // ignore
        }
      }
    });

    const cleanup = () => {
      if (ptyProcess) {
        try {
          ptyProcess.kill();
        } catch (e) {
          // ignore
        }
        ptyProcess = null;
      }
    };

    socket.on('disconnect', cleanup);
    socket.on('terminal:close', cleanup);
  });
}
