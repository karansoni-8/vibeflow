import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/cn';

export default function StartEndNode({ data, type }: any) {
  const isStart = type === 'start';
  return (
    <div className={cn(
      "px-6 py-2 rounded-full border-2 bg-[#141c2b]/90 backdrop-blur-md shadow-lg flex items-center justify-center min-w-[100px]",
      isStart ? "border-[#10b981] shadow-[#10b981]/20 text-[#10b981]" : "border-[#f43f5e] shadow-[#f43f5e]/20 text-[#f43f5e]"
    )}>
      {isStart && <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-[#10b981] border-none" />}
      {!isStart && <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-[#f43f5e] border-none" />}
      <span className="font-bold text-sm tracking-wider uppercase">{data.label}</span>
    </div>
  );
}
