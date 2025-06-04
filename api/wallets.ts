import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple wallet storage for Vercel deployment
class WalletStorage {
  private wallets: Map<string, any> = new Map();
  private walletCounter = 0;

  async createWallet(data: any) {
    const wallet = { 
      id: ++this.walletCounter, 
      ...data, 
      createdAt: new Date().toISOString() 
    };
    this.wallets.set(data.address, wallet);
    return wallet;
  }

  async getWalletByAddress(address: string) {
    return this.wallets.get(address) || null;
  }

  async updateWallet(id: number, data: any) {
    for (const [key, wallet] of this.wallets.entries()) {
      if (wallet.id === id) {
        const updated = { ...wallet, ...data };
        this.wallets.set(key, updated);
        return updated;
      }
    }
    return null;
  }
}

const storage = new WalletStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { address, deviceId, balance, balanceUSD } = req.body;
      if (!address) {
        return res.status(400).json({ error: 'Wallet address required' });
      }
      
      const wallet = await storage.createWallet({
        address,
        deviceId: deviceId || 0,
        balance: balance || 0,
        balanceUSD: balanceUSD || 0
      });
      res.status(201).json(wallet);
    } catch (error) {
      console.error('Error creating wallet:', error);
      res.status(400).json({ error: 'Invalid wallet data' });
    }
  } else if (req.method === 'GET') {
    const { address } = req.query;
    if (address && typeof address === 'string') {
      try {
        const wallet = await storage.getWalletByAddress(address);
        if (wallet) {
          res.status(200).json(wallet);
        } else {
          res.status(404).json({ error: 'Wallet not found' });
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(400).json({ error: 'Wallet address required' });
    }
  } else if (req.method === 'PUT') {
    const { address } = req.query;
    if (address && typeof address === 'string') {
      try {
        const wallet = await storage.getWalletByAddress(address);
        if (!wallet) {
          return res.status(404).json({ error: 'Wallet not found' });
        }
        
        const updatedWallet = await storage.updateWallet(wallet.id, req.body);
        res.status(200).json(updatedWallet);
      } catch (error) {
        console.error('Error updating wallet:', error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(400).json({ error: 'Wallet address required' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}