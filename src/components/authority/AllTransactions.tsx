
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropletIcon } from "lucide-react";

const transactions = [
  {
    id: 1,
    address: "Block A, #123",
    usage: "245L",
    time: "2 hours ago",
    block: "Block A"
  },
  {
    id: 2,
    address: "Block B, #45",
    usage: "180L",
    time: "3 hours ago",
    block: "Block B"
  },
  {
    id: 3,
    address: "Block C, #78",
    usage: "310L",
    time: "4 hours ago",
    block: "Block C"
  },
  {
    id: 4,
    address: "Block A, #126",
    usage: "195L",
    time: "5 hours ago",
    block: "Block A"
  }
];

export const AllTransactions = () => {
  return (
    <Card className="p-6 glass-panel">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <DropletIcon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{tx.address}</p>
                  <p className="text-sm text-muted-foreground">{tx.block} • {tx.time}</p>
                </div>
              </div>
              <p className="font-medium">{tx.usage}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
