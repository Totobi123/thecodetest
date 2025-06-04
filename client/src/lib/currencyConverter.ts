// Currency conversion utilities
export class CurrencyConverter {
  private static instance: CurrencyConverter;
  private readonly USD_TO_NGN_RATE = 1580; // Current approximate rate

  private constructor() {}

  static getInstance(): CurrencyConverter {
    if (!CurrencyConverter.instance) {
      CurrencyConverter.instance = new CurrencyConverter();
    }
    return CurrencyConverter.instance;
  }

  // Convert USD to Naira
  convertUSDToNaira(usdAmount: number): number {
    return usdAmount * this.USD_TO_NGN_RATE;
  }

  // Convert Naira to USD
  convertNairaToUSD(nairaAmount: number): number {
    return nairaAmount / this.USD_TO_NGN_RATE;
  }

  // Format currency based on type
  formatCurrency(amount: number, currency: 'USD' | 'NGN' | 'BNB'): string {
    switch (currency) {
      case 'USD':
        return `$${amount.toFixed(2)}`;
      case 'NGN':
        return `₦${amount.toLocaleString()}`;
      case 'BNB':
        return `${amount.toFixed(4)} BNB`;
      default:
        return amount.toString();
    }
  }

  // Get current exchange rate
  getExchangeRate(): number {
    return this.USD_TO_NGN_RATE;
  }

  // Convert balance to display format based on user preference
  convertBalance(usdAmount: number, showNaira: boolean = false): {
    primary: string;
    secondary: string;
  } {
    if (showNaira) {
      const nairaAmount = this.convertUSDToNaira(usdAmount);
      return {
        primary: this.formatCurrency(nairaAmount, 'NGN'),
        secondary: this.formatCurrency(usdAmount, 'USD')
      };
    } else {
      const nairaAmount = this.convertUSDToNaira(usdAmount);
      return {
        primary: this.formatCurrency(usdAmount, 'USD'),
        secondary: this.formatCurrency(nairaAmount, 'NGN')
      };
    }
  }
}

export const currencyConverter = CurrencyConverter.getInstance();