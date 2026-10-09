import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';

export function useTerminalSocket(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize xterm.js
    const term = new Terminal({
      theme: {
        background: '#0a0a12',
        foreground: '#f4f4f7',
        cursor: '#22d3ee',
        selectionBackground: 'rgba(139, 92, 246, 0.3)',
        black: '#12121e',
        red: '#f87171',
        green: '#34d399',
        yellow: '#fbbf24',
        blue: '#60a5fa',
        magenta: '#c084fc',
        cyan: '#22d3ee',
        white: '#ffffff',
      },
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      fontSize: 13,
      lineHeight: 1.25,
      cursorBlink: true,
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // Connect socket
    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      const cols = term.cols || 80;
      const rows = term.rows || 24;
      socket.emit('terminal:init', { cols, rows });
    });

    socket.on('terminal:ready', () => {
      // Fit again once connected
      fitAddon.fit();
    });

    socket.on('terminal:output', (data: string) => {
      term.write(data);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      term.write('\r\n\x1b[33m[VibeFlow Terminal Disconnected]\x1b[0m\r\n');
    });

    // Keystroke forwarding
    const onDataDisposable = term.onData((data) => {
      socket.emit('terminal:input', data);
    });

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
        if (socket.connected) {
          socket.emit('terminal:resize', {
            cols: term.cols,
            rows: term.rows,
          });
        }
      } catch (e) {
        // ignore
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      onDataDisposable.dispose();
      resizeObserver.disconnect();
      socket.disconnect();
      term.dispose();
      termRef.current = null;
      fitAddonRef.current = null;
    };
  }, [containerRef]);

  const fitTerminal = () => {
    if (fitAddonRef.current) {
      try {
        fitAddonRef.current.fit();
      } catch (e) {
        // ignore
      }
    }
  };

  return { isConnected, fitTerminal };
}
