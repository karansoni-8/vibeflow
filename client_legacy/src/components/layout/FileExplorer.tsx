import React, { useState } from 'react';
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
