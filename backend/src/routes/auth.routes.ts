import { Router } from 'express';
import { verifyFirebaseToken, AuthRequest } from '../middleware/verifyFirebaseToken.js';
import { User } from '../models/User.model.js';
import { isDbConnected } from '../config/db.js';

const router = Router();

router.get('/me', verifyFirebaseToken, async (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

router.post('/verify', verifyFirebaseToken, async (req: AuthRequest, res) => {
  if (req.user && isDbConnected()) {
    try {
      await User.findOneAndUpdate(
        { firebaseUid: req.user.uid },
        {
          firebaseUid: req.user.uid,
          email: req.user.email,
          displayName: req.user.name || 'Vibe Coder',
          photoURL: req.user.picture,
        },
        { upsert: true, new: true }
      );
    } catch (err: any) {
      console.warn('Could not upsert user in DB:', err.message);
    }
  }
  res.json({ success: true, user: req.user });
});

export default router;
