import { create } from 'zustand';
import type { User } from 'firebase/auth';

// Check if we're in dev mode (no Firebase config)
const isDevMode = !import.meta.env.VITE_FIREBASE_API_KEY;

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isDevMode: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  initAuth: () => void;
}

// Create a mock user for dev mode
const mockDevUser = {
  uid: 'dev_user_123',
  email: 'dev@vibeflow.local',
  displayName: 'Developer',
  photoURL: null,
  getIdToken: async () => 'dev-token',
} as unknown as User;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  isDevMode,

  initAuth: () => {
    if (isDevMode) {
      // In dev mode, auto-login with mock user
      console.log('🔧 Dev mode: Firebase not configured, using mock authentication');
      set({ user: mockDevUser, loading: false, initialized: true });
      return;
    }

    // Only import Firebase auth dynamically when config exists
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      import('../lib/firebase').then(({ auth }) => {
        onAuthStateChanged(auth, (currentUser) => {
          set({ user: currentUser, loading: false, initialized: true });
        });
      });
    });
  },

  signInWithGoogle: async () => {
    if (isDevMode) {
      set({ user: mockDevUser });
      return;
    }
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('../lib/firebase');
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  },

  signInWithGitHub: async () => {
    if (isDevMode) {
      set({ user: mockDevUser });
      return;
    }
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, githubProvider } = await import('../lib/firebase');
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  },

  signOut: async () => {
    if (isDevMode) {
      set({ user: null });
      return;
    }
    try {
      const { signOut: firebaseSignOut } = await import('firebase/auth');
      const { auth } = await import('../lib/firebase');
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  getIdToken: async () => {
    const user = get().user;
    if (!user) return null;
    if (isDevMode) return 'dev-token';
    try {
      return await user.getIdToken();
    } catch {
      return null;
    }
  },
}));
