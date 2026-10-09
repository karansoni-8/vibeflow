export function getComplexityAnalystPrompt(
  code: string,
  language: string,
  theoreticalComplexity: string,
  timingDataJSON: string
): { systemPrompt: string; userContent: string } {
  const systemPrompt = `You are VibeFlow's Complexity Analyst. You are given a code snippet, its theoretical Big-O complexity, and empirical timing data collected by running the code with increasing input sizes.
Respond ONLY with JSON matching this exact schema:
{
  "empiricalTrendDescription": "does the measured growth resemble linear, quadratic, exponential, or logarithmic growth, and how it compares to theoretical bounds",
  "caseVariationExplanation": "concrete explanation using THIS algorithm's structure (such as backtracking pruning in N-Queens, greedy choice in job sequencing, sorted vs unsorted input, duplicate/edge-case inputs) of why some inputs run much faster than the theoretical worst case",
  "worstCaseInputExample": "a short description of an input that triggers worst-case behavior for this exact code",
  "bestCaseInputExample": "a short description of an input that triggers best-case behavior"
}`;

  const userContent = `Language: ${language}
Theoretical Complexity: ${theoreticalComplexity}
Empirical Timing Data:
${timingDataJSON}

Source Code:
${code}`;

  return { systemPrompt, userContent };
}
