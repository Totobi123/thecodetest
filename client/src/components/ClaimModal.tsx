import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Gift, X } from 'lucide-react';
import { GiveawayCalculation } from '../types/wallet';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => Promise<boolean>;
  calculation: GiveawayCalculation | null;
  isLoading: boolean;
}

export default function ClaimModal({ 
  isOpen, 
  onClose, 
  onClaim, 
  calculation, 
  isLoading 
}: ClaimModalProps) {
  const handleClaim = async () => {
    const success = await onClaim();
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50 px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <Card className="glass-effect border-yellow-500/30">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 20, stiffness: 300 }}
                    className="w-16 h-16 gradient-gold rounded-full mx-auto mb-4 flex items-center justify-center"
                  >
                    <Gift className="text-2xl text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-yellow-500 mb-2">Claim Your Giveaway</h3>
                  <p className="text-gray-400">Congratulations! You're eligible for a BNB giveaway.</p>
                </div>

                {calculation && (
                  <div className="space-y-4 mb-6">
                    <Card className="bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Reward Amount</span>
                          <span className="text-yellow-500 font-semibold">
                            {calculation.giveawayAmount.toFixed(4)} BNB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">USD Value</span>
                          <span className="text-white font-semibold">
                            ~${calculation.giveawayAmountUSD.toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-green-900/20 border-green-600/50">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={16} />
                          <div>
                            <h4 className="font-semibold text-sm mb-1 text-green-500">Verified Wallet</h4>
                            <p className="text-green-200 text-xs">
                              Your wallet has been verified and approved for the giveaway.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="space-y-3">
                  <Button 
                    onClick={handleClaim}
                    disabled={isLoading}
                    className="w-full btn-gradient text-black font-semibold hover:scale-105 transition-all duration-200"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Gift className="mr-2" size={16} />
                    )}
                    {isLoading ? 'Processing...' : 'Claim Now'}
                  </Button>
                  
                  <Button 
                    onClick={onClose}
                    variant="secondary"
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                    disabled={isLoading}
                  >
                    <X className="mr-2" size={16} />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
