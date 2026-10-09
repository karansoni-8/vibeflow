import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VIBE_GEMINI_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const modelName = 'gemini-2.0-flash';

async function invokeGeminiWithRetry(prompt: string, systemInstruction: string, jsonResponse = true) {
  if (!genAI) {
    return { error: 'Gemini API key is missing' };
  }
  
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction
  }, {
    apiVersion: 'v1beta'
  });

  const generationConfig: any = {};
  if (jsonResponse) {
    generationConfig.responseMimeType = 'application/json';
  }

  let attempt = 0;
  while (attempt < 2) {
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig
      });
      const text = result.response.text();
      if (jsonResponse) {
        return JSON.parse(text);
      }
      return text;
    } catch (error) {
      console.error(`Gemini invocation error (attempt ${attempt + 1}):`, error);
      attempt++;
      if (attempt >= 2) throw error;
    }
  }
}

export async function generateCode(prompt: string, language: string, beginnerMode: boolean = false) {
  const sys = 'Expert programming tutor. Generate clean, well-commented code. Return JSON format: { "code": "string", "explanation": "string" }';
  const p = `Language: ${language}\nPrompt: ${prompt}\nBeginner mode: ${beginnerMode}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function explainCode(code: string, language: string, beginnerMode: boolean = false) {
  const sys = 'Explain code step-by-step for beginners. Return JSON format: { "overview": "string", "steps": ["string"], "variables": ["string"], "algorithm": "string", "complexity": { "time": "string", "space": "string" }, "beginnerExplanation": "string" }';
  const p = `Language: ${language}\nCode:\n${code}\nBeginner mode: ${beginnerMode}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function explainLine(code: string, lineNumber: number, language: string, beginnerMode: boolean = false) {
  const sys = 'Explain what a specific line does. Return JSON format: { "explanation": "string", "purpose": "string", "variablesInvolved": ["string"], "stateEffect": "string", "complexityContribution": "string", "possibleBugs": ["string"] }';
  const p = `Language: ${language}\nCode:\n${code}\nTarget Line Number: ${lineNumber}\nBeginner mode: ${beginnerMode}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function improveCode(code: string, language: string) {
  const sys = 'Analyze and suggest improvements. Return JSON format: { "suggestions": ["string"], "improvedCode": "string", "currentComplexity": "string", "improvedComplexity": "string", "diffExplanation": "string" }';
  const p = `Language: ${language}\nCode:\n${code}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function analyzeComplexity(code: string, language: string, input?: string) {
  const sys = 'Analyze computational complexity. Distinguish theoretical vs observed. Consider input sensitivity. Return JSON format: { "algorithm": "string", "time": { "best": "string", "average": "string", "worst": "string" }, "space": { "best": "string", "average": "string", "worst": "string" }, "explanation": "string", "inputSensitivity": "string", "observedNote": "string" }';
  const p = `Language: ${language}\nCode:\n${code}\nInput: ${input || 'N/A'}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function explainError(code: string, language: string, stderr: string, stdout: string, exitCode: number, input?: string) {
  const sys = 'Explain compiler/runtime errors for beginners. Return JSON format: { "type": "string", "title": "string", "explanation": "string", "location": { "line": 0, "column": 0 }, "cause": "string", "fix": "string", "correctedCode": "string", "beginnerExplanation": "string" }';
  const p = `Language: ${language}\nCode:\n${code}\nStderr:\n${stderr}\nStdout:\n${stdout}\nExit Code: ${exitCode}\nInput: ${input || 'N/A'}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function generateFlowchart(code: string, language: string) {
  const sys = 'Convert code to structured flowchart JSON. Standard flowchart semantics. Nodes: start, end, process, decision, inputOutput, subprocess. Every decision must have YES/NO branches. Loops must have return edges. Include lineStart/lineEnd in each node data for code sync. Return ONLY valid JSON format: { "nodes": [{ "id": "string", "type": "string", "label": "string", "lineStart": 0, "lineEnd": 0 }], "edges": [{ "source": "string", "target": "string", "label": "string" }] }';
  const p = `Language: ${language}\nCode:\n${code}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function generateTestCases(code: string, language: string) {
  const sys = "Generate test cases including normal, edge, boundary, and large cases. Return JSON format: { \"testCases\": [{ \"name\": \"string\", \"input\": \"string\", \"expectedOutput\": \"string\", \"description\": \"string\", \"category\": \"normal\"|\"edge\"|\"boundary\"|\"large\" }] }";
  const p = `Language: ${language}\nCode:\n${code}`;
  return await invokeGeminiWithRetry(p, sys);
}

export async function chatWithAI(message: string, context: { code?: string, language?: string, selectedCode?: string, errors?: string, input?: string } = {}, beginnerMode: boolean = false) {
  const sys = 'AI coding assistant. Context-aware. Return JSON format: { "response": "string" }';
  const p = `Message: ${message}\nContext: ${JSON.stringify(context)}\nBeginner mode: ${beginnerMode}`;
  return await invokeGeminiWithRetry(p, sys);
}
