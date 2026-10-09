import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../../vibeflow.db');
let db: Database.Database;

/** Initialize the database and create tables. Called once at startup. */
export function initDatabase() {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      firebase_uid TEXT UNIQUE,
      email TEXT,
      display_name TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      name TEXT,
      language TEXT DEFAULT 'cpp',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
      name TEXT,
      language TEXT,
      content TEXT DEFAULT '',
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS executions (
      id TEXT PRIMARY KEY,
      file_id TEXT REFERENCES files(id),
      input TEXT,
      output TEXT,
      error TEXT,
      exit_code INTEGER,
      execution_time_ms INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function getDb(): Database.Database {
  if (!db) initDatabase();
  return db;
}

export function getOrCreateUser(firebaseUid: string, email: string, displayName: string, avatarUrl: string) {
  const existing = getUserByFirebaseUid(firebaseUid);
  if (existing) {
    getDb().prepare('UPDATE users SET email = ?, display_name = ?, avatar_url = ? WHERE firebase_uid = ?')
      .run(email, displayName, avatarUrl, firebaseUid);
    return getUserByFirebaseUid(firebaseUid);
  }
  const id = uuidv4();
  getDb().prepare('INSERT INTO users (id, firebase_uid, email, display_name, avatar_url) VALUES (?, ?, ?, ?, ?)')
    .run(id, firebaseUid, email, displayName, avatarUrl);
  return getUserByFirebaseUid(firebaseUid);
}

export function getUserByFirebaseUid(uid: string) {
  return getDb().prepare('SELECT * FROM users WHERE firebase_uid = ?').get(uid);
}

export function createProject(userId: string, name: string, language: string) {
  const projectId = uuidv4();
  getDb().prepare('INSERT INTO projects (id, user_id, name, language) VALUES (?, ?, ?, ?)').run(projectId, userId, name, language);

  const fileId = uuidv4();
  const extension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : 'cpp';
  const fileName = language === 'java' ? 'Main.java' : `main.${extension}`;
  getDb().prepare('INSERT INTO files (id, project_id, name, language) VALUES (?, ?, ?, ?)').run(fileId, projectId, fileName, language);

  return getProjectById(projectId);
}

export function getProjectsByUserId(userId: string) {
  return getDb().prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
}

export function getProjectById(projectId: string): any {
  const project = getDb().prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!project) return null;
  const files = getFilesByProjectId(projectId);
  return { ...(project as any), files };
}

export function updateProject(projectId: string, data: { name?: string; language?: string }) {
  if (data.name) {
    getDb().prepare('UPDATE projects SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(data.name, projectId);
  }
  if (data.language) {
    getDb().prepare('UPDATE projects SET language = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(data.language, projectId);
  }
  return getProjectById(projectId);
}

export function deleteProject(projectId: string) {
  getDb().prepare('DELETE FROM files WHERE project_id = ?').run(projectId);
  getDb().prepare('DELETE FROM projects WHERE id = ?').run(projectId);
}

export function createFile(projectId: string, name: string, language: string, content: string = '') {
  const id = uuidv4();
  getDb().prepare('INSERT INTO files (id, project_id, name, language, content) VALUES (?, ?, ?, ?, ?)').run(id, projectId, name, language, content);
  // Update project timestamp
  getDb().prepare('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(projectId);
  return getFileById(id);
}

export function getFileById(fileId: string) {
  return getDb().prepare('SELECT * FROM files WHERE id = ?').get(fileId);
}

export function updateFileContent(fileId: string, content: string) {
  getDb().prepare('UPDATE files SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(content, fileId);
  // Also update project timestamp
  const file: any = getFileById(fileId);
  if (file) {
    getDb().prepare('UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(file.project_id);
  }
  return getFileById(fileId);
}

export function deleteFile(fileId: string) {
  getDb().prepare('DELETE FROM files WHERE id = ?').run(fileId);
}

export function createExecution(fileId: string, input: string, output: string, error: string, exitCode: number | null, executionTimeMs: number) {
  const id = uuidv4();
  getDb().prepare('INSERT INTO executions (id, file_id, input, output, error, exit_code, execution_time_ms) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, fileId, input, output, error, exitCode, executionTimeMs);
  return getDb().prepare('SELECT * FROM executions WHERE id = ?').get(id);
}

export function getFilesByProjectId(projectId: string) {
  return getDb().prepare('SELECT * FROM files WHERE project_id = ?').all(projectId);
}

export default { getDb };
