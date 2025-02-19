
import { ethers } from 'ethers';
import type { ContractTransactionResponse } from 'ethers';

// ABI for the smart contract with added fine calculation
const contractABI = [
  {
    "inputs": [],
    "name": "getWaterUsage",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "updateWaterUsage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExcessUsageFine",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Define interface for the contract functions
interface WaterContract {
  getWaterUsage(): Promise<bigint>;
  updateWaterUsage(usage: number): Promise<ContractTransactionResponse>;
  getExcessUsageFine(): Promise<bigint>;
  connect(signer: ethers.Signer): ethers.Contract & WaterContract;
}

// Using a valid Ethereum address format
const contractAddress = "0x0000000000000000000000000000000000000000"; // Replace with your actual deployed contract address

const WATER_USAGE_LIMIT = 500; // 500ml limit
const FINE_RATE = 0.50; // 50 cents per ml over limit

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract & WaterContract;
  private initialized: boolean = false;

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.provider
    ) as ethers.Contract & WaterContract;
    
    this.contract = contract;
  }

  private async initialize() {
    if (!this.initialized) {
      try {
        await this.provider.getNetwork();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize blockchain service:', error);
        throw error;
      }
    }
  }

  async getWaterUsage(userAddress: string): Promise<number> {
    try {
      await this.initialize();
      const usage = await this.contract.getWaterUsage();
      return Number(usage);
    } catch (error) {
      console.error('Error fetching water usage:', error);
      return 0;
    }
  }

  async calculateExcessFine(usage: number): Promise<number> {
    if (usage <= WATER_USAGE_LIMIT) {
      return 0;
    }
    const excessUsage = usage - WATER_USAGE_LIMIT;
    return excessUsage * FINE_RATE;
  }

  async updateWaterUsage(usage: number): Promise<void> {
    try {
      await this.initialize();
      const fine = await this.calculateExcessFine(usage);
      
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer) as ethers.Contract & WaterContract;
      
      // Update water usage on the blockchain
      const tx = await contractWithSigner.updateWaterUsage(usage);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      // If there's a fine, log it (you might want to emit an event or store this information)
      if (fine > 0) {
        console.log(`Excess usage fine calculated: $${fine.toFixed(2)}`);
      }
    } catch (error) {
      console.error('Error updating water usage:', error);
      throw error;
    }
  }

  async getExcessUsageFine(): Promise<number> {
    try {
      await this.initialize();
      const fine = await this.contract.getExcessUsageFine();
      return Number(fine);
    } catch (error) {
      console.error('Error fetching excess usage fine:', error);
      return 0;
    }
  }
}

export const blockchainService = new BlockchainService();
