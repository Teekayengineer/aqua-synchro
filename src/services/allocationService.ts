
export interface AllocationRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  requestDate: string;
  responseDate?: string;
  responseBy?: string;
}

class AllocationService {
  private requests: AllocationRequest[] = [];
  private listeners: ((requests: AllocationRequest[]) => void)[] = [];

  // Generate a unique ID for requests
  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Submit a new allocation request
  submitRequest(userId: string, userName: string, amount: number, reason: string): AllocationRequest {
    const newRequest: AllocationRequest = {
      id: this.generateId(),
      userId,
      userName,
      amount,
      reason,
      status: 'pending',
      requestDate: new Date().toISOString(),
    };

    this.requests.push(newRequest);
    this.notifyListeners();
    return newRequest;
  }

  // Get all requests (for authority dashboard)
  getAllRequests(): AllocationRequest[] {
    return [...this.requests];
  }

  // Get requests for a specific user
  getUserRequests(userId: string): AllocationRequest[] {
    return this.requests.filter(req => req.userId === userId);
  }

  // Approve a request
  approveRequest(requestId: string, responseBy: string): boolean {
    const request = this.requests.find(req => req.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'approved';
      request.responseDate = new Date().toISOString();
      request.responseBy = responseBy;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Decline a request
  declineRequest(requestId: string, responseBy: string): boolean {
    const request = this.requests.find(req => req.id === requestId);
    if (request && request.status === 'pending') {
      request.status = 'declined';
      request.responseDate = new Date().toISOString();
      request.responseBy = responseBy;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // Add listener for real-time updates
  addListener(callback: (requests: AllocationRequest[]) => void) {
    this.listeners.push(callback);
  }

  // Remove listener
  removeListener(callback: (requests: AllocationRequest[]) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.requests));
  }
}

export const allocationService = new AllocationService();
