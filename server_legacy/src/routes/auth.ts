import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { getOrCreateUser, getUserByFirebaseUid } from '../database';

const router = Router();

router.post('/verify', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const dbUser = getOrCreateUser(user.uid, user.email || '', user.name || '', user.picture || '');
    res.json(dbUser);
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const dbUser = getUserByFirebaseUid(user.uid);
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(dbUser);
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
