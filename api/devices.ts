import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory storage for Vercel deployment
class SimpleStorage {
  private devices: Map<string, any> = new Map();
  private deviceCounter = 0;

  async createDevice(data: any) {
    const device = { 
      id: ++this.deviceCounter, 
      ...data, 
      createdAt: new Date().toISOString() 
    };
    this.devices.set(data.deviceId, device);
    return device;
  }

  async getDeviceByDeviceId(deviceId: string) {
    return this.devices.get(deviceId) || null;
  }

  async updateDevice(id: number, data: any) {
    for (const [key, device] of this.devices.entries()) {
      if (device.id === id) {
        const updated = { ...device, ...data };
        this.devices.set(key, updated);
        return updated;
      }
    }
    return null;
  }
}

const storage = new SimpleStorage();

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
      const { deviceId, activationCode, isActivated } = req.body;
      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID required' });
      }
      
      const device = await storage.createDevice({
        deviceId,
        activationCode: activationCode || '',
        isActivated: isActivated || false
      });
      res.status(201).json(device);
    } catch (error) {
      console.error('Error creating device:', error);
      res.status(400).json({ error: 'Invalid device data' });
    }
  } else if (req.method === 'GET') {
    const { deviceId } = req.query;
    if (deviceId && typeof deviceId === 'string') {
      try {
        const device = await storage.getDeviceByDeviceId(deviceId);
        if (device) {
          res.status(200).json(device);
        } else {
          res.status(404).json({ error: 'Device not found' });
        }
      } catch (error) {
        console.error('Error fetching device:', error);
        res.status(500).json({ error: 'Server error' });
      }
    } else {
      res.status(400).json({ error: 'Device ID required' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}