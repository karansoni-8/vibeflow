import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { StartEndNode } from './nodes/StartEndNode';
import { ProcessNode } from './nodes/ProcessNode';
import { DecisionNode } from './nodes/DecisionNode';
import { InputOutputNode } from './nodes/InputOutputNode';
import { SubprocessNode } from './nodes/SubprocessNode';
import { FlowchartGraph, FlowchartNode } from '../../types';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RefreshCw,
  GitBranch,
  Sparkles,
} from 'lucide-react';

interface FlowchartViewerProps {
  graph: FlowchartGraph | null;
  loading?: boolean;
  activeLine?: number | null;
  onSelectLine?: (lineStart?: number, lineEnd?: number) => void;
}

const nodeTypes = {
  start: StartEndNode,
  end: StartEndNode,
  process: ProcessNode,
  decision: DecisionNode,
  inputOutput: InputOutputNode,
  subprocess: SubprocessNode,
  loop: DecisionNode,
};

// Dagre Layout Engine
function getLayoutedElements(graph: FlowchartGraph, activeLine?: number | null) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'TB',
    nodesep: 60,
    ranksep: 75,
    marginx: 30,
    marginy: 30,
  });

  // Calculate dimensions based on node type
  graph.nodes.forEach((node) => {
    let width = 180;
    let height = 60;
    if (node.type === 'start' || node.type === 'end') {
      width = 130;
      height = 45;
    } else if (node.type === 'decision' || node.type === 'loop') {
      width = 130;
      height = 130;
    } else if (node.type === 'inputOutput') {
      width = 190;
      height = 55;
    }
    dagreGraph.setNode(node.id, { width, height });
  });

  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: Node[] = graph.nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const isSelectedByLine = Boolean(
      activeLine &&
      node.lineStart &&
      node.lineEnd &&
      activeLine >= node.lineStart &&
      activeLine <= node.lineEnd
    );

    return {
      id: node.id,
      type: node.type,
      position: {
        x: (nodeWithPosition?.x || 0) - (nodeWithPosition?.width || 180) / 2,
        y: (nodeWithPosition?.y || 0) - (nodeWithPosition?.height || 60) / 2,
      },
      data: {
        ...node,
      },
      selected: isSelectedByLine,
    };
  });

  const layoutedEdges: Edge[] = graph.edges.map((edge) => {
    let strokeColor = '#38bdf8';
    let labelBgStyle = { fill: '#0b0f17', fillOpacity: 0.9, stroke: '#1e293b' };
    let labelStyle: React.CSSProperties = { fill: '#38bdf8', fontWeight: 700, fontFamily: 'monospace', fontSize: 10 };

    if (edge.label === 'YES') {
      strokeColor = '#10b981';
      labelStyle.fill = '#34d399';
    } else if (edge.label === 'NO') {
      strokeColor = '#f43f5e';
      labelStyle.fill = '#fb7185';
    } else if (edge.label === 'REPEAT') {
      strokeColor = '#06b6d4';
      labelStyle.fill = '#22d3ee';
    }

    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.label === 'YES' || edge.label === 'REPEAT',
      style: { stroke: strokeColor, strokeWidth: 2 },
      labelBgStyle,
      labelStyle,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 14,
        height: 14,
        color: strokeColor,
      },
    };
  });

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

function FlowchartCanvas({ graph, loading, activeLine, onSelectLine }: FlowchartViewerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // Layout recalculation
  const updateLayout = useCallback(() => {
    if (!graph || graph.nodes.length === 0) return;
    const { nodes: lNodes, edges: lEdges } = getLayoutedElements(graph, activeLine);
    setNodes(lNodes);
    setEdges(lEdges);
    setTimeout(() => {
      fitView({ padding: 0.2, duration: 400 });
    }, 50);
  }, [graph, activeLine, fitView, setNodes, setEdges]);

  useEffect(() => {
    updateLayout();
  }, [updateLayout]);

  // Code line synchronization on node click
  const handleNodeClick = useCallback(
    (_: any, node: Node) => {
      const data = node.data as unknown as FlowchartNode;
      if (data && onSelectLine) {
        onSelectLine(data.lineStart, data.lineEnd);
      }
    },
    [onSelectLine]
  );

  return (
    <div className={`relative w-full h-full flex flex-col bg-dark-950 select-none overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-dark-950/95' : ''}`}>
      {/* Top Flowchart Header & Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-dark-900/90 border-b border-white/5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-brand-cyan" />
          <span className="font-semibold text-slate-200">Control Flow Diagram</span>
          {loading && (
            <span className="flex items-center gap-1.5 text-brand-cyan font-mono text-[11px] animate-pulse">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Syncing...
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => zoomIn({ duration: 200 })}
            className="p-1.5 rounded hover:bg-dark-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => zoomOut({ duration: 200 })}
            className="p-1.5 rounded hover:bg-dark-800 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => fitView({ padding: 0.2, duration: 400 })}
            className="p-1.5 rounded hover:bg-dark-800 text-slate-300 hover:text-white transition-colors"
            title="Fit Diagram"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-dark-800 text-slate-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Flowchart Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          minZoom={0.2}
          maxZoom={1.8}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={18} size={1} />
        </ReactFlow>

        {/* Helper Hint */}
        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-slate-500 bg-dark-900/80 px-2 py-1 rounded border border-white/5 pointer-events-none">
          Click any node to navigate to code • Drag to pan
        </div>
      </div>
    </div>
  );
}

export function FlowchartViewer(props: FlowchartViewerProps) {
  return (
    <ReactFlowProvider>
      <FlowchartCanvas {...props} />
    </ReactFlowProvider>
  );
}
