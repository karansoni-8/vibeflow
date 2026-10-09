import { Router } from 'express';
import { executeCode } from '../services/execution.js';
const router = Router();
router.post('/', async (req, res) => {
    const { language, code, input } = req.body;
    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
    }
    const validLangs = ['cpp', 'python', 'javascript', 'java'];
    if (!validLangs.includes(language)) {
        return res.status(400).json({ error: `Unsupported language: ${language}` });
    }
    try {
        const result = await executeCode(language, code, input || '');
        res.json(result);
    }
    catch (err) {
        res.status(500).json({
            error: err.message || 'Execution failed',
            status: 'error',
        });
    }
});
export default router;
