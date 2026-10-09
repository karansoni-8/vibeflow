import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers } from 'lucide-react';

export const SubprocessNode = memo(({ data, selected }: any) => {
  return (
    <div
      className={`min-w-[160px] max-w-[220px] px-4 py-2 border-y border-x-4 rounded-md text-center transition-all cursor-pointer relative shadow-md ${
        selected
          ? 'bg-blue-950/90 border-blue-400 ring-2 ring-blue-400/40 text-blue-100'
          : 'bg-dark-850/90 border-blue-600/70 text-blue-200 hover:border-blue-400'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-slate-400 border-2 border-dark-900 !rounded-full"
      />

      <div className="flex items-center justify-center gap-1.5 mb-1">
        <Layers className="w-3 h-3 text-blue-400" />
        <span className="text-[10px] font-mono text-blue-300 uppercase tracking-wider">Subprocess</span>
        {data.lineStart && (
          <span className="text-[9px] font-mono bg-dark-700/80 px-1 rounded text-blue-300 ml-auto">
            L{data.lineStart}
          </span>
        )}
      </div>
      <div className="text-xs font-mono font-medium truncate text-blue-100" title={data.label}>
        {data.label}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-blue-400 border-2 border-dark-900 !rounded-full"
      />
    </div>
  );
});

SubprocessNode.displayName = 'SubprocessNode';
