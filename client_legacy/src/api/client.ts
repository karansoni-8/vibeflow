import {
  Project,
  User,
  ExecutionResult,
  FlowchartGraph,
  ComplexityAnalysis,
  ErrorExplanation,
  TestCase,
  CodeImprovement,
  FileItem,
} from '../types';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errText = await response.text();
    let errMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error) errMsg = parsed.error;
    } catch {}
    throw new Error(errMsg);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Auth
  async getMe(): Promise<{ user: User }> {
    return request('/auth/me');
  },
  async login(provider: string = 'developer', email?: string, name?: string): Promise<{ user: User; token: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ provider, email, name }),
    });
  },
  async logout(): Promise<{ success: boolean }> {
    return request('/auth/logout', { method: 'POST' });
  },

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    return request('/projects');
  },
  async getProject(id: string): Promise<{ project: Project }> {
    return request(`/projects/${id}`);
  },
  async createProject(name: string, description?: string): Promise<{ project: Project }> {
    return request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },
  async updateProject(id: string, updates: Partial<Project>): Promise<{ project: Project }> {
    return request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  async deleteProject(id: string): Promise<{ success: boolean }> {
    return request(`/projects/${id}`, { method: 'DELETE' });
  },

  // Files
  async saveFile(projectId: string, fileId: string, content: string): Promise<{ file: FileItem }> {
    return request(`/projects/${projectId}/files/${fileId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },
  async createFile(projectId: string, name: string, language?: string): Promise<{ file: FileItem }> {
    return request(`/projects/${projectId}/files`, {
      method: 'POST',
      body: JSON.stringify({ name, language }),
    });
  },
  async deleteFile(projectId: string, fileId: string): Promise<{ success: boolean }> {
    return request(`/projects/${projectId}/files/${fileId}`, { method: 'DELETE' });
  },

  // Execution
  async execute(language: string, code: string, input: string = ''): Promise<ExecutionResult> {
    return request('/execute', {
      method: 'POST',
      body: JSON.stringify({ language, code, input }),
    });
  },

  // Terminal
  async runTerminalCommand(command: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return request('/terminal/execute', {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  },

  // AI Services
  async aiGenerateCode(prompt: string, language: string): Promise<{ code: string }> {
    return request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, language }),
    });
  },
  async aiExplainCode(code: string, language: string, beginnerMode: boolean): Promise<{ explanation: any }> {
    return request('/ai/explain', {
      method: 'POST',
      body: JSON.stringify({ code, language, beginnerMode }),
    });
  },
  async aiExplainLine(
    code: string,
    lineNumber: number,
    lineContent: string,
    language: string,
    beginnerMode: boolean
  ): Promise<{ explanation: any }> {
    return request('/ai/explain-line', {
      method: 'POST',
      body: JSON.stringify({ code, lineNumber, lineContent, language, beginnerMode }),
    });
  },
  async aiImproveCode(code: string, language: string): Promise<{ improvement: CodeImprovement }> {
    return request('/ai/improve', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  },
  async aiAnalyzeComplexity(
    code: string,
    language: string,
    observedData?: { input?: string; iterations?: number; operations?: number; executionTimeMs?: number }
  ): Promise<{ analysis: ComplexityAnalysis }> {
    return request('/ai/complexity', {
      method: 'POST',
      body: JSON.stringify({ code, language, observedData }),
    });
  },
  async aiExplainError(
    code: string,
    language: string,
    stderr: string,
    stdout: string = '',
    exitCode: number = 1
  ): Promise<{ explanation: ErrorExplanation }> {
    return request('/ai/explain-error', {
      method: 'POST',
      body: JSON.stringify({ code, language, stderr, stdout, exitCode }),
    });
  },
  async aiGenerateTests(code: string, language: string): Promise<{ tests: TestCase[] }> {
    return request('/ai/tests', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  },
  async aiGenerateFlowchart(code: string, language: string): Promise<{ graph: FlowchartGraph }> {
    return request('/ai/flowchart', {
      method: 'POST',
      body: JSON.stringify({ code, language }),
    });
  },
};
