import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple giveaway storage for Vercel deployment
class GiveawayStorage {
  private giveaways: Map<number, any> = new Map();
  private giveawayCounter = 0;

  async createGiveaway(data: any) {
    const giveaway = { 
      id: ++this.giveawayCounter, 
      ...data, 
      createdAt: new Date().toISOString() 
    };
    this.giveaways.set(giveaway.id, giveaway);
    return giveaway;
  }

  async getGiveawaysByWallet(walletId: number) {
    return Array.from(this.giveaways.values()).filter(g => g.walletId === walletId);
  }
}

const storage = new GiveawayStorage();

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
      const { walletId, amount, amountUSD, status } = req.body;
      if (!walletId || !amount) {
        return res.status(400).json({ error: 'Wallet ID and amount required' });
      }
      
      const giveaway = await storage.createGiveaway({
        walletId: parseInt(walletId),
        amount: parseFloat(amount),
        amountUSD: parseFloat(amountUSD) || 0,
        status: status || 'pending'
      });
      res.status(201).json(giveaway);
    } catch (error) {
      console.error('Error creating giveaway:', error);
      res.status(400).json({ error: 'Invalid giveaway data' });
    }
  } else if (req.method === 'GET') {
    const { walletId } = req.query;
    if (walletId && typeof walletId === 'string') {
      try {
        const giveaways = await storage.getGiveawaysByWallet(parseInt(walletId));
        res.status(200).json(giveaways);
      } catch (error) {
        console.error('Error fetching giveaways:', error);
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