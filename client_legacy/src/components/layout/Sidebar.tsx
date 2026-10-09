import React, { useState } from 'react';
import { Project, FileItem } from '../../types';
import {
  Folder,
  FileCode,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Code,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  project: Project | null;
  activeFileId: string | null;
  onSelectFile: (fileId: string) => void;
  onCreateFile: (name: string, language?: string) => void;
  onDeleteFile: (fileId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  project,
  activeFileId,
  onSelectFile,
  onCreateFile,
  onDeleteFile,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  if (collapsed) {
    return (
      <div className="w-10 bg-dark-950 border-r border-white/5 flex flex-col items-center py-3 select-none">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded hover:bg-dark-850 text-slate-400 hover:text-white"
          title="Expand File Explorer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim());
    setNewFileName('');
    setIsCreating(false);
  };

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case 'cpp':
        return 'text-blue-400';
      case 'python':
        return 'text-amber-400';
      case 'java':
        return 'text-rose-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <aside className="w-60 bg-dark-950 border-r border-white/5 flex flex-col select-none text-xs font-mono">
      {/* Explorer Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 text-slate-400">
        <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider text-slate-300">
          <Folder className="w-3.5 h-3.5 text-brand-cyan" />
          <span>Explorer</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsCreating(true)}
            className="p-1 rounded hover:bg-dark-850 text-slate-400 hover:text-white transition-colors"
            title="New File"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-dark-850 text-slate-400 hover:text-white transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronDown className="w-3.5 h-3.5 transform -rotate-90" />
          </button>
        </div>
      </div>

      {/* Project Folder Label */}
      <div className="px-3 py-2 flex items-center gap-1.5 text-slate-300 font-medium">
        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        <span className="truncate">{project?.name || 'Project Root'}</span>
      </div>

      {/* New File Inline Form */}
      {isCreating && (
        <form onSubmit={handleCreateSubmit} className="px-3 py-1">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onBlur={() => !newFileName.trim() && setIsCreating(false)}
            placeholder="e.g. solution.cpp"
            autoFocus
            className="w-full bg-dark-900 border border-brand-cyan/60 rounded px-2 py-1 text-xs text-white focus:outline-none"
          />
        </form>
      )}

      {/* File List */}
      <div className="flex-1 overflow-y-auto px-1 py-1 space-y-0.5">
        {project?.files.map((file) => {
          const isActive = file.id === activeFileId;

          return (
            <div
              key={file.id}
              onClick={() => onSelectFile(file.id)}
              className={`group flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors ${
                isActive
                  ? 'bg-brand-cyan/10 text-brand-cyan font-semibold border-l-2 border-brand-cyan'
                  : 'text-slate-400 hover:bg-dark-850 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${getLanguageColor(file.language)}`} />
                <span className="truncate">{file.name}</span>
              </div>

              {project.files.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${file.name}?`)) {
                      onDeleteFile(file.id);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 transition-opacity"
                  title="Delete File"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Information Tip */}
      <div className="p-3 border-t border-white/5 text-[10px] text-slate-500 font-sans leading-relaxed">
        Double click any file to open. Flowcharts sync automatically to active code.
      </div>
    </aside>
  );
}
