import { Response } from 'express';
import { AuthRequest } from '../middleware/verifyFirebaseToken.js';
import { Project } from '../models/Project.model.js';
import { isDbConnected } from '../config/db.js';

// In-memory project storage fallback
interface InMemoryProject {
  id: string;
  userId: string;
  title: string;
  language: string;
  code: string;
  lastFlowchart?: string;
  lastExplainReport?: any;
  createdAt: Date;
  updatedAt: Date;
}

const inMemoryProjects: Map<string, InMemoryProject> = new Map();

export async function listProjectsHandler(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.uid || 'guest';

  if (isDbConnected()) {
    try {
      const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
      res.json({ projects });
      return;
    } catch (e) {
      console.warn('DB error listing projects, falling back to memory');
    }
  }

  const userProjects = Array.from(inMemoryProjects.values())
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  res.json({ projects: userProjects });
}

export async function createProjectHandler(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.uid || 'guest';
  const { title, language, code, lastFlowchart, lastExplainReport } = req.body;

  if (isDbConnected()) {
    try {
      const newProj = await Project.create({
        userId,
        title: title || 'Untitled Algorithm',
        language: language || 'python',
        code: code || '',
        lastFlowchart,
        lastExplainReport,
      });
      res.status(201).json({ project: newProj });
      return;
    } catch (e) {
      console.warn('DB error creating project, falling back to memory');
    }
  }

  const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const memoryProj: InMemoryProject = {
    id,
    userId,
    title: title || 'Untitled Algorithm',
    language: language || 'python',
    code: code || '',
    lastFlowchart,
    lastExplainReport,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryProjects.set(id, memoryProj);
  res.status(201).json({ project: memoryProj });
}

export async function getProjectHandler(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.uid || 'guest';

  if (isDbConnected()) {
    try {
      const project = await Project.findOne({ _id: id, userId });
      if (project) {
        res.json({ project });
        return;
      }
    } catch (e) {
      // ignore
    }
  }

  const project = inMemoryProjects.get(id);
  if (project && project.userId === userId) {
    res.json({ project });
    return;
  }

  res.status(404).json({ error: 'Project not found' });
}

export async function updateProjectHandler(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.uid || 'guest';
  const { title, language, code, lastFlowchart, lastExplainReport } = req.body;

  if (isDbConnected()) {
    try {
      const project = await Project.findOneAndUpdate(
        { _id: id, userId },
        {
          ...(title && { title }),
          ...(language && { language }),
          ...(code !== undefined && { code }),
          ...(lastFlowchart !== undefined && { lastFlowchart }),
          ...(lastExplainReport !== undefined && { lastExplainReport }),
          updatedAt: new Date(),
        },
        { new: true }
      );
      if (project) {
        res.json({ project });
        return;
      }
    } catch (e) {
      // ignore
    }
  }

  const memoryProj = inMemoryProjects.get(id);
  if (memoryProj && memoryProj.userId === userId) {
    if (title) memoryProj.title = title;
    if (language) memoryProj.language = language;
    if (code !== undefined) memoryProj.code = code;
    if (lastFlowchart !== undefined) memoryProj.lastFlowchart = lastFlowchart;
    if (lastExplainReport !== undefined) memoryProj.lastExplainReport = lastExplainReport;
    memoryProj.updatedAt = new Date();
    res.json({ project: memoryProj });
    return;
  }

  res.status(404).json({ error: 'Project not found' });
}

export async function deleteProjectHandler(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user?.uid || 'guest';

  if (isDbConnected()) {
    try {
      await Project.deleteOne({ _id: id, userId });
      res.json({ success: true });
      return;
    } catch (e) {
      // ignore
    }
  }

  if (inMemoryProjects.has(id)) {
    inMemoryProjects.delete(id);
    res.json({ success: true });
    return;
  }

  res.status(404).json({ error: 'Project not found' });
}
