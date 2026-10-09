import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function DecisionNode({ data }: any) {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-[#eab308] bg-[#141c2b]/90 backdrop-blur-md shadow-lg shadow-[#eab308]/10 transform rotate-45 rounded-sm" />
      <div className="relative z-10 p-4 text-center font-mono text-xs text-[#eab308] max-w-full break-words">
        {data.label}
      </div>
      
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-[#eab308] border-none z-20" />
      <Handle type="source" position={Position.Bottom} id="yes" className="w-2 h-2 !bg-[#10b981] border-none z-20 left-1/4" />
      <Handle type="source" position={Position.Bottom} id="no" className="w-2 h-2 !bg-[#f43f5e] border-none z-20 left-3/4" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !bg-[#eab308] border-none z-20" />
      <Handle type="source" position={Position.Left} id="left" className="w-2 h-2 !bg-[#eab308] border-none z-20" />
    </div>
  );
}
