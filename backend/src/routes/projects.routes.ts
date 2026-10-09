import { Router } from 'express';
import {
  listProjectsHandler,
  createProjectHandler,
  getProjectHandler,
  updateProjectHandler,
  deleteProjectHandler,
} from '../controllers/projects.controller.js';
import { verifyFirebaseToken } from '../middleware/verifyFirebaseToken.js';

const router = Router();

router.use(verifyFirebaseToken);

router.get('/', listProjectsHandler);
router.post('/', createProjectHandler);
router.get('/:id', getProjectHandler);
router.put('/:id', updateProjectHandler);
router.delete('/:id', deleteProjectHandler);

export default router;
