
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpCircle } from "lucide-react";
import { blockchainService } from "@/services/blockchainService";

export const RequestAllocation = () => {
  const [requestAmount, setRequestAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await blockchainService.requestAdditionalAllocation(
        Number(requestAmount),
        reason
      );
      
      toast({
        title: "Request Submitted",
        description: `Your request for ${requestAmount}L has been submitted for approval.`,
      });

      // Reset form
      setRequestAmount("");
      setReason("");
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit allocation request. Please try again.",
        variant: "destructive",
      });
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Card>
  );
};
