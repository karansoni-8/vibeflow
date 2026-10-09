import React, { useMemo } from 'react';
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
  subprocess: ProcessNode,
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
