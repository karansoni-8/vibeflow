export const sampleProjects = [
  {
    name: "Binary Search",
    language: "cpp",
    description: "An efficient algorithm for finding an item from a sorted list of items.",
    code: `#include <iostream>
#include <vector>

using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            return mid;
        }

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

int main() {
    vector<int> sortedArray = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int target = 23;

    cout << "Array: ";
    for (int num : sortedArray) {
        cout << num << " ";
    }
    cout << endl;

    int result = binarySearch(sortedArray, target);

    if (result != -1) {
        cout << "Element " << target << " found at index " << result << endl;
    } else {
        cout << "Element " << target << " not found in the array." << endl;
    }

    return 0;
}
`
  },
  {
    name: "Merge Sort",
    language: "cpp",
    description: "A divide and conquer algorithm that divides an array into halves, sorts them, and merges them.",
    code: `#include <iostream>
#include <vector>

using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    vector<int> L(n1), R(n2);

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

void printArray(const vector<int>& arr) {
    for (int num : arr) cout << num << " ";
    cout << endl;
}

int main() {
    vector<int> arr = {12, 11, 13, 5, 6, 7};
    cout << "Given array is \\n";
    printArray(arr);

    mergeSort(arr, 0, arr.size() - 1);

    cout << "\\nSorted array is \\n";
    printArray(arr);
    return 0;
}
`
  },
  {
    name: "Fibonacci Sequence",
    language: "python",
    description: "Recursive and iterative approaches to generating the Fibonacci sequence.",
    code: `def fibonacci_recursive(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    seq = fibonacci_recursive(n - 1)
    seq.append(seq[-1] + seq[-2])
    return seq

def fibonacci_iterative(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    seq = [0, 1]
    for _ in range(2, n):
        seq.append(seq[-1] + seq[-2])
    return seq

if __name__ == "__main__":
    n = 10
    print(f"First {n} numbers of Fibonacci sequence:")
    print("Recursive:", fibonacci_recursive(n))
    print("Iterative:", fibonacci_iterative(n))
`
  },
  {
    name: "Breadth-First Search (BFS)",
    language: "cpp",
    description: "Traversing a graph in a breadthward motion starting from a chosen node.",
    code: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

class Graph {
    int V; // No. of vertices
    vector<vector<int>> adj; // Adjacency list

public:
    Graph(int V);
    void addEdge(int v, int w);
    void BFS(int s);
};

Graph::Graph(int V) {
    this->V = V;
    adj.resize(V);
}

void Graph::addEdge(int v, int w) {
    adj[v].push_back(w);
}

void Graph::BFS(int s) {
    vector<bool> visited(V, false);
    queue<int> q;

    visited[s] = true;
    q.push(s);

    while (!q.empty()) {
        s = q.front();
        cout << s << " ";
        q.pop();

        for (int adjacent : adj[s]) {
            if (!visited[adjacent]) {
                visited[adjacent] = true;
                q.push(adjacent);
            }
        }
    }
}

int main() {
    Graph g(4);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 2);
    g.addEdge(2, 0);
    g.addEdge(2, 3);
    g.addEdge(3, 3);

    cout << "Following is Breadth First Traversal "
         << "(starting from vertex 2) \\n";
    g.BFS(2);
    cout << endl;

    return 0;
}
`
  },
  {
    name: "Depth-First Search (DFS)",
    language: "cpp",
    description: "Traversing a graph in a depthward motion starting from a chosen node.",
    code: `#include <iostream>
#include <vector>

using namespace std;

class Graph {
    int V; // No. of vertices
    vector<vector<int>> adj;

    void DFSUtil(int v, vector<bool>& visited);

public:
    Graph(int V);
    void addEdge(int v, int w);
    void DFS(int v);
};

Graph::Graph(int V) {
    this->V = V;
    adj.resize(V);
}

void Graph::addEdge(int v, int w) {
    adj[v].push_back(w);
}

void Graph::DFSUtil(int v, vector<bool>& visited) {
    visited[v] = true;
    cout << v << " ";

    for (int adjacent : adj[v]) {
        if (!visited[adjacent]) {
            DFSUtil(adjacent, visited);
        }
    }
}

void Graph::DFS(int v) {
    vector<bool> visited(V, false);
    DFSUtil(v, visited);
}

int main() {
    Graph g(4);
    g.addEdge(0, 1);
    g.addEdge(0, 2);
    g.addEdge(1, 2);
    g.addEdge(2, 0);
    g.addEdge(2, 3);
    g.addEdge(3, 3);

    cout << "Following is Depth First Traversal "
         << "(starting from vertex 2) \\n";
    g.DFS(2);
    cout << endl;

    return 0;
}
`
  },
  {
    name: "0/1 Knapsack",
    language: "python",
    description: "Dynamic programming solution to the classic 0/1 knapsack problem.",
    code: `def knapSack(W, wt, val, n):
    # K[i][w] will store the max value that can be attained with capacity w
    # using items up to index i-1.
    K = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

    for i in range(n + 1):
        for w in range(W + 1):
            if i == 0 or w == 0:
                K[i][w] = 0
            elif wt[i-1] <= w:
                K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]],  K[i-1][w])
            else:
                K[i][w] = K[i-1][w]

    return K[n][W]

if __name__ == "__main__":
    val = [60, 100, 120]
    wt = [10, 20, 30]
    W = 50
    n = len(val)
    print(f"Maximum value in Knapsack of capacity {W}:")
    print(knapSack(W, wt, val, n))
`
  },
  {
    name: "N-Queens",
    language: "cpp",
    description: "Backtracking algorithm to place N chess queens on an N×N chessboard.",
    code: `#include <iostream>
#include <vector>

using namespace std;

void printBoard(const vector<vector<int>>& board) {
    int N = board.size();
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            cout << (board[i][j] ? "Q " : ". ");
        }
        cout << "\\n";
    }
    cout << "\\n";
}

bool isSafe(const vector<vector<int>>& board, int row, int col) {
    int i, j;
    int N = board.size();

    // Check this row on left side
    for (i = 0; i < col; i++)
        if (board[row][i]) return false;

    // Check upper diagonal on left side
    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j]) return false;

    // Check lower diagonal on left side
    for (i = row, j = col; j >= 0 && i < N; i++, j--)
        if (board[i][j]) return false;

    return true;
}

bool solveNQUtil(vector<vector<int>>& board, int col) {
    int N = board.size();
    if (col >= N) {
        printBoard(board);
        return true; 
    }

    bool res = false;
    for (int i = 0; i < N; i++) {
        if (isSafe(board, i, col)) {
            board[i][col] = 1;
            res = solveNQUtil(board, col + 1) || res;
            board[i][col] = 0; // backtrack
        }
    }
    return res;
}

void solveNQ(int N) {
    vector<vector<int>> board(N, vector<int>(N, 0));
    if (!solveNQUtil(board, 0)) {
        cout << "Solution does not exist";
    }
}

int main() {
    int N = 4;
    cout << "Solutions for " << N << "-Queens problem:\\n\\n";
    solveNQ(N);
    return 0;
}
`
  },
  {
    name: "Job Sequencing",
    language: "cpp",
    description: "Greedy algorithm for job sequencing with deadlines to maximize profit.",
    code: `#include <iostream>
#include <algorithm>
#include <vector>

using namespace std;

struct Job {
    char id;      // Job Id
    int dead;     // Deadline of job
    int profit;   // Profit if job is over before or on deadline
};

bool comparison(Job a, Job b) {
    return (a.profit > b.profit);
}

void printJobScheduling(vector<Job>& arr, int n) {
    sort(arr.begin(), arr.end(), comparison);

    vector<int> result(n); // To store result (Sequence of jobs)
    vector<bool> slot(n, false); // To keep track of free time slots

    int totalProfit = 0;

    for (int i = 0; i < n; i++) {
        for (int j = min(n, arr[i].dead) - 1; j >= 0; j--) {
            if (slot[j] == false) {
                result[j] = i;
                slot[j] = true;
                totalProfit += arr[i].profit;
                break;
            }
        }
    }

    cout << "Job Sequence to maximize profit: ";
    for (int i = 0; i < n; i++) {
        if (slot[i]) {
            cout << arr[result[i]].id << " ";
        }
    }
    cout << "\\nTotal Profit: " << totalProfit << endl;
}

int main() {
    vector<Job> arr = {
        {'a', 2, 100}, {'b', 1, 19}, {'c', 2, 27},
        {'d', 1, 25}, {'e', 3, 15}
    };
    
    int n = arr.size();
    cout << "Following is maximum profit sequence of jobs \\n";
    printJobScheduling(arr, n);
    
    return 0;
}
`
  }
];
