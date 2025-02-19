
import { ethers } from 'ethers';

// ABI for the smart contract (this would be your actual contract ABI)
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
  }
] as const;

// Define interface for the contract functions
interface WaterContract extends ethers.BaseContract {
  getWaterUsage(): Promise<bigint>;
  updateWaterUsage(usage: number): Promise<ethers.ContractTransaction>;
}

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: WaterContract;
  private initialized: boolean = false;

  constructor() {
    // Using Sepolia testnet
    this.provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
    const contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.provider
    );
    
    // Cast the contract to our interface type after verifying it has the required functions
    if (typeof contract.getWaterUsage === 'function' && 
        typeof contract.updateWaterUsage === 'function') {
      this.contract = contract as WaterContract;
    } else {
      throw new Error('Contract does not implement required functions');
    }
  }

  private async initialize() {
    if (!this.initialized) {
      try {
        // Verify network connection
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

  async updateWaterUsage(usage: number): Promise<void> {
    try {
      await this.initialize();
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer) as WaterContract;
      const tx = await contractWithSigner.updateWaterUsage(usage);
      if (tx.wait) {
        await tx.wait(); // Wait for transaction to be mined
      }
    } catch (error) {
      console.error('Error updating water usage:', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
