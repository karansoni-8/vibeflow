import { auth } from './firebase';

const BASE_URL = '/api';

export const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'API Error');
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    return { data: null, error: error.message };
  }
};

export const verifyAuth = () => fetchApi('/auth/verify', { method: 'POST' });
export const getProjects = () => fetchApi('/projects');
export const createProject = (name: string, language: string) => fetchApi('/projects', {
  method: 'POST',
  body: JSON.stringify({ name, language }),
});
export const getProject = (id: string) => fetchApi(`/projects/${id}`);
export const updateProject = (id: string, data: any) => fetchApi(`/projects/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deleteProject = (id: string) => fetchApi(`/projects/${id}`, { method: 'DELETE' });

export const createFile = (projectId: string, name: string, language: string) => fetchApi(`/projects/${projectId}/files`, {
  method: 'POST',
  body: JSON.stringify({ name, language }),
});
export const updateFile = (id: string, content: string) => fetchApi(`/files/${id}`, {
  method: 'PUT',
  body: JSON.stringify({ content }),
});
export const deleteFile = (id: string) => fetchApi(`/files/${id}`, { method: 'DELETE' });

export const executeCode = (language: string, code: string, stdin?: string) => fetchApi('/execute', {
  method: 'POST',
  body: JSON.stringify({ language, code, stdin }),
});

export const generateCode = (prompt: string, language: string, beginnerMode?: boolean) => fetchApi('/ai/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt, language, beginnerMode }),
});
export const explainCode = (code: string, language: string, beginnerMode?: boolean) => fetchApi('/ai/explain', {
  method: 'POST',
  body: JSON.stringify({ code, language, beginnerMode }),
});
export const explainLine = (code: string, lineNumber: number, language: string) => fetchApi('/ai/explain-line', {
  method: 'POST',
  body: JSON.stringify({ code, lineNumber, language }),
});
export const improveCode = (code: string, language: string) => fetchApi('/ai/improve', {
  method: 'POST',
  body: JSON.stringify({ code, language }),
});
export const analyzeComplexity = (code: string, language: string, input?: string) => fetchApi('/ai/complexity', {
  method: 'POST',
  body: JSON.stringify({ code, language, input }),
});
export const explainError = (code: string, language: string, stderr: string, stdout: string, exitCode: number, input?: string) => fetchApi('/ai/error', {
  method: 'POST',
  body: JSON.stringify({ code, language, stderr, stdout, exitCode, input }),
});
export const generateFlowchart = (code: string, language: string) => fetchApi('/ai/flowchart', {
  method: 'POST',
  body: JSON.stringify({ code, language }),
});
export const generateTestCases = (code: string, language: string) => fetchApi('/ai/tests', {
  method: 'POST',
  body: JSON.stringify({ code, language }),
});
export const chatWithAI = (message: string, context: any, beginnerMode?: boolean) => fetchApi('/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ message, context, beginnerMode }),
});
