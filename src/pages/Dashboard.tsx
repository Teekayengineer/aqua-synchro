
import { Sidebar } from "@/components/Sidebar";
import { WaterUsageStats } from "@/components/WaterUsageStats";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ChartCard } from "@/components/ChartCard";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Dashboard = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Simulate checking water usage thresholds
    const currentUsage = 245; // This would come from your actual data
    const threshold = 300;
    const warningThreshold = threshold * 0.8;

    if (currentUsage >= warningThreshold) {
      const remainingLiters = threshold - currentUsage;
      toast({
        title: "Water Usage Alert",
        description: `You have ${remainingLiters}L remaining in your daily limit. Consider reducing usage.`,
        variant: "destructive",
      });
    }

    // Simulate checking for maintenance updates
    if (Math.random() > 0.5) { // Just for demonstration
      toast({
        title: "Scheduled Maintenance",
        description: "Water supply may be affected on Saturday between 2 AM - 4 AM due to routine maintenance.",
      });
    }
  }, []); // In a real app, this would depend on real-time data updates

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          <WaterUsageStats />
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
