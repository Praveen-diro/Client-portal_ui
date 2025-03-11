import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";
import { logService } from "./logs.service";
import { CookieService } from "./auth.service";

ls.config.encrypt = true;

export interface UserResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
}

export interface UserFormData {
  emailId: string;
  password?: string;
  role?: string;
  [key: string]: any;
}

class UsersService {
  private subscribers: ((data: any) => void)[] = [];
  private retryCount: { [key: string]: number } = {};
  private MAX_RETRY_COUNT = 3;

  constructor() {
    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults(): void {
    const token = CookieService.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token as string;
    }
  }

  private getApiKey(): string {
    return CookieService.get("apikey") as string;
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
    this.setupAxiosDefaults();

    try {
      const response = await axios.post(url, data);

      if (retryKey) {
        this.retryCount[retryKey] = 0;
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return this.handleApiError(error, url, data, retryKey);
    }
  }

  private async handleApiError<T>(error: any, url: string, data: any, retryKey?: string): Promise<UserResponse<T>> {
    // Handle token refresh for 401/403 errors
    if (
      CookieService.get("refreshToken") &&
      (error.response?.status === 401 ||
        error.response?.status === 403 ||
        error.message === "Network Error" ||
        error.message === "Request failed with status code 401") &&
      retryKey &&
      this.retryCount[retryKey] < this.MAX_RETRY_COUNT
    ) {
      console.log("Attempting to refresh token for:", retryKey, "- Attempt:", this.retryCount[retryKey] + 1);
      this.retryCount[retryKey]++;

      try {
        await refreshAuthService.refreshAuth(async () => {
          return { success: true };
        }, false);

        // Update axios defaults with new token
        this.setupAxiosDefaults();

        console.log("Token refreshed successfully, retrying request");
        return this.makeRequest(url, data, retryKey);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
      }
    }

    if (retryKey) {
      this.retryCount[retryKey] = 0;
    }

    await logService.sendLogs(`API Request Failed: ${url}`, error.response || error.message, "users.service.ts");
    return {
      success: false,
      error: error.response?.data || error.message || "An unknown error occurred",
    };
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
    const json = { emailId: CookieService.get("email"), apiKey: this.getApiKey() };
    const response = await this.makeRequest(env.getWorkersList, json, "getUsers");

    // Check if response has error property using type assertion
    const responseData = response.data as Record<string, any>;
    if (response.success && responseData && responseData.error === true) {
      return { success: false, error: responseData };
    }

    this.notifySubscribers({ type: "GET_USERS", data: response.data });
    return response;
  }

  async getUser(email: string): Promise<UserResponse<any>> {
    const json = { emailId: email, apiKey: this.getApiKey() };
    return this.makeRequest(env.getWorker, json, `getUser-${email}`);
  }

  async updateUser(formData: UserFormData): Promise<UserResponse<any>> {
    const response = await this.makeRequest(env.updateWorker, formData, `updateUser-${formData.email}`);

    if (response.success) {
      await logService.sendLogs("updateUser", "updateUser success", "users.service.ts");
      this.notifySubscribers({ type: "UPDATE_USER", data: response.data });
      await this.getUsers(); // Refresh users list
    }

    return response;
  }

  async deleteUser(email: string): Promise<UserResponse<any>> {
    const json = { emailId: email, apiKey: this.getApiKey() };

    const response = await this.makeRequest(env.deleteWorker, json, `deleteUser-${email}`);

    if (response.success) {
      await logService.sendLogs("deleteUser", "deleteUser success", "users.service.ts");
      this.notifySubscribers({ type: "DELETE_USER", data: { email } });
      await this.getUsers(); // Refresh users list
    }

    return response;
  }

  async transferOwnership(currentOwner: string, newOwner: string): Promise<UserResponse<any>> {
    const json = {
      currentOwner,
      newOwner,
      apiKey: this.getApiKey(),
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
