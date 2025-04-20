import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { axiosService } from "./axios.service";
import { refreshAuthService } from "./refreshAuth.service";
import { logsService } from "./logs.service";
import { cookies } from "./cookie.service";
import { apiService, ApiResponse } from "./api.service";

ls.config.encrypt = true;

export interface ViewDocResponse<T> extends ApiResponse<T> {}
export interface TableResponse<T> extends ApiResponse<T> {}

interface SessionIdPayload {
  sessionid: string;
}

interface lastLinkClickedPayload {
  sessionid: string;
}

interface VerifyKycPayload {
  [docid: string]: any;
  apikey: string;
}

class ViewDocService {
  private subscribers: ((data: any) => void)[] = [];
  private MAX_RETRY_COUNT: number = 3;

  // constructor() {
  //   this.setupCustomAxiosDefaults();
  // }

  // private setupCustomAxiosDefaults(): void {
  //   // Custom implementation for viewdoc service that handles test mode
  //   if (cookies.get("authMode") === "2") {
  //     axios.defaults.headers.common["Authorization"] = cookies.get("tokenTest");
  //   } else {
  //     axios.defaults.headers.common["Authorization"] = cookies.get("token");
  //   }
  // }

  private getApiKey(): string {
    return (cookies.get("apikey") as string) || "";
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

  private async makeRequest<T>(url: string, data: any, retryKey?: string): Promise<TableResponse<T>> {
    // Add apiKey if not already in the data
    const requestData = data.apikey ? data : { ...data, apikey: this.getApiKey() };

    return apiService.makeRequest<T>(url, requestData, retryKey, this.MAX_RETRY_COUNT, false, true);
  }

  async searchTable(
    search: string,
    limit: number,
    requesterEmail: string,
    requesterRole: string,
    status: string
  ): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      search,
      limit,
      numberOfRecords: 10,
      requesterEmail,
      requesterRole,
      status,
    };

    return this.makeRequest(env.userlist, data, "searchTable");
  }

  async getDownloadDocument(sessionId: string): Promise<ViewDocResponse<any>> {
    // this.setupCustomAxiosDefaults();
    const downloadJson: SessionIdPayload = { sessionid: sessionId };

    try {
      const response = await apiService.makeRefreshAuthRequest(env.download, downloadJson);

      if (
        response.data &&
        typeof response.data === "object" &&
        "message" in response.data &&
        response.data.message === "You are not allowed to see this document!"
      ) {
        this.notifySubscribers({ type: "GET_VIEW_DOC_MESSAGE", data: response.data });
        return {
          success: false,
          message: response.data.message as string,
          data: response.data,
        };
      }

      await logsService.sendLogs("getDownloadedDocument", "getDownloadedDocument success", "viewdoc.service.ts");
      this.notifySubscribers({ type: "GET_PDF_DATA", data: response.data });
      return response;
    } catch (error: any) {
      await logsService.sendLogs("getDownloadedDocument Failed", error.response, "viewdoc.service.ts");
      return { success: false, error: error.response || error.message };
    }
  }

  async getLastClickedDocument(sessionid: string): Promise<ViewDocResponse<any>> {
    // this.setupCustomAxiosDefaults();
    const json: lastLinkClickedPayload = { sessionid };

    const response = await apiService.makeRefreshAuthRequest(env.get_lastclicked_link, json);
    this.notifySubscribers({ type: "S3_BUCKET_DATA", data: response.data });
    return response;
  }

  async approveDocument(json: VerifyKycPayload): Promise<ViewDocResponse<any>> {
    // this.setupCustomAxiosDefaults();

    const response = await apiService.makeRefreshAuthRequest(env.verifykyc, { ...json, apikey: this.getApiKey() });
    this.notifySubscribers({ type: "GET_APPROVE_DATA", data: response.data });
    return response;
  }

  async rejectDocument(json: VerifyKycPayload): Promise<ViewDocResponse<any>> {
    // this.setupCustomAxiosDefaults();

    const response = await apiService.makeRefreshAuthRequest(env.verifykyc, { ...json, apikey: this.getApiKey() });
    this.notifySubscribers({ type: "GET_REJECT_DATA", data: response.data });
    return response;
  }

  closeApproveDocument(): void {
    this.notifySubscribers({ type: "GET_APPROVE_DATA", data: null });
  }

  closeRejectDocument(): void {
    this.notifySubscribers({ type: "GET_REJECT_DATA", data: null });
  }

  closeSweetAlert(): void {
    this.notifySubscribers({ type: "REMOVE_VIEW_DOC_MESSAGE", data: null });
  }
}

export const viewDocService = new ViewDocService();
