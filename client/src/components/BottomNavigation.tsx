import { motion } from 'framer-motion';
import { Home, Calculator, History, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'calculator', icon: Calculator, label: 'Calculate' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 safe-area-inset-bottom"
    >
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2 pb-safe">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id as 'dashboard' | 'calculator' | 'history' | 'settings')}
                className="flex flex-col items-center space-y-1 p-3 relative min-w-[60px]"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  animate={{
                    color: isActive ? '#FFD700' : '#9CA3AF',
                    scale: isActive ? 1.2 : 1
                  }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Icon size={22} />
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -inset-2 bg-yellow-500/20 rounded-full"
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </motion.div>
                <motion.span
                  animate={{
                    color: isActive ? '#FFD700' : '#9CA3AF',
                    fontWeight: isActive ? 600 : 400
                  }}
                  className="text-xs"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
