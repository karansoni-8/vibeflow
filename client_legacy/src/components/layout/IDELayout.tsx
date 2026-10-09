import React, { useEffect, useState } from 'react';
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
