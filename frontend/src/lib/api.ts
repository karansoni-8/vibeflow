import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vibeflow_token') || 'dev_guest_token';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ExecutionResponse {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export interface FlowchartResponse {
  mermaidCode: string;
  error?: string;
}

export interface LineExplanation {
  lines: string;
  explanation: string;
}

export interface Enhancement {
  title: string;
  description: string;
  improvedComplexity?: string;
}

export interface ExplainResponse {
  summary: string;
  lineByLine: LineExplanation[];
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
    reasoning: string;
  };
  spaceComplexity: {
    value: string;
    reasoning: string;
  };
  enhancements: Enhancement[];
}

export interface ErrorDoctorResponse {
  errorType: string;
  plainEnglishExplanation: string;
  likelyLine: number;
  whyItHappened: string;
  suggestedFix: string;
  correctedCodeSnippet: string;
}

export interface DataPoint {
  inputSize: number;
  durationMs: number;
  theoreticalNormalized?: number;
}

export interface EmpiricalComplexityResponse {
  timingData: DataPoint[];
  empiricalTrendDescription: string;
  caseVariationExplanation: string;
  worstCaseInputExample: string;
  bestCaseInputExample: string;
}

export interface PseudocodeResponse {
  pseudocode: string;
}

export const executeApi = {
  getRuntimes: async () => {
    const res = await api.get('/api/execute/runtimes');
    return res.data;
  },
  runCode: async (language: string, code: string, stdin: string = '', projectId?: string): Promise<ExecutionResponse> => {
    const res = await api.post('/api/execute', { language, code, stdin, projectId });
    return res.data;
  },
};

export const aiApi = {
  getFlowchart: async (code: string, language: string): Promise<FlowchartResponse> => {
    const res = await api.post('/api/ai/flowchart', { code, language });
    return res.data;
  },
  explainCode: async (code: string, language: string): Promise<ExplainResponse> => {
    const res = await api.post('/api/ai/explain', { code, language });
    return res.data;
  },
  explainError: async (code: string, language: string, rawError: string): Promise<ErrorDoctorResponse> => {
    const res = await api.post('/api/ai/error-explain', { code, language, rawError });
    return res.data;
  },
  generateCode: async (prompt: string, language: string, existingCode?: string): Promise<{ response: string; code: string }> => {
    const res = await api.post('/api/ai/generate', { prompt, language, existingCode });
    return res.data;
  },
  explainSelection: async (language: string, fullCode: string, selectedCode: string, startLine: number, endLine: number): Promise<{ explanation: string }> => {
    const res = await api.post('/api/ai/explain-selection', { language, fullCode, selectedCode, startLine, endLine });
    return res.data;
  },
  getEmpiricalComplexity: async (code: string, language: string, theoreticalComplexity?: string): Promise<EmpiricalComplexityResponse> => {
    const res = await api.post('/api/ai/complexity-empirical', { code, language, theoreticalComplexity });
    return res.data;
  },
  getPseudocode: async (code: string, language: string): Promise<PseudocodeResponse> => {
    const res = await api.post('/api/ai/pseudocode', { code, language });
    return res.data;
  },
};

export const projectApi = {
  list: async () => {
    const res = await api.get('/api/projects');
    return res.data.projects;
  },
  create: async (data: { title: string; language: string; code: string; lastFlowchart?: string; lastExplainReport?: any }) => {
    const res = await api.post('/api/projects', data);
    return res.data.project;
  },
  get: async (id: string) => {
    const res = await api.get(`/api/projects/${id}`);
    return res.data.project;
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/api/projects/${id}`, data);
    return res.data.project;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/api/projects/${id}`);
    return res.data;
  },
};
