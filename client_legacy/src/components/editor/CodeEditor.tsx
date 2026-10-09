import React, { useRef, useState } from 'react';
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
