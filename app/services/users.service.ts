import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";
import { logService } from "./logs.service";

ls.config.encrypt = true;

export interface UserResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
}

export interface UserFormData {
  email: string;
  password?: string;
  role?: string;
  [key: string]: any;
}

class UsersService {
  private subscribers: ((data: any) => void)[] = [];

  constructor() {
    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults(): void {
    axios.defaults.headers.common["Authorization"] = ls.get("token");
  }

  private getApiKey(): string {
    return ls.get("apikey") || "";
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
    this.setupAxiosDefaults();
    try {
      formData.password = this.generateRandomPassword();

      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.addWorker, formData);
      }, false);

      await logService.sendLogs("addUser", "addUser success", "users.service.ts");
      this.notifySubscribers({ type: "ADD_USER", data: response?.data });
      await this.getUsers(); // Refresh users list
      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("addUser Failed", error.response, "users.service.ts");
      return { success: false, error: error.response || error.message };
    }
  }

  async getUsers(): Promise<UserResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const json = { emailId: ls.get("email"), apiKey: this.getApiKey() };
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.getWorkersList, json);
      }, false);

      if (response?.data?.error === true) {
        await logService.sendLogs("getUsers Failed", response.data, "users.service.ts");
        return { success: false, error: response.data };
      }

      await logService.sendLogs("getUsers", "getUsers success", "users.service.ts");
      this.notifySubscribers({ type: "GET_USERS", data: response?.data });
      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("getUsers Failed", error.message, "users.service.ts");
      return { success: false, error: error.message };
    }
  }

  async getUser(email: string): Promise<UserResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const json = { emailId: email, apiKey: this.getApiKey() };
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.getWorker, json);
      }, false);

      await logService.sendLogs("getUser", "getUser success", "users.service.ts");
      this.notifySubscribers({ type: "GET_USER", data: response?.data });
      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("getUser Failed", error.message, "users.service.ts");
      return { success: false, error: error.message };
    }
  }

  async updateUser(formData: UserFormData): Promise<UserResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.updateWorker, formData);
      }, false);

      await logService.sendLogs("updateUser", "updateUser success", "users.service.ts");
      this.notifySubscribers({ type: "EDIT_USER", data: response?.data });
      await this.getUsers(); // Refresh users list
      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("updateUser Failed", error.message, "users.service.ts");
      return { success: false, error: error.message };
    }
  }

  async deleteUser(email: string): Promise<UserResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const json = {
        apiKey: this.getApiKey(),
        orgEmailId: ls.get("email"),
        workerEmailId: email,
      };

      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.deleteWorker, json);
      }, false);

      await logService.sendLogs("deleteUser", "deleteUser success", "users.service.ts");
      this.notifySubscribers({ type: "DELETE_USERS", data: response?.data });
      await this.getUsers(); // Refresh users list
      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("deleteUser Failed", error.message, "users.service.ts");
      return { success: false, error: error.message };
    }
  }

  async transferOwnership(currentOwner: string, newOwner: string): Promise<UserResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const json = {
        currentowner: currentOwner,
        newowner: newOwner,
      };

      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.ownerTransfer, json);
      }, false);

      await logService.sendLogs("transferOwnership", "transferOwnership success", "users.service.ts");
      this.notifySubscribers({ type: "TRANSFER_OWNERSHIP", data: response?.data });
      await this.getUsers(); // Refresh users list

      // Clear storage and redirect
      localStorage.clear();
      window.location.href = "/login";

      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("transferOwnership Failed", error.message, "users.service.ts");
      return { success: false, error: error.message };
    }
  }
}

export const usersService = new UsersService();
