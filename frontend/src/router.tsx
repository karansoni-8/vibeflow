import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { IDEPage } from './pages/IDEPage';
import { useAuth } from './hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const hasLocalToken = !!localStorage.getItem('vibeflow_token');

  if (loading) {
    return (
      <div className="w-screen h-screen bg-[#05050a] flex items-center justify-center text-cyan-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-[#9a9ab0]">Authenticating VibeFlow session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !hasLocalToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/ide"
        element={
          <ProtectedRoute>
            <IDEPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
