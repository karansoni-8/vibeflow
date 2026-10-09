import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useIdeStore } from '../../store/ideStore';
import { aiApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const CodeEditor: React.FC = () => {
  const { code, setCode, language } = useIdeStore();
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Define custom VibeFlow dark theme
    monaco.editor.defineTheme('vibeflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '22d3ee' },
        { token: 'function', foreground: '60a5fa' },
      ],
      colors: {
        'editor.background': '#0a0a12',
        'editor.foreground': '#f4f4f7',
        'editorLineNumber.foreground': '#4b4b60',
        'editorLineNumber.activeForeground': '#22d3ee',
        'editor.selectionBackground': '#2e2547',
        'editor.inactiveSelectionBackground': '#1a1829',
        'editorCursor.foreground': '#22d3ee',
        'editor.lineHighlightBackground': '#121220',
      },
    });

    monaco.editor.setTheme('vibeflow-dark');

    // Context menu action: "Explain this selection" (Section 9.4)
    editor.addAction({
      id: 'vibeflow-explain-selection',
      label: '✨ Explain this selection (VibeFlow)',
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1,
      run: async (ed: any) => {
        const selection = ed.getSelection();
        if (!selection || selection.isEmpty()) {
          toast('Select a line or block of code first to explain it.', { icon: '💡' });
          return;
        }

        const selectedText = ed.getModel().getValueInRange(selection);
        const fullText = ed.getValue();
        const startLine = selection.startLineNumber;
        const endLine = selection.endLineNumber;

        const toastId = toast.loading(`Analyzing lines ${startLine}-${endLine}...`);
        try {
          const res = await aiApi.explainSelection(
            language,
            fullText,
            selectedText,
            startLine,
            endLine
          );

          toast.dismiss(toastId);

          // Render peek notification with the plain-English explanation
          toast((t) => (
            <div className="text-xs space-y-1">
              <div className="font-semibold text-cyan-400 flex items-center gap-1">
                <span>Lines {startLine}–{endLine} Analysis</span>
              </div>
              <p className="text-[#f4f4f7] leading-relaxed">{res.explanation}</p>
              <div className="text-right">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-[10px] text-violet-400 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ), {
            duration: 8000,
            style: { background: '#121222', border: '1px solid #8b5cf6', color: '#f4f4f7' },
          });
        } catch (err: any) {
          toast.dismiss(toastId);
          toast.error('Could not explain selected lines.');
        }
      },
    });

    // Keyboard shortcut: Ctrl/Cmd + Enter to trigger Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      // Find the run button and trigger click or dispatch custom event
      const runBtn = document.querySelector('button[title*="Run Code"]') as HTMLButtonElement;
      if (runBtn) runBtn.click();
    });
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python':
      case 'py':
        return 'python';
      case 'c++':
      case 'cpp':
        return 'cpp';
      case 'c':
        return 'c';
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'typescript':
      case 'ts':
        return 'typescript';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a12] flex flex-col">
      {/* Editor top status bar */}
      <div className="h-7 bg-[#0d0d16] border-b border-white/5 px-3 flex items-center justify-between text-[11px] text-[#9a9ab0]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-medium text-white/90 uppercase tracking-wider text-[10px]">
            Editor Buffer
          </span>
          <span className="text-white/40">|</span>
          <span className="capitalize">{language}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Right-click selection → Explain Selection</span>
          <span className="text-white/30">UTF-8</span>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full h-full relative">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(val) => setCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            tabSize: 4,
            minimap: { enabled: true, scale: 0.75 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
