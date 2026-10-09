import React, { useState } from 'react';
import { Project, User } from '../../types';
import {
  FolderPlus,
  ArrowRight,
  Code2,
  Clock,
  Trash2,
  Sparkles,
  GitBranch,
  Cpu,
  Search,
  BookOpen,
} from 'lucide-react';

interface DashboardProps {
  user: User | null;
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string, description?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onLogout: () => void;
}

export function Dashboard({
  user,
  projects,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onLogout,
}: DashboardProps) {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreateProject(newName.trim(), newDesc.trim());
    setNewName('');
    setNewDesc('');
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col select-none overflow-y-auto font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-glow-cyan">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 7 12 17 20 7" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight">
              Vibe<span className="text-brand-cyan">Flow</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-2">Workspace Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            {user?.avatar && (
              <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full ring-1 ring-white/10" />
            )}
            <span className="font-semibold">{user?.name}</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-slate-400 hover:text-rose-400 font-mono transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 p-6 rounded-2xl border border-white/5">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Welcome back, {user?.name || 'Developer'} 👋
            </h1>
            <p className="text-xs text-slate-400 max-w-lg">
              Select an algorithmic project below to start coding, test inputs, observe real-time flowcharts, or generate new solutions with Vibe Mode.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-dark-950 font-bold text-xs flex items-center gap-2 shadow-glow-cyan hover:opacity-95 transition-all self-start md:self-auto"
          >
            <FolderPlus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-dark-900 border border-slate-800 rounded-lg px-3 py-2 w-full max-w-md focus-within:border-brand-cyan/50 text-xs">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search algorithm projects..."
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="text-xs font-mono text-slate-500">
            {filteredProjects.length} Projects Available
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const activeFile = p.files[0];
            const lang = activeFile?.language || 'cpp';

            return (
              <div
                key={p.id}
                onClick={() => onSelectProject(p.id)}
                className="group p-5 rounded-xl bg-dark-900/80 border border-slate-800/80 hover:border-brand-cyan/40 transition-all cursor-pointer hover:shadow-glow-cyan flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        lang === 'cpp'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : lang === 'python'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Python' : lang}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${p.name}"?`)) {
                          onDeleteProject(p.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-brand-cyan transition-colors">
                    {p.name}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description || 'Interactive algorithm workspace.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </span>

                  <span className="flex items-center gap-1 text-brand-cyan group-hover:translate-x-0.5 transition-transform font-bold">
                    Open IDE <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* New Project Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-dark-900 border border-slate-700 w-full max-w-md rounded-xl p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in duration-150"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-brand-cyan" />
              Create New Algorithm Project
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Project Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Quick Sort Optimization"
                autoFocus
                className="w-full bg-dark-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Description (Optional)</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe problem statement or notes..."
                rows={2}
                className="w-full bg-dark-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-brand-cyan/50 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newName.trim()}
                className="px-5 py-2 text-xs font-bold text-dark-950 bg-brand-cyan hover:bg-cyan-300 rounded-lg shadow-glow-cyan"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
