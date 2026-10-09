import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (optional-friendly)
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }
} catch (error) {
  console.warn('Firebase Admin init warning: GOOGLE_APPLICATION_CREDENTIALS might be missing. Using DEV_MODE if enabled.');
}

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (process.env.VIBE_DEV_MODE === 'true') {
    req.user = {
      uid: 'dev_user_123',
      email: 'dev@vibeflow.local',
      name: 'Developer',
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
