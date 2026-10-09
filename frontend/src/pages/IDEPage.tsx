import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { ResizableLayout } from '../components/layout/ResizableLayout';
import { CommandPalette } from '../components/layout/CommandPalette';

export const IDEPage: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col bg-[#05050a] text-[#f4f4f7] overflow-hidden">
      {/* Top Fixed Navbar */}
      <Navbar />

      {/* Main Split IDE Workspace */}
      <main className="flex-1 w-full overflow-hidden">
        <ResizableLayout />
      </main>

      {/* Quick Search & Command Palette Modal (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
};
