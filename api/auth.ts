import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple device storage for Vercel deployment
class DeviceStorage {
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

const storage = new DeviceStorage();

function decodeDeviceId(deviceId: string): string {
  try {
    return Buffer.from(deviceId, 'base64').toString('utf-8');
  } catch {
    return deviceId;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
  
  if (pathname === '/api/auth/register-device' && req.method === 'POST') {
    try {
      const { deviceId, activationCode } = req.body;
      
      if (!deviceId || !activationCode) {
        return res.status(400).json({ error: 'Device ID and activation code required' });
      }

      const decodedDeviceId = decodeDeviceId(deviceId);
      const expectedActivationCode = decodedDeviceId.slice(0, 6);
      
      if (activationCode !== expectedActivationCode) {
        return res.status(400).json({ error: 'Invalid activation code' });
      }

      let device = await storage.getDeviceByDeviceId(deviceId);
      
      if (!device) {
        device = await storage.createDevice({
          deviceId,
          isActivated: true,
          activationCode
        });
      } else {
        device = await storage.updateDevice(device.id, { isActivated: true });
      }

      res.status(200).json({
        message: 'Device registered and activated successfully',
        device
      });
    } catch (error) {
      console.error('Error registering device:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (pathname === '/api/auth/verify-device' && req.method === 'POST') {
    try {
      const { deviceId } = req.body;
      
      if (!deviceId) {
        return res.status(400).json({ error: 'Device ID required' });
      }

      const device = await storage.getDeviceByDeviceId(deviceId);
      
      if (!device || !device.isActivated) {
        return res.status(404).json({ error: 'Device not found or not activated' });
      }

      res.status(200).json({
        message: 'Device verified successfully',
        device
      });
    } catch (error) {
      console.error('Error verifying device:', error);
      res.status(500).json({ error: 'Server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}