import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { 
  GenerateCodeSchema, ExplainCodeSchema, ExplainLineSchema, 
  ImproveCodeSchema, ComplexitySchema, ErrorExplainSchema, 
  FlowchartSchema, TestCaseSchema, ChatSchema 
} from '../schemas';
import { 
  generateCode, explainCode, explainLine, improveCode, 
  analyzeComplexity, explainError, generateFlowchart, 
  generateTestCases, chatWithAI 
} from '../services/gemini';

const router = Router();
router.use(verifyToken);

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many AI requests, please try again later.' }
});

router.use(limiter);

router.post('/generate', validateBody(GenerateCodeSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { prompt, language, beginnerMode } = req.body;
    const result = await generateCode(prompt, language, beginnerMode);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/explain', validateBody(ExplainCodeSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, language, beginnerMode } = req.body;
    const result = await explainCode(code, language, beginnerMode);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/explain-line', validateBody(ExplainLineSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, lineNumber, language, beginnerMode } = req.body;
    const result = await explainLine(code, lineNumber, language, beginnerMode);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/improve', validateBody(ImproveCodeSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, language } = req.body;
    const result = await improveCode(code, language);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/complexity', validateBody(ComplexitySchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, language, input } = req.body;
    const result = await analyzeComplexity(code, language, input);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/error', validateBody(ErrorExplainSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, language, stderr, stdout, exitCode, input } = req.body;
    const result = await explainError(code, language, stderr, stdout, exitCode, input);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/flowchart', validateBody(FlowchartSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, language } = req.body;
    const result = await generateFlowchart(code, language);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tests', validateBody(TestCaseSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { code, language } = req.body;
    const result = await generateTestCases(code, language);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/chat', validateBody(ChatSchema), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, context, beginnerMode } = req.body;
    const result = await chatWithAI(message, context, beginnerMode);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
