import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Loader2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInject: () => Promise<void>;
  injectionAmount: number;
  injectionAmountUSD: number;
}

export default function InjectionModal({ 
  isOpen, 
  onClose, 
  onInject, 
  injectionAmount, 
  injectionAmountUSD 
}: InjectionModalProps) {
  const [isInjecting, setIsInjecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);

  const handleInject = async () => {
    setIsInjecting(true);
    setIsComplete(false);
    setProgress(0);
    setTimeRemaining(30);

    // Start the 30-second timer
    const startTime = Date.now();
    const duration = 30000; // 30 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      const remaining = Math.max(30 - Math.floor(elapsed / 1000), 0);
      
      setProgress(newProgress);
      setTimeRemaining(remaining);

      if (elapsed >= duration) {
        clearInterval(timer);
        setIsComplete(true);
        setIsInjecting(false);
      }
    }, 100);

    try {
      await onInject();
    } catch (error) {
      clearInterval(timer);
      setIsInjecting(false);
      setProgress(0);
      setTimeRemaining(30);
    }
  };

  const handleClose = () => {
    if (!isInjecting) {
      setProgress(0);
      setIsComplete(false);
      setTimeRemaining(30);
      onClose();
    }
  };

  // Request notification permission
  useEffect(() => {
    if (isComplete && Notification.permission === 'granted') {
      new Notification('Balance Injection Complete!', {
        body: `${injectionAmount.toFixed(4)} BNB ($${injectionAmountUSD.toFixed(2)}) has been added to your wallet`,
        icon: '/favicon.ico'
      });
    }
  }, [isComplete, injectionAmount, injectionAmountUSD]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md wallet-card">
        <DialogHeader>
          <DialogTitle className="text-center text-yellow-500">
            Balance Injection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <AnimatePresence mode="wait">
            {!isInjecting && !isComplete && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-4"
              >
                <div className="bg-yellow-500/10 rounded-2xl p-6">
                  <DollarSign size={48} className="text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Ready to Inject</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    You will receive {injectionAmount.toFixed(4)} BNB (${injectionAmountUSD.toFixed(2)})
                  </p>
                  <p className="text-gray-500 text-xs">
                    This process will take 30 seconds
                  </p>
                </div>

                <Button
                  onClick={handleInject}
                  className="w-full btn-gradient text-black font-semibold py-3 rounded-xl"
                >
                  Start Injection
                </Button>
              </motion.div>
            )}

            {isInjecting && (
              <motion.div
                key="injecting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-6"
              >
                <div className="bg-blue-500/10 rounded-2xl p-6">
                  <Loader2 size={48} className="text-blue-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold mb-2">Injecting Balance</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Adding {injectionAmount.toFixed(4)} BNB to your wallet...
                  </p>
                  <p className="text-blue-400 font-mono text-lg">
                    {timeRemaining}s remaining
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-gray-700" />
                </div>
              </motion.div>
            )}

            {isComplete && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center space-y-4"
              >
                <div className="bg-green-500/10 rounded-2xl p-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 300 }}
                  >
                    <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2 text-green-500">
                    Injection Complete!
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    Successfully added {injectionAmount.toFixed(4)} BNB
                  </p>
                  <p className="text-green-400 font-semibold">
                    +${injectionAmountUSD.toFixed(2)} USD
                  </p>
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full btn-gradient text-black font-semibold py-3 rounded-xl"
                >
                  Continue
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}