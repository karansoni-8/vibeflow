import { Router } from 'express';
import { getRuntimesHandler, executeCodeHandler } from '../controllers/execute.controller.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = Router();

router.get('/runtimes', getRuntimesHandler);
router.post('/', verifyFirebaseToken, executeCodeHandler);

export default router;
