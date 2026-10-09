import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function InputOutputNode({ data }: any) {
  return (
    <div className="relative min-w-[160px] h-[50px] flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-[#a855f7] bg-[#141c2b]/90 backdrop-blur-md shadow-lg shadow-[#a855f7]/10 transform skew-x-[-20deg] rounded-sm" />
      <div className="relative z-10 px-6 font-mono text-sm text-[#a855f7]">
        {data.label}
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-[#a855f7] border-none z-20" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-[#a855f7] border-none z-20" />
    </div>
  );
}
