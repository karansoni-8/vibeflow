import { ComplexityAnalysis } from '../types.js';

export function analyzeComplexityStatic(code: string, language: string): ComplexityAnalysis {
  const lines = code.split('\n');
  let loopDepth = 0;
  let maxLoopDepth = 0;
  let hasDivideAndConquer = false;
  let hasRecursion = false;
  let hasDynamicProgramming = false;
  let hasBacktracking = false;
  let hasGraphTraversal = false;

  // Simple pattern heuristics
  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.includes('mid =') || trimmed.includes('/ 2') || trimmed.includes('>> 1')) {
      hasDivideAndConquer = true;
    }
    if (trimmed.includes('dp[') || trimmed.includes('memo[') || trimmed.includes('memoization')) {
      hasDynamicProgramming = true;
    }
    if (trimmed.includes('isSafe') || trimmed.includes('backtrack') || trimmed.includes('solve(')) {
      hasBacktracking = true;
    }
    if (trimmed.includes('queue<') || trimmed.includes('visited[') || trimmed.includes('adj[')) {
      hasGraphTraversal = true;
    }

    if (trimmed.startsWith('for') || trimmed.startsWith('while')) {
      loopDepth++;
      if (loopDepth > maxLoopDepth) maxLoopDepth = loopDepth;
    } else if (trimmed === '}' && loopDepth > 0) {
      loopDepth--;
    }
  }

  // Algorithm classification
  let detectedAlgo = 'General Iterative Algorithm';
  let best = 'O(1)';
  let average = 'O(n)';
  let worst = 'O(n)';
  let space = 'O(1)';
  let sensitivity = 'Linear traversal depends on the length of input n and whether early break is encountered.';

  if (hasBacktracking) {
    detectedAlgo = 'Backtracking Search';
    best = 'O(1)';
    average = 'Exponential with Pruning';
    worst = 'O(N!) or O(2^N)';
    space = 'O(N) recursion stack';
    sensitivity = 'Pruning eliminates non-viable state subtrees early. The observed number of explored states for a given configuration is often orders of magnitude smaller than the theoretical exponential worst case.';
  } else if (hasDynamicProgramming) {
    detectedAlgo = 'Dynamic Programming';
    best = 'O(n)';
    average = 'O(n * W) or O(n)';
    worst = 'O(n * W) or O(n)';
    space = 'O(n) or O(n * W) auxiliary table';
    sensitivity = 'Complexity is pseudo-polynomial depending on numerical capacity/constraints rather than pure combinatorial branching.';
  } else if (hasGraphTraversal) {
    detectedAlgo = 'Graph Traversal (BFS / DFS)';
    best = 'O(1)';
    average = 'O(V + E)';
    worst = 'O(V + E)';
    space = 'O(V) visited & queue/stack';
    sensitivity = 'Actual visited vertices and traversed edges directly mirror the connectivity density of the input graph.';
  } else if (hasDivideAndConquer && maxLoopDepth <= 1) {
    detectedAlgo = 'Divide and Conquer (Binary Search)';
    best = 'O(1)';
    average = 'O(log n)';
    worst = 'O(log n)';
    space = 'O(1)';
    sensitivity = 'Best case O(1) occurs when the target is at the exact midpoint on the first check. Worst case O(log n) occurs when target is absent or at the boundaries.';
  } else if (maxLoopDepth === 2) {
    detectedAlgo = 'Quadratic Nested Loops';
    best = 'O(n)';
    average = 'O(n²)';
    worst = 'O(n²)';
    space = 'O(1)';
    sensitivity = 'The nested inner loop runs up to n times for each of the n outer loop iterations, generating approximately (n * (n + 1)) / 2 total operations in triangular loops.';
  } else if (maxLoopDepth >= 3) {
    detectedAlgo = 'Cubic or Multi-nested Loops';
    best = 'O(n²)';
    average = 'O(n³)';
    worst = 'O(n³)';
    space = 'O(1)';
    sensitivity = 'Deeply nested loop structure scales exponentially with dimensional inputs.';
  }

  return {
    algorithm: detectedAlgo,
    timeComplexity: {
      best: {
        asymptotic: best,
        explanation: 'Occurs under favorable input positioning (e.g. immediate match or minimal branches).'
      },
      average: {
        asymptotic: average,
        explanation: 'Expected behavior across typical randomly distributed input instances.'
      },
      worst: {
        asymptotic: worst,
        explanation: 'Upper theoretical asymptotic bound under adversarial or worst-case input configurations.'
      }
    },
    spaceComplexity: {
      asymptotic: space,
      explanation: 'Auxiliary memory overhead utilized beyond the input data structure itself.'
    },
    inputSensitivity: {
      characteristics: 'Dependent on input size (n), data distribution (sorted vs reverse vs random), and pruning triggers.',
      observedOperations: 'Derived during live execution run',
      theoreticalVsObserved: sensitivity
    },
    overallExplanation: `This algorithm demonstrates an asymptotic worst-case time complexity of ${worst} and space requirement of ${space}. Input values directly influence the actual number of execution cycles.`
  };
}
