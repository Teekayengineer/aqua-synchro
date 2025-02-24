
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpCircle } from "lucide-react";

export const RequestAllocation = () => {
  const [requestAmount, setRequestAmount] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would typically make an API call to submit the request
    toast({
      title: "Request Submitted",
      description: `Your request for ${requestAmount}L has been submitted for approval.`,
    });

    // Reset form
    setRequestAmount("");
    setReason("");
  };

  return (
    <Card className="p-6 glass-panel">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <ArrowUpCircle className="h-5 w-5 text-primary" />
        Request Additional Allocation
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (in Liters)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount in liters"
            value={requestAmount}
            onChange={(e) => setRequestAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <div>
          <Label htmlFor="reason">Reason for Request</Label>
          <Input
            id="reason"
            placeholder="Brief explanation for additional allocation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Submit Request
        </Button>
      </form>
    </Card>
  );
};
