import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    api: {
      auth: '/api/auth',
      devices: '/api/devices', 
      wallets: '/api/wallets',
      giveaways: '/api/giveaways',
      transactions: '/api/transactions'
    }
  };

  res.status(200).json(healthCheck);
}