import { Project, User, ExecutionResult, FileItem } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

export const demoUser: User = {
  id: 'usr_demo_vibeflow',
  name: 'Alex Rivera',
  email: 'alex.rivera@vibeflow.dev',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  createdAt: new Date().toISOString(),
};

export const sampleProjects: Project[] = [
  {
    id: 'proj_binary_search',
    userId: demoUser.id,
    name: 'Binary Search (C++)',
    description: 'Classic divide-and-conquer search with O(log n) theoretical complexity and observed iterations.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_bs_main',
    files: [
      {
        id: 'file_bs_main',
        projectId: 'proj_binary_search',
        name: 'main.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <vector>

using namespace std;

// Returns index of target if found, otherwise -1.
// Also tracks observed iterations for input-sensitive complexity analysis.
int binarySearch(const vector<int>& arr, int target, int& observedIterations) {
    int low = 0;
    int high = arr.size() - 1;
    observedIterations = 0;

    while (low <= high) {
        observedIterations++;
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            low = mid + 1; // Search right half
        } else {
            high = mid - 1; // Search left half
        }
    }
    return -1; // Target not found
}

int main() {
    int n, target;
    cout << "Enter array size: " << endl;
    if (!(cin >> n)) return 0;

    vector<int> arr(n);
    cout << "Enter " << n << " sorted integers:" << endl;
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    cout << "Enter target value to search: " << endl;
    cin >> target;

    int iterations = 0;
    int index = binarySearch(arr, target, iterations);

    if (index != -1) {
        cout << "Result: Found " << target << " at index " << index << endl;
    } else {
        cout << "Result: Target " << target << " not found" << endl;
    }
    cout << "Observed loop iterations: " << iterations << endl;
    return 0;
}
`,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'file_bs_readme',
        projectId: 'proj_binary_search',
        name: 'README.md',
        language: 'javascript',
        content: `# Binary Search in C++
## Complexity
- Best Case: O(1) when target is at exact midpoint.
- Average Case: O(log n).
- Worst Case: O(log n) when target is absent or at extremities.
- Space Complexity: O(1) iterative.
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_merge_sort',
    userId: demoUser.id,
    name: 'Merge Sort (C++)',
    description: 'Efficient divide-and-conquer sorting algorithm with stable O(n log n) runtime.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_ms_main',
    files: [
      {
        id: 'file_ms_main',
        projectId: 'proj_merge_sort',
        name: 'main.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <vector>

using namespace std;

void merge(vector<int>& arr, int left, int mid, int right, long long& comparisons) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<int> L(n1);
    vector<int> R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        comparisons++;
        if (L[i] <= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}

void mergeSort(vector<int>& arr, int left, int right, long long& comparisons) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid, comparisons);
    mergeSort(arr, mid + 1, right, comparisons);
    merge(arr, left, mid, right, comparisons);
}

int main() {
    int n;
    cout << "Enter number of elements:" << endl;
    if (!(cin >> n)) return 0;

    vector<int> arr(n);
    cout << "Enter " << n << " integers:" << endl;
    for (int i = 0; i < n; i++) cin >> arr[i];

    long long comparisons = 0;
    mergeSort(arr, 0, n - 1, comparisons);

    cout << "Sorted Array: ";
    for (int x : arr) cout << x << " ";
    cout << endl;
    cout << "Total Merge Comparisons: " << comparisons << endl;
    return 0;
}
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_fibonacci',
    userId: demoUser.id,
    name: 'Fibonacci Memoization (Python)',
    description: 'Dynamic Programming reducing naive exponential O(2^n) to linear O(n).',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_fib_main',
    files: [
      {
        id: 'file_fib_main',
        projectId: 'proj_fibonacci',
        name: 'fib.py',
        language: 'python',
        content: `import sys

memo = {}
call_count = 0

def fib(n):
    global call_count
    call_count += 1
    
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
        
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

def main():
    print("Enter n to compute Fibonacci(n):")
    try:
        line = sys.stdin.readline().strip()
        if not line:
            n = 10
        else:
            n = int(line)
    except Exception:
        n = 10

    result = fib(n)
    print(f"Fibonacci({n}) = {result}")
    print(f"Total function calls with memoization: {call_count}")
    print(f"Naive calls would have been roughly: ~{2 ** min(n, 30)}")

if __name__ == '__main__':
    main()
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_bfs',
    userId: demoUser.id,
    name: 'Breadth-First Search (C++)',
    description: 'Graph traversal algorithm using queue exploring layer by layer with O(V + E) complexity.',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_bfs_main',
    files: [
      {
        id: 'file_bfs_main',
        projectId: 'proj_bfs',
        name: 'bfs.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

void bfs(int start, const vector<vector<int>>& adj, int V) {
    vector<bool> visited(V, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    cout << "BFS Traversal Order: ";
    int visitedCount = 0;

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        cout << u << " ";
        visitedCount++;

        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    cout << endl;
    cout << "Total Nodes Visited: " << visitedCount << " out of " << V << endl;
}

int main() {
    int V = 6;
    vector<vector<int>> adj(V);
    // Add edges
    adj[0] = {1, 2};
    adj[1] = {0, 3, 4};
    adj[2] = {0, 4};
    adj[3] = {1, 5};
    adj[4] = {1, 2, 5};
    adj[5] = {3, 4};

    cout << "Running BFS on a graph with " << V << " vertices..." << endl;
    bfs(0, adj, V);
    return 0;
}
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_dfs',
    userId: demoUser.id,
    name: 'Depth-First Search (C++)',
    description: 'Recursive graph traversal exploring deeply along branches with O(V + E) time and O(V) stack space.',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_dfs_main',
    files: [
      {
        id: 'file_dfs_main',
        projectId: 'proj_dfs',
        name: 'dfs.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <vector>

using namespace std;

void dfsUtil(int u, const vector<vector<int>>& adj, vector<bool>& visited, int& steps) {
    visited[u] = true;
    steps++;
    cout << u << " ";

    for (int v : adj[u]) {
        if (!visited[v]) {
            dfsUtil(v, adj, visited, steps);
        }
    }
}

int main() {
    int V = 6;
    vector<vector<int>> adj(V);
    adj[0] = {1, 2};
    adj[1] = {0, 3};
    adj[2] = {0, 4};
    adj[3] = {1, 5};
    adj[4] = {2};
    adj[5] = {3};

    vector<bool> visited(V, false);
    cout << "DFS Traversal starting from node 0: ";
    int steps = 0;
    dfsUtil(0, adj, visited, steps);
    cout << endl;
    cout << "Total recursive steps: " << steps << endl;
    return 0;
}
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_knapsack',
    userId: demoUser.id,
    name: '0/1 Knapsack Problem (Python)',
    description: 'Dynamic Programming solution for classic resource allocation with O(n * W) pseudo-polynomial complexity.',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_ks_main',
    files: [
      {
        id: 'file_ks_main',
        projectId: 'proj_knapsack',
        name: 'knapsack.py',
        language: 'python',
        content: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    table_lookups = 0

    for i in range(1, n + 1):
        for w in range(1, W + 1):
            table_lookups += 1
            if wt[i - 1] <= w:
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]

    return dp[n][W], table_lookups

def main():
    values = [60, 100, 120]
    weights = [10, 20, 30]
    capacity = 50
    n = len(values)

    max_val, lookups = knapsack(capacity, weights, values, n)
    print(f"Items: {n}")
    print(f"Knapsack Capacity: {capacity}")
    print(f"Maximum Value Achieved: {max_val}")
    print(f"Total DP table cell calculations: {lookups} (n * W = {n * capacity})")

if __name__ == '__main__':
    main()
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_nqueens',
    userId: demoUser.id,
    name: 'N-Queens Backtracking (C++)',
    description: 'Demonstrates input-sensitive pruning where observed state explorations are far below theoretical O(N!).',
    createdAt: new Date(Date.now() - 3600000 * 140).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_nq_main',
    files: [
      {
        id: 'file_nq_main',
        projectId: 'proj_nqueens',
        name: 'nqueens.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <vector>

using namespace std;

bool isSafe(int row, int col, const vector<string>& board, int n) {
    // Check upper column
    for (int i = 0; i < row; i++) {
        if (board[i][col] == 'Q') return false;
    }
    // Check upper-left diagonal
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }
    // Check upper-right diagonal
    for (int i = row, j = col; i >= 0 && j < n; i--, j++) {
        if (board[i][j] == 'Q') return false;
    }
    return true;
}

void solve(int row, int n, vector<string>& board, int& solutions, long long& exploredStates, long long& prunedStates) {
    exploredStates++;
    if (row == n) {
        solutions++;
        return;
    }

    for (int col = 0; col < n; col++) {
        if (isSafe(row, col, board, n)) {
            board[row][col] = 'Q';
            solve(row + 1, n, board, solutions, exploredStates, prunedStates);
            board[row][col] = '.'; // Backtrack
        } else {
            prunedStates++; // Branch eliminated early!
        }
    }
}

int main() {
    int n = 4;
    cout << "Enter board dimension N (default 4):" << endl;
    if (cin >> n) {
        if (n <= 0 || n > 12) n = 4;
    }

    vector<string> board(n, string(n, '.'));
    int solutions = 0;
    long long exploredStates = 0;
    long long prunedStates = 0;

    solve(0, n, board, solutions, exploredStates, prunedStates);

    cout << "N = " << n << endl;
    cout << "Total Valid Solutions Found: " << solutions << endl;
    cout << "Observed Explored States: " << exploredStates << endl;
    cout << "Observed Pruned Branches: " << prunedStates << endl;
    cout << "Theoretical Worst Case (N!): ~" << (n <= 10 ? 1 : 0) << endl;
    return 0;
}
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  },
  {
    id: 'proj_job_sequencing',
    userId: demoUser.id,
    name: 'Job Sequencing with Deadlines (C++)',
    description: 'Greedy algorithmic approach sorting by profit and assigning available time slots.',
    createdAt: new Date(Date.now() - 3600000 * 160).toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: 'file_job_main',
    files: [
      {
        id: 'file_job_main',
        projectId: 'proj_job_sequencing',
        name: 'job_sequencing.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

struct Job {
    char id;
    int deadline;
    int profit;
};

bool compare(Job a, Job b) {
    return a.profit > b.profit;
}

int main() {
    vector<Job> jobs = {
        {'a', 2, 100},
        {'b', 1, 19},
        {'c', 2, 27},
        {'d', 1, 25},
        {'e', 3, 15}
    };

    // 1. Sort jobs in decreasing order of profit (O(n log n))
    sort(jobs.begin(), jobs.end(), compare);

    int maxDeadline = 0;
    for (const auto& j : jobs) {
        maxDeadline = max(maxDeadline, j.deadline);
    }

    vector<char> slot(maxDeadline + 1, '-');
    int totalProfit = 0;
    int jobCount = 0;

    // 2. Greedy slot assignment
    for (const auto& j : jobs) {
        for (int r = min(maxDeadline, j.deadline); r > 0; r--) {
            if (slot[r] == '-') {
                slot[r] = j.id;
                totalProfit += j.profit;
                jobCount++;
                break;
            }
        }
    }

    cout << "Selected Job Sequence: ";
    for (int i = 1; i <= maxDeadline; i++) {
        if (slot[i] != '-') cout << slot[i] << " ";
    }
    cout << endl;
    cout << "Total Scheduled Jobs: " << jobCount << endl;
    cout << "Maximum Profit: $" << totalProfit << endl;
    return 0;
}
`,
        updatedAt: new Date().toISOString(),
      }
    ],
  }
];

class StorageService {
  private users: Map<string, User> = new Map();
  private projects: Map<string, Project> = new Map();

  constructor() {
    this.users.set(demoUser.id, demoUser);
    for (const proj of sampleProjects) {
      this.projects.set(proj.id, proj);
    }
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  saveUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  getProjects(userId: string): Project[] {
    return Array.from(this.projects.values()).filter((p) => p.userId === userId);
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  createProject(userId: string, name: string, description?: string): Project {
    const id = `proj_${uuidv4().slice(0, 8)}`;
    const fileId = `file_${uuidv4().slice(0, 8)}`;
    const newFile: FileItem = {
      id: fileId,
      projectId: id,
      name: 'main.cpp',
      language: 'cpp',
      content: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Welcome to VibeFlow!" << endl;\n    return 0;\n}\n`,
      updatedAt: new Date().toISOString(),
    };

    const project: Project = {
      id,
      userId,
      name,
      description: description || 'Created with VibeFlow',
      files: [newFile],
      activeFileId: fileId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.projects.set(id, project);
    return project;
  }

  updateProject(id: string, updates: Partial<Project>): Project | undefined {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updated = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  saveFile(projectId: string, fileId: string, content: string): FileItem | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    const file = project.files.find((f) => f.id === fileId);
    if (!file) return undefined;

    file.content = content;
    file.updatedAt = new Date().toISOString();
    project.updatedAt = new Date().toISOString();
    return file;
  }

  createFile(projectId: string, name: string, language?: 'cpp' | 'python' | 'java' | 'javascript'): FileItem | undefined {
    const project = this.projects.get(projectId);
    if (!project) return undefined;

    let lang = language;
    if (!lang) {
      if (name.endsWith('.cpp') || name.endsWith('.h')) lang = 'cpp';
      else if (name.endsWith('.py')) lang = 'python';
      else if (name.endsWith('.java')) lang = 'java';
      else lang = 'javascript';
    }

    const newFile: FileItem = {
      id: `file_${uuidv4().slice(0, 8)}`,
      projectId,
      name,
      language: lang,
      content: lang === 'cpp' ? '// New C++ file\n' : lang === 'python' ? '# New Python file\n' : '// New file\n',
      updatedAt: new Date().toISOString(),
    };

    project.files.push(newFile);
    project.activeFileId = newFile.id;
    project.updatedAt = new Date().toISOString();
    return newFile;
  }

  deleteFile(projectId: string, fileId: string): boolean {
    const project = this.projects.get(projectId);
    if (!project || project.files.length <= 1) return false; // keep at least one file

    const index = project.files.findIndex((f) => f.id === fileId);
    if (index === -1) return false;

    project.files.splice(index, 1);
    if (project.activeFileId === fileId) {
      project.activeFileId = project.files[0].id;
    }
    project.updatedAt = new Date().toISOString();
    return true;
  }
}

export const storage = new StorageService();
