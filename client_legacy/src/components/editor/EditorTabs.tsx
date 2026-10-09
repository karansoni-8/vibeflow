import React from 'react';
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
