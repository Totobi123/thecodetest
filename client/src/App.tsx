import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AuthScreen from './pages/AuthScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import ImportWallet from './pages/ImportWallet';
import CreateWallet from './pages/CreateWallet';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import History from './pages/History';
import Settings from './pages/Settings';
import BottomNavigation from './components/BottomNavigation';
import { useWallet } from './hooks/useWallet';
import { deviceAuthService } from './lib/deviceAuth';

type Screen = 'auth' | 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { wallet, isConnected } = useWallet();

  useEffect(() => {
    // Check if device is already authenticated
    if (deviceAuthService.isDeviceActivated()) {
      setIsAuthenticated(true);
      setCurrentScreen('welcome');
    }
  }, []);

  // Auto-navigate to dashboard if wallet is connected
  useEffect(() => {
    if (isConnected && currentScreen === 'welcome') {
      setCurrentScreen('dashboard');
    }
  }, [isConnected, currentScreen]);

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setCurrentScreen('welcome');
  };

  const renderScreen = () => {
    if (!isAuthenticated && currentScreen === 'auth') {
      return <AuthScreen onAuthenticated={handleAuthenticated} />;
    }

    if (!isAuthenticated) {
      return <AuthScreen onAuthenticated={handleAuthenticated} />;
    }

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigate} />;
      case 'import':
        return <ImportWallet onNavigate={handleNavigate} />;
      case 'create':
        return <CreateWallet onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'calculator':
        return <Calculator onNavigate={handleNavigate} />;
      case 'history':
        return <History onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      default:
        return <WelcomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="max-w-md mx-auto bg-background min-h-screen relative overflow-hidden">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-400">
            <span>9:41</span>
            <div className="flex space-x-1">
              <i className="fas fa-signal"></i>
              <i className="fas fa-wifi"></i>
              <i className="fas fa-battery-three-quarters"></i>
            </div>
          </div>

          {/* Main Content */}
          <main className={isAuthenticated && ['dashboard', 'calculator', 'history', 'settings'].includes(currentScreen) ? 'pb-20' : ''}>
            {renderScreen()}
          </main>

          {/* Bottom Navigation - show when authenticated and on main screens */}
          {isAuthenticated && ['dashboard', 'calculator', 'history', 'settings'].includes(currentScreen) && (
            <BottomNavigation 
              activeScreen={currentScreen} 
              onNavigate={(screen) => handleNavigate(screen)} 
            />
          )}
        </div>
        
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
