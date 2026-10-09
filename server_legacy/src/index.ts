import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load dotenv from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import database to initialize it
import { initDatabase } from './database/index.js';

// Import route handlers
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import executionRouter from './routes/execution.js';
import aiRouter from './routes/ai.js';

const app = express();
const port = process.env.PORT || 3001;

// --------------- Middleware ---------------
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// --------------- Health Check ---------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --------------- Routes ---------------
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/execute', executionRouter);
app.use('/api/ai', aiRouter);

// --------------- Global Error Handler ---------------
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err.message || err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// --------------- Initialize & Start ---------------
try {
  initDatabase();
  console.log('✓ Database initialized');
} catch (err) {
  console.error('✗ Database initialization failed:', err);
}

app.listen(port, () => {
  console.log(`\n  ⚡ VibeFlow server running at http://localhost:${port}`);
  console.log(`  📦 Dev mode: ${process.env.VIBE_DEV_MODE === 'true' ? 'ON' : 'OFF'}`);
  console.log(`  🤖 Gemini API: ${process.env.VIBE_GEMINI_KEY ? 'Configured' : 'Not configured'}\n`);
});
