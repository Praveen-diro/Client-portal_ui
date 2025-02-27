import axios from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";

ls.config.encrypt = true;

export interface TableResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  search: string;
}

export interface SessionReportParams {
  sessionid: string;
}

export interface FeedbackFormData {
  sessionid: string;
  feedback: string;
  rating: number;
}

export interface PdfToJsonParams {
  docid: string;
  redotemplate?: boolean;
}

export interface ExtractTransactionParams {
  docid: string;
  sessionid: string;
}

class TableService {
  private retryCount: { [key: string]: number } = {
    request: 0,
    pending: 0,
    review: 0,
    approved: 0,
    rejected: 0,
    pdf: 0,
    extract: 0,
    create: 0,
    sendReview: 0,
  };

  private readonly MAX_RETRY_COUNT = 5;

  constructor() {
    this.setupAxiosDefaults();
  }

  private getApiKey(): string {
    return ls.get("apikey") || "";
  }

  private setupAxiosDefaults(): void {
    axios.defaults.headers.common["Authorization"] = ls.get("token");
  }

  private async makeRequest<T>(url: string, data: any, retryKey?: string): Promise<TableResponse<T>> {
    try {
      const response = await refreshAuthService.refreshAuth(async () => {
        return await axios.post(url, { ...data, apikey: this.getApiKey() });
      }, false);

      if (retryKey) {
        this.retryCount[retryKey] = 0;
      }

      return {
        success: true,
        data: response?.data,
      };
    } catch (error: any) {
      if (
        retryKey &&
        ls.get("refreshToken") &&
        (error.message === "Request failed with status code 401" || error.message === "Network Error") &&
        this.retryCount[retryKey] < this.MAX_RETRY_COUNT
      ) {
        this.retryCount[retryKey]++;
        return this.makeRequest(url, data, retryKey);
      }

      if (retryKey) {
        this.retryCount[retryKey] = 0;
      }

      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getRequested(params: PaginationParams = { offset: 0, limit: 10 }): Promise<TableResponse<any>> {
    return this.makeRequest(env.userlist, params, "request");
  }

  async getPending(params: PaginationParams = { offset: 0, limit: 10 }): Promise<TableResponse<any>> {
    return this.makeRequest(env.recentactivities, params, "pending");
  }

  async getReviewPending(params: PaginationParams = { offset: 0, limit: 10 }): Promise<TableResponse<any>> {
    return this.makeRequest(env.verifykyc, params, "review");
  }

  async getApproved(params: PaginationParams = { offset: 0, limit: 10 }): Promise<TableResponse<any>> {
    return this.makeRequest(env.orguserlist, params, "approved");
  }

  async getRejected(params: PaginationParams = { offset: 0, limit: 10 }): Promise<TableResponse<any>> {
    return this.makeRequest(env.orguserlistwithoutorg, params, "rejected");
  }

  async getSessionReport(sessionid: string): Promise<TableResponse<any>> {
    const params: SessionReportParams = { sessionid };
    return this.makeRequest(env.recentactivities, params);
  }

  async searchTable(search: string, offset: number, limit: number): Promise<TableResponse<any>> {
    const params: SearchParams = { search, offset, limit };
    return this.makeRequest(env.fulltextsearch, params);
  }

  async submitFeedback(data: FeedbackFormData): Promise<TableResponse<any>> {
    return this.makeRequest(env.feedbackUrl, data);
  }

  async deleteSession(sessionid: string): Promise<TableResponse<any>> {
    return this.makeRequest(env.deletesession, { sessionid });
  }

  async getPdfToJson(docid: string): Promise<TableResponse<any>> {
    const params: PdfToJsonParams = { docid };
    return this.makeRequest(env.pdftojson, params, "pdf");
  }

  async getExtractTransactionData(data: ExtractTransactionParams): Promise<TableResponse<any>> {
    return this.makeRequest(env.extractTransaction, data, "extract");
  }

  async createTableData(data: any): Promise<TableResponse<any>> {
    return this.makeRequest(env.rawmxcreation, data, "create");
  }

  async sendForReview(docid: string): Promise<TableResponse<any>> {
    const params: PdfToJsonParams = { docid, redotemplate: true };
    return this.makeRequest(env.pdftojson, params, "sendReview");
  }

  async getAllUsers(): Promise<TableResponse<any>> {
    try {
      const response = await refreshAuthService.refreshAuth(async () => {
        return await axios.get(env.getalluserdata, {
          headers: { "Content-Type": "application/json" },
        });
      }, false);

      return {
        success: true,
        data: response?.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const tableService = new TableService();
