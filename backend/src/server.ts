import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { fetchRuntimes } from './services/piston.service.js';
import { setupTerminalSocket } from './socket/terminalSocket.js';

import authRoutes from './routes/auth.routes.js';
import executeRoutes from './routes/execute.routes.js';
import aiRoutes from './routes/ai.routes.js';
import projectsRoutes from './routes/projects.routes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: [config.clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [config.clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/projects', projectsRoutes);

// Error handling middleware
app.use(errorHandler);

// Terminal Socket handler
setupTerminalSocket(io);

// Server startup
async function startServer() {
  await connectDB();
  await fetchRuntimes();

  server.listen(config.port, () => {
    console.log(`🚀 VibeFlow Backend listening on http://localhost:${config.port}`);
    console.log(`📡 Socket.io connected and ready for terminal streams`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
