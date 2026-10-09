import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.7-flash',
  pistonApiUrl: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/vibeflow',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
};
