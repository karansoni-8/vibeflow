import React, { useState } from 'react';
import {
  GitFork,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  Activity,
  Terminal,
  FileCode,
  Code2,
} from 'lucide-react';
import { useIdeStore, RightTab, BottomTab } from '../../store/ideStore';
import { CodeEditor } from '../editor/CodeEditor';
import { FlowchartPanel } from '../panels/FlowchartPanel';
import { ExplainPanel } from '../panels/ExplainPanel';
import { PseudocodePanel } from '../panels/PseudocodePanel';
import { ChatPanel } from '../panels/ChatPanel';
import { ErrorPanel } from '../panels/ErrorPanel';
import { ComplexityChartPanel } from '../panels/ComplexityChartPanel';
import { OutputConsole } from '../panels/OutputConsole';
import { TerminalPanel } from '../panels/TerminalPanel';

export const ResizableLayout: React.FC = () => {
  const {
    activeTabRight,
    setActiveTabRight,
    activeTabBottom,
    setActiveTabBottom,
    errorBadgeCount,
  } = useIdeStore();

  // Split dimensions (percentages or pixels)
  const [rightWidth, setRightWidth] = useState<number>(45); // percentage
  const [bottomHeight, setBottomHeight] = useState<number>(220); // pixels
  const [isDraggingH, setIsDraggingH] = useState(false);
  const [isDraggingV, setIsDraggingV] = useState(false);

  // Horizontal splitter (between center and right)
  const handleMouseDownH = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingH(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const totalWidth = window.innerWidth;
      const newRightWidth = ((totalWidth - moveEvent.clientX) / totalWidth) * 100;
      if (newRightWidth >= 25 && newRightWidth <= 65) {
        setRightWidth(newRightWidth);
      }
    };

    const onMouseUp = () => {
      setIsDraggingH(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Vertical splitter (between editor and bottom panel)
  const handleMouseDownV = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingV(true);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const totalHeight = window.innerHeight;
      const newBottomHeight = totalHeight - moveEvent.clientY;
      if (newBottomHeight >= 120 && newBottomHeight <= 500) {
        setBottomHeight(newBottomHeight);
      }
    };

    const onMouseUp = () => {
      setIsDraggingV(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="flex-1 w-full h-[calc(100vh-3.5rem)] flex overflow-hidden select-none bg-[#05050a]">
      {/* Left + Center Area (Editor + Bottom Console/Terminal) */}
      <div
        className="flex flex-col h-full overflow-hidden"
        style={{ width: `${100 - rightWidth}%` }}
      >
        {/* Editor buffer area */}
        <div className="flex-1 w-full overflow-hidden">
          <CodeEditor />
        </div>

        {/* Vertical Resize Divider */}
        <div
          onMouseDown={handleMouseDownV}
          className={`h-1.5 w-full bg-white/5 hover:bg-cyan-500/50 cursor-row-resize transition ${
            isDraggingV ? 'bg-cyan-500' : ''
          }`}
          title="Drag to resize console"
        />

        {/* Bottom Tabbed Area (Output Console | Terminal) */}
        <div
          className="w-full flex flex-col bg-[#07070d] border-t border-white/10 shrink-0"
          style={{ height: `${bottomHeight}px` }}
        >
          {/* Bottom Tabs Header */}
          <div className="h-8 bg-[#0a0a12] border-b border-white/5 px-3 flex items-center gap-1">
            <button
              onClick={() => setActiveTabBottom('output')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-t font-medium transition cursor-pointer ${
                activeTabBottom === 'output'
                  ? 'bg-[#07070d] text-cyan-400 border-t-2 border-cyan-400 font-semibold'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Program Output</span>
            </button>

            <button
              onClick={() => setActiveTabBottom('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-t font-medium transition cursor-pointer ${
                activeTabBottom === 'terminal'
                  ? 'bg-[#07070d] text-amber-400 border-t-2 border-amber-400 font-semibold'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Shell Terminal</span>
            </button>
          </div>

          {/* Bottom Tab Content */}
          <div className="flex-1 w-full h-full overflow-hidden">
            {activeTabBottom === 'output' && <OutputConsole />}
            {activeTabBottom === 'terminal' && <TerminalPanel />}
          </div>
        </div>
      </div>

      {/* Horizontal Resize Divider */}
      <div
        onMouseDown={handleMouseDownH}
        className={`w-1.5 h-full bg-white/5 hover:bg-violet-500/50 cursor-col-resize transition ${
          isDraggingH ? 'bg-violet-500' : ''
        }`}
        title="Drag to resize side panel"
      />

      {/* Right Tabbed Area (Flowchart | Explain | Chat | Error Doctor | Complexity) */}
      <div
        className="h-full flex flex-col bg-[#0d0d16] border-l border-white/10 shrink-0 overflow-hidden"
        style={{ width: `${rightWidth}%` }}
      >
        {/* Right Tabs Header */}
        <div className="h-10 bg-[#0a0a12] border-b border-white/10 px-2 flex items-center justify-between shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTabRight('flowchart')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition font-medium cursor-pointer ${
                activeTabRight === 'flowchart'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-violet-400" />
              <span>Flowchart</span>
            </button>

            <button
              onClick={() => setActiveTabRight('explain')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition font-medium cursor-pointer ${
                activeTabRight === 'explain'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Explain</span>
            </button>

            <button
              onClick={() => setActiveTabRight('pseudocode')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition font-medium cursor-pointer ${
                activeTabRight === 'pseudocode'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pseudocode</span>
            </button>

            <button
              onClick={() => setActiveTabRight('chat')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition font-medium cursor-pointer ${
                activeTabRight === 'chat'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>AI Tutor</span>
            </button>

            <button
              onClick={() => setActiveTabRight('error')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition font-medium relative cursor-pointer ${
                activeTabRight === 'error'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Error Doctor</span>
              {errorBadgeCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTabRight('complexity')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition font-medium cursor-pointer ${
                activeTabRight === 'complexity'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-[#9a9ab0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Empirical Scaling</span>
            </button>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 w-full h-full overflow-hidden">
          {activeTabRight === 'flowchart' && <FlowchartPanel />}
          {activeTabRight === 'explain' && <ExplainPanel />}
          {activeTabRight === 'pseudocode' && <PseudocodePanel />}
          {activeTabRight === 'chat' && <ChatPanel />}
          {activeTabRight === 'error' && <ErrorPanel />}
          {activeTabRight === 'complexity' && <ComplexityChartPanel />}
        </div>
      </div>
    </div>
  );
};
