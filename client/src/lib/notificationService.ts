export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Show transaction notification
  async showTransactionNotification(
    type: 'receive' | 'send' | 'giveaway',
    amount: number,
    amountUSD: number,
    currency: 'BNB' | 'USD' = 'BNB'
  ): Promise<void> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const title = this.getNotificationTitle(type);
    const body = this.getNotificationBody(type, amount, amountUSD, currency);
    const icon = this.getNotificationIcon(type);

    // Show browser notification
    const notification = new Notification(title, {
      body,
      icon,
      badge: '/favicon.ico',
      tag: `transaction-${Date.now()}`,
      requireInteraction: true,
      silent: false
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Show in-app toast as well
    this.showInAppNotification(type, amount, amountUSD, currency);
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'receive':
        return '💰 Payment Received!';
      case 'send':
        return '📤 Payment Sent!';
      case 'giveaway':
        return '🎉 Giveaway Received!';
      default:
        return '💳 Transaction Complete';
    }
  }

  private getNotificationBody(
    type: string,
    amount: number,
    amountUSD: number,
    currency: 'BNB' | 'USD'
  ): string {
    const formattedAmount = currency === 'BNB' 
      ? `${amount.toFixed(4)} BNB ($${amountUSD.toFixed(2)})`
      : `$${amountUSD.toFixed(2)} (${amount.toFixed(4)} BNB)`;

    switch (type) {
      case 'receive':
        return `You received ${formattedAmount}`;
      case 'send':
        return `You sent ${formattedAmount}`;
      case 'giveaway':
        return `You received ${formattedAmount} from giveaway!`;
      default:
        return `Transaction of ${formattedAmount} completed`;
    }
  }

  private getNotificationIcon(type: string): string {
    // Return appropriate icon based on type
    return '/favicon.ico'; // Fallback to favicon
  }

  private showInAppNotification(
    type: string,
    amount: number,
    amountUSD: number,
    currency: 'BNB' | 'USD'
  ): void {
    // Create in-app notification element
    const notification = document.createElement('div');
    notification.className = `
      fixed top-4 right-4 z-50 bg-gray-900 border border-yellow-500/50 
      rounded-xl p-4 shadow-2xl max-w-sm transform transition-all duration-300
      translate-x-full opacity-0
    `;

    const formattedAmount = currency === 'BNB' 
      ? `${amount.toFixed(4)} BNB`
      : `$${amountUSD.toFixed(2)}`;

    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
          ${this.getInAppIcon(type)}
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-white text-sm">
            ${this.getNotificationTitle(type).replace(/[^\w\s]/gi, '')}
          </h4>
          <p class="text-gray-300 text-xs">
            ${type === 'send' ? '-' : '+'}${formattedAmount}
          </p>
        </div>
        <button class="text-gray-400 hover:text-white" onclick="this.parentElement.parentElement.remove()">
          ×
        </button>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentElement) {
          notification.parentElement.removeChild(notification);
        }
      }, 300);
    }, 5000);
  }

  private getInAppIcon(type: string): string {
    switch (type) {
      case 'receive':
        return '↓';
      case 'send':
        return '↑';
      case 'giveaway':
        return '🎁';
      default:
        return '$';
    }
  }

  // Convert USD to Naira
  convertUSDToNaira(usdAmount: number): number {
    const USD_TO_NGN_RATE = 1580; // Current rate
    return usdAmount * USD_TO_NGN_RATE;
  }

  // Show notification with Naira conversion
  async showTransactionNotificationWithNaira(
    type: 'receive' | 'send' | 'giveaway',
    amount: number,
    amountUSD: number
  ): Promise<void> {
    const nairaAmount = this.convertUSDToNaira(amountUSD);
    
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return;

    const title = this.getNotificationTitle(type);
    const body = `${this.getNotificationBody(type, amount, amountUSD, 'USD')} (₦${nairaAmount.toLocaleString()})`;
    
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `transaction-naira-${Date.now()}`,
      requireInteraction: true
    });

    setTimeout(() => notification.close(), 7000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export const notificationService = NotificationService.getInstance();