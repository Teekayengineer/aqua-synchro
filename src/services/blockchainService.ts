
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
];

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with actual contract address

class BlockchainService {
  private provider: ethers.Provider;
  private contract: ethers.Contract;

  constructor() {
    // Connect to Ethereum network (replace with your network)
    this.provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
    this.contract = new ethers.Contract(contractAddress, contractABI, this.provider);
  }

  async getWaterUsage(userAddress: string): Promise<number> {
    try {
      const usage = await this.contract.getWaterUsage();
      return Number(usage);
    } catch (error) {
      console.error('Error fetching water usage:', error);
      return 0;
    }
  }

  async updateWaterUsage(usage: number): Promise<void> {
    try {
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      await contractWithSigner.updateWaterUsage(usage);
    } catch (error) {
      console.error('Error updating water usage:', error);
    }
  }
}

export const blockchainService = new BlockchainService();
