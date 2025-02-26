import ls from "localstorage-slim";

export interface WorldMapResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
}

class WorldMapService {
  private subscribers: ((data: any) => void)[] = [];

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(data: any): void {
    this.subscribers.forEach((callback) => callback(data));
  }

  async getCategory(): Promise<WorldMapResponse<any>> {
    try {
      // Notify subscribers about coverage header update
      this.notifySubscribers({ type: "GET_COVERAGE_HEADER" });

      return {
        success: true,
        loading: false,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        loading: false,
      };
    }
  }

  // Additional methods can be added here for future worldmap functionality
  // For example:
  // - getCoverageData
  // - getRegionDetails
  // - updateCoverage
}

export const worldMapService = new WorldMapService();
