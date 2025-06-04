import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Check, AlertTriangle, Sparkles, Copy, Eye, EyeOff } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '@/hooks/use-toast';

interface CreateWalletProps {
  onNavigate: (screen: 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function CreateWallet({ onNavigate }: CreateWalletProps) {
  const [walletData, setWalletData] = useState<any>(null);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const { createWallet, isLoading } = useWallet();
  const { toast } = useToast();

  const handleCreateWallet = async () => {
    try {
      const newWallet = await createWallet();
      setWalletData(newWallet);
      setShowWalletInfo(true);
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create wallet',
        variant: 'destructive',
      });
    }
  };

  const handleContinueToDashboard = () => {
    onNavigate('dashboard');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
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
            onClick={() => onNavigate('welcome')}
            variant="ghost"
            size="sm"
            className="mr-4 text-yellow-500 hover:bg-yellow-500/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-yellow-500">Create Wallet</h1>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 20, stiffness: 300 }}
            className="w-20 h-20 gradient-gold rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Plus className="text-2xl text-black" size={32} />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-semibold mb-2"
          >
            {showWalletInfo ? 'Wallet Created Successfully!' : 'New BNB Wallet'}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400"
          >
            {showWalletInfo ? 'Save your wallet details securely' : 'Generate a secure wallet for BNB giveaways'}
          </motion.p>
        </div>

{!showWalletInfo ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-effect rounded-2xl border-yellow-500/20">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Wallet Features</h4>
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-sm">BNB Smart Chain Compatible</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-sm">Giveaway Eligible</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center space-x-3"
                    >
                      <Check className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-sm">SHA-256 Secure Generation</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={handleCreateWallet}
                disabled={isLoading}
                className="w-full btn-gradient text-black font-semibold py-4 rounded-xl hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="mr-2" size={20} />
                Generate Wallet
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Card className="bg-amber-900/20 border-amber-600/50 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="text-amber-500 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-amber-500">Important</h4>
                      <p className="text-amber-200 text-xs">
                        Save your private key securely. We cannot recover lost wallets.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Wallet Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="glass-effect rounded-2xl border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Wallet Address</h4>
                    <Button
                      onClick={() => copyToClipboard(walletData?.address || '', 'Wallet Address')}
                      variant="ghost"
                      size="sm"
                      className="text-yellow-500 hover:bg-yellow-500/10"
                    >
                      <Copy size={16} />
                    </Button>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-4">
                    <p className="text-sm font-mono text-gray-300 break-all">
                      {walletData?.address}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Private Key */}
              <Card className="glass-effect rounded-2xl border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Private Key</h4>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        variant="ghost"
                        size="sm"
                        className="text-yellow-500 hover:bg-yellow-500/10"
                      >
                        {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(walletData?.privateKey || '', 'Private Key')}
                        variant="ghost"
                        size="sm"
                        className="text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-xl p-4">
                    <p className="text-sm font-mono text-gray-300 break-all">
                      {showPrivateKey ? walletData?.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Warning */}
              <Card className="bg-red-900/20 border-red-600/50 rounded-2xl">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="text-red-500 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-red-500">Security Warning</h4>
                      <p className="text-red-200 text-xs">
                        Never share your private key with anyone. Store it securely offline. Anyone with your private key can access your funds.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                onClick={handleContinueToDashboard}
                className="w-full btn-gradient text-black font-semibold py-4 rounded-xl hover:scale-105 transition-all duration-200"
              >
                <Check className="mr-2" size={20} />
                Continue to Dashboard
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>

      <LoadingOverlay isVisible={isLoading} message="Generating secure wallet" />
    </>
  );
}
