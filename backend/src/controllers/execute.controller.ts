import { Response } from 'express';
import { AuthRequest } from '../middleware/verifyFirebaseToken.js';
import { executeCode, getCachedRuntimes } from '../services/piston.service.js';
import { ExecutionHistory } from '../models/ExecutionHistory.model.js';
import { isDbConnected } from '../config/db.js';

// In-memory execution history store when Mongo is offline
const inMemoryHistory: any[] = [];

export async function getRuntimesHandler(req: AuthRequest, res: Response): Promise<void> {
  const runtimes = getCachedRuntimes();
  res.json({ runtimes });
}

export async function executeCodeHandler(req: AuthRequest, res: Response): Promise<void> {
  const { language, version, code, stdin, projectId } = req.body;

  if (!language || typeof code !== 'string') {
    res.status(400).json({ error: 'Language and code are required.' });
    return;
  }

  try {
    const result = await executeCode(language, code, version, stdin || '');

    // Record execution history
    const historyItem = {
      userId: req.user?.uid,
      projectId,
      language,
      code,
      stdin: stdin || '',
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      createdAt: new Date(),
    };

    if (isDbConnected()) {
      ExecutionHistory.create(historyItem).catch((e) =>
        console.warn('Could not save execution history to DB:', e.message)
      );
    } else {
      inMemoryHistory.unshift(historyItem);
      if (inMemoryHistory.length > 50) inMemoryHistory.pop();
    }

    res.json(result);
  } catch (err: any) {
    console.error('Execute Controller Error:', err);
    res.status(500).json({
      stdout: '',
      stderr: `Execution failed: ${err.message}`,
      exitCode: 1,
      durationMs: 0,
    });
  }
}
