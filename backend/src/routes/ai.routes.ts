import { Router } from 'express';
import {
  generateFlowchartHandler,
  explainCodeHandler,
  errorDoctorHandler,
  generateCodeHandler,
  explainSelectionHandler,
  empiricalComplexityHandler,
  generatePseudocodeHandler,
} from '../controllers/ai.controller.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = Router();

router.use(verifyFirebaseToken);

router.post('/flowchart', generateFlowchartHandler);
router.post('/explain', explainCodeHandler);
router.post('/error-explain', errorDoctorHandler);
router.post('/generate', generateCodeHandler);
router.post('/explain-selection', explainSelectionHandler);
router.post('/complexity-empirical', empiricalComplexityHandler);
router.post('/pseudocode', generatePseudocodeHandler);

export default router;

