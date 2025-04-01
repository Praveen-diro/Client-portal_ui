import axios, { AxiosResponse } from "axios";
import { cookies } from "./cookie.service";
import { axiosService } from "./axios.service";
import { refreshAuthService } from "./refreshAuth.service";
import { logService } from "./logs.service";

// Declare the loadingSubscribers property on the Window interface
declare global {
  interface Window {
    loadingSubscribers?: ((isLoading: boolean) => void)[];
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
  message?: string;
}

class ApiService {
  private retryCount: { [key: string]: number } = {};
  private readonly DEFAULT_MAX_RETRY_COUNT = 3;

  /**
   * Makes an API request with automatic token refresh on 401/403 errors
   * @param url The API endpoint URL
   * @param data The request payload
   * @param retryKey Optional key to track retry attempts for this specific request
   * @param maxRetryCount Maximum number of retry attempts (defaults to 3)
   * @param shouldSetLoading Whether to update global loading state
   * @param shouldLog Whether to log errors
   * @returns Promise with standardized API response
   */
  async makeRequest<T>(
    url: string,
    data: any,
    retryKey?: string,
    maxRetryCount: number = this.DEFAULT_MAX_RETRY_COUNT,
    shouldSetLoading: boolean = false,
    shouldLog: boolean = true
  ): Promise<ApiResponse<T>> {
    // Update loading state if requested
    if (shouldSetLoading && typeof window !== "undefined") {
      this.setLoading(true);
    }

    try {
      // Ensure authorization headers are set
      axiosService.setupAxiosDefaults();

      // Make the API request
      const response = await axios.post(url, data);

      // Reset retry count on success
      if (retryKey) {
        this.retryCount[retryKey] = 0;
      }

      // Reset loading state
      if (shouldSetLoading && typeof window !== "undefined") {
        this.setLoading(false);
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      // Handle token refresh for 401/403 errors
      if (
        cookies.get("refreshToken") &&
        (error.response?.status === 401 ||
          error.response?.status === 403 ||
          error.message === "Network Error" ||
          error.message === "Request failed with status code 401") &&
        retryKey &&
        (!this.retryCount[retryKey] || this.retryCount[retryKey] < maxRetryCount)
      ) {
        // Initialize or increment retry count
        if (!this.retryCount[retryKey]) {
          this.retryCount[retryKey] = 0;
        }
        this.retryCount[retryKey]++;

        console.log(`Attempting to refresh token for: ${retryKey} - Attempt: ${this.retryCount[retryKey]}`);

        try {
          // Attempt to refresh the token
          await refreshAuthService.refreshAuth(async () => {
            return { success: true };
          }, false);

          // Update axios defaults with new token
          axiosService.setupAxiosDefaults();

          console.log("Token refreshed successfully, retrying request");

          // Retry the request
          return this.makeRequest(url, data, retryKey, maxRetryCount, shouldSetLoading, shouldLog);
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
        }
      }

      // Reset retry count
      if (retryKey) {
        this.retryCount[retryKey] = 0;
      }

      // Reset loading state
      if (shouldSetLoading && typeof window !== "undefined") {
        this.setLoading(false);
      }

      // Log the error if requested
      if (shouldLog) {
        await logService.sendLogs(`API Request Failed: ${url}`, error.response || error.message, "api.service.ts");
      }

      return {
        success: false,
        error: error.response?.data || error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Makes an API request using refreshAuth to handle token refresh
   * @param url The API endpoint URL
   * @param data The request payload
   * @returns Promise with standardized API response
   */
  async makeRefreshAuthRequest<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      // First attempt the request without automatic token refresh
      axiosService.setupAxiosDefaults();
      const response = await axios.post<T>(url, data);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      // Only attempt token refresh for 401/403 errors
      if (cookies.get("refreshToken") && (error.response?.status === 401 || error.response?.status === 403)) {
        try {
          // Attempt to refresh the token
          await refreshAuthService.refreshAuth(async () => {
            return { success: true };
          }, false);

          // Retry the request with the new token
          axiosService.setupAxiosDefaults();
          const response = await axios.post<T>(url, data);

          return {
            success: true,
            data: response.data,
          };
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
        }
      }

      console.error("Request failed:", error);
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Makes a GET API request using refreshAuth to handle token refresh
   * @param url The API endpoint URL
   * @param params Optional query parameters
   * @returns Promise with standardized API response
   */
  async makeRefreshAuthGetRequest<T>(url: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    // Convert params to query string
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join("&");

    // Build full URL with query parameters
    const fullUrl = `${url}${queryString ? `?${queryString}` : ""}`;

    try {
      // First attempt the request without automatic token refresh
      axiosService.setupAxiosDefaults();
      const response = await axios.get<T>(fullUrl);

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      // Handle network errors specifically
      if (error.message === "Network Error") {
        console.error(`Network error during request to ${url}:`, error);
        return {
          success: false,
          error: {
            message: "Unable to connect to the server. Please check your internet connection or try again later.",
            statusCode: "NETWORK_ERROR",
            originalError: error.message,
          },
        };
      }

      // Only attempt token refresh for 401/403 errors
      if (cookies.get("refreshToken") && (error.response?.status === 401 || error.response?.status === 403)) {
        try {
          // Attempt to refresh the token
          await refreshAuthService.refreshAuth(async () => {
            return { success: true };
          }, false);

          // Retry the request with the new token
          axiosService.setupAxiosDefaults();
          const response = await axios.get<T>(fullUrl);

          return {
            success: true,
            data: response.data,
          };
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError);
        }
      }

      console.error(`GET request failed to ${url}:`, error);
      return {
        success: false,
        error: error.response?.data || {
          message: error.message || "An unknown error occurred",
          statusCode: error.response?.status || "UNKNOWN_ERROR",
        },
      };
    }
  }

  // Helper method to update loading state
  private setLoading(isLoading: boolean): void {
    // This is a placeholder - the actual implementation would depend on your loading state management
    // For example, if you're using a global loading state with subscribers:
    if (typeof window !== "undefined" && window.loadingSubscribers) {
      window.loadingSubscribers.forEach((callback) => callback(isLoading));
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
