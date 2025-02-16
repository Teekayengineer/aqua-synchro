
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Download } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Monthly Usage Report - March 2024",
    type: "Monthly",
    date: "Mar 31, 2024"
  },
  {
    id: 2,
    name: "Block A Detailed Analysis",
    type: "Block",
    date: "Mar 30, 2024"
  },
  {
    id: 3,
    name: "High Usage Alert Report",
    type: "Alert",
    date: "Mar 29, 2024"
  },
  {
    id: 4,
    name: "Weekly Summary",
    type: "Weekly",
    date: "Mar 28, 2024"
  }
];

export const ReportsSection = () => {
  return (
    <Card className="p-6 glass-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Generated Reports</h3>
        <Button size="sm">
          <FileText className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.date}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
