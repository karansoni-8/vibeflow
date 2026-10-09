import { Router } from 'express';
import { storage, demoUser } from '../services/storage.js';
const router = Router();
// Get all projects for current user
router.get('/', (req, res) => {
    const userId = req.query.userId || demoUser.id;
    const projects = storage.getProjects(userId);
    res.json({ projects });
});
// Get single project by ID
router.get('/:id', (req, res) => {
    const project = storage.getProject(req.params.id);
    if (!project) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project });
});
// Create project
router.post('/', (req, res) => {
    const { name, description, userId } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Project name is required' });
    }
    const project = storage.createProject(userId || demoUser.id, name, description);
    res.status(201).json({ project });
});
// Update project
router.put('/:id', (req, res) => {
    const updated = storage.updateProject(req.params.id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project: updated });
});
// Delete project
router.delete('/:id', (req, res) => {
    const deleted = storage.deleteProject(req.params.id);
    res.json({ success: deleted });
});
// Save file content (Autosave endpoint)
router.put('/:id/files/:fileId', (req, res) => {
    const { content } = req.body;
    if (content === undefined) {
        return res.status(400).json({ error: 'Content is required' });
    }
    const updatedFile = storage.saveFile(req.params.id, req.params.fileId, content);
    if (!updatedFile) {
        return res.status(404).json({ error: 'File or project not found' });
    }
    res.json({ file: updatedFile });
});
// Create file
router.post('/:id/files', (req, res) => {
    const { name, language } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'File name is required' });
    }
    const file = storage.createFile(req.params.id, name, language);
    if (!file) {
        return res.status(404).json({ error: 'Project not found' });
    }
    res.status(201).json({ file });
});
// Delete file
router.delete('/:id/files/:fileId', (req, res) => {
    const success = storage.deleteFile(req.params.id, req.params.fileId);
    res.json({ success });
});
export default router;
