export class DeviceAuthService {
  private static instance: DeviceAuthService;
  private deviceId: string | null = null;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): DeviceAuthService {
    if (!DeviceAuthService.instance) {
      DeviceAuthService.instance = new DeviceAuthService();
    }
    return DeviceAuthService.instance;
  }

  // Generate a unique device ID (Base64 encoded random string)
  generateDeviceId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2);
    const deviceInfo = navigator.userAgent.slice(-10);
    const combined = timestamp + random + deviceInfo;
    const base64 = btoa(combined)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return base64;
  }

  // Generate a unique user ID for Telegram tracking
  generateUserId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `USR_${timestamp}_${random}`.toUpperCase();
  }

  // Get or create device ID for this device
  getDeviceId(): string {
    if (this.deviceId) {
      return this.deviceId;
    }

    // Check if device ID exists in localStorage
    const storedDeviceId = localStorage.getItem('deviceId');
    if (storedDeviceId) {
      this.deviceId = storedDeviceId;
      return storedDeviceId;
    }

    // Generate new device ID and store it
    const newDeviceId = this.generateDeviceId();
    localStorage.setItem('deviceId', newDeviceId);
    this.deviceId = newDeviceId;
    return newDeviceId;
  }

  // Get or create user ID for Telegram tracking
  getUserId(): string {
    if (this.userId) {
      return this.userId;
    }

    // Check if user ID exists in localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = storedUserId;
      return storedUserId;
    }

    // Generate new user ID and store it
    const newUserId = this.generateUserId();
    localStorage.setItem('userId', newUserId);
    this.userId = newUserId;
    return newUserId;
  }

  // Decode device ID to get activation code
  decodeDeviceId(deviceId: string): string {
    try {
      const decoded = atob(deviceId.replace(/-/g, '+').replace(/_/g, '/'));
      return decoded; // Return the full decoded string as activation code
    } catch (error) {
      throw new Error('Invalid device ID');
    }
  }

  // Verify activation code against device ID
  verifyActivationCode(deviceId: string, activationCode: string): boolean {
    try {
      const expectedCode = this.decodeDeviceId(deviceId);
      return expectedCode === activationCode;
    } catch {
      return false;
    }
  }

  // Check if device is activated
  isDeviceActivated(): boolean {
    return localStorage.getItem('deviceActivated') === 'true';
  }

  // Set device as activated
  setDeviceActivated(): void {
    localStorage.setItem('deviceActivated', 'true');
  }

  // Clear device data (logout)
  clearDeviceData(): void {
    localStorage.removeItem('deviceId');
    localStorage.removeItem('userId');
    localStorage.removeItem('deviceActivated');
    this.deviceId = null;
    this.userId = null;
  }
}

export const deviceAuthService = DeviceAuthService.getInstance();