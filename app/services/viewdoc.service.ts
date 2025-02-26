import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";
import { logService } from "./logs.service";

ls.config.encrypt = true;

export interface ViewDocResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
  message?: string;
}

interface SessionIdPayload {
  sessionid: string;
}

interface S3BucketIdPayload {
  id: string;
}

interface VerifyKycPayload {
  [key: string]: any;
}

class ViewDocService {
  private subscribers: ((data: any) => void)[] = [];

  constructor() {
    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults(): void {
    if (ls.get("authMode") === "2") {
      axios.defaults.headers.common["Authorization"] = ls.get("tokenTest");
    } else {
      axios.defaults.headers.common["Authorization"] = ls.get("token");
    }
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

  async getDownloadDocument(sessionId: string): Promise<ViewDocResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const downloadJson: SessionIdPayload = { sessionid: sessionId };

      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.download, downloadJson);
      }, false);

      if (response?.data?.message === "You are not allowed to see this document!") {
        this.notifySubscribers({ type: "GET_VIEW_DOC_MESSAGE", data: response.data });
        return {
          success: false,
          message: response.data.message,
          data: response.data,
        };
      }

      await logService.sendLogs("getDownloadedDocument", "getDownloadedDocument success", "viewdoc.service.ts");
      this.notifySubscribers({ type: "GET_PDF_DATA", data: response?.data });
      return { success: true, data: response?.data };
    } catch (error: any) {
      await logService.sendLogs("getDownloadedDocument Failed", error.response, "viewdoc.service.ts");
      return { success: false, error: error.response || error.message };
    }
  }

  async getLastClickedDocument(id: string): Promise<ViewDocResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const json: S3BucketIdPayload = { id };
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.getS3bucket, json);
      }, false);

      this.notifySubscribers({ type: "S3_BUCKET_DATA", data: response?.data });
      return { success: true, data: response?.data };
    } catch (error: any) {
      return { success: false, error: error.response || error.message };
    }
  }

  async approveDocument(json: VerifyKycPayload): Promise<ViewDocResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.verifykyc, json);
      }, false);

      this.notifySubscribers({ type: "GET_APPROVE_DATA", data: response?.data });
      return { success: true, data: response?.data };
    } catch (error: any) {
      return { success: false, error: error.response || error.message };
    }
  }

  async rejectDocument(json: VerifyKycPayload): Promise<ViewDocResponse<any>> {
    this.setupAxiosDefaults();
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<any>>(async () => {
        return await axios.post(env.verifykyc, json);
      }, false);

      this.notifySubscribers({ type: "GET_REJECT_DATA", data: response?.data });
      return { success: true, data: response?.data };
    } catch (error: any) {
      return { success: false, error: error.response || error.message };
    }
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
