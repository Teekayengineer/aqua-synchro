
import { Sidebar } from "@/components/Sidebar";
import { WaterUsageStats } from "@/components/WaterUsageStats";
import { TransactionHistory } from "@/components/TransactionHistory";
import { ChartCard } from "@/components/ChartCard";

const Dashboard = () => {
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
