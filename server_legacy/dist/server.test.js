import { describe, it, expect } from 'vitest';
import { executeCode } from './services/execution.js';
import { parseControlFlow } from './services/astFlowchart.js';
import { analyzeComplexityStatic } from './services/astComplexity.js';
import { storage, demoUser } from './services/storage.js';
describe('VibeFlow Execution Service', () => {
    it('should execute Python code successfully and capture output', async () => {
        const code = `print("Hello from VibeFlow Python!")`;
        const res = await executeCode('python', code, '');
        expect(res.status).toBe('success');
        expect(res.stdout).toContain('Hello from VibeFlow Python!');
        expect(res.exitCode).toBe(0);
        expect(res.executionTimeMs).toBeGreaterThan(0);
    });
    it('should handle Python standard input', async () => {
        const code = `import sys
val = sys.stdin.readline().strip()
print(f"Read input: {val}")`;
        const res = await executeCode('python', code, 'test_input_123');
        expect(res.status).toBe('success');
        expect(res.stdout).toContain('Read input: test_input_123');
    });
    it('should compile and execute C++ code successfully', async () => {
        const code = `#include <iostream>
using namespace std;
int main() {
    cout << "VibeFlow C++ Works!" << endl;
    return 0;
}`;
        const res = await executeCode('cpp', code, '');
        expect(res.status).toBe('success');
        expect(res.stdout).toContain('VibeFlow C++ Works!');
        expect(res.exitCode).toBe(0);
    }, 20000);
    it('should catch C++ syntax errors and return error status', async () => {
        const code = `#include <iostream>
using namespace std;
int main() {
    cout << "Missing semicolon"
    return 0;
}`;
        const res = await executeCode('cpp', code, '');
        expect(res.status).toBe('error');
        expect(res.stderr).toContain('error');
    });
});
describe('VibeFlow Flowchart AST Engine', () => {
    it('should generate START, END, and standard flowchart nodes', () => {
        const code = `int a = 10;
if (a > 5) {
    cout << "Yes";
}`;
        const graph = parseControlFlow(code, 'cpp');
        expect(graph.nodes.length).toBeGreaterThan(0);
        const startNode = graph.nodes.find((n) => n.type === 'start');
        const endNode = graph.nodes.find((n) => n.type === 'end');
        const decisionNode = graph.nodes.find((n) => n.type === 'decision');
        expect(startNode).toBeDefined();
        expect(endNode).toBeDefined();
        expect(decisionNode).toBeDefined();
        expect(decisionNode?.label).toContain('a > 5');
        // Edge check: YES and NO branch labels
        const yesEdge = graph.edges.find((e) => e.label === 'YES');
        const noEdge = graph.edges.find((e) => e.label === 'NO');
        expect(yesEdge).toBeDefined();
        expect(noEdge).toBeDefined();
    });
    it('should generate loop decision and repeat back-edge for loops', () => {
        const code = `for (int i = 0; i < n; i++) {
    cout << i;
}`;
        const graph = parseControlFlow(code, 'cpp');
        const repeatEdge = graph.edges.find((e) => e.label === 'REPEAT');
        expect(repeatEdge).toBeDefined();
    });
});
describe('VibeFlow Complexity Static Analyzer', () => {
    it('should recognize binary search divide-and-conquer complexity', () => {
        const code = `while (low <= high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
}`;
        const comp = analyzeComplexityStatic(code, 'cpp');
        expect(comp.timeComplexity.worst.asymptotic).toBe('O(log n)');
        expect(comp.timeComplexity.best.asymptotic).toBe('O(1)');
    });
    it('should identify quadratic complexity for nested loops', () => {
        const code = `for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        cout << i << j;
    }
}`;
        const comp = analyzeComplexityStatic(code, 'cpp');
        expect(comp.timeComplexity.worst.asymptotic).toBe('O(n²)');
    });
});
describe('VibeFlow Project & Storage Service', () => {
    it('should retrieve preloaded sample projects', () => {
        const projs = storage.getProjects(demoUser.id);
        expect(projs.length).toBeGreaterThanOrEqual(8);
        const bsProj = projs.find((p) => p.name.includes('Binary Search'));
        expect(bsProj).toBeDefined();
        expect(bsProj?.files.length).toBeGreaterThan(0);
    });
});
