import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  listClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className, listClassName }) => {
  const activeContent = tabs.find(t => t.id === activeTab)?.content;

  return (
    <div className={cn("flex flex-col w-full h-full", className)}>
      <div className={cn("flex overflow-x-auto hide-scrollbar border-b border-white/10 bg-[#06090e]/50 backdrop-blur-sm", listClassName)}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {tab.icon}
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_-2px_10px_rgba(56,189,248,0.5)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-auto bg-[#0b0f17]">
        {activeContent}
      </div>
    </div>
  );
};
