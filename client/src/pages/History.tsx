import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, Gift, Filter, Search, DollarSign } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useWallet } from '../hooks/useWallet';
import { type TransactionHistory } from '../lib/wallet';
import { currencyConverter } from '../lib/currencyConverter';
import { formatDistanceToNow } from 'date-fns';

interface HistoryProps {
  onNavigate: (screen: 'welcome' | 'import' | 'create' | 'dashboard' | 'calculator' | 'history' | 'settings') => void;
}

export default function History({ onNavigate }: HistoryProps) {
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'giveaway' | 'receive' | 'send'>('all');
  const [showNaira, setShowNaira] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wallet?.address) {
      fetchTransactions();
    }
  }, [wallet?.address]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, searchTerm, selectedFilter]);

  const fetchTransactions = async () => {
    if (!wallet?.address) return;

    try {
      setIsLoading(true);
      // Get transactions directly from wallet service (localStorage)
      const { walletService } = await import('../lib/wallet');
      const data = walletService.getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === selectedFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  };

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'pending') {
      return <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />;
    }

    switch (type) {
      case 'giveaway':
        return <Gift className="text-yellow-500" size={20} />;
      case 'receive':
        return <ArrowDownLeft className="text-green-500" size={20} />;
      case 'send':
        return <ArrowUpRight className="text-red-500" size={20} />;
      default:
        return <DollarSign className="text-blue-500" size={20} />;
    }
  };

  const getTransactionTitle = (type: string) => {
    switch (type) {
      case 'giveaway':
        return 'Giveaway Received';
      case 'receive':
        return 'Received';
      case 'send':
        return 'Sent';
      default:
        return 'Transaction';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'failed':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const formatAmount = (amount: number, amountUSD: number) => {
    if (showNaira) {
      return currencyConverter.formatCurrency(currencyConverter.convertUSDToNaira(amountUSD), 'NGN');
    }
    return `${amount.toFixed(4)} BNB`;
  };

  const formatSecondaryAmount = (amount: number, amountUSD: number) => {
    if (showNaira) {
      return currencyConverter.formatCurrency(amountUSD, 'USD');
    }
    return currencyConverter.formatCurrency(currencyConverter.convertUSDToNaira(amountUSD), 'NGN');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 pt-6 border-b border-gray-700/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold">Transaction History</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNaira(!showNaira)}
            className="flex items-center space-x-2 text-yellow-500 hover:bg-yellow-500/10 px-3 py-2"
          >
            <DollarSign size={16} />
            <span className="text-sm font-medium">{showNaira ? 'NGN' : 'USD'}</span>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/80 border-gray-600 text-white placeholder-gray-400 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-700 px-4 whitespace-nowrap"
          >
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'giveaway', 'receive', 'send'] as const).map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className={`capitalize flex-1 sm:flex-none min-w-[70px] ${
                selectedFilter === filter 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60 border-gray-600'
              }`}
            >
              {filter}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Transactions List */}
      <div className="p-4 space-y-3 max-w-lg mx-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-800/60 rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-16" />
                  </div>
                  <div className="text-right">
                    <div className="h-4 bg-gray-700 rounded w-20 mb-2" />
                    <div className="h-3 bg-gray-700 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Your transactions will appear here once you start using your wallet'
              }
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-effect border-gray-700 hover:border-yellow-500/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                        {getTransactionIcon(transaction.type, transaction.status)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">
                            {getTransactionTitle(transaction.type)}
                          </h4>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(transaction.status)}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {formatDistanceToNow(new Date(transaction.timestamp), { addSuffix: true })}
                        </p>
                        {transaction.txHash && (
                          <p className="text-gray-500 text-xs font-mono">
                            {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-6)}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'send' ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {transaction.type === 'send' ? '-' : '+'}
                          {formatAmount(transaction.amount, transaction.amountUSD)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {formatSecondaryAmount(transaction.amount, transaction.amountUSD)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Exchange Rate Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 border-t border-gray-800"
      >
        <div className="text-center text-gray-400 text-sm">
          <p>Exchange Rate: $1 USD = ₦{currencyConverter.getExchangeRate().toLocaleString()}</p>
          <p className="text-xs mt-1">Rates are approximate and may vary</p>
        </div>
      </motion.div>
    </div>
  );
}