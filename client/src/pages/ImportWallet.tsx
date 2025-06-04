import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, Wallet, Info } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '@/hooks/use-toast';

interface ImportWalletProps {
  onNavigate: (screen: 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function ImportWallet({ onNavigate }: ImportWalletProps) {
  const [privateKey, setPrivateKey] = useState('');
  const { importWalletFromPrivateKey, isLoading } = useWallet();
  const { toast } = useToast();

  const handleImportWallet = async () => {
    if (!privateKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your private key',
        variant: 'destructive',
      });
      return;
    }

    try {
      await importWalletFromPrivateKey(privateKey.trim());
      onNavigate('dashboard');
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'Failed to import wallet',
        variant: 'destructive',
      });
    }
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
          <h1 className="text-2xl font-bold text-yellow-500">Import Wallet</h1>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-effect rounded-2xl border-yellow-500/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', damping: 20, stiffness: 300 }}
                  >
                    <Wallet className="text-yellow-500 text-3xl mb-3 mx-auto" size={48} />
                  </motion.div>
                  <h3 className="text-lg font-semibold">Import Wallet</h3>
                  <p className="text-gray-400 text-sm mt-2">
                    Enter your private key to import your BNB wallet
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Private Key
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your private key (64 characters)"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      className="w-full bg-gray-700 border-gray-600 rounded-xl p-4 text-white focus:border-yellow-500 transition-all duration-300"
                    />
                  </div>

                  <Button
                    onClick={handleImportWallet}
                    disabled={isLoading || !privateKey.trim()}
                    className="w-full btn-gradient text-black font-semibold py-4 rounded-xl hover:scale-105 transition-all duration-200"
                  >
                    <Search className="mr-2" size={16} />
                    Import Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gray-800 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Info className="text-yellow-500 mt-1 flex-shrink-0" size={16} />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Security Notice</h4>
                    <p className="text-gray-400 text-xs">
                      Your private key is processed locally using SHA-256 encryption and never sent to our servers. Your wallet address will be derived automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <LoadingOverlay isVisible={isLoading} message="Verifying wallet address" />
    </>
  );
}
