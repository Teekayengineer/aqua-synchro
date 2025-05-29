import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { allocationService, type AllocationRequest } from "@/services/allocationService";

export const AllocationRequests = () => {
  const [requests, setRequests] = useState<AllocationRequest[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock authority user
  const authorityUser = "Water Authority Admin";

  useEffect(() => {
    // Load all requests initially
    const loadRequests = () => {
      const allRequests = allocationService.getAllRequests();
      console.log("Loading requests in authority dashboard:", allRequests);
      setRequests(allRequests);
    };

    loadRequests();

    // Listen for updates with a more specific callback
    const handleRequestsUpdate = (updatedRequests: AllocationRequest[]) => {
      console.log("Authority dashboard received update:", updatedRequests);
      setRequests([...updatedRequests]);
    };

    allocationService.addListener(handleRequestsUpdate);

    // Also poll for updates every 2 seconds to ensure sync
    const interval = setInterval(loadRequests, 2000);

    return () => {
      allocationService.removeListener(handleRequestsUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleApprove = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      console.log("Approving request:", requestId);
      const success = allocationService.approveRequest(requestId, authorityUser);
      if (success) {
        toast({
          title: "Request Approved",
          description: "The water allocation request has been approved.",
        });
        // Force refresh
        const updatedRequests = allocationService.getAllRequests();
        setRequests([...updatedRequests]);
      } else {
        throw new Error("Failed to approve request");
      }
    } catch (error) {
      console.error("Error approving request:", error);
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      console.log("Declining request:", requestId);
      const success = allocationService.declineRequest(requestId, authorityUser);
      if (success) {
        toast({
          title: "Request Declined",
          description: "The water allocation request has been declined.",
        });
        // Force refresh
        const updatedRequests = allocationService.getAllRequests();
        setRequests([...updatedRequests]);
      } else {
        throw new Error("Failed to decline request");
      }
    } catch (error) {
      console.error("Error declining request:", error);
      toast({
        title: "Error",
        description: "Failed to decline the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
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
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'approved':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declined':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const processedRequests = requests.filter(req => req.status !== 'pending');

  console.log("Rendering requests - Total:", requests.length, "Pending:", pendingRequests.length, "Processed:", processedRequests.length);

  return (
    <Card className="p-6 glass-panel">
      <h3 className="font-semibold text-lg mb-6">Water Allocation Requests</h3>
      
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h4 className="font-medium text-orange-600 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Requests ({pendingRequests.length})
          </h4>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-orange-200 bg-orange-50/50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{request.userName}</span>
                      <span className="text-lg font-semibold text-primary">{request.amount}L</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{request.reason}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Requested: {new Date(request.requestDate).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(request.id)}
                      disabled={processingId === request.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingId === request.id ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDecline(request.id)}
                      disabled={processingId === request.id}
                    >
                      {processingId === request.id ? "Processing..." : "Decline"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedRequests.length > 0 && (
        <div>
          <h4 className="font-medium text-muted-foreground mb-4">
            Recent Decisions ({processedRequests.length})
          </h4>
          <div className="space-y-3">
            {processedRequests.slice(-5).reverse().map((request) => (
              <div key={request.id} className={`border rounded-lg p-3 ${getStatusColor(request.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    <span className="font-medium">{request.userName}</span>
                    <span className="text-sm">{request.amount}L</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {request.responseDate && new Date(request.responseDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No allocation requests yet</p>
        </div>
      )}
    </Card>
  );
};
