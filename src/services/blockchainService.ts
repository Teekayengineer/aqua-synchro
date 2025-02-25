import { ethers } from 'ethers';
import type { ContractTransactionResponse } from 'ethers';

// Updated ABI to include constructor parameters
const contractABI = [
  {
    "inputs": [
      {"name": "initialLimit", "type": "uint256"},
      {"name": "fineRate", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
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
  },
  {
    "inputs": [{"type": "uint256"}, {"type": "string"}],
    "name": "requestAllocation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Define the contract interface with explicit types
interface WaterContractInterface extends ethers.BaseContract {
  getWaterUsage(): Promise<bigint>;
  updateWaterUsage(usage: number): Promise<ContractTransactionResponse>;
  getExcessUsageFine(): Promise<bigint>;
  requestAllocation(amount: number, reason: string): Promise<ContractTransactionResponse>;
  connect(signer: ethers.Signer): WaterContractInterface;
}

// Using environment variable for contract address
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || "";

const WATER_USAGE_LIMIT = 500; // 500ml limit
const FINE_RATE = 50; // 50 basis points (0.50) per ml over limit

class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: WaterContractInterface;
  private initialized: boolean = false;

  constructor() {
    // Use environment variable for Infura key
    const infuraKey = import.meta.env.VITE_INFURA_KEY || "";
    this.provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${infuraKey}`);
    
    if (!contractAddress) {
      console.error('Contract address not set in environment variables');
    }

    this.contract = new ethers.Contract(
      contractAddress,
      contractABI,
      this.provider
    ) as WaterContractInterface;
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

  // Helper method to deploy the contract (useful for testing)
  async deployContract() {
    try {
      const signer = await this.provider.getSigner();
      const factory = new ethers.ContractFactory(contractABI, contractBytecode, signer);
      
      // Deploy with constructor parameters
      const contract = await factory.deploy(
        WATER_USAGE_LIMIT, // Initial limit in ml
        FINE_RATE // Fine rate in basis points
      );
      
      await contract.waitForDeployment();
      console.log('Contract deployed at:', await contract.getAddress());
      return contract.getAddress();
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
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
      const contractWithSigner = this.contract.connect(signer);
      
      // Update water usage on the blockchain
      const tx = await contractWithSigner.updateWaterUsage(usage);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      // If there's a fine, log it
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

  async requestAdditionalAllocation(amount: number, reason: string): Promise<void> {
    try {
      await this.initialize();
      const signer = await this.provider.getSigner();
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.requestAllocation(amount, reason);
      const receipt = await tx.wait();
      
      if (!receipt) {
        throw new Error('Transaction failed');
      }

      console.log('Allocation request submitted successfully');
    } catch (error) {
      console.error('Error requesting allocation:', error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
