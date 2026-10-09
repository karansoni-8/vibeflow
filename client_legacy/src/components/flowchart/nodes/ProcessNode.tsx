import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function ProcessNode({ data }: any) {
  return (
    <div className="px-4 py-3 rounded-md border border-white/10 border-l-4 border-l-[#38bdf8] bg-[#141c2b]/90 backdrop-blur-md shadow-lg shadow-[#38bdf8]/10 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-[#38bdf8] border-none" />
      <div className="font-mono text-sm text-white/90">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-[#38bdf8] border-none" />
    </div>
  );
}
