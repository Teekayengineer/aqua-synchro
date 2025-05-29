
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const handleDownloadReport = (report: typeof reports[0]) => {
    // Generate mock CSV content for the report
    const csvContent = generateReportCSV(report);
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.name.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `${report.name} has been downloaded successfully.`,
    });
  };

  const generateReportCSV = (report: typeof reports[0]) => {
    const headers = ['Date', 'Location', 'Usage (L)', 'Status', 'Notes'];
    const sampleData = [
      ['2024-03-31', 'Block A-1', '1250', 'Normal', 'Within allocated limit'],
      ['2024-03-31', 'Block A-2', '1480', 'High', 'Approaching limit'],
      ['2024-03-31', 'Block B-1', '980', 'Normal', 'Efficient usage'],
      ['2024-03-31', 'Block B-2', '1650', 'Critical', 'Exceeded limit'],
      ['2024-03-31', 'Block C-1', '1100', 'Normal', 'Within allocated limit'],
    ];

    const csvRows = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ];

    return `Report: ${report.name}\nGenerated: ${new Date().toISOString()}\nType: ${report.type}\n\n${csvRows.join('\n')}`;
  };

  const handleNewReport = () => {
    toast({
      title: "New Report",
      description: "Report generation feature coming soon!",
    });
  };

  return (
    <Card className="p-6 glass-panel">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Generated Reports</h3>
        <Button size="sm" onClick={handleNewReport}>
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
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDownloadReport(report)}
                className="hover:bg-primary/10"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
