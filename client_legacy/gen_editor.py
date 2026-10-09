import os

base_dir = r"C:\Users\devel\.gemini\antigravity\scratch\vibeflow\client\src"

files = {
    "components/editor/CodeEditor.tsx": """import React, { useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useIdeStore } from '@/store/ideStore';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import ContextActionMenu from '../ai/ContextActionMenu';
import EditorTabs from './EditorTabs';

export default function CodeEditor() {
  const { activeFile, updateFileContent, settings, setCursorPosition } = useIdeStore();
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, text: string } | null>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('vibeflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '38bdf8', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'f43f5e' },
      ],
      colors: {
        'editor.background': '#090d16',
        'editor.lineHighlightBackground': '#1e293b40',
        'editorLineNumber.foreground': '#475569',
        'editorLineNumber.activeForeground': '#38bdf8',
        'editorCursor.foreground': '#38bdf8',
      }
    });
    
    monaco.editor.setTheme('vibeflow-dark');

    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({ line: e.position.lineNumber, column: e.position.column });
    });

    editor.onMouseUp((e: any) => {
      const selection = editor.getSelection();
      const model = editor.getModel();
      if (!selection.isEmpty()) {
        const text = model.getValueInRange(selection);
        setContextMenu({
          x: e.event.posx,
          y: e.event.posy,
          text
        });
      } else {
        setContextMenu(null);
      }
    });
  };

  const debouncedUpdate = useDebouncedCallback((content: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, content);
    }
  }, 1500);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      debouncedUpdate(value);
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-[#090d16] text-white/50">
        Select a file to start editing
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative bg-[#090d16]">
      <EditorTabs />
      <div className="flex-1">
        <Editor
          height="100%"
          language={activeFile.language}
          value={activeFile.content}
          theme="vibeflow-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize: settings?.fontSize || 14,
            tabSize: settings?.tabSize || 2,
            wordWrap: settings?.wordWrap ? 'on' : 'off',
            minimap: { enabled: settings?.minimap ?? true },
            lineNumbers: 'on',
            folding: true,
            matchBrackets: 'always',
            autoIndent: 'full',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          }}
        />
      </div>
      {contextMenu && (
        <ContextActionMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          selectedText={contextMenu.text} 
          onClose={() => setContextMenu(null)} 
        />
      )}
    </div>
  );
}
""",
    "components/editor/EditorTabs.tsx": """import React from 'react';
import { useIdeStore } from '@/store/ideStore';
import { X, FileCode, FileJson, FileText } from 'lucide-react';
import { cn } from '@/lib/cn';

export default function EditorTabs() {
  const { files, activeFile, setActiveFile, closeFile } = useIdeStore();

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
    <div className="flex bg-[#06090e] border-b border-white/10 overflow-x-auto no-scrollbar shrink-0">
      {files.map(file => (
        <div
          key={file.id}
          onClick={() => setActiveFile(file.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm border-r border-white/10 cursor-pointer min-w-max group",
            activeFile?.id === file.id 
              ? "bg-[#090d16] text-[#38bdf8] border-b-2 border-b-[#38bdf8]" 
              : "text-white/60 hover:bg-white/5 hover:text-white border-b-2 border-b-transparent"
          )}
        >
          {getFileIcon(file.language)}
          <span>{file.name}</span>
          {/* Unsaved indicator mock */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.id);
            }}
            className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/10 ml-2"
          >
            <X size={14} />
          </button>
        </div>
      ))}
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
