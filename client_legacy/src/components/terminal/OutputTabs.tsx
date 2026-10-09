import React from 'react';
import {
  Terminal as TerminalIcon,
  Play,
  Keyboard,
  Cpu,
  Bot,
  ListChecks,
  AlertCircle,
} from 'lucide-react';

export type TabType = 'output' | 'terminal' | 'input' | 'complexity' | 'ai' | 'tests';

interface OutputTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasError?: boolean;
  hasOutput?: boolean;
}

export function OutputTabs({ activeTab, onTabChange, hasError, hasOutput }: OutputTabsProps) {
  const tabs: { id: TabType; label: string; icon: any; badge?: boolean }[] = [
    { id: 'output', label: 'OUTPUT', icon: Play, badge: hasOutput },
    { id: 'terminal', label: 'TERMINAL', icon: TerminalIcon },
    { id: 'input', label: 'INPUT (STDIN)', icon: Keyboard },
    { id: 'complexity', label: 'COMPLEXITY', icon: Cpu },
    { id: 'ai', label: 'AI ASSISTANT', icon: Bot },
    { id: 'tests', label: 'TEST CASES', icon: ListChecks },
  ];

  return (
    <div className="flex items-center justify-between border-b border-slate-800 bg-dark-900/95 px-2 select-none">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-medium border-b-2 transition-all shrink-0 ${
                isActive
                  ? 'border-brand-cyan text-brand-cyan bg-dark-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-dark-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-brand-cyan' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.id === 'output' && hasError && (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
