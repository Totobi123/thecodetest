import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Plus, Gift, Calculator, Shield, Bitcoin } from 'lucide-react';

interface WelcomeScreenProps {
  onNavigate: (screen: 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8 animate-fade-in"
    >
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 20, stiffness: 300 }}
          className="w-24 h-24 gradient-gold rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse-gold"
        >
          <Bitcoin className="text-3xl text-black" size={32} />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-yellow-500 mb-3"
        >
          BNB Giveaway
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-300 text-lg"
        >
          Premium Mobile Wallet Platform
        </motion.p>
        
        {/* Security Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 mt-6 mb-6"
        >
          <div className="flex items-start space-x-2">
            <Shield className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
            <div>
              <div className="text-sm font-medium text-red-300">⚠️ OFFICIAL APP WARNING</div>
              <div className="text-xs text-red-200 mt-1">
                This is the ONLY official BNB Giveaway app. Beware of fake copies and scam numbers.
                <br />
                <strong>Official Contact: +234 807 130 9276</strong>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-400 mt-2"
        >
          Secure • Fast • Reliable
        </motion.p>
      </div>

      <div className="space-y-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="wallet-card rounded-2xl">
            <CardContent className="p-6 text-center">
              <Gift className="text-yellow-500 text-2xl mb-3 mx-auto" size={32} />
              <h3 className="text-lg font-semibold mb-2">Exclusive Giveaways</h3>
              <p className="text-gray-400 text-sm">Participate in BNB airdrops and rewards</p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="wallet-card rounded-2xl">
            <CardContent className="p-6 text-center">
              <Calculator className="text-yellow-500 text-2xl mb-3 mx-auto" size={32} />
              <h3 className="text-lg font-semibold mb-2">Smart Calculator</h3>
              <p className="text-gray-400 text-sm">Calculate eligibility based on your balance</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <Button
          onClick={() => onNavigate('import')}
          className="w-full btn-gradient text-black font-semibold py-4 rounded-2xl text-lg hover:scale-105 transition-all duration-200"
        >
          <Download className="mr-2" size={20} />
          Import Wallet
        </Button>
        
        <Button
          onClick={() => onNavigate('create')}
          variant="secondary"
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-2xl text-lg transition-all duration-300"
        >
          <Plus className="mr-2" size={20} />
          Create New Wallet
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-8"
      >
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <Shield className="mr-1" size={12} />
          Legitimate Airdrop Platform - No Illegal Activities
        </p>
      </motion.div>
    </motion.div>
  );
}
