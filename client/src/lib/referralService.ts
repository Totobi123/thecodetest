import { deviceAuthService } from './deviceAuth';
import { notificationService } from './notificationService';

export interface ReferralData {
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  totalEarnings: number;
  referralHistory: ReferralTransaction[];
}

export interface ReferralTransaction {
  id: string;
  referredUserId: string;
  referredUserAddress: string;
  rewardAmount: number;
  rewardAmountUSD: number;
  timestamp: string;
  status: 'pending' | 'completed';
}

export class ReferralService {
  private static instance: ReferralService;
  private referralData: ReferralData | null = null;
  private readonly REFERRAL_REWARD_USD = 10; // $10 per referral

  private constructor() {}

  static getInstance(): ReferralService {
    if (!ReferralService.instance) {
      ReferralService.instance = new ReferralService();
    }
    return ReferralService.instance;
  }

  // Generate unique referral code for user
  generateReferralCode(): string {
    const deviceId = deviceAuthService.getDeviceId();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 6);
    return `REF${deviceId.substring(0, 4)}${timestamp}${random}`.toUpperCase();
  }

  // Initialize referral data for user
  initializeReferralData(referredBy?: string): ReferralData {
    const referralCode = this.generateReferralCode();
    
    this.referralData = {
      referralCode,
      referredBy,
      referralsCount: 0,
      totalEarnings: 0,
      referralHistory: []
    };

    // Save to localStorage
    localStorage.setItem('referral-data', JSON.stringify(this.referralData));
    
    // If user was referred by someone, process the referral reward
    if (referredBy) {
      this.processReferralReward(referredBy);
    }

    return this.referralData;
  }

  // Get current referral data
  getReferralData(): ReferralData | null {
    if (!this.referralData) {
      const saved = localStorage.getItem('referral-data');
      if (saved) {
        this.referralData = JSON.parse(saved);
      }
    }
    return this.referralData;
  }

  // Process referral reward when someone uses a referral code
  private async processReferralReward(referrerCode: string): Promise<void> {
    try {
      const newUserAddress = deviceAuthService.getUserId();
      
      const referralTransaction: ReferralTransaction = {
        id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        referredUserId: deviceAuthService.getUserId(),
        referredUserAddress: newUserAddress,
        rewardAmount: this.REFERRAL_REWARD_USD / 250, // Convert to BNB
        rewardAmountUSD: this.REFERRAL_REWARD_USD,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };

      // Send referral reward to backend
      await this.sendReferralReward(referrerCode, referralTransaction);

      // Show notification to referrer if they're currently active
      await this.notifyReferralSuccess(referrerCode, referralTransaction);

    } catch (error) {
      console.error('Failed to process referral reward:', error);
    }
  }

  // Send referral reward to backend
  private async sendReferralReward(referrerCode: string, transaction: ReferralTransaction): Promise<void> {
    try {
      const response = await fetch('/api/referral/reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referrerCode,
          transaction,
          deviceId: deviceAuthService.getDeviceId()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send referral reward');
      }

      const result = await response.json();
      console.log('Referral reward processed:', result);
    } catch (error) {
      console.error('Error sending referral reward:', error);
    }
  }

  // Notify referrer of successful referral
  private async notifyReferralSuccess(referrerCode: string, transaction: ReferralTransaction): Promise<void> {
    try {
      // Show notification if referrer is currently using the app
      await notificationService.showTransactionNotificationWithNaira(
        'receive',
        transaction.rewardAmount,
        transaction.rewardAmountUSD
      );

      // Create custom referral notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Referral Reward!', {
          body: `You earned $${transaction.rewardAmountUSD} for referring a friend! Your referral code: ${referrerCode}`,
          icon: '/favicon.ico',
          tag: 'referral-reward'
        });
      }
    } catch (error) {
      console.error('Failed to notify referral success:', error);
    }
  }

  // Add new referral when someone uses user's code
  addReferral(referredUserAddress: string): void {
    if (!this.referralData) return;

    const transaction: ReferralTransaction = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      referredUserId: `user_${Date.now()}`,
      referredUserAddress,
      rewardAmount: this.REFERRAL_REWARD_USD / 250,
      rewardAmountUSD: this.REFERRAL_REWARD_USD,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    this.referralData.referralsCount += 1;
    this.referralData.totalEarnings += this.REFERRAL_REWARD_USD;
    this.referralData.referralHistory.push(transaction);

    // Save updated data
    localStorage.setItem('referral-data', JSON.stringify(this.referralData));
  }

  // Validate referral code format
  isValidReferralCode(code: string): boolean {
    return /^REF[A-Z0-9]{8,16}$/.test(code);
  }

  // Generate referral link
  generateReferralLink(referralCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  }

  // Get referral code from URL
  getReferralCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    return refCode && this.isValidReferralCode(refCode) ? refCode : null;
  }

  // Share referral code
  async shareReferralCode(referralCode: string): Promise<void> {
    const referralLink = this.generateReferralLink(referralCode);
    const shareText = `Join me on this amazing crypto airdrop platform and earn free BNB! Use my referral code: ${referralCode}\n\n${referralLink}`;

    try {
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: 'Join Crypto Airdrop Platform',
          text: shareText,
          url: referralLink
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        
        // Show toast notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Referral link copied to clipboard!';
        if (document.body) {
          document.body.appendChild(notification);
        }
        
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to share referral code:', error);
    }
  }

  // Calculate potential earnings
  calculatePotentialEarnings(referralsCount: number): number {
    return referralsCount * this.REFERRAL_REWARD_USD;
  }
}

export const referralService = ReferralService.getInstance();