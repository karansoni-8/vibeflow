import os

base_dir = r"C:\Users\devel\.gemini\antigravity\scratch\vibeflow\client\src"

files = {
    "types/index.ts": """export interface Project {
  id: string;
  userId: string;
  name: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  language: string;
  content: string;
  updatedAt: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  status: 'running' | 'success' | 'error' | 'timeout';
}

export interface FlowchartNode {
  id: string;
  type: 'start' | 'end' | 'process' | 'decision' | 'inputOutput' | 'subprocess';
  data: { label: string; lineStart?: number; lineEnd?: number };
  position: { x: number; y: number };
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface FlowchartData {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export interface ComplexityData {
  algorithm: string;
  time: { best: string; average: string; worst: string };
  space: { best: string; average: string; worst: string };
  explanation: string;
  inputSensitivity: string;
}

export interface ErrorExplanation {
  type: string;
  title: string;
  explanation: string;
  location: string;
  cause: string;
  fix: string;
  correctedCode: string;
  beginnerExplanation: string;
}

export interface CodeExplanation {
  overview: string;
  steps: string[];
  variables: { name: string; purpose: string; type: string }[];
  algorithm: string;
  complexity: string;
  beginnerExplanation: string;
}

export interface LineExplanation {
  explanation: string;
  purpose: string;
  variablesInvolved: string[];
  stateEffect: string;
  complexityContribution: string;
  possibleBugs: string[];
}

export interface CodeImprovementSuggestion {
  severity: 'info' | 'warning' | 'performance';
  title: string;
  description: string;
  affectedLines: number[];
}

export interface CodeImprovement {
  suggestions: CodeImprovementSuggestion[];
  improvedCode: string;
  currentComplexity: string;
  improvedComplexity: string;
  diffExplanation: string;
}

export interface TestCase {
  id: string;
  name: string;
  input: string;
  expectedOutput?: string;
  description: string;
  category: 'Normal' | 'Edge' | 'Boundary' | 'Large';
  status?: 'pass' | 'fail' | 'pending';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Settings {
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  beginnerMode: boolean;
  vibeMode: boolean;
  defaultLanguage: string;
  execTimeout: number;
}
""",
    "hooks/useDebounce.ts": """import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}
""",
    "hooks/useKeyboardShortcuts.ts": """import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onRun?: () => void;
  onCommandPalette?: () => void;
  onAIAssist?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handlers.onSave?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handlers.onRun?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlers.onCommandPalette?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        handlers.onAIAssist?.();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        handlers.onEscape?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}
"""
}

for path, content in files.items():
    full_path = os.path.join(base_dir, path.replace('/', os.sep))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
