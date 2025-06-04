import { useState, useEffect } from 'react';
import { Users, Share2, Gift, Copy, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { referralService, ReferralData } from '../lib/referralService';
import { i18n } from '../lib/i18n';
import { motion } from 'framer-motion';

export default function ReferralSection() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [showReferralCode, setShowReferralCode] = useState(false);

  useEffect(() => {
    // Initialize or load referral data
    let data = referralService.getReferralData();
    if (!data) {
      // Check if user came from a referral link
      const referredBy = referralService.getReferralCodeFromUrl();
      data = referralService.initializeReferralData(referredBy ?? undefined);
    }
    setReferralData(data);
  }, []);

  const handleShareReferral = async () => {
    if (referralData) {
      await referralService.shareReferralCode(referralData.referralCode);
    }
  };

  const copyReferralCode = async () => {
    if (referralData) {
      try {
        await navigator.clipboard.writeText(referralData.referralCode);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = 'Referral code copied!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 2000);
      } catch (error) {
        console.error('Failed to copy referral code:', error);
      }
    }
  };

  if (!referralData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Referral Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-effect border-yellow-500/20">
          <CardContent className="p-4 text-center">
            <Users className="mx-auto mb-2 text-yellow-500" size={24} />
            <div className="text-2xl font-bold text-white">{referralData.referralsCount}</div>
            <div className="text-xs text-gray-400">{i18n.t('friendsReferred')}</div>
          </CardContent>
        </Card>

        <Card className="glass-effect border-green-500/20">
          <CardContent className="p-4 text-center">
            <DollarSign className="mx-auto mb-2 text-green-500" size={24} />
            <div className="text-2xl font-bold text-white">${referralData.totalEarnings}</div>
            <div className="text-xs text-gray-400">{i18n.t('referralBonus')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code Section */}
      <Card className="glass-effect border-yellow-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Gift className="text-yellow-500" size={20} />
            <span>{i18n.t('referralCode')}</span>
          </CardTitle>
          <p className="text-sm text-gray-400">{i18n.t('earnPerReferral')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Referral Code Display */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-800 rounded-lg p-3 font-mono text-yellow-400 text-center">
              {showReferralCode ? referralData.referralCode : '••••••••••••'}
            </div>
            <Button
              onClick={() => setShowReferralCode(!showReferralCode)}
              variant="ghost"
              size="sm"
              className="text-yellow-500 hover:bg-yellow-500/10"
            >
              {showReferralCode ? '👁️' : '👁️‍🗨️'}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={copyReferralCode}
              variant="outline"
              className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
            >
              <Copy size={16} className="mr-2" />
              {i18n.t('copy')}
            </Button>
            <Button
              onClick={handleShareReferral}
              className="btn-gradient text-black font-semibold"
            >
              <Share2 size={16} className="mr-2" />
              {i18n.t('share')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      {referralData.referralHistory.length > 0 && (
        <Card className="glass-effect border-gray-600/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referralData.referralHistory.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm text-white">
                      {transaction.referredUserAddress.substring(0, 8)}...
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-400">
                      +${transaction.rewardAmountUSD}
                    </div>
                    <div className="text-xs text-gray-400">
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Welcome Message for Referred Users */}
      {referralData.referredBy && (
        <Card className="glass-effect border-blue-500/20">
          <CardContent className="p-4 text-center">
            <Gift className="mx-auto mb-2 text-blue-500" size={24} />
            <div className="text-sm text-blue-400">
              Welcome! You were referred by: {referralData.referredBy}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Your referrer will earn $10 when you complete your first injection!
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}