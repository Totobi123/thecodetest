import { useState } from 'react';
import { ArrowLeft, Globe, Bell, Shield, Info, Users, LogOut, Palette, Phone, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import LanguageSelector from '../components/LanguageSelector';
import ReferralSection from '../components/ReferralSection';
import { i18n } from '../lib/i18n';
import { useWallet } from '../hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface SettingsProps {
  onNavigate: (screen: 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [darkTheme, setDarkTheme] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  const { disconnectWallet } = useWallet();
  const { toast } = useToast();

  const handleThemeChange = (enabled: boolean) => {
    setDarkTheme(enabled);
    localStorage.setItem('theme', enabled ? 'dark' : 'purple');
    document.documentElement.className = enabled ? 'dark-theme' : 'purple-theme';
    
    toast({
      title: 'Theme Updated',
      description: `Switched to ${enabled ? 'dark' : 'purple'} theme`,
    });
  };

  const handleLogout = () => {
    disconnectWallet();
    localStorage.clear();
    onNavigate('welcome');
    
    toast({
      title: 'Logged Out',
      description: 'Successfully logged out of your wallet',
    });
  };

  const contactDeveloper = () => {
    const message = 'Hello GENX, I need help with the BNB Airdrop app';
    const whatsappUrl = `https://wa.me/2348071309276?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="px-6 py-8"
      >
        <div className="flex items-center mb-8">
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="ghost"
            size="sm"
            className="mr-4 text-yellow-500 hover:bg-yellow-500/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-yellow-500">{i18n.t('settings')}</h1>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <Card className="glass-effect border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="text-yellow-500" size={20} />
                <span>{i18n.t('language')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowLanguageSelector(true)}
                variant="outline"
                className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
              >
                <Globe size={16} className="mr-2" />
                Change Language
              </Button>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="glass-effect border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="text-purple-500" size={20} />
                <span>Theme</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Dark Theme</div>
                  <div className="text-sm text-gray-400">Switch between purple and dark themes</div>
                </div>
                <Switch
                  checked={darkTheme}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-effect border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="text-blue-500" size={20} />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Transaction Notifications</div>
                  <div className="text-sm text-gray-400">Get notified of injections and rewards</div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Push Notifications</div>
                  <div className="text-sm text-gray-400">Enhanced notifications for referrals</div>
                </div>
                <Switch
                  checked={pushNotificationsEnabled}
                  onCheckedChange={setPushNotificationsEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Referral System */}
          <Card className="glass-effect border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-green-500" size={20} />
                <span>Referral System</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralSection />
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="glass-effect border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogOut className="text-red-500" size={20} />
                <span>Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>

          {/* Developer Credits */}
          <Card className="glass-effect border-gradient-to-r from-yellow-500/20 to-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="text-red-500" size={20} />
                <span>Made with Love</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gradient bg-gradient-to-r from-yellow-500 to-purple-500 bg-clip-text text-transparent">
                  GENX
                </div>
                <div className="text-sm text-gray-400">Developer</div>
              </div>
              
              <Separator className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20" />
              
              <Button
                onClick={contactDeveloper}
                variant="outline"
                className="w-full border-green-500/50 text-green-500 hover:bg-green-500/10"
              >
                <Phone size={16} className="mr-2" />
                Contact Developer: 08071309276
              </Button>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="glass-effect border-gray-600/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="text-gray-400" size={20} />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <div className="text-sm font-medium text-white">Local Security</div>
                  <div className="text-xs text-gray-400">
                    All data is stored securely on your device
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Info className="text-blue-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <div className="text-sm font-medium text-white">Local Storage</div>
                  <div className="text-xs text-gray-400">
                    Your wallet data is stored locally and never transmitted
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Information */}
          <Card className="glass-effect border-gray-600/20">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-400">
                Crypto Airdrop Platform v1.0
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Secure • Multi-language • Referral System
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </>
  );
}