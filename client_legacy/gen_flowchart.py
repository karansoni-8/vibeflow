import os

base_dir = r"C:\Users\devel\.gemini\antigravity\scratch\vibeflow\client\src"

files = {
    "components/flowchart/FlowchartPanel.tsx": """import React, { useMemo } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useIdeStore } from '@/store/ideStore';
import StartEndNode from './nodes/StartEndNode';
import ProcessNode from './nodes/ProcessNode';
import DecisionNode from './nodes/DecisionNode';
import InputOutputNode from './nodes/InputOutputNode';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const nodeTypes = {
  start: StartEndNode,
  end: StartEndNode,
  process: ProcessNode,
  decision: DecisionNode,
  inputOutput: InputOutputNode,
  subprocess: ProcessNode, // Simplified
};

export default function FlowchartPanel() {
  const { flowchartData, isGeneratingFlowchart } = useIdeStore();

  const nodes = useMemo(() => flowchartData?.nodes || [], [flowchartData]);
  const edges = useMemo(() => flowchartData?.edges || [], [flowchartData]);

  return (
    <div className="h-full flex flex-col bg-[#0b0f17] border-l border-white/10">
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#06090e]">
        <h3 className="text-sm font-semibold text-white/80">Flowchart Viewer</h3>
      </div>
      
      <div className="flex-1 relative">
        {isGeneratingFlowchart ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#38bdf8]">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Generating flowchart...</p>
          </div>
        ) : !flowchartData ? (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 px-8 text-center">
            Click "Generate Flowchart" in the toolbar to visualize your code
          </div>
        ) : (
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[#0b0f17]"
              proOptions={{ hideAttribution: true }}
            >
              <Background color="#ffffff" gap={16} size={1} opacity={0.1} />
              <Controls className="bg-[#141c2b] border border-white/10 fill-white" />
            </ReactFlow>
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
""",
    "components/flowchart/nodes/StartEndNode.tsx": """import React from 'react';
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
""",
    "components/flowchart/nodes/ProcessNode.tsx": """import React from 'react';
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
""",
    "components/flowchart/nodes/DecisionNode.tsx": """import React from 'react';
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
""",
    "components/flowchart/nodes/InputOutputNode.tsx": """import React from 'react';
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
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path.replace('/', os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
