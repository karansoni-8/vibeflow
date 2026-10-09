import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validate';
import { ExecuteCodeSchema } from '../schemas';
import { executeCode } from '../services/executor';
import { createExecution } from '../database';

const router = Router();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many execution requests, please try again later.' }
});

router.post('/', limiter, validateBody(ExecuteCodeSchema), async (req: Request, res: Response) => {
  try {
    const { language, code, stdin, fileId } = req.body;
    const result = await executeCode(language, code, stdin);
    
    // Save execution to DB if fileId is provided
    if (fileId) {
      createExecution(fileId, stdin || '', result.stdout, result.stderr, result.exitCode, result.executionTimeMs);
    }
    
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Execution failed' });
  }
});

export default router;
