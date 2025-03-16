import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";
import { logService } from "./logs.service";
import { cookies } from "./cookie.service";
import { axiosService } from "./axios.service";
import { apiService, ApiResponse } from "./api.service";

ls.config.encrypt = true;

// Global loading state for components to subscribe to
let loadingSubscribers: ((isLoading: boolean) => void)[] = [];

/**
 * Subscribe to loading state changes across the application
 * @param callback Function to call when loading state changes
 * @returns Unsubscribe function
 */
export const subscribeToLoading = (callback: (isLoading: boolean) => void): (() => void) => {
  loadingSubscribers.push(callback);
  return () => {
    loadingSubscribers = loadingSubscribers.filter((sub) => sub !== callback);
  };
};

/**
 * Update loading state and notify all subscribers
 * @param isLoading Current loading state
 */
const setLoading = (isLoading: boolean) => {
  loadingSubscribers.forEach((callback) => callback(isLoading));
};

// Make loadingSubscribers available globally for the apiService
if (typeof window !== "undefined") {
  (window as any).loadingSubscribers = loadingSubscribers;
}

export interface UserResponse<T> extends ApiResponse<T> {}

export interface UserFormData {
  emailId: string;
  email?: string;
  password?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  apiKey?: string;
  adminEmail?: string;
  country?: string;
  _id?: string;
  [key: string]: any;
}

class UsersService {
  private subscribers: ((data: any) => void)[] = [];
  private retryCount: { [key: string]: number } = {};
  private MAX_RETRY_COUNT = 3;

  constructor() {
    axiosService.setupAxiosDefaults();
  }

  private getApiKey(): string {
    const emailCookies= cookies.get("apikey")
    console.log('email cookies',emailCookies)
    return cookies.get("apikey") as string;
  }

  private generateRandomPassword(): string {
    const randomStr = (Math.random() + 1).toString(36).substring(7);
    const rA = ["a", "d", "f", "x", "g", "h"];
    const rB = ["A", "S", "D", "K", "F", "G"];
    const rC = ["#", "@", "$", "!"];
    const rD = ["2", "4", "5", "1", "6", "8"];
    const rS =
      rA[Math.floor(Math.random() * rA.length)] +
      rB[Math.floor(Math.random() * rB.length)] +
      rC[Math.floor(Math.random() * rC.length)] +
      rD[Math.floor(Math.random() * rD.length)];

    return randomStr + rS + "@";
  }

  private async makeRequest<T>(url: string, data: any, retryKey?: string): Promise<UserResponse<T>> {
    // Only add apiKey if it's not already in the data
    const requestData = data.apiKey ? data : { ...data, apiKey: this.getApiKey() };

    return apiService.makeRequest<T>(url, requestData, retryKey, this.MAX_RETRY_COUNT, true, true);
  }

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(data: any): void {
    this.subscribers.forEach((callback) => callback(data));
  }

  async addUser(formData: UserFormData): Promise<UserResponse<any>> {
    formData.password = this.generateRandomPassword();

    const response = await this.makeRequest(env.addWorker, formData, `addUser-${formData.emailId}`);

    if (response.success) {
      await logService.sendLogs("addUser", "addUser success", "users.service.ts");
      this.notifySubscribers({ type: "ADD_USER", data: response.data });
      await this.getUsers(); // Refresh users list
    }

    return response;
  }

  async getUsers(): Promise<UserResponse<any>> {
    const json = { emailId: cookies.get("email") };
    try {
      const response = await this.makeRequest(env.getWorkersList, json, "getUsers");

      // Check if response has error property using type assertion
      const responseData = response.data as Record<string, any>;
      if (response.success && responseData && responseData.error === true) {
        return { success: false, error: responseData };
      }

      // Ensure the response data has the proper format for the Redux store
      if (response.success && !responseData.workers) {
        // If the response is successful but doesn't have the expected format,
        // transform it to match what the Redux store expects
        const formattedData = {
          workers: Array.isArray(responseData) ? responseData : [],
          error: null,
          ownerEmail: cookies.get("email") || "",
        };
        this.notifySubscribers({ type: "GET_USERS", data: formattedData });
        return { success: true, data: formattedData };
      }

      this.notifySubscribers({ type: "GET_USERS", data: response.data });
      return response;
    } catch (error: any) {
      // Log the error
      await logService.sendLogs("getUsers Failed", error, "users.service.ts");

      // Return a properly formatted error response that can be handled by the UI
      const errorResponse = {
        success: false,
        error: error.message || "Failed to fetch users",
        data: {
          workers: [],
          error: error.message || "Failed to fetch users",
          ownerEmail: cookies.get("email") || "",
        },
      };

      this.notifySubscribers({ type: "GET_USERS", data: errorResponse.data });
      return errorResponse;
    }
  }

  async getUser(email: string): Promise<UserResponse<any>> {
    const json = { emailId: email };
    return this.makeRequest(env.getWorker, json, `getUser-${email}`);
  }

  async updateUser(formData: UserFormData): Promise<UserResponse<any>> {
    // Ensure the data has the correct format
    const updateData = {
      ...formData,
      // Use email from either formData.email or formData.emailId
      email: formData.email || formData.emailId,
    };

    // Use a consistent identifier for logging
    const emailIdentifier = updateData.email || updateData.emailId;
    const response = await this.makeRequest(env.updateWorker, updateData, `updateUser-${emailIdentifier}`);

    if (response.success) {
      await logService.sendLogs("updateUser", "updateUser success", "users.service.ts");
      this.notifySubscribers({ type: "UPDATE_USER", data: response.data });
      await this.getUsers(); // Refresh users list
    }

    return response;
  }

  async deleteUser(email: string): Promise<UserResponse<any>> {
    const json = {
      workerEmailId: email,
      orgEmailId: cookies.get("email"),
    };

    // Notify subscribers about loading state - this will be picked up by components
    this.notifySubscribers({ type: "DELETE_USER_LOADING", data: { loading: true, email } });

    try {
      // makeRequest already handles setting loading state through axios interceptors
      const response = await this.makeRequest(env.deleteWorker, json, `deleteUser-${email}`);

      if (response.success) {
        // Log successful deletion
        await logService.sendLogs("deleteUser", "deleteUser success", "users.service.ts");

        // Notify subscribers about successful deletion
        this.notifySubscribers({ type: "DELETE_USER", data: { email, success: true } });

        // Refresh the users list
        await this.getUsers();
      } else {
        // Log failed deletion
        await logService.sendLogs("deleteUser Failed", response.error, "users.service.ts");

        // Notify subscribers about failed deletion
        this.notifySubscribers({ type: "DELETE_USER", data: { email, success: false, error: response.error } });
      }

      return response;
    } catch (error: any) {
      // Log any unexpected errors
      await logService.sendLogs("deleteUser Error", error?.message || error, "users.service.ts");

      // Notify subscribers about the error
      this.notifySubscribers({
        type: "DELETE_USER",
        data: { email, success: false, error: error?.message || "Unknown error occurred" },
      });

      return {
        success: false,
        error: error?.message || "Failed to delete user",
      };
    } finally {
      // Always notify subscribers that loading is complete
      this.notifySubscribers({ type: "DELETE_USER_LOADING", data: { loading: false, email } });
    }
  }

  async transferOwnership(currentOwner: string, newOwner: string): Promise<UserResponse<any>> {
    const json = {
      currentOwner,
      newOwner,
    };

    const response = await this.makeRequest(env.ownerTransfer, json, `transferOwnership-${currentOwner}-${newOwner}`);

    if (response.success) {
      await logService.sendLogs(
        "transferOwnership",
        `Ownership transferred from ${currentOwner} to ${newOwner}`,
        "users.service.ts"
      );
      this.notifySubscribers({
        type: "TRANSFER_OWNERSHIP",
        data: { currentOwner, newOwner },
      });
      await this.getUsers(); // Refresh users list
    }

    return response;
  }
}

export const usersService = new UsersService();
