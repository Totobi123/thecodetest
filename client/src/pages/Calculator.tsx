import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator as CalculatorIcon, DollarSign, TrendingUp } from 'lucide-react';
import { walletService, type GiveawayCalculation } from '@/lib/wallet';
import { useWallet } from '@/hooks/useWallet';
import { i18n } from '@/lib/i18n';

export default function Calculator() {
  const [balanceInput, setBalanceInput] = useState('');
  const [calculation, setCalculation] = useState<GiveawayCalculation | null>(null);
  const { wallet } = useWallet();

  const handleCalculate = () => {
    const balance = parseFloat(balanceInput);
    if (isNaN(balance) || balance <= 0) {
      return;
    }

    const result = walletService.calculateGiveaway(balance);
    setCalculation(result);
  };

  const useCurrentBalance = () => {
    if (wallet?.balance) {
      setBalanceInput(wallet.balance.toString());
      const result = walletService.calculateGiveaway(wallet.balance);
      setCalculation(result);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4 pb-24">
      <div className="max-w-lg mx-auto space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-4"
        >
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full shadow-lg">
              <CalculatorIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {i18n.translate('calculator')}
          </h1>
          <p className="text-gray-300 text-sm">
            Calculate your potential giveaway rewards
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-xl">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-3 block">
                    Enter your BNB balance
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="number"
                        step="0.001"
                        placeholder="0.000"
                        value={balanceInput}
                        onChange={(e) => setBalanceInput(e.target.value)}
                        className="bg-gray-700/80 border-gray-600 text-white placeholder-gray-400 text-lg py-3 pr-16 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 font-medium">
                        BNB
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleCalculate}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 text-white font-semibold shadow-lg"
                    disabled={!balanceInput || parseFloat(balanceInput) <= 0}
                  >
                    <CalculatorIcon className="mr-2 h-4 w-4" />
                    Calculate Rewards
                  </Button>
                  {wallet?.balance && (
                    <Button
                      onClick={useCurrentBalance}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 py-3 whitespace-nowrap"
                    >
                      Use Current ({wallet.balance.toFixed(4)} BNB)
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {calculation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Eligibility Status */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Eligibility Status</h3>
                  <Badge 
                    variant={calculation.isEligible ? "default" : "destructive"}
                    className={calculation.isEligible ? "bg-green-500 text-green-900" : ""}
                  >
                    {calculation.isEligible ? 'Eligible' : 'Not Eligible'}
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
                      ${(parseFloat(balanceInput) * 250 || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Eligibility</span>
                    <span className="text-white font-semibold">
                      {calculation.eligibilityPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        calculation.isEligible ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(calculation.eligibilityPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reward Details */}
            {calculation.isEligible && (
              <Card className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 backdrop-blur-sm border-purple-500/50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-6 w-6 text-purple-400 mr-2" />
                    <h3 className="text-lg font-semibold text-white">Reward Calculation</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Base Reward (5%)</span>
                      <span className="text-white font-semibold">
                        {calculation.baseReward.toFixed(4)} BNB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bonus Multiplier</span>
                      <span className="text-purple-400 font-semibold">
                        {calculation.bonusMultiplier}x
                      </span>
                    </div>
                    <div className="border-t border-gray-600 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Giveaway</span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">
                            {calculation.giveawayAmount.toFixed(4)} BNB
                          </div>
                          <div className="text-sm text-gray-400">
                            ≈ ${calculation.giveawayAmountUSD.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-900/30 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-300">
                        Higher balances earn bonus multipliers up to 1.5x
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Not Eligible Message */}
            {!calculation.isEligible && (
              <Card className="bg-red-900/20 backdrop-blur-sm border-red-500/50">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    Not Eligible for Giveaway
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You need at least $15.00 worth of BNB (≈0.06 BNB) to be eligible for the giveaway.
                  </p>
                  <p className="text-sm text-gray-400">
                    Current balance: ${(parseFloat(balanceInput) * 250).toFixed(2)} | 
                    Need: ${(15 - parseFloat(balanceInput) * 250).toFixed(2)} more
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}