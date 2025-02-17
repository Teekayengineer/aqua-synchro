
type WaterUsageData = {
  timestamp: number;
  usage: number;
  deviceId: string;
};

class IoTService {
  private ws: WebSocket | null = null;
  private listeners: ((data: WaterUsageData) => void)[] = [];

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    // Replace with your actual WebSocket endpoint
    this.ws = new WebSocket('YOUR_WEBSOCKET_ENDPOINT');

    this.ws.onmessage = (event) => {
      try {
        const data: WaterUsageData = JSON.parse(event.data);
        this.notifyListeners(data);
      } catch (error) {
        console.error('Error parsing IoT data:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.initializeWebSocket(), 5000);
    };
  }

  private notifyListeners(data: WaterUsageData) {
    this.listeners.forEach(listener => listener(data));
  }

  addListener(callback: (data: WaterUsageData) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (data: WaterUsageData) => void) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
}

export const iotService = new IoTService();
