export class Web3Service {
  private static instance: Web3Service;
  private bnbPrice: number = 250; // Mock BNB price, should be fetched from API

  private constructor() {}

  static getInstance(): Web3Service {
    if (!Web3Service.instance) {
      Web3Service.instance = new Web3Service();
    }
    return Web3Service.instance;
  }

  // Validate BNB/BSC address format
  isValidBNBAddress(address: string): boolean {
    if (!address) return false;
    
    // Basic validation for Ethereum/BSC address format
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    return addressRegex.test(address);
  }

  // Get BNB balance for an address using BScan API
  async getBNBBalance(address: string): Promise<{ balance: number; balanceUSD: number }> {
    if (!this.isValidBNBAddress(address)) {
      throw new Error('Invalid BNB address format');
    }

    try {
      // Use BScan API to get real BNB balance
      const apiKey = 'Z9SHVAABWK9GQB3KUM786HE1HQYBBX75KB';
      const response = await fetch(`https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch balance from BScan');
      }

      const data = await response.json();
      
      if (data.status !== '1') {
        throw new Error('BScan API error: ' + data.message);
      }

      // Convert from Wei to BNB (1 BNB = 10^18 Wei)
      const balanceInWei = data.result;
      const balance = parseFloat(balanceInWei) / Math.pow(10, 18);
      
      // Get current BNB price for accurate USD calculation
      const currentPrice = await this.getBNBPrice();
      const balanceUSD = balance * currentPrice;

      return { balance, balanceUSD };
    } catch (error) {
      console.error('Error fetching BNB balance:', error);
      // Fallback to backend API if BScan fails
      try {
        const fallbackResponse = await fetch(`/api/wallet/balance/${address}`);
        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          return {
            balance: fallbackData.balance,
            balanceUSD: fallbackData.balance * this.bnbPrice
          };
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
      
      // Return zero balance as last resort
      return { balance: 0, balanceUSD: 0 };
    }
  }

  // Generate a new wallet address using proper cryptographic methods
  async generateWalletAddress(): Promise<{ address: string; privateKey: string }> {
    const { CryptoWallet } = await import('./crypto');
    return CryptoWallet.generateWallet();
  }

  // Import wallet from private key
  async importFromPrivateKey(privateKey: string): Promise<{ address: string; privateKey: string }> {
    const { CryptoWallet } = await import('./crypto');
    return CryptoWallet.importFromPrivateKey(privateKey);
  }

  // Get current BNB price from CoinGecko API
  async getBNBPrice(): Promise<number> {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd');
      if (response.ok) {
        const data = await response.json();
        this.bnbPrice = data.binancecoin.usd;
        return data.binancecoin.usd;
      }
    } catch (error) {
      console.error('Error fetching BNB price:', error);
    }
    
    return this.bnbPrice; // Return cached price as fallback
  }

  // Calculate transaction fees
  estimateTransactionFee(): number {
    // BSC transaction fees are typically very low
    return 0.0005; // 0.0005 BNB fee
  }
}

export const web3Service = Web3Service.getInstance();
