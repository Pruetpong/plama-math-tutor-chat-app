import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { ChatPage } from './components/ChatPage';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { PlamaConfigProvider } from './contexts/PlamaConfigContext';
import { usePlamaConfig } from './hooks/usePlamaConfig';
import { SetupPage } from './components/SetupPage';

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { grade, topic, setPlamaConfig, isLoading: isConfigLoading } = usePlamaConfig();

    if (isAuthLoading || isConfigLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    if (!grade || !topic) {
        return <SetupPage onSetupComplete={setPlamaConfig} />;
    }
    
    return <ChatPage />;
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PlamaConfigProvider>
          <AppContent />
        </PlamaConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;