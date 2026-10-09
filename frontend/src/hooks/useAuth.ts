import { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from '../lib/firebase';
import { api } from '../lib/api';

export interface AuthUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUserProfile | null>(() => {
    const saved = localStorage.getItem('vibeflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: User | null) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          localStorage.setItem('vibeflow_token', token);
          const profile: AuthUserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'Vibe Coder',
            photoURL: fbUser.photoURL || undefined,
          };
          setUser(profile);
          localStorage.setItem('vibeflow_user', JSON.stringify(profile));

          // Inform backend
          await api.post('/api/auth/verify', {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (e) {
          console.warn('Auth token sync error:', e);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, googleProvider);
      const token = await res.user.getIdToken();
      localStorage.setItem('vibeflow_token', token);
      const profile: AuthUserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Vibe Coder',
        photoURL: res.user.photoURL || undefined,
      };
      setUser(profile);
      localStorage.setItem('vibeflow_user', JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGithub = async () => {
    try {
      setLoading(true);
      const res = await signInWithPopup(auth, githubProvider);
      const token = await res.user.getIdToken();
      localStorage.setItem('vibeflow_token', token);
      const profile: AuthUserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Vibe Coder',
        photoURL: res.user.photoURL || undefined,
      };
      setUser(profile);
      localStorage.setItem('vibeflow_user', JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.error('GitHub Sign In failed:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser: AuthUserProfile = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 8),
      email: 'student@vibeflow.dev',
      displayName: 'Vibe Student (Demo)',
      photoURL: '',
    };
    localStorage.setItem('vibeflow_token', 'dev_guest_token');
    localStorage.setItem('vibeflow_user', JSON.stringify(guestUser));
    setUser(guestUser);
    return guestUser;
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('vibeflow_token');
    localStorage.removeItem('vibeflow_user');
    setUser(null);
  };

  return {
    user,
    loading,
    loginWithGoogle,
    loginWithGithub,
    loginAsGuest,
    logout,
    isAuthenticated: !!user,
  };
}
