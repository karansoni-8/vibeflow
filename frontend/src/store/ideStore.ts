import { create } from 'zustand';
import {
  ExplainResponse,
  ErrorDoctorResponse,
  EmpiricalComplexityResponse,
} from '../lib/api';

export type RightTab = 'flowchart' | 'explain' | 'pseudocode' | 'chat' | 'error' | 'complexity';
export type BottomTab = 'output' | 'terminal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  code?: string;
  timestamp: Date;
}

export const STARTER_CODE: Record<string, string> = {
  python: `# Fibonacci with Dynamic Programming & Memoization
# Notice how memoization avoids redundant recursive calls!

memo = {}

def fibonacci(n):
    # Base cases: fib(0)=0, fib(1)=1
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    # Check memo table for precomputed subproblems
    if n in memo:
        return memo[n]
    
    # Recursive case with state caching
    memo[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return memo[n]

if __name__ == "__main__":
    n = 10
    print(f"Fibonacci({n}) = {fibonacci(n)}")
    print("Memoized cache contents:", memo)
`,
  'c++': `// Binary Search Algorithm (C++)
// Time Complexity: O(log N) worst case, O(1) best case

#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        // Check if target is present at mid
        if (arr[mid] == target) {
            return mid;
        }

        // If target greater, ignore left half
        if (arr[mid] < target) {
            left = mid + 1;
        }
        // If target is smaller, ignore right half
        else {
            right = mid - 1;
        }
    }

    return -1; // Element not found
}

int main() {
    std::vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;

    int result = binarySearch(arr, target);
    if (result != -1) {
        std::cout << "Element " << target << " found at index: " << result << std::endl;
    } else {
        std::cout << "Element not found" << std::endl;
    }

    return 0;
}
`,
  c: `// Linear & Binary Search in C
#include <stdio.h>

int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int n = sizeof(arr) / sizeof(arr[0]);
    int target = 30;

    int index = linearSearch(arr, n, target);
    if (index != -1) {
        printf("Element found at index: %d\\n", index);
    } else {
        printf("Element not found\\n");
    }
    return 0;
}
`,
  javascript: `// Merge Sort Implementation in JavaScript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

const numbers = [38, 27, 43, 3, 9, 82, 10];
console.log("Original Array:", numbers);
console.log("Sorted Array:  ", mergeSort(numbers));
`,
  nqueens: `# N-Queens Backtracking with Pruning
def solve_nqueens(n):
    solutions = []
    board = [-1] * n
    cols = set()
    diag1 = set() # r - c
    diag2 = set() # r + c

    def backtrack(row):
        if row == n:
            solutions.append(list(board))
            return
        for col in range(n):
            if col in cols or (row - col) in diag1 or (row + col) in diag2:
                continue # Prune invalid branch!
            
            # Place queen
            board[row] = col
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)

            backtrack(row + 1)

            # Undo placement
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    backtrack(0)
    return len(solutions)

n = 8
print(f"Total valid arrangements for {n}-Queens: {solve_nqueens(n)}")
`,
  jobsequencing: `# Greedy Job Sequencing with Deadlines
class Job:
    def __init__(self, id, deadline, profit):
        self.id = id
        self.deadline = deadline
        self.profit = profit

def schedule_jobs(jobs, max_deadline):
    # Sort jobs in descending order of profit (Greedy Choice)
    jobs.sort(key=lambda x: x.profit, reverse=True)
    
    slots = [-1] * (max_deadline + 1)
    total_profit = 0
    scheduled = []

    for job in jobs:
        # Find latest available slot before or at deadline
        for slot in range(job.deadline, 0, -1):
            if slots[slot] == -1:
                slots[slot] = job.id
                scheduled.append(job.id)
                total_profit += job.profit
                break

    return scheduled, total_profit

jobs = [
    Job('J1', 2, 100),
    Job('J2', 1, 19),
    Job('J3', 2, 27),
    Job('J4', 1, 25),
    Job('J5', 3, 15)
]

scheduled, profit = schedule_jobs(jobs, 3)
print(f"Scheduled Jobs: {scheduled}")
print(f"Maximum Profit: {profit}")
`,
};

interface IdeState {
  language: string;
  code: string;
  stdin: string;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number | null;
  isExecuting: boolean;

  activeTabRight: RightTab;
  activeTabBottom: BottomTab;

  // Flowchart
  flowchartCode: string;
  isGeneratingFlowchart: boolean;
  autoSyncFlowchart: boolean;
  flowchartError: string | null;

  // Explainer
  explanation: ExplainResponse | null;
  isExplaining: boolean;

  // Pseudocode
  pseudocode: string | null;
  isGeneratingPseudocode: boolean;

  // Error Doctor
  errorDoctorReport: ErrorDoctorResponse | null;
  isDiagnosingError: boolean;
  errorBadgeCount: number;

  // Complexity Analysis
  empiricalData: EmpiricalComplexityResponse | null;
  isBenchmarking: boolean;

  // Chat
  chatMessages: ChatMessage[];
  isGeneratingChat: boolean;

  // Command palette
  isCommandPaletteOpen: boolean;

  // Project
  currentProjectId: string | null;
  projectTitle: string;
  isSaving: boolean;

  // Actions
  setLanguage: (lang: string) => void;
  setCode: (code: string) => void;
  setStdin: (stdin: string) => void;
  setExecutionResult: (res: { stdout: string; stderr: string; exitCode: number; durationMs: number }) => void;
  setIsExecuting: (executing: boolean) => void;
  setActiveTabRight: (tab: RightTab) => void;
  setActiveTabBottom: (tab: BottomTab) => void;
  setFlowchartCode: (code: string) => void;
  setIsGeneratingFlowchart: (val: boolean) => void;
  setAutoSyncFlowchart: (val: boolean) => void;
  setFlowchartError: (err: string | null) => void;
  setExplanation: (exp: ExplainResponse | null) => void;
  setIsExplaining: (val: boolean) => void;
  setPseudocode: (code: string | null) => void;
  setIsGeneratingPseudocode: (val: boolean) => void;
  setErrorDoctorReport: (report: ErrorDoctorResponse | null) => void;
  setIsDiagnosingError: (val: boolean) => void;
  setErrorBadgeCount: (count: number) => void;
  setEmpiricalData: (data: EmpiricalComplexityResponse | null) => void;
  setIsBenchmarking: (val: boolean) => void;
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsGeneratingChat: (val: boolean) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  loadSnippet: (key: string) => void;
}

export const useIdeStore = create<IdeState>((set, get) => ({
  language: 'python',
  code: STARTER_CODE.python,
  stdin: '',
  stdout: '',
  stderr: '',
  exitCode: null,
  durationMs: null,
  isExecuting: false,

  activeTabRight: 'flowchart',
  activeTabBottom: 'output',

  flowchartCode: `flowchart TD
  Start([Start]) --> Init[/Initialize memo table/]
  Init --> Call[[fibonacci(10)]]
  Call --> BaseCheck{n <= 1 ?}
  BaseCheck -->|Yes| RetBase[/Return n/]
  BaseCheck -->|No| MemoCheck{In memo cache?}
  MemoCheck -->|Yes| RetMemo[/Return cached value/]
  MemoCheck -->|No| Compute[Compute fib(n-1) + fib(n-2)]
  Compute --> Store[Store result in memo]
  Store --> Ret[/Return result/]
  RetBase --> End([End])
  RetMemo --> End
  Ret --> End`,
  isGeneratingFlowchart: false,
  autoSyncFlowchart: false,
  flowchartError: null,

  explanation: null,
  isExplaining: false,

  pseudocode: null,
  isGeneratingPseudocode: false,

  errorDoctorReport: null,
  isDiagnosingError: false,
  errorBadgeCount: 0,

  empiricalData: null,
  isBenchmarking: false,

  chatMessages: [
    {
      id: 'welcome_1',
      role: 'ai',
      text: "👋 Welcome to VibeFlow! I'm your AI pair programmer and DSA tutor. Ask me to explain concepts, optimize loops, or build custom algorithms from scratch!",
      timestamp: new Date(),
    },
  ],
  isGeneratingChat: false,

  isCommandPaletteOpen: false,

  currentProjectId: null,
  projectTitle: 'Fibonacci Dynamic Programming',
  isSaving: false,

  setLanguage: (lang: string) => {
    const defaultCode = STARTER_CODE[lang] || STARTER_CODE.python;
    set({ language: lang, code: defaultCode });
  },

  setCode: (code: string) => set({ code }),
  setStdin: (stdin: string) => set({ stdin }),

  setExecutionResult: (res) =>
    set({
      stdout: res.stdout,
      stderr: res.stderr,
      exitCode: res.exitCode,
      durationMs: res.durationMs,
      isExecuting: false,
    }),

  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setActiveTabRight: (activeTabRight) => set({ activeTabRight }),
  setActiveTabBottom: (activeTabBottom) => set({ activeTabBottom }),

  setFlowchartCode: (flowchartCode) => set({ flowchartCode, flowchartError: null }),
  setIsGeneratingFlowchart: (isGeneratingFlowchart) => set({ isGeneratingFlowchart }),
  setAutoSyncFlowchart: (autoSyncFlowchart) => set({ autoSyncFlowchart }),
  setFlowchartError: (flowchartError) => set({ flowchartError }),

  setExplanation: (explanation) => set({ explanation, isExplaining: false }),
  setIsExplaining: (isExplaining) => set({ isExplaining }),

  setPseudocode: (pseudocode) => set({ pseudocode, isGeneratingPseudocode: false }),
  setIsGeneratingPseudocode: (isGeneratingPseudocode) => set({ isGeneratingPseudocode }),

  setErrorDoctorReport: (errorDoctorReport) => set({ errorDoctorReport, isDiagnosingError: false }),
  setIsDiagnosingError: (isDiagnosingError) => set({ isDiagnosingError }),
  setErrorBadgeCount: (errorBadgeCount) => set({ errorBadgeCount }),

  setEmpiricalData: (empiricalData) => set({ empiricalData, isBenchmarking: false }),
  setIsBenchmarking: (isBenchmarking) => set({ isBenchmarking }),

  addChatMessage: (msg) =>
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,
        {
          id: `msg_${Date.now()}_${Math.random()}`,
          timestamp: new Date(),
          ...msg,
        },
      ],
    })),

  setIsGeneratingChat: (isGeneratingChat) => set({ isGeneratingChat }),
  setIsCommandPaletteOpen: (isCommandPaletteOpen) => set({ isCommandPaletteOpen }),

  loadSnippet: (key: string) => {
    if (STARTER_CODE[key]) {
      set({
        code: STARTER_CODE[key],
        language: key === 'c++' || key === 'c' ? key : 'python',
      });
    }
  },
}));
