
import { Sidebar } from "@/components/authority/AuthoritySidebar";
import { WaterUsageStats } from "@/components/authority/AuthorityWaterStats";
import { AllTransactions } from "@/components/authority/AllTransactions";
import { ReportsSection } from "@/components/authority/ReportsSection";
import { AllocationRequests } from "@/components/authority/AllocationRequests";

const AuthorityDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 space-y-8">
          <WaterUsageStats />
          <AllocationRequests />
          <div className="grid md:grid-cols-2 gap-8">
            <AllTransactions />
            <ReportsSection />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
