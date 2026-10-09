import React, { useEffect, useState, useRef } from 'react';
import {
  GitFork,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Info,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { useIdeStore } from '../../store/ideStore';
import { useDebouncedFlowchart } from '../../hooks/useDebouncedFlowchart';
import { renderMermaidSvg } from '../../lib/mermaidRenderer';

export const FlowchartPanel: React.FC = () => {
  const {
    flowchartCode,
    autoSyncFlowchart,
    setAutoSyncFlowchart,
    flowchartError,
  } = useIdeStore();

  const { forceRegenerate, isGeneratingFlowchart } = useDebouncedFlowchart();
  const [svgContent, setSvgContent] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      if (!flowchartCode) return;
      try {
        setRenderError(null);
        const uniqueId = `mermaid_svg_${Date.now()}`;
        const svg = await renderMermaidSvg(uniqueId, flowchartCode);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (isMounted) {
          setRenderError('Could not render flowchart layout.');
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [flowchartCode]);

  const exportSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibeflow-flowchart.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0d0d16] select-none relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-10 bg-white/5 border-b border-white/10 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <GitFork className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-semibold text-[#f4f4f7]">Control Flowchart</span>
          {isGeneratingFlowchart ? (
            <span className="text-[10px] text-cyan-400 ai-shimmer flex items-center gap-1">
              • Generating...
            </span>
          ) : (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" /> Synchronized
            </span>
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5">
          {/* Auto-sync Toggle */}
          <button
            onClick={() => setAutoSyncFlowchart(!autoSyncFlowchart)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5 text-[11px] text-[#9a9ab0] hover:text-white transition"
            title="Toggle real-time auto sync"
          >
            <span>Auto-sync</span>
            {autoSyncFlowchart ? (
              <ToggleRight className="w-4 h-4 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-[#9a9ab0]" />
            )}
          </button>

          {/* Regenerate button */}
          <button
            onClick={forceRegenerate}
            disabled={isGeneratingFlowchart}
            className="p-1 rounded hover:bg-white/10 text-[#9a9ab0] hover:text-white transition disabled:opacity-50"
            title="Force regenerate flowchart"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingFlowchart ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Legend toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-1 rounded hover:bg-white/10 text-[#9a9ab0] hover:text-white transition"
            title="Flowchart Symbol Standards"
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Export SVG */}
          <button
            onClick={exportSvg}
            className="p-1 rounded hover:bg-white/10 text-[#9a9ab0] hover:text-white transition"
            title="Download Flowchart as SVG"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Symbol Standard Legend Modal/Tooltip */}
      {showLegend && (
        <div className="absolute top-11 right-3 z-30 w-72 glass-panel p-3 text-xs shadow-2xl animate-in fade-in duration-150">
          <div className="font-semibold text-white mb-2 flex items-center justify-between">
            <span>Standard Flowchart Symbols</span>
            <button onClick={() => setShowLegend(false)} className="text-[#9a9ab0] hover:text-white">✕</button>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#9a9ab0]">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Stadium Pill</span>
              <span>Start / End Terminals</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Rectangle</span>
              <span>Computation / Assignment</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Rhombus Diamond</span>
              <span>Condition (Yes / No)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Parallelogram</span>
              <span>Input / Output (I/O)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Double Rectangle</span>
              <span>Subroutine / Function Call</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Back-Edge Cycle</span>
              <span>For / While Loop</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Pan/Zoom Canvas */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-[#090910]" ref={containerRef}>
        {renderError || flowchartError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-xs text-[#9a9ab0] space-y-2">
            <AlertCircle className="w-8 h-8 text-amber-400 opacity-80" />
            <p className="font-medium text-white/90">Flowchart synchronization pending</p>
            <p className="max-w-xs text-[11px]">
              {renderError || flowchartError || 'Write complete statements to generate standard flow structure.'}
            </p>
            <button
              onClick={forceRegenerate}
              className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/15 rounded text-white text-xs transition"
            >
              Regenerate Now
            </button>
          </div>
        ) : (
          <TransformWrapper
            initialScale={0.9}
            minScale={0.3}
            maxScale={3}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                {/* Floating Zoom Controls */}
                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-[#12121e]/80 backdrop-blur-md border border-white/10 rounded-lg p-1 shadow-lg">
                  <button
                    onClick={() => zoomIn()}
                    className="p-1.5 hover:bg-white/10 rounded text-[#9a9ab0] hover:text-white transition"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => zoomOut()}
                    className="p-1.5 hover:bg-white/10 rounded text-[#9a9ab0] hover:text-white transition"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="p-1.5 hover:bg-white/10 rounded text-[#9a9ab0] hover:text-white transition"
                    title="Reset Zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* SVG Render Canvas with Framer Motion Cross-fade */}
                <TransformComponent
                  wrapperClass="!w-full !h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                  contentClass="!w-full !h-full flex items-center justify-center"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={svgContent ? svgContent.substring(0, 30) : 'empty'}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full flex items-center justify-center p-6"
                      dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                  </AnimatePresence>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        )}
      </div>
    </div>
  );
};
