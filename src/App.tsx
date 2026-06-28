import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import InstallBanner from './components/InstallBanner';
import GlobalErrorBoundary from './components/GlobalErrorBoundary';
import { registerGlobalErrorHandlers } from './utils/errors';

export default function App() {
  // Register global interceptors for unhandled promise rejections and uncaught exceptions
  useEffect(() => {
    const unregister = registerGlobalErrorHandlers();
    return () => {
      unregister();
    };
  }, []);

  return (
    <>
      <InstallBanner />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#1e293b',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff'
            }
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff'
            }
          }
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <GlobalErrorBoundary>
            <AnimatedRoutes />
          </GlobalErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
