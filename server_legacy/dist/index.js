import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import projectsRouter from './routes/projects.js';
import executeRouter from './routes/execute.js';
import aiRouter from './routes/ai.js';
import terminalRouter from './routes/terminal.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
app.use(cors());
app.use(express.json({ limit: '10mb' }));
// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        name: 'VibeFlow API Engine',
        version: '1.0.0',
        geminiConfigured: Boolean(process.env.GEMINI_API_KEY?.trim()),
        timestamp: new Date().toISOString(),
    });
});
// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/execute', executeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/terminal', terminalRouter);
app.listen(PORT, () => {
    console.log(`[VibeFlow Engine] Server listening on http://localhost:${PORT}`);
    console.log(`[VibeFlow Engine] Gemini API status: ${process.env.GEMINI_API_KEY ? 'Configured' : 'Offline/Fallback mode'}`);
});
