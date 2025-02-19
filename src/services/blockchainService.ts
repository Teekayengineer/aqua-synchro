
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
    this.provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
    this.contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.provider
    ) as WaterContract;
  }

  private async initialize() {
    if (!this.initialized) {
      this.initialized = true;
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
      await tx.wait(); // Wait for transaction to be mined
    } catch (error) {
      console.error('Error updating water usage:', error);
    }
  }
}

export const blockchainService = new BlockchainService();
