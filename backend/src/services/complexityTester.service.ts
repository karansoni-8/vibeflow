import { executeCode } from './piston.service.js';
import { callGemini } from './gemini.service.js';
import { getComplexityAnalystPrompt } from '../prompts/complexityAnalyst.prompt.js';

export interface DataPoint {
  inputSize: number;
  durationMs: number;
  theoreticalNormalized?: number;
}

export interface EmpiricalComplexityResult {
  timingData: DataPoint[];
  empiricalTrendDescription: string;
  caseVariationExplanation: string;
  worstCaseInputExample: string;
  bestCaseInputExample: string;
}

export async function runEmpiricalComplexitySweep(
  code: string,
  language: string,
  theoreticalComplexity: string = 'O(N^2)'
): Promise<EmpiricalComplexityResult> {
  const isPython = language.toLowerCase().includes('py');
  const isCpp = language.toLowerCase().includes('c++') || language.toLowerCase().includes('cpp');

  // Determine appropriate input sizes based on code keywords
  let inputSizes = [10, 50, 200, 1000, 4000];
  const lowerCode = code.toLowerCase();

  if (lowerCode.includes('queen') || lowerCode.includes('nqueen')) {
    inputSizes = [4, 6, 8, 10, 12];
  } else if (lowerCode.includes('fib') || lowerCode.includes('recur')) {
    inputSizes = [5, 12, 20, 28, 33];
  } else if (lowerCode.includes('job') || lowerCode.includes('deadline')) {
    inputSizes = [5, 20, 50, 150, 400];
  } else if (lowerCode.includes('sort') || lowerCode.includes('search')) {
    inputSizes = [100, 500, 2000, 8000, 20000];
  }

  const timingData: DataPoint[] = [];

  for (const size of inputSizes) {
    let testStdin = '';
    // Format input based on typical algorithm patterns
    if (lowerCode.includes('queen') || lowerCode.includes('fib')) {
      testStdin = `${size}\n`;
    } else {
      // Generate array input: size followed by random numbers
      const nums: number[] = [];
      for (let i = 0; i < Math.min(size, 200); i++) {
        nums.push(Math.floor(Math.random() * 1000));
      }
      testStdin = `${size}\n${nums.join(' ')}\n`;
    }

    // Run 2 iterations to compute average execution time
    let totalTime = 0;
    const runs = 2;
    for (let r = 0; r < runs; r++) {
      const res = await executeCode(language, code, undefined, testStdin);
      totalTime += Math.max(res.durationMs, 1);
    }
    const avgDuration = Math.round(totalTime / runs);

    // Calculate theoretical curve normalization for overlay
    let theoretical = 1;
    const t = theoreticalComplexity.toUpperCase();
    if (t.includes('2^') || t.includes('EXPONENTIAL') || t.includes('N!')) {
      theoretical = Math.min(Math.pow(1.8, Math.min(size, 15)), 5000);
    } else if (t.includes('N^2') || t.includes('QUADRATIC')) {
      theoretical = Math.pow(size / 100, 2) * 5;
    } else if (t.includes('LOG') && t.includes('N')) {
      theoretical = (size / 10) * Math.log2(size || 1);
    } else if (t.includes('LOG')) {
      theoretical = Math.log2(size || 1) * 8;
    } else {
      // Linear
      theoretical = (size / 10) * 2;
    }

    timingData.push({
      inputSize: size,
      durationMs: avgDuration,
      theoreticalNormalized: Math.max(Math.round(theoretical), 1),
    });
  }

  // Send to Gemini for analytical explanation
  const timingJSON = JSON.stringify(timingData, null, 2);
  const { systemPrompt, userContent } = getComplexityAnalystPrompt(
    code,
    language,
    theoreticalComplexity,
    timingJSON
  );

  try {
    const aiText = await callGemini(systemPrompt, userContent, { json: true });
    const parsed = JSON.parse(aiText);
    return {
      timingData,
      empiricalTrendDescription: parsed.empiricalTrendDescription || 'Execution time scales smoothly across benchmarked input sizes.',
      caseVariationExplanation: parsed.caseVariationExplanation || 'Runtime depends closely on input branching, sorted order, and pruning.',
      worstCaseInputExample: parsed.worstCaseInputExample || 'Adversarial inputs or unpruned recursion trees.',
      bestCaseInputExample: parsed.bestCaseInputExample || 'Pre-sorted inputs or early termination conditions.',
    };
  } catch (err) {
    return {
      timingData,
      empiricalTrendDescription: `Observed execution time scaled from ${timingData[0]?.durationMs}ms at N=${timingData[0]?.inputSize} up to ${timingData[timingData.length - 1]?.durationMs}ms at N=${timingData[timingData.length - 1]?.inputSize}.`,
      caseVariationExplanation: 'In practical execution, branching pruning and CPU cache locality often keep practical running times substantially below theoretical worst-case asymptotic upper bounds.',
      worstCaseInputExample: 'Inputs that maximize backtracking recursion or force worst-case comparisons.',
      bestCaseInputExample: 'Inputs that trigger immediate base-case returns or early pruning.',
    };
  }
}
