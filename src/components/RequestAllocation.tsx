
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { allocationService, type AllocationRequest } from "@/services/allocationService";

export const RequestAllocation = () => {
  const [requestAmount, setRequestAmount] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRequests, setUserRequests] = useState<AllocationRequest[]>([]);
  const { toast } = useToast();

  // Mock user data - in real app, this would come from auth context
  const currentUser = { id: "user123", name: "John Doe" };

  useEffect(() => {
    // Load user's existing requests
    const requests = allocationService.getUserRequests(currentUser.id);
    setUserRequests(requests);

    // Listen for updates
    const handleRequestsUpdate = (allRequests: AllocationRequest[]) => {
      const userReqs = allRequests.filter(req => req.userId === currentUser.id);
      setUserRequests(userReqs);
    };

    allocationService.addListener(handleRequestsUpdate);

    return () => {
      allocationService.removeListener(handleRequestsUpdate);
    };
  }, [currentUser.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const request = allocationService.submitRequest(
        currentUser.id,
        currentUser.name,
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'declined':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
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

      {userRequests.length > 0 && (
        <Card className="p-6 glass-panel">
          <h3 className="font-semibold mb-4">Your Requests</h3>
          <div className="space-y-3">
            {userRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(request.status)}
                    <span className="font-medium">{request.amount}L</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Requested: {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
