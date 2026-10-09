import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { CreateProjectSchema, CreateFileSchema, UpdateFileSchema } from '../schemas';
import { 
  getProjectsByUserId, createProject, getProjectById, updateProject, deleteProject,
  createFile, getFileById, updateFileContent, deleteFile, getUserByFirebaseUid
} from '../database';

const router = Router();
router.use(verifyToken);

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const user = getUserByFirebaseUid(req.user!.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const projects = getProjectsByUserId(user.id);
  res.json(projects);
});

router.post('/', validateBody(CreateProjectSchema), async (req: AuthenticatedRequest, res: Response) => {
  const user = getUserByFirebaseUid(req.user!.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, language } = req.body;
  const project = createProject(user.id, name, language);
  res.status(201).json(project);
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const project = getProjectById(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const { name, language } = req.body;
  const project = updateProject(req.params.id, { name, language });
  res.json(project);
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  deleteProject(req.params.id);
  res.status(204).send();
});

router.post('/:id/files', validateBody(CreateFileSchema), async (req: AuthenticatedRequest, res: Response) => {
  const { name, language, content } = req.body;
  const file = createFile(req.params.id, name, language, content);
  res.status(201).json(file);
});

// File routes
router.get('/files/:id', async (req: AuthenticatedRequest, res: Response) => {
  const file = getFileById(req.params.id);
  if (!file) return res.status(404).json({ error: 'File not found' });
  res.json(file);
});

router.put('/files/:id', validateBody(UpdateFileSchema), async (req: AuthenticatedRequest, res: Response) => {
  const file = updateFileContent(req.params.id, req.body.content);
  res.json(file);
});

router.delete('/files/:id', async (req: AuthenticatedRequest, res: Response) => {
  deleteFile(req.params.id);
  res.status(204).send();
});

export default router;
