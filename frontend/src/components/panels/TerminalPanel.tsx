import React, { useRef } from 'react';
import {
  Terminal as TerminalIcon,
  ShieldAlert,
  Maximize2,
  Trash2,
} from 'lucide-react';
import { useTerminalSocket } from '../../hooks/useTerminalSocket';

export const TerminalPanel: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isConnected, fitTerminal } = useTerminalSocket(terminalRef);

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0a12] select-none overflow-hidden relative">
      {/* Terminal Toolbar */}
      <div className="h-8 bg-[#0d0d16] border-b border-white/5 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-white/90">Integrated Shell Terminal</span>
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400' : 'bg-rose-400'
            }`}
            title={isConnected ? 'PTY Shell Active' : 'Disconnected'}
          />
          <span className="text-[10px] text-[#9a9ab0]">
            {isConnected ? 'node-pty ready' : 'Connecting...'}
          </span>
        </div>

        {/* Security Warning Badge */}
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-1.5 text-[10px] text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"
            title="Real shell process running on local development machine. Never expose on public network without containerization."
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Local Shell Mode</span>
          </div>

          <button
            onClick={() => fitTerminal()}
            className="text-[#9a9ab0] hover:text-white p-1 rounded hover:bg-white/5 transition"
            title="Fit to window"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* xterm.js DOM Mount Target */}
      <div
        ref={terminalRef}
        className="flex-1 w-full h-full p-2 overflow-hidden"
        style={{ minHeight: '120px' }}
      />
    </div>
  );
};
