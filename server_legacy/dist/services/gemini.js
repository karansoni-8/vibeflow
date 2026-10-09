import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { parseControlFlow } from './astFlowchart.js';
import { analyzeComplexityStatic } from './astComplexity.js';
dotenv.config();
const apiKey = process.env.GEMINI_API_KEY?.trim();
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
// Helper to get model
function getModel(jsonMode = false) {
    if (!genAI)
        return null;
    return genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: jsonMode ? { responseMimeType: 'application/json' } : undefined,
    });
}
// 1. Code Generation
export async function generateCode(prompt, language) {
    const model = getModel(false);
    if (!model) {
        return `// Offline / Default Template for: ${prompt}
// Note: To enable live Gemini AI generation, provide GEMINI_API_KEY in server/.env

#include <iostream>
#include <vector>

using namespace std;

// Solution for: ${prompt}
int main() {
    cout << "Generated template for: ${prompt}" << endl;
    return 0;
}
`;
    }
    const systemInstruction = `You are an expert programming tutor and developer tools AI inside the VibeFlow IDE.
The user wants code in language "${language}".
Prompt: "${prompt}".
Generate clean, well-commented, production-ready code with appropriate DSA data structures.
Do not include conversational chit-chat. Return ONLY the code, wrapped in markdown code blocks or plain text.`;
    try {
        const response = await model.generateContent(systemInstruction);
        let text = response.response.text();
        // Strip markdown code fences if present
        text = text.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
        return text.trim();
    }
    catch (err) {
        console.error('Gemini generateCode error:', err);
        return `// Gemini AI temporarily unavailable (${err.message}).\n// Please check your GEMINI_API_KEY in server/.env\n`;
    }
}
// 2. Code Explanation
export async function explainCode(code, language, beginnerMode = false) {
    const model = getModel(true);
    if (!model) {
        const staticComp = analyzeComplexityStatic(code, language);
        return {
            overview: `This ${language} program performs ${staticComp.algorithm}. It processes standard inputs and executes algorithmic operations.`,
            stepByStep: [
                '1. Initializes necessary data structures and variables.',
                '2. Processes control flow through conditional checks and iterative loops.',
                '3. Produces output or returns computation results.',
            ],
            importantVariables: [
                { name: 'n / size', purpose: 'Represents the problem scale or number of elements.' },
                { name: 'i / loop counter', purpose: 'Tracks traversal index.' },
            ],
            algorithm: staticComp.algorithm,
            complexity: {
                time: staticComp.timeComplexity.worst.asymptotic,
                space: staticComp.spaceComplexity.asymptotic,
            },
            beginnerExplanation: beginnerMode
                ? 'Think of this program like a step-by-step recipe. It reads your ingredients (inputs), follows rules to organize them, and serves the finished dish (output).'
                : 'The algorithm operates deterministically on input structures, optimizing resource utilization according to standard algorithmic paradigms.',
        };
    }
    const prompt = `Analyze the following ${language} code. Provide an educational breakdown.
Beginner mode is: ${beginnerMode ? 'ENABLED (use very simple analogies, define all terms)' : 'DISABLED (technical and precise)'}.

Code:
\`\`\`${language}
${code}
\`\`\`

Return a valid JSON object matching this schema:
{
  "overview": "Clear summary of what the code achieves",
  "stepByStep": ["Step 1 explanation", "Step 2 explanation", "..."],
  "importantVariables": [{"name": "varName", "purpose": "What it holds and why"}],
  "algorithm": "Name of identified algorithm (e.g. Binary Search, Merge Sort, etc.)",
  "complexity": {
    "time": "e.g. O(n log n)",
    "space": "e.g. O(1)"
  },
  "beginnerExplanation": "Simple plain-English analogy explanation without scary jargon"
}`;
    try {
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());
        return parsed;
    }
    catch (err) {
        console.error('Gemini explainCode error:', err);
        return {
            overview: 'Could not fetch explanation from AI service.',
            stepByStep: ['Check your API connection in server/.env'],
            importantVariables: [],
            algorithm: 'Unknown',
            complexity: { time: 'N/A', space: 'N/A' },
            beginnerExplanation: 'Service unavailable.',
        };
    }
}
// 3. Line by Line Explanation
export async function explainLine(code, lineNumber, lineContent, language, beginnerMode = false) {
    const model = getModel(true);
    if (!model) {
        return {
            line: lineNumber,
            content: lineContent,
            whatItDoes: `Executes statement: ${lineContent}`,
            whyItExists: 'Contributes to program control flow or state modification.',
            variablesInvolved: ['Locally scoped identifiers'],
            stateEffect: 'Updates registers or memory references.',
            complexityContribution: lineContent.includes('for') || lineContent.includes('while') ? 'O(n)' : 'O(1)',
            possibleBugs: 'Watch out for off-by-one bounds or null references.',
        };
    }
    const prompt = `Explain line ${lineNumber} of this ${language} code:
Line: "${lineContent}"

Full code context:
\`\`\`${language}
${code}
\`\`\`

Beginner mode is: ${beginnerMode ? 'ENABLED (explain simply without complex jargon)' : 'DISABLED'}.

Return JSON:
{
  "line": ${lineNumber},
  "content": "${lineContent.replace(/"/g, '\\"')}",
  "whatItDoes": "What happens right here",
  "whyItExists": "The architectural or logical purpose of this line",
  "variablesInvolved": ["var1", "var2"],
  "stateEffect": "How variables or memory change after this line executes",
  "complexityContribution": "e.g. O(1) or O(n) loop execution",
  "possibleBugs": "Common errors beginners make with this line (e.g. off-by-one, semicolon, null)"
}`;
    try {
        const response = await model.generateContent(prompt);
        return JSON.parse(response.response.text());
    }
    catch (err) {
        return {
            line: lineNumber,
            content: lineContent,
            whatItDoes: 'Line analysis unavailable',
            whyItExists: '',
            variablesInvolved: [],
            stateEffect: '',
            complexityContribution: 'O(1)',
            possibleBugs: '',
        };
    }
}
// 4. Complexity Analysis with Input-Sensitivity
export async function analyzeComplexity(code, language, observedData) {
    const staticResult = analyzeComplexityStatic(code, language);
    const model = getModel(true);
    if (!model) {
        if (observedData?.operations || observedData?.iterations) {
            staticResult.inputSensitivity.observedOperations = observedData.operations || observedData.iterations;
        }
        return staticResult;
    }
    const prompt = `You are an expert algorithm complexity professor.
Analyze this ${language} algorithm:
\`\`\`${language}
${code}
\`\`\`

Observed runtime telemetry for current run:
- Input provided: "${observedData?.input || 'Default test vector'}"
- Observed iterations / operations: ${observedData?.iterations || observedData?.operations || 'Not measured directly'}
- Runtime: ${observedData?.executionTimeMs || 0}ms

MANDATORY RULES:
1. Distinguish between theoretical asymptotic complexity and actual observed finite execution.
2. NEVER say "observed complexity is O(3)" or "current complexity = O(7)". Big-O is an asymptotic bound for n -> infinity!
3. Explain input sensitivity (e.g. best case immediate termination vs worst case full traversal, backtracking pruning branches, pivot selection in sorting).

Return JSON matching this schema:
{
  "algorithm": "Name of algorithm",
  "timeComplexity": {
    "best": {"asymptotic": "O(...)", "explanation": "When this occurs"},
    "average": {"asymptotic": "O(...)", "explanation": "Expected case"},
    "worst": {"asymptotic": "O(...)", "explanation": "Adversarial/worst input"}
  },
  "spaceComplexity": {
    "asymptotic": "O(...)",
    "explanation": "Memory requirement details"
  },
  "inputSensitivity": {
    "characteristics": "How input values alter behavior",
    "observedOperations": "${observedData?.iterations || 'Derived from execution'}",
    "theoreticalVsObserved": "Explicit explanation contrasting asymptotic bounds with this specific test input"
  },
  "overallExplanation": "Thorough educational paragraph"
}`;
    try {
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());
        return parsed;
    }
    catch (err) {
        console.error('Gemini complexity error:', err);
        return staticResult;
    }
}
// 5. Error Explainer
export async function explainError(code, language, stderr, stdout = '', exitCode = 1) {
    const model = getModel(true);
    // Heuristic parser for missing semicolon or common C++/Python errors if offline
    let errorLine = 1;
    const lineMatch = stderr.match(/:(\d+):(?:\d+:)?\s*error/i) || stderr.match(/line (\d+)/i);
    if (lineMatch) {
        errorLine = parseInt(lineMatch[1], 10);
    }
    if (!model) {
        const isMissingSemicolon = stderr.toLowerCase().includes('expected') && stderr.includes(';');
        return {
            type: 'Syntax Error',
            title: isMissingSemicolon ? 'Missing Semicolon (;)' : 'Compilation / Runtime Error',
            whatHappened: isMissingSemicolon
                ? 'The compiler expected a semicolon (;) at the end of a statement.'
                : `The compiler or interpreter encountered a failure: ${stderr.slice(0, 100)}...`,
            whyItHappened: isMissingSemicolon
                ? 'In C++, statements must end with a semicolon so the compiler knows where the instruction ends.'
                : 'An invalid statement or syntax construct was detected during compilation/runtime.',
            whereItHappened: {
                line: errorLine,
                snippet: code.split('\n')[errorLine - 1] || '',
            },
            howToFix: isMissingSemicolon
                ? `Check line ${Math.max(1, errorLine - 1)} or ${errorLine} and append a semicolon (;).`
                : 'Review the compiler error message and inspect the highlighted line in Monaco editor.',
            correctedCode: code,
            beginnerNote: 'Don\'t worry! Even senior engineers frequently miss semicolons or misplace brackets.',
        };
    }
    const prompt = `You are a friendly, encouraging beginner programming mentor inside VibeFlow.
A student ran this ${language} code and encountered an error.

Error output (stderr):
${stderr}

Exit code: ${exitCode}

Source code:
\`\`\`${language}
${code}
\`\`\`

Translate this intimidating compiler error into a kind, beginner-friendly explanation.
Return JSON:
{
  "type": "Syntax Error | Compilation Error | Runtime Error | Logical Error | Memory Error | Type Error | Timeout / Infinite Loop",
  "title": "Short friendly title e.g. Missing Semicolon (;)",
  "whatHappened": "Plain English summary of what went wrong",
  "whyItHappened": "Why the compiler got confused",
  "whereItHappened": {
    "line": ${errorLine},
    "column": 1,
    "snippet": "the specific problematic line"
  },
  "howToFix": "Clear step-by-step fix instruction",
  "correctedCode": "The full corrected source code with the fix applied",
  "beginnerNote": "Encouraging tip to prevent this in the future"
}`;
    try {
        const response = await model.generateContent(prompt);
        return JSON.parse(response.response.text());
    }
    catch (err) {
        return {
            type: 'Compilation Error',
            title: 'Compiler Diagnostic',
            whatHappened: stderr,
            whyItHappened: 'Error during compilation',
            whereItHappened: { line: errorLine },
            howToFix: 'Examine compiler message',
            correctedCode: code,
            beginnerNote: 'Check syntax on the highlighted line.',
        };
    }
}
// 6. Test Case Generator
export async function generateTestCases(code, language) {
    const model = getModel(true);
    if (!model) {
        return [
            {
                id: 'tc_1',
                name: 'Normal Standard Case',
                type: 'normal',
                input: '5\n10 20 30 40 50\n30',
                explanation: 'Typical sorted array with target in the middle.',
            },
            {
                id: 'tc_2',
                name: 'Edge Case: Element Absent',
                type: 'edge',
                input: '5\n10 20 30 40 50\n99',
                explanation: 'Verifies the program handles missing elements without crashing.',
            },
            {
                id: 'tc_3',
                name: 'Boundary Case: Single Element',
                type: 'boundary',
                input: '1\n42\n42',
                explanation: 'Tests lower boundary with minimal array size n=1.',
            },
            {
                id: 'tc_4',
                name: 'Large Input Stress Test',
                type: 'large',
                input: '10\n1 2 3 4 5 6 7 8 9 10\n1',
                explanation: 'Checks performance scaling and target at starting boundary.',
            },
        ];
    }
    const prompt = `Generate 4 diverse test cases for this ${language} code:
\`\`\`${language}
${code}
\`\`\`

Include:
1 normal case
1 edge case (explain why this edge case matters, e.g. empty array, target absent, negative values)
1 boundary case (e.g. n=1, 0)
1 large/stress case

Return JSON array of test cases:
[
  {
    "id": "tc_1",
    "name": "Normal Case",
    "type": "normal | edge | boundary | large",
    "input": "exact stdin input string",
    "expectedOutput": "optional expected string",
    "explanation": "Why this test case is essential"
  }
]`;
    try {
        const response = await model.generateContent(prompt);
        return JSON.parse(response.response.text());
    }
    catch (err) {
        return [];
    }
}
// 7. Code Improvement / Optimization
export async function improveCode(code, language) {
    const model = getModel(true);
    if (!model) {
        return {
            title: 'Code Formatting & Modern Best Practices',
            category: 'readability',
            currentComplexity: 'Current implementation',
            improvedComplexity: 'Optimized asymptotic bound',
            reason: 'Use modern standard library abstractions and clear variable naming.',
            improvedCode: code,
            diffSummary: 'Add GEMINI_API_KEY to unlock advanced algorithmic refactoring.',
        };
    }
    const prompt = `Analyze this ${language} code and provide an algorithmic or architectural improvement (e.g. reducing complexity, eliminating redundant operations, or enhancing modern readability).

Code:
\`\`\`${language}
${code}
\`\`\`

Return JSON:
{
  "title": "Title of improvement (e.g. Optimize from O(n²) to O(n log n))",
  "category": "performance | readability | safety | idiomatic",
  "currentComplexity": "e.g. O(n²)",
  "improvedComplexity": "e.g. O(n log n)",
  "reason": "Detailed justification of why the new implementation is superior",
  "improvedCode": "Complete replacement code",
  "diffSummary": "Bullet points summarizing the exact changes"
}`;
    try {
        const response = await model.generateContent(prompt);
        return JSON.parse(response.response.text());
    }
    catch (err) {
        return {
            title: 'Optimization Unavailable',
            category: 'performance',
            currentComplexity: 'O(n)',
            improvedComplexity: 'O(n)',
            reason: 'AI service unreachable.',
            improvedCode: code,
            diffSummary: 'No changes generated.',
        };
    }
}
// 8. Semantic Flowchart Generator
export async function generateFlowchart(code, language) {
    // Use deterministic AST parser first as foundation
    const astGraph = parseControlFlow(code, language);
    const model = getModel(true);
    if (!model) {
        return astGraph;
    }
    const prompt = `Analyze this ${language} source code and generate a standard flowchart control-flow graph JSON.
Code:
\`\`\`${language}
${code}
\`\`\`

STANDARD FLOWCHART CONVENTIONS:
- "start": Terminator shape for entry point.
- "end": Terminator shape for exit/return.
- "process": Rectangle for assignment, computation, or operation.
- "decision": Diamond for conditions (if, while condition, for condition).
- "inputOutput": Parallelogram for cin/cout, print, input.
- "subprocess": Distinct shape for function calls.
- Decision branches MUST have edge labels: "YES" and "NO".
- Loop structures MUST have a back-edge from body back to the decision condition!
- Include lineStart and lineEnd numbers pointing to original code lines for code-to-flowchart synchronization.

Return JSON:
{
  "nodes": [
    {"id": "n1", "type": "start", "label": "START", "lineStart": 1, "lineEnd": 1, "description": "Entry"},
    {"id": "n2", "type": "decision", "label": "x > 5?", "lineStart": 5, "lineEnd": 5, "description": "Condition check"}
  ],
  "edges": [
    {"id": "e1", "source": "n1", "target": "n2"},
    {"id": "e2", "source": "n2", "target": "n3", "label": "YES"},
    {"id": "e3", "source": "n2", "target": "n4", "label": "NO"}
  ]
}`;
    try {
        const response = await model.generateContent(prompt);
        const parsed = JSON.parse(response.response.text());
        if (parsed.nodes && parsed.edges && parsed.nodes.length > 0) {
            return parsed;
        }
        return astGraph;
    }
    catch (err) {
        console.error('Gemini flowchart generation fallback to AST:', err);
        return astGraph;
    }
}
