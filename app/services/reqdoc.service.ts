import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";

ls.config.encrypt = true;

export interface ReqDocResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
}

class ReqDocService {
  constructor() {
    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults(): void {
    axios.defaults.headers.common["Authorization"] = ls.get("token");
  }

  async getInviteLink(json: any): Promise<ReqDocResponse<any>> {
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.getverificationlink, json);
      }, false);

      return {
        success: true,
        data: response?.data,
        loading: false,
      };
    } catch (error: any) {
      console.error("Failed to get invite link:", error);
      return {
        success: false,
        error: error.response || error.message,
        loading: false,
      };
    }
  }

  async getTestPreview(json: any): Promise<ReqDocResponse<any>> {
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.getverificationlink, json);
      }, false);

      console.log("Verification link:", response?.data?.verificationlink);
      return {
        success: true,
        data: response?.data,
        loading: false,
      };
    } catch (error: any) {
      console.error("Failed to get test preview:", error);
      return {
        success: false,
        error: error.response || error.message,
        loading: false,
      };
    }
  }

  async sendRequest(json: any): Promise<ReqDocResponse<any>> {
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.sendsmsfororg, json);
      }, false);

      return {
        success: true,
        data: response?.data,
        loading: false,
      };
    } catch (error: any) {
      console.error("Failed to send request:", error);
      return {
        success: false,
        error: error.response || error.message,
        loading: false,
      };
    }
  }
}

export const reqDocService = new ReqDocService();
