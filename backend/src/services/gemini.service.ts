import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured in backend .env');
    }
    genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }
  return genAI;
}

// Simple in-flight dedup: prevents the same session from firing overlapping identical requests
const ongoingRequests = new Set<string>();

export async function callGemini(
  systemPrompt: string,
  userContent: string,
  opts?: { json?: boolean; sessionKey?: string }
): Promise<string> {
  const sessionKey = opts?.sessionKey;
  if (sessionKey) {
    if (ongoingRequests.has(sessionKey)) {
      // Wait briefly then continue — don't block indefinitely
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    ongoingRequests.add(sessionKey);
  }

  const ai = getGenAI();

  // Primary model first, one fast fallback — no extra retry loops that add latency
  const modelsToTry = [
    config.geminiModel || 'gemini-2.0-flash',
    'gemini-1.5-flash',
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const model = ai.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          ...(opts?.json ? { responseMimeType: 'application/json' } : {}),
          // Speed optimizations: cap output tokens, use lower temperature for deterministic responses
          maxOutputTokens: opts?.json ? 1500 : 1024,
          temperature: 0.2,
          topP: 0.8,
          topK: 20,
        },
      });

      const result = await model.generateContent(userContent);
      const text = result.response.text();
      if (text) {
        if (sessionKey) ongoingRequests.delete(sessionKey);
        return text;
      }
    } catch (err: any) {
      lastError = err;
      const msg = err.message || '';
      const isQuota = msg.includes('429') || msg.includes('quota');
      const is503 = msg.includes('503') || msg.includes('high demand');

      if (is503) {
        // Brief pause only for transient 503, then try next model
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
      if (isQuota) {
        // Quota exhausted — immediately fall through to next model, no wait
        console.warn(`Model ${modelName} quota exhausted, trying fallback...`);
      } else {
        console.warn(`Model ${modelName} failed: ${msg}`);
      }
      // Always continue to next model
      continue;
    }
  }

  if (sessionKey) {
    ongoingRequests.delete(sessionKey);
  }

  console.error('All Gemini models exhausted:', lastError?.message || lastError);
  throw new Error(lastError?.message || 'AI_UNAVAILABLE');
}
