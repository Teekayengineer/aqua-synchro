
import { Card } from "@/components/ui/card";
import { Droplet, AlertTriangle, TrendingUp } from "lucide-react";

export const WaterUsageStats = () => {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="p-6 glass-panel card-hover">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Daily Usage
            </p>
            <h3 className="text-2xl font-bold mt-2">245 L</h3>
          </div>
          <Droplet className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          82% of daily limit
        </p>
      </Card>

      <Card className="p-6 glass-panel card-hover">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Weekly Average
            </p>
            <h3 className="text-2xl font-bold mt-2">1,720 L</h3>
          </div>
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          5% increase from last week
        </p>
      </Card>

      <Card className="p-6 glass-panel card-hover">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Contract Limit
            </p>
            <h3 className="text-2xl font-bold mt-2">300 L/day</h3>
          </div>
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          55 L remaining today
        </p>
      </Card>
    </div>
  );
};
