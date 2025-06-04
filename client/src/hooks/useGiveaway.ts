import { useState } from 'react';
import { walletService, type GiveawayCalculation } from '../lib/wallet';

export const useGiveaway = () => {
  const [calculation, setCalculation] = useState<GiveawayCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const calculateGiveaway = (balance?: number) => {
    setIsCalculating(true);
    
    try {
      const result = walletService.calculateGiveaway(balance);
      setCalculation(result);
      return result;
    } catch (error) {
      console.error('Error calculating giveaway:', error);
      setCalculation(null);
      return null;
    } finally {
      setIsCalculating(false);
    }
  };

  const claimGiveaway = async () => {
    if (!calculation?.isEligible) {
      setClaimError('Not eligible for giveaway');
      return false;
    }

    setIsClaiming(true);
    setClaimError(null);

    try {
      const wallet = walletService.getWallet();
      if (!wallet) {
        throw new Error('No wallet connected');
      }

      const response = await fetch('/api/giveaway/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet.address,
          amount: calculation.giveawayAmount.toString(),
          amountUSD: calculation.giveawayAmountUSD.toString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to claim giveaway');
      }

      const result = await response.json();
      
      // Giveaway claimed successfully
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to claim giveaway';
      setClaimError(errorMessage);
      console.error('Error claiming giveaway:', error);
      return false;
    } finally {
      setIsClaiming(false);
    }
  };

  const resetCalculation = () => {
    setCalculation(null);
    setClaimError(null);
  };

  return {
    calculation,
    isCalculating,
    isClaiming,
    claimError,
    calculateGiveaway,
    claimGiveaway,
    resetCalculation,
    isEligible: calculation?.isEligible ?? false
  };
};
