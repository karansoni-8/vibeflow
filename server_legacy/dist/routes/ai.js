import { Router } from 'express';
import { generateCode, explainCode, explainLine, improveCode, analyzeComplexity, explainError, generateTestCases, generateFlowchart, } from '../services/gemini.js';
const router = Router();
// AI Code Generation
router.post('/generate', async (req, res) => {
    const { prompt, language } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    const code = await generateCode(prompt, language || 'cpp');
    res.json({ code });
});
// AI Code Explanation
router.post('/explain', async (req, res) => {
    const { code, language, beginnerMode } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    const explanation = await explainCode(code, language || 'cpp', Boolean(beginnerMode));
    res.json({ explanation });
});
// Line by line explanation
router.post('/explain-line', async (req, res) => {
    const { code, lineNumber, lineContent, language, beginnerMode } = req.body;
    if (!code || lineNumber === undefined) {
        return res.status(400).json({ error: 'Code and lineNumber are required' });
    }
    const explanation = await explainLine(code, Number(lineNumber), lineContent || '', language || 'cpp', Boolean(beginnerMode));
    res.json({ explanation });
});
// Code Improvement
router.post('/improve', async (req, res) => {
    const { code, language } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    const improvement = await improveCode(code, language || 'cpp');
    res.json({ improvement });
});
// Complexity Analysis
router.post('/complexity', async (req, res) => {
    const { code, language, observedData } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    const analysis = await analyzeComplexity(code, language || 'cpp', observedData);
    res.json({ analysis });
});
// Error Explanation & 1-Click Fix
router.post('/explain-error', async (req, res) => {
    const { code, language, stderr, stdout, exitCode } = req.body;
    if (!stderr && !code) {
        return res.status(400).json({ error: 'Error context is required' });
    }
    const explanation = await explainError(code || '', language || 'cpp', stderr || '', stdout || '', exitCode || 1);
    res.json({ explanation });
});
// Generate Test Cases
router.post('/tests', async (req, res) => {
    const { code, language } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    const tests = await generateTestCases(code, language || 'cpp');
    res.json({ tests });
});
// Generate Flowchart JSON Graph
router.post('/flowchart', async (req, res) => {
    const { code, language } = req.body;
    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }
    const graph = await generateFlowchart(code, language || 'cpp');
    res.json({ graph });
});
export default router;
