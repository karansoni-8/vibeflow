import React from 'react';
import { useIdeStore } from '@/store/ideStore';
import { cn } from '@/lib/cn';

export default function StatusBar() {
  const { activeFile, isSaving, settings, cursorPosition, complexitySummary } = useIdeStore();

  return (
    <div className="h-6 border-t border-white/10 bg-[#06090e] flex items-center justify-between px-3 text-[11px] text-white/60 shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {isSaving ? (
            <span className="text-[#38bdf8]">Saving...</span>
          ) : (
            <span className="text-[#10b981]">Saved ✓</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {activeFile && <span>{activeFile.language}</span>}
        <span>
          Ln {cursorPosition?.line || 1}, Col {cursorPosition?.column || 1}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {complexitySummary && (
          <span className="text-[#a855f7]">{complexitySummary}</span>
        )}
        {settings?.beginnerMode && (
          <span className="bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 rounded-full">
            Beginner Mode Active
          </span>
        )}
      </div>
    </div>
  );
}
