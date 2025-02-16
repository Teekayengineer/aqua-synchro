
import { Card } from "@/components/ui/card";
import { Droplet, AlertTriangle, Users } from "lucide-react";

export const WaterUsageStats = () => {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="p-6 glass-panel card-hover">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Daily Usage
            </p>
            <h3 className="text-2xl font-bold mt-2">12,450 L</h3>
          </div>
          <Droplet className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Across all blocks
        </p>
      </Card>

      <Card className="p-6 glass-panel card-hover">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Users
            </p>
            <h3 className="text-2xl font-bold mt-2">1,284</h3>
          </div>
          <Users className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          In 42 residential blocks
        </p>
      </Card>

      <Card className="p-6 glass-panel card-hover">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Alert Status
            </p>
            <h3 className="text-2xl font-bold mt-2">3 Blocks</h3>
          </div>
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Above usage threshold
        </p>
      </Card>
    </div>
  );
};
