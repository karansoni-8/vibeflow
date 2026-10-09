import { create } from 'zustand';

export interface Project {
  id: string;
  name: string;
  language: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface File {
  id: string;
  projectId: string;
  name: string;
  content: string;
  language: string;
}

export interface Output {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  executionTimeMs: number;
  status: 'success' | 'error' | 'timeout';
}

export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface IDEState {
  currentProject: Project | null;
  files: File[];
  activeFileId: string | null;
  code: string;
  language: string;
  output: Output | null;
  isRunning: boolean;
  isSaving: boolean;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  flowchartData: { nodes: any[]; edges: any[] } | null;
  complexityData: object | null;
  aiChatHistory: AIChatMessage[];
  isAiLoading: boolean;
  beginnerMode: boolean;
  vibeMode: boolean;
  input: string;
  
  setProject: (project: Project | null) => void;
  setFiles: (files: File[]) => void;
  setActiveFile: (fileId: string | null) => void;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setOutput: (output: Output | null) => void;
  setIsRunning: (isRunning: boolean) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;
  setFlowchartData: (data: { nodes: any[]; edges: any[] } | null) => void;
  setComplexityData: (data: object | null) => void;
  addAiMessage: (message: AIChatMessage) => void;
  clearAiChat: () => void;
  setIsAiLoading: (isLoading: boolean) => void;
  setBeginnerMode: (enabled: boolean) => void;
  setVibeMode: (enabled: boolean) => void;
  setInput: (input: string) => void;
}

export const useIdeStore = create<IDEState>((set) => ({
  currentProject: null,
  files: [],
  activeFileId: null,
  code: '',
  language: 'javascript',
  output: null,
  isRunning: false,
  isSaving: false,
  saveStatus: 'saved',
  flowchartData: null,
  complexityData: null,
  aiChatHistory: [],
  isAiLoading: false,
  beginnerMode: false,
  vibeMode: false,
  input: '',
  
  setProject: (project) => set({ currentProject: project }),
  setFiles: (files) => set({ files }),
  setActiveFile: (activeFileId) => set({ activeFileId }),
  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setOutput: (output) => set({ output }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setSaveStatus: (status) => set({ saveStatus: status, isSaving: status === 'saving' }),
  setFlowchartData: (data) => set({ flowchartData: data }),
  setComplexityData: (data) => set({ complexityData: data }),
  addAiMessage: (message) => set((state) => ({ aiChatHistory: [...state.aiChatHistory, message] })),
  clearAiChat: () => set({ aiChatHistory: [] }),
  setIsAiLoading: (isAiLoading) => set({ isAiLoading }),
  setBeginnerMode: (beginnerMode) => set({ beginnerMode }),
  setVibeMode: (vibeMode) => set({ vibeMode }),
  setInput: (input) => set({ input }),
}));
