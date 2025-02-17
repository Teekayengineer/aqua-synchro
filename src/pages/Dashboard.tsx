
import { Sidebar } from "@/components/Sidebar";
import { WaterUsageStats } from "@/components/WaterUsageStats";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ChartCard } from "@/components/ChartCard";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { blockchainService } from "@/services/blockchainService";
import { iotService } from "@/services/iotService";

const Dashboard = () => {
  const { toast } = useToast();
  const [currentUsage, setCurrentUsage] = useState(0);
  const threshold = 300;
  const warningThreshold = threshold * 0.8;

  useEffect(() => {
    // Initial blockchain data fetch
    const fetchBlockchainData = async () => {
      const usage = await blockchainService.getWaterUsage("USER_ADDRESS");
      setCurrentUsage(usage);
    };

    fetchBlockchainData();

    // Set up IoT real-time data listener
    const handleIoTData = (data: { usage: number }) => {
      setCurrentUsage(data.usage);
      
      // Update blockchain with new usage data
      blockchainService.updateWaterUsage(data.usage);

      // Check thresholds and show alerts
      if (data.usage >= warningThreshold) {
        const remainingLiters = threshold - data.usage;
        toast({
          title: "Water Usage Alert",
          description: `You have ${remainingLiters}L remaining in your daily limit. Consider reducing usage.`,
          variant: "destructive",
        });
      }
    };

    iotService.addListener(handleIoTData);

    // Cleanup
    return () => {
      iotService.removeListener(handleIoTData);
    };
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          <WaterUsageStats currentUsage={currentUsage} />
          <div className="grid md:grid-cols-2 gap-8">
            <ChartCard />
            <TransactionHistory />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
