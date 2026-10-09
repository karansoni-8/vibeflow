import os

base_dir = r"C:\Users\devel\.gemini\antigravity\scratch\vibeflow\client\src"

files = {
    "components/layout/IDELayout.tsx": """import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '@/components/ui/resizable';
import Toolbar from './Toolbar';
import StatusBar from './StatusBar';
import FileExplorer from './FileExplorer';
import CodeEditor from '../editor/CodeEditor';
import FlowchartPanel from '../flowchart/FlowchartPanel';
import OutputPanel from '../terminal/OutputPanel';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useIdeStore } from '@/store/ideStore';
import { cn } from '@/lib/cn';

export default function IDELayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const { loadProject, saveCurrentFile, runCode } = useIdeStore();
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  useKeyboardShortcuts({
    onSave: saveCurrentFile,
    onRun: runCode,
    onAIAssist: () => setShowAI(true),
  });

  return (
    <div className="flex flex-col h-screen w-full bg-[#06090e] text-white overflow-hidden">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={15} minSize={10} maxSize={30}>
            <FileExplorer />
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-white/10 hover:bg-[#38bdf8]/50 transition-colors" />
          <ResizablePanel defaultSize={50} minSize={30}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={70} minSize={20}>
                <CodeEditor />
              </ResizablePanel>
              <ResizableHandle className="h-1 bg-white/10 hover:bg-[#38bdf8]/50 transition-colors" />
              <ResizablePanel defaultSize={30} minSize={10}>
                <OutputPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle className="w-1 bg-white/10 hover:bg-[#38bdf8]/50 transition-colors" />
          <ResizablePanel defaultSize={35} minSize={20}>
            <FlowchartPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <StatusBar />
    </div>
  );
}
""",
    "components/layout/Toolbar.tsx": """import React from 'react';
import { 
  Play, Square, Sparkles, BookOpen, Zap, BarChart3, 
  GitBranch, TestTube, AlignLeft, GraduationCap, Wand2, Settings, User
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useIdeStore } from '@/store/ideStore';

export default function Toolbar() {
  const { isRunning, runCode, stopCode, settings, toggleBeginnerMode, toggleVibeMode } = useIdeStore();

  const ActionButton = ({ icon: Icon, label, onClick, active = false, color = "text-white", disabled = false, bg = "" }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "p-2 rounded-md transition-all flex items-center justify-center relative group",
        active ? "bg-white/10 text-[#38bdf8]" : "hover:bg-white/5",
        color,
        bg,
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon size={18} />
      <span className="absolute -bottom-8 bg-[#141c2b] border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
        {label}
      </span>
    </button>
  );

  return (
    <div className="h-12 border-b border-white/10 bg-[#0b0f17]/80 backdrop-blur flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2 font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#38bdf8] to-[#a855f7]">
        <Sparkles size={20} className="text-[#38bdf8]" />
        VibeFlow
      </div>

      <div className="flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-black/20">
        {!isRunning ? (
          <ActionButton icon={Play} label="Run (Ctrl+Enter)" onClick={runCode} color="text-[#10b981]" bg="hover:bg-[#10b981]/10" />
        ) : (
          <ActionButton icon={Square} label="Stop" onClick={stopCode} color="text-[#f43f5e]" bg="hover:bg-[#f43f5e]/10" />
        )}
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ActionButton icon={Sparkles} label="AI Generate (Ctrl+K)" color="text-[#a855f7]" bg="hover:bg-[#a855f7]/10" />
        <ActionButton icon={BookOpen} label="Explain Code" />
        <ActionButton icon={Zap} label="Improve Code" />
        <ActionButton icon={BarChart3} label="Complexity Analysis" />
        <ActionButton icon={GitBranch} label="Generate Flowchart" />
        <ActionButton icon={TestTube} label="Generate Tests" />
        <ActionButton icon={AlignLeft} label="Format Document" />
      </div>

      <div className="flex items-center gap-2">
        <ActionButton 
          icon={GraduationCap} 
          label="Beginner Mode" 
          active={settings?.beginnerMode} 
          onClick={toggleBeginnerMode}
          color={settings?.beginnerMode ? "text-[#10b981]" : "text-white/70"}
        />
        <ActionButton 
          icon={Wand2} 
          label="Vibe Mode" 
          active={settings?.vibeMode} 
          onClick={toggleVibeMode}
          color={settings?.vibeMode ? "text-[#a855f7]" : "text-white/70"}
        />
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ActionButton icon={Settings} label="Settings" />
        <ActionButton icon={User} label="Profile" />
      </div>
    </div>
  );
}
""",
    "components/layout/StatusBar.tsx": """import React from 'react';
import { useIdeStore } from '@/store/ideStore';
import { cn } from '@/lib/cn';

export default function StatusBar() {
  const { activeFile, isSaving, settings, cursorPosition, complexitySummary } = useIdeStore();

  return (
    <div className="h-6 border-t border-white/10 bg-[#06090e] flex items-center justify-between px-3 text-[11px] text-white/60 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {isSaving ? (
            <span className="text-[#38bdf8]">Saving...</span>
          ) : (
            <span className="text-[#10b981]">Saved ✓</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {activeFile && <span>{activeFile.language}</span>}
        <span>
          Ln {cursorPosition?.line || 1}, Col {cursorPosition?.column || 1}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {complexitySummary && (
          <span className="text-[#a855f7]">{complexitySummary}</span>
        )}
        {settings?.beginnerMode && (
          <span className="bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full">
            Beginner Mode Active
          </span>
        )}
      </div>
    </div>
  );
}
""",
    "components/layout/FileExplorer.tsx": """import React, { useState } from 'react';
import { useIdeStore } from '@/store/ideStore';
import { FileCode, FileJson, FileText, Folder, Plus, Trash2, Edit2, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function FileExplorer() {
  const { files, activeFile, setActiveFile, createFile, deleteFile, renameFile, project } = useIdeStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const getFileIcon = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'javascript':
      case 'typescript':
      case 'python':
        return <FileCode size={14} className="text-[#eab308]" />;
      case 'cpp':
      case 'c':
        return <FileCode size={14} className="text-[#3b82f6]" />;
      case 'java':
        return <FileCode size={14} className="text-[#ef4444]" />;
      case 'json':
        return <FileJson size={14} className="text-[#10b981]" />;
      default:
        return <FileText size={14} className="text-white/60" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#06090e] border-r border-white/10 select-none">
      <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-white/80 uppercase tracking-wider">
        <span>EXPLORER</span>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div 
          className="flex items-center px-1 py-1 hover:bg-white/5 cursor-pointer text-sm font-medium"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span className="ml-1">{project?.name || 'VibeFlow Project'}</span>
        </div>

        {isExpanded && (
          <div className="ml-4 mt-1 space-y-0.5">
            {files.map(file => (
              <div
                key={file.id}
                onClick={() => setActiveFile(file.id)}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer group",
                  activeFile?.id === file.id ? "bg-[#38bdf8]/10 text-[#38bdf8]" : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {getFileIcon(file.language)}
                <span className="flex-1 truncate">{file.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <button className="w-full flex items-center justify-center gap-2 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-white/80 transition-colors">
          <Plus size={14} />
          New File
        </button>
      </div>
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
