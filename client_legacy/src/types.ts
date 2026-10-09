export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface FileItem {
  id: string;
  projectId: string;
  name: string;
  language: 'cpp' | 'python' | 'java' | 'javascript';
  content: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  files: FileItem[];
  activeFileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionResult {
  id: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  memoryUsageMb?: number;
  timedOut?: boolean;
  status: 'success' | 'error' | 'timeout';
}

export type FlowchartNodeType =
  | 'start'
  | 'end'
  | 'process'
  | 'decision'
  | 'inputOutput'
  | 'loop'
  | 'subprocess';

export interface FlowchartNode {
  id: string;
  type: FlowchartNodeType;
  label: string;
  lineStart?: number;
  lineEnd?: number;
  description?: string;
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  animated?: boolean;
}

export interface FlowchartGraph {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
}

export interface ComplexityCase {
  asymptotic: string;
  explanation: string;
}

export interface ComplexityAnalysis {
  algorithm: string;
  timeComplexity: {
    best: ComplexityCase;
    average: ComplexityCase;
    worst: ComplexityCase;
  };
  spaceComplexity: {
    asymptotic: string;
    explanation: string;
  };
  inputSensitivity: {
    characteristics: string;
    observedOperations?: number | string;
    theoreticalVsObserved: string;
  };
  lineContributions?: Array<{
    line: number;
    code: string;
    complexity: string;
    reason: string;
  }>;
  overallExplanation: string;
}

export interface ErrorExplanation {
  type:
    | 'Syntax Error'
    | 'Compilation Error'
    | 'Runtime Error'
    | 'Logical Error'
    | 'Memory Error'
    | 'Type Error'
    | 'Timeout / Infinite Loop';
  title: string;
  whatHappened: string;
  whyItHappened: string;
  whereItHappened: {
    line: number;
    column?: number;
    snippet?: string;
  };
  howToFix: string;
  correctedCode: string;
  beginnerNote: string;
}

export interface TestCase {
  id: string;
  name: string;
  type: 'normal' | 'edge' | 'boundary' | 'large';
  input: string;
  expectedOutput?: string;
  explanation: string;
}

export interface CodeImprovement {
  title: string;
  category: 'performance' | 'readability' | 'safety' | 'idiomatic';
  currentComplexity: string;
  improvedComplexity: string;
  reason: string;
  improvedCode: string;
  diffSummary: string;
}
