import { useState, useEffect } from 'react';
import { walletService, type WalletData } from '../lib/wallet';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importWallet = async (privateKey: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const walletData = walletService.importWallet(privateKey);
      if (walletData) {
        setWallet(walletData);
        return walletData;
      } else {
        throw new Error('Invalid private key');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const importWalletFromPrivateKey = async (privateKey: string) => {
    return importWallet(privateKey); // Use the same method
  };

  const createWallet = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const walletData = walletService.createWallet();
      setWallet(walletData);
      return walletData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBalance = async () => {
    if (!wallet) return null;
    
    setIsLoading(true);
    try {
      // For demo purposes, just return current wallet
      return wallet;
    } catch (err) {
      console.error('Error updating balance:', err);
      return wallet;
    } finally {
      setIsLoading(false);
    }
  };

  const injectBalance = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await walletService.injectBalance();
      if (success) {
        const updatedWallet = walletService.getWallet();
        if (updatedWallet) {
          setWallet({...updatedWallet}); // Force state update with new object
        }
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to inject balance';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const notifyDashboardAccess = async () => {
    // Dashboard notification logic if needed
  };

  const disconnectWallet = () => {
    walletService.disconnect();
    setWallet(null);
    setError(null);
  };

  // Initialize wallet state from service
  useEffect(() => {
    const existingWallet = walletService.getWallet();
    if (existingWallet) {
      setWallet(existingWallet);
    }
  }, []);

  // Completely disabled auto-refresh - only manual refresh for all wallets
  // useEffect(() => {
  //   if (!wallet?.isConnected) return;

  //   const interval = setInterval(() => {
  //     updateBalance();
  //   }, 30000);

  //   return () => clearInterval(interval);
  // }, [wallet?.isConnected]);

  return {
    wallet,
    isLoading,
    error,
    importWallet,
    importWalletFromPrivateKey,
    createWallet,
    updateBalance,
    injectBalance,
    notifyDashboardAccess,
    disconnectWallet,
    isConnected: !!wallet?.isConnected
  };
};
