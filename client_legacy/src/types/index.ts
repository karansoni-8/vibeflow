export interface Project {
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
