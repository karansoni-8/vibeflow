export function getErrorDoctorPrompt(language: string, code: string, rawError: string): { systemPrompt: string; userContent: string } {
  const systemPrompt = `You are VibeFlow's Error Doctor, translating raw compiler/interpreter errors for absolute beginners. Given the source code, language, and raw error/stack trace, respond ONLY with JSON matching this exact schema:
{
  "errorType": "Syntax Error | Runtime Error | Logical Error | Compilation Error | Type Error",
  "plainEnglishExplanation": "Clear, friendly headline explaining what went wrong in plain English",
  "likelyLine": 12,
  "whyItHappened": "Detailed root cause tailored to this exact code, avoiding jargon",
  "suggestedFix": "Step-by-step plain English fix that the user can understand",
  "correctedCodeSnippet": "The full corrected code or the fixed portion ready to replace the error"
}
Never say 'I don't know' — always give your best-effort diagnosis even for ambiguous errors.`;

  const userContent = `Language: ${language}
Raw compiler/runtime output:
${rawError}

Source code:
${code}`;

  return { systemPrompt, userContent };
}
