import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppRouter } from './router';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel',
          style: {
            background: '#12121e',
            color: '#f4f4f7',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            borderRadius: '12px',
          },
        }}
      />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
