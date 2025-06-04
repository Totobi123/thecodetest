import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple transaction storage for Vercel deployment
class TransactionStorage {
  private transactions: Map<number, any> = new Map();
  private transactionCounter = 0;

  async createTransaction(data: any) {
    const transaction = { 
      id: ++this.transactionCounter, 
      ...data, 
      createdAt: new Date().toISOString() 
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  async getTransactionsByWallet(walletId: number) {
    return Array.from(this.transactions.values()).filter(t => t.walletId === walletId);
  }
}

const storage = new TransactionStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { walletId, type, amount, amountUSD, status } = req.body;
      if (!walletId || !type || !amount) {
        return res.status(400).json({ error: 'Wallet ID, type, and amount required' });
      }
      
      const transaction = await storage.createTransaction({
        walletId: parseInt(walletId),
        type,
        amount: parseFloat(amount),
        amountUSD: parseFloat(amountUSD) || 0,
        status: status || 'completed',
        timestamp: new Date().toISOString()
      });
      res.status(201).json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      res.status(400).json({ error: 'Invalid transaction data' });
    }
  } else if (req.method === 'GET') {
    const { walletId } = req.query;
    if (walletId && typeof walletId === 'string') {
      try {
        const transactions = await storage.getTransactionsByWallet(parseInt(walletId));
        res.status(200).json(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(400).json({ error: 'Wallet ID required' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}