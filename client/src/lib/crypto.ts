import { ethers } from 'ethers';

// Crypto utilities for wallet generation and management using ethers.js
export class CryptoWallet {
  
  // Generate a random wallet using ethers
  static generateWallet(): { privateKey: string; address: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      privateKey: wallet.privateKey,
      address: wallet.address
    };
  }

  // Import wallet from private key
  static importFromPrivateKey(privateKey: string): { privateKey: string; address: string } {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return {
        privateKey: wallet.privateKey,
        address: wallet.address
      };
    } catch (error) {
      throw new Error('Invalid private key format');
    }
  }

  // Validate private key format
  static isValidPrivateKey(privateKey: string): boolean {
    try {
      new ethers.Wallet(privateKey);
      return true;
    } catch {
      return false;
    }
  }

  // Validate BNB address format
  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  // Convert private key to address
  static privateKeyToAddress(privateKey: string): string {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return wallet.address;
    } catch (error) {
      throw new Error('Invalid private key');
    }
  }

  // Generate seed phrase (12 words) for wallet backup
  static generateSeedPhrase(): string[] {
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
      'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
      'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
      'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
      'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
      'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among'
    ];

    const seedPhrase: string[] = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      seedPhrase.push(words[randomIndex]);
    }
    
    return seedPhrase;
  }
}