import { CryptoWallet } from './crypto';
import { currencyConverter } from './currencyConverter';

export interface WalletData {
  address: string;
  privateKey?: string;
  balance: number;
  balanceUSD: number;
  isEligible: boolean;
  isConnected: boolean;
  lastBalanceInjection?: string;
  dailyInjectionUsed?: boolean;
}

export interface GiveawayCalculation {
  isEligible: boolean;
  giveawayAmount: number;
  giveawayAmountUSD: number;
  eligibilityPercentage: number;
  bonusMultiplier: number;
  baseReward: number;
}

export interface TransactionHistory {
  id: string;
  type: 'receive' | 'send' | 'giveaway';
  amount: number;
  amountUSD: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export class WalletService {
  private walletData: WalletData | null = null;
  private transactions: TransactionHistory[] = [];

  // Premium private keys with higher balances
  private premiumKeys = [
    '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    '0x2345678901bcdef01234567890abcdef1234567890abcdef1234567890abcde0',
    '0x3456789012cdef012345678901bcdef012345678901bcdef012345678901bcde1',
    '0x4567890123def0123456789012cdef0123456789012cdef0123456789012cde2',
    '0x5678901234ef01234567890123def01234567890123def01234567890123de3'
  ];

  createWallet(): WalletData {
    const wallet = CryptoWallet.generateWallet();
    const balance = Math.random() * 0.5 + 0.1; // Random balance between 0.1-0.6 BNB
    const balanceUSD = balance * 250;
    
    this.walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance,
      balanceUSD,
      isEligible: balanceUSD >= 15,
      isConnected: true,
      dailyInjectionUsed: false
    };

    this.saveToStorage();
    return this.walletData;
  }

  importWallet(privateKey: string): WalletData | null {
    if (!CryptoWallet.isValidPrivateKey(privateKey)) {
      return null;
    }

    const wallet = CryptoWallet.importFromPrivateKey(privateKey);
    const isPremium = this.premiumKeys.includes(privateKey);
    const balance = isPremium ? Math.random() * 2 + 3 : Math.random() * 0.5 + 0.1;
    const balanceUSD = balance * 250;
    
    this.walletData = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance,
      balanceUSD,
      isEligible: balanceUSD >= 15,
      isConnected: true,
      dailyInjectionUsed: false
    };

    this.saveToStorage();
    return this.walletData;
  }

  getWallet(): WalletData | null {
    if (!this.walletData) {
      this.loadFromStorage();
    }
    return this.walletData;
  }

  calculateGiveaway(balance?: number): GiveawayCalculation {
    const currentBalance = balance ?? this.walletData?.balance ?? 0;
    const bnbPrice = 250; // BNB price in USD
    const balanceUSD = currentBalance * bnbPrice;
    const minRequiredUSD = 15;
    const isEligible = balanceUSD >= minRequiredUSD;
    
    if (!isEligible) {
      return {
        isEligible: false,
        giveawayAmount: 0,
        giveawayAmountUSD: 0,
        eligibilityPercentage: Math.round((balanceUSD / minRequiredUSD) * 100),
        bonusMultiplier: 1.0,
        baseReward: 0
      };
    }

    // Enhanced calculation logic
    let baseRewardPercentage = 0.08; // 8% base reward
    let bonusMultiplier = 1.0;

    // Tier-based bonus system
    if (balanceUSD >= 1000) {
      bonusMultiplier = 3.0;
      baseRewardPercentage = 0.15;
    } else if (balanceUSD >= 500) {
      bonusMultiplier = 2.5;
      baseRewardPercentage = 0.12;
    } else if (balanceUSD >= 250) {
      bonusMultiplier = 2.0;
      baseRewardPercentage = 0.10;
    } else if (balanceUSD >= 100) {
      bonusMultiplier = 1.5;
    }

    const baseReward = currentBalance * baseRewardPercentage;
    const giveawayAmount = baseReward * bonusMultiplier;
    const giveawayAmountUSD = giveawayAmount * bnbPrice;

    return {
      isEligible: true,
      giveawayAmount: Number(giveawayAmount.toFixed(6)),
      giveawayAmountUSD: Number(giveawayAmountUSD.toFixed(2)),
      eligibilityPercentage: 100,
      bonusMultiplier: Number(bonusMultiplier.toFixed(1)),
      baseReward: Number(baseReward.toFixed(6))
    };
  }

  async injectBalance(): Promise<boolean> {
    if (!this.walletData) {
      return false;
    }

    // Remove all limits - always allow injection
    const now = new Date();
    
    // Calculate injection amount - generous amounts for better UX
    const baseInjection = Math.random() * 0.5 + 0.3; // 0.3-0.8 BNB
    const bonusMultiplier = this.walletData.balanceUSD > 50 ? 2.0 : 1.5;
    const injectionAmount = baseInjection * bonusMultiplier;

    // Update wallet data immediately
    this.walletData.balance += injectionAmount;
    this.walletData.balanceUSD = this.walletData.balance * 250;
    this.walletData.isEligible = this.walletData.balanceUSD >= 15;
    this.walletData.lastBalanceInjection = now.toISOString();
    this.walletData.dailyInjectionUsed = false; // Always reset for next use

    // Create transaction record
    const transaction: TransactionHistory = {
      id: `injection_${Date.now()}`,
      type: 'receive',
      amount: injectionAmount,
      amountUSD: injectionAmount * 250,
      timestamp: now.toISOString(),
      status: 'completed',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`
    };

    this.transactions.push(transaction);
    this.saveToStorage();
    
    console.log('Balance injection successful:', {
      amount: injectionAmount,
      newBalance: this.walletData.balance,
      newBalanceUSD: this.walletData.balanceUSD
    });
    
    return true;
  }

  private saveToStorage(): void {
    if (this.walletData) {
      localStorage.setItem('walletData', JSON.stringify(this.walletData));
    }
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  private loadFromStorage(): void {
    const savedWallet = localStorage.getItem('walletData');
    const savedTransactions = localStorage.getItem('transactions');
    
    if (savedWallet) {
      this.walletData = JSON.parse(savedWallet);
    }
    
    if (savedTransactions) {
      this.transactions = JSON.parse(savedTransactions);
    }
  }

  getTransactions(): TransactionHistory[] {
    return this.transactions;
  }

  resetDailyInjection(): void {
    if (this.walletData) {
      this.walletData.dailyInjectionUsed = false;
      this.walletData.lastBalanceInjection = undefined;
      this.saveToStorage();
    }
  }

  disconnect(): void {
    this.walletData = null;
    this.transactions = [];
    localStorage.removeItem('walletData');
    localStorage.removeItem('transactions');
  }
}

export const walletService = new WalletService();