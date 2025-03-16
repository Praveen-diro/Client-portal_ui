import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { axiosService } from "./axios.service";
import { refreshAuthService } from "./refreshAuth.service";
import { cookies } from "./cookie.service";
import { apiService, ApiResponse } from "./api.service";

ls.config.encrypt = true;

export interface OrgResponse<T> extends ApiResponse<T> {}

class OrgService {
  private readonly MAX_RETRY_COUNT = 3;

  constructor() {
    axiosService.setupAxiosDefaults();
  }

  private getApiKey(): string {
    return cookies.get("apikey") || "";
  }

  private async makeRequest<T>(url: string, data: any): Promise<OrgResponse<T>> {
    const requestData = { ...data, apikey: this.getApiKey() };
    return apiService.makeRequest<T>(url, requestData, undefined, this.MAX_RETRY_COUNT);
  }

  async getOrg(): Promise<OrgResponse<any>> {
    return this.makeRequest(env.orgdetails, { apikey: this.getApiKey() });
  }

  async getOrgList(): Promise<OrgResponse<any>> {
    axiosService.setupAxiosDefaults();
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
    axiosService.setupAxiosDefaults();
    const id = btnId || cookies.get("orgid");
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
    return apiService.makeRefreshAuthRequest(env.orgaccount, {
      apikey: this.getApiKey(),
      email: cookies.get("email"),
    });
  }

  async updateOrg(formData: any): Promise<OrgResponse<any>> {
    axiosService.setupAxiosDefaults();
    return apiService.makeRefreshAuthRequest(env.updateorganization, formData);
  }
}

export const orgService = new OrgService();
