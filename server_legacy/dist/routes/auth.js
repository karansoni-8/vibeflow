import { Router } from 'express';
import { storage, demoUser } from '../services/storage.js';
import { v4 as uuidv4 } from 'uuid';
const router = Router();
// Get current session user
router.get('/me', (req, res) => {
    const user = storage.getUser(demoUser.id);
    res.json({ user: user || demoUser });
});
// Login (Developer / Guest / Demo)
router.post('/login', (req, res) => {
    const { provider, email, name } = req.body;
    let user = storage.getUser(demoUser.id);
    if (email && email !== demoUser.email) {
        user = {
            id: `usr_${uuidv4().slice(0, 8)}`,
            name: name || 'Developer',
            email: email,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
            createdAt: new Date().toISOString(),
        };
        storage.saveUser(user);
    }
    res.json({
        success: true,
        user: user || demoUser,
        token: `jwt_${uuidv4()}`,
        provider: provider || 'developer',
    });
});
// OAuth Callback / Mock handler for Google
router.get('/google', (req, res) => {
    res.redirect('/?auth=google_success');
});
// OAuth Callback / Mock handler for GitHub
router.get('/github', (req, res) => {
    res.redirect('/?auth=github_success');
});
// Logout
router.post('/logout', (req, res) => {
    res.json({ success: true });
});
export default router;
