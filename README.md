<div align="center">

<img src="https://img.shields.io/badge/VibeFlow-AI%20IDE-7c3aed?style=for-the-badge&logo=sparkles&logoColor=white" />
<img src="https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Gemini-AI-4285f4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

# VibeFlow — AI-Powered IDE for Beginner Coders

**A browser-based, AI-native Integrated Development Environment designed for students learning Data Structures & Algorithms (DSA/DAA), beginners, and "vibe coders" who iterate with AI.**

[🚀 Quick Start](#-quick-start) · [✨ Features](#-features) · [🏗 Architecture](#-architecture) · [🔧 Tech Stack](#-tech-stack) · [📖 Usage](#-usage)

</div>

---

## 🎯 What is VibeFlow?

Existing AI code editors (Cursor, GitHub Copilot) are built for professionals. Existing beginner tools run code but explain nothing. **VibeFlow sits in the gap** — it runs real code, but *teaches while doing it*.

When a student writes their first backtracking solution, VibeFlow doesn't just execute it — it:
- **Visualizes** the control flow as a live Mermaid flowchart
- **Explains** the algorithm in plain English with Big-O complexity cards
- **Converts** it to academic pseudocode (for reports and presentations)
- **Diagnoses** every error with a root cause + 1-click fix
- **Benchmarks** it empirically across input sizes to prove why it's O(2^N)

---

## ✨ Features

### 1. 🗺 Real-Time Control Flowchart Generation
- Standards-compliant ISO/ANSI diagrams (Mermaid.js)
- Stadium pills for Start/End, decision rhombuses, I/O parallelograms
- Loop back-edges visually showing iteration cycles
- Zoom, pan, reset, and SVG export

### 2. 📖 Algorithmic Explainer & Big-O Analysis
- Plain-English summary of what the algorithm does
- **Best / Average / Worst Case** Big-O cards with justifications
- Line-by-line interactive accordion breakdown
- Optimization suggestions with "Ask AI to implement" button

### 3. 📄 Pseudocode Generator *(NEW)*
- Converts code to language-agnostic academic pseudocode
- Uses standard ALGORITHM / INPUT / OUTPUT / RETURN conventions
- Perfect for CS project reports and presentations
- Copy-to-clipboard button

### 4. 🩺 Error Doctor & 1-Click Fix
- Translates raw compiler/runtime errors into plain English
- "Why it happened" + "How to fix it" explanation
- 1-click "Apply Fix" with instant undo buffer

### 5. 🖥 Dual-Console Development Environment
- **Shell Terminal**: Real OS pseudoterminal (`node-pty` + `xterm.js`) supporting `pip install`, `g++`, any shell command
- **Program Output Console**: Programiz-style stdout/stderr viewer with millisecond execution timing

### 6. 📊 Empirical Complexity Benchmarking
- Automated input sweeps (N = 4, 6, 8, 10...)
- Interactive Recharts plot: empirical wall-clock time vs. theoretical curves
- AI narrative explaining pruning effects, greedy feasibility, cache locality

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- Python 3 (for Python code execution)
- MinGW/GCC (for C/C++ execution on Windows, optional)
- A free Gemini API key ([Get one here](https://aistudio.google.com))

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/vibeflow.git
cd vibeflow
```

### 2. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 3. Configure Environment Variables

**Backend** — Create `backend/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/vibeflow
FIREBASE_SERVICE_ACCOUNT=./serviceAccountKey.json
```

**Frontend** — Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

> 💡 **No Firebase/MongoDB?** No problem! VibeFlow automatically activates **Guest Mode** and **in-memory storage** — you can use the full IDE immediately without any cloud configuration.

### 4. Run the Project
```bash
npm run dev
```

This starts both servers concurrently:
- 🌐 **Frontend**: http://localhost:5173
- ⚙️ **Backend**: http://localhost:5000

### 5. Open in Browser
Navigate to **http://localhost:5173** and click **"Continue as Guest"** to start coding!

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│              CLIENT (React 18 + Vite + TypeScript)       │
│  Monaco Editor │ Mermaid Flowchart │ xterm.js Terminal   │
│  Recharts Benchmark │ Big-O Cards │ Error Doctor UI      │
└────────────────────────┬────────────────────────────────-┘
                         │ HTTP REST + WebSocket (Socket.io)
┌────────────────────────▼─────────────────────────────────┐
│              BACKEND (Node.js 24 + Express)               │
│  ┌─────────────────────┐  ┌──────────────────────────┐   │
│  │  Code Execution     │  │  AI Cognitive Engine     │   │
│  │  Piston API +       │  │  Gemini 3.7/3.6 Flash   │   │
│  │  MinGW g++ / Python │  │  + Local AST Fallback   │   │
│  └─────────────────────┘  └──────────────────────────┘   │
│  ┌─────────────────────┐  ┌──────────────────────────┐   │
│  │  node-pty PTY Shell │  │  Firebase Admin + Mongo  │   │
│  └─────────────────────┘  └──────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

---

## 🔧 Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3.1 | Core UI framework |
| TypeScript | 5.6.2 | Type safety |
| Vite | 6.0.1 | Build tool & HMR |
| Monaco Editor | 0.45.0 | VS Code engine |
| Mermaid.js | 10.9.1 | Flowchart SVG generation |
| xterm.js | 5.5.0 | Terminal emulator |
| Recharts | 2.13.3 | Complexity benchmark charts |
| TailwindCSS | 3.4.17 | Styling |
| Framer Motion | 11.15.0 | Animations |
| Zustand | 4.5.5 | State management |
| react-zoom-pan-pinch | 3.6.1 | Flowchart viewport |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 24.x | Runtime |
| Express | 4.21.2 | API framework |
| Socket.io | 4.8.1 | Real-time terminal streaming |
| node-pty | 1.0.2 | OS pseudoterminal |
| @google/generative-ai | Latest | Gemini AI SDK |
| Mongoose | 8.x | MongoDB ODM |
| firebase-admin | 12.x | Auth token verification |

### AI & Intelligence
| Component | Details |
|-----------|---------|
| Primary Model | Google Gemini 2.0 Flash |
| Fallback Model | Google Gemini 1.5 Flash |
| Structured Output | `responseMimeType: "application/json"` |
| Offline Fallback | Built-in AST + rule-based synthesizer |

---

## 📖 Usage

### Code Execution
1. Select a language from the dropdown (Python, C++, JavaScript, C, Java)
2. Write or paste your code in the Monaco editor
3. Click **▶ Run** or press `Ctrl+Enter`
4. See output in the **Program Output Console** with execution time

### Generate Flowchart
1. Write code in the editor
2. Click the **Flowchart** tab in the right panel
3. Click **"Generate Flowchart"** (or enable **Auto-sync**)
4. Zoom, pan, and export as SVG

### Generate Pseudocode
1. Write code in the editor
2. Click the **Pseudocode** tab
3. Click **"Generate Pseudocode"**
4. Copy for use in reports or presentations

### Explain Algorithm
1. Write code in the editor
2. Click the **Explain** tab
3. Click **"Explain Algorithm"**
4. See summary, Best/Average/Worst Big-O cards, and line-by-line breakdown

### Error Doctor
1. Run code that has an error
2. The **Error Doctor** tab will automatically highlight
3. Click **"Diagnose Error"** for plain-English diagnosis
4. Click **"Apply Fix"** to automatically fix the code

### Empirical Complexity
1. Write an algorithm in the editor
2. Click **Empirical Scaling** tab
3. Click **"Run Benchmark"**
4. See real vs. theoretical complexity curves on the chart

---

## 🔑 Getting Free API Keys

### Gemini API Key (Required for AI features)
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click **"Get API Key"**
3. Create a new key and copy it
4. Add to `backend/.env` as `GEMINI_API_KEY=...`

> **Free tier**: 1500 requests/day on Gemini 2.0 Flash

### Firebase (Optional — for Google/GitHub login)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Google provider
4. Get web config → add to `frontend/.env`
5. Download service account key → save as `backend/serviceAccountKey.json`

### MongoDB Atlas (Optional — for persistent storage)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Get connection string → add to `backend/.env` as `MONGODB_URI=...`

---

## 📁 Project Structure

```
vibeflow/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/          # Monaco code editor
│   │   │   ├── layout/          # ResizableLayout, Navbar, CommandPalette
│   │   │   └── panels/          # FlowchartPanel, ExplainPanel, PseudocodePanel,
│   │   │                        # ErrorPanel, ComplexityChartPanel, ChatPanel, etc.
│   │   ├── hooks/               # useDebouncedFlowchart
│   │   ├── lib/                 # api.ts, firebase.ts, mermaidRenderer.ts
│   │   ├── pages/               # IDEPage, LandingPage, LoginPage
│   │   └── store/               # Zustand ideStore
│   └── package.json
│
├── backend/                     # Node.js + Express API
│   ├── src/
│   │   ├── controllers/         # ai.controller.ts, execute.controller.ts
│   │   ├── middleware/          # verifyFirebaseToken.ts
│   │   ├── models/              # User.ts, Project.ts, ExecutionHistory.ts
│   │   ├── prompts/             # flowchart, explain, pseudocode, errorDoctor prompts
│   │   ├── routes/              # ai.routes.ts, execute.routes.ts, projects.routes.ts
│   │   ├── services/            # gemini.service.ts, piston.service.ts, terminal.service.ts
│   │   ├── socket/              # Socket.io terminal handler
│   │   └── server.ts
│   └── package.json
│
├── package.json                 # Root orchestrator (concurrently)
└── README.md
```

---

## 🎓 Research Foundation

VibeFlow's design is grounded in established educational theories:

| Theory | Application |
|--------|-------------|
| **Dual-Coding Theory** (Paivio, 1971) | Simultaneous code + visual flowchart + text explanation |
| **Cognitive Load Theory** (Sweller, 1998) | Externalizes control flow and complexity to reduce mental load |
| **Scaffolded Learning** (Vygotsky) | Error Doctor provides just-in-time guidance rather than raw errors |
| **Constructionist Learning** (Papert, 1991) | Students learn by editing code and instantly seeing diagram changes |

---

## 🛣 Roadmap

- [ ] Multi-file project support
- [ ] Live collaborative editing (WebRTC + Yjs)
- [ ] Vector DB (ChromaDB) for cross-file RAG context
- [ ] Adaptive difficulty engine (personalized algorithm challenges)
- [ ] Electron/Tauri offline desktop packaging
- [ ] WCAG 2.1 AA accessibility compliance

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built with ❤️ for CS students who learn by doing</strong><br/>
  <em>Final-Year Computer Science Capstone Project</em>
</div>
