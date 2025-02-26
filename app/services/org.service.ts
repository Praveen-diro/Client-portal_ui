import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";

ls.config.encrypt = true;

export interface OrgResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

class OrgService {
  private retryCount = 0;
  private readonly MAX_RETRIES = 5;

  constructor() {
    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults(): void {
    axios.defaults.headers.common["Authorization"] = ls.get("token");
  }

  private getApiKey(): string {
    return ls.get("apikey") || "";
  }

  async getOrg(): Promise<OrgResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.orgdetails, { apikey: this.getApiKey() });
      }, false);

      return { success: true, data: response?.data };
    } catch (error: any) {
      console.error("Failed to get org:", error);
      return { success: false, error: error.message };
    }
  }

  async getOrgList(): Promise<OrgResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.get(env.orglist);
      }, false);

      return { success: true, data: response?.data };
    } catch (error: any) {
      console.error("Failed to get org list:", error);
      return { success: false, error: error.message };
    }
  }

  async uploadSecondLogo(file: File, btnId?: string): Promise<OrgResponse<any>> {
    this.setupAxiosDefaults();
    const id = btnId || ls.get("orgid");
    const url = `https://logo.diro.live/api/logo-upload/${id}`;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const config = {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(url, formData, config);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Failed to upload logo:", error);
      return { success: false, error: error.message };
    }
  }

  async removeBackground(file: File): Promise<OrgResponse<any>> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios({
        method: "post",
        url: "https://logo.diro.live/api/remove-background",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({ success: true, data: reader.result });
        };
        reader.readAsDataURL(response.data);
      });
    } catch (error: any) {
      console.error("Failed to remove background:", error);
      return { success: false, error: error.message };
    }
  }

  async getBillingOrg(): Promise<OrgResponse<any>> {
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.orgaccount, {
          apikey: this.getApiKey(),
          email: ls.get("email"),
        });
      }, false);

      return { success: true, data: response?.data };
    } catch (error: any) {
      console.error("Failed to get billing org:", error);
      return { success: false, error: error.message };
    }
  }

  async updateOrg(formData: any): Promise<OrgResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.updateorganization, formData);
      }, false);

      return { success: true, data: response?.data };
    } catch (error: any) {
      console.error("Failed to update org:", error);
      return { success: false, error: error.message };
    }
  }
}

export const orgService = new OrgService();
