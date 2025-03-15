import axios from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { CookieService } from "./auth.service";
import { refreshAuthService } from "./refreshAuth.service";
import { axiosService } from "./axios.service";

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

export interface AutoNavParams {
  sessionid: string;
}

export interface PdfToJsonParams {
  docid: string;
  redotemplate?: boolean;
}

export interface ExtractTransactionParams {
  docid: string;
  sessionid: string;
}

export interface RequestPaginationParams extends PaginationParams {
  status: string;
  requesterEmail?: string;
  requesterRole?: string;
  numberOfRecords?: number;
}

class TableService {
  private retryCount: { [key: string]: number } = {
    getRequested: 0,
    getPending: 0,
    getReviewPending: 0,
    getApproved: 0,
    getRejected: 0,
    getSessionReport: 0,
    searchTable: 0,
    submitFeedback: 0,
    deleteSession: 0,
    getPdfToJson: 0,
    getExtractTransactionData: 0,
    createTableData: 0,
  };
  private readonly MAX_RETRY_COUNT = 5;

  constructor() {
    axiosService.setupAxiosDefaults();
  }

  private getApiKey(): string {
    return (CookieService.get("apikey") as string) || "";
  }

  private async makeRequest<T>(url: string, data: any, retryKey?: string): Promise<TableResponse<T>> {
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
      // Handle token refresh for 401 errors
      console.log("response from the api", error.response.data);
      if (
        CookieService.get("refreshToken") &&
        (error.message === "Request failed with status code 401" || error.message === "Network Error") &&
        retryKey &&
        this.retryCount[retryKey] < this.MAX_RETRY_COUNT
      ) {
        this.retryCount[retryKey]++;
        await refreshAuthService.refreshAuth(async () => {
          return { success: true };
        }, false);
        return this.makeRequest(url, data, retryKey);
      }

      if (retryKey) {
        this.retryCount[retryKey] = 0;
      }

      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  async getRequested(params: RequestPaginationParams = { offset: 0, limit: 10, status: "invite" }): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      status: params.status || "invite",
      offset: params.offset || 0,
      requesterEmail: CookieService.get("email") as string,
      requesterRole: CookieService.get("roles") as string,
      numberOfRecords: params.limit || 10,
    };

    console.log("Sending request to invite API with data:", {
      ...data,
      apikey: data.apikey ? "exists" : "missing",
    });

    try {
      const response = await this.makeRequest<any>(env.requesteduser, data, "getRequested");

      // Ensure data property is properly structured even if API returns unexpected format
      if (response.success && response.data && !response.data.data && Array.isArray(response.data)) {
        response.data = { data: response.data, total: response.data.length };
      }
      console.log("Received response from invite API:", response);

      return response;
    } catch (error) {
      console.error("Error in getRequested:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  async getPending(params: RequestPaginationParams = { offset: 0, limit: 10, status: "pending" }): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      status: params.status || "pending",
      offset: params.offset || 0,
      orgid: ls.get("orgid") as string,
      requesterEmail: ls.get("email") as string,
      requesterRole: ls.get("roles") as string,
      numberOfRecords: params.limit || 10,
    };

    return this.makeRequest(env.userlist, data, "getPending");
  }

  async getReviewPending(params: PaginationParams = { offset: 0, limit: 10 }): Promise<TableResponse<any>> {
    // Existing implementation
    return { success: false, error: "Not implemented" };
  }

  async getApproved(params: RequestPaginationParams = { offset: 0, limit: 10, status: "approved" }): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      status: params.status || "approved",
      offset: params.offset || 0,
      orgid: ls.get("orgid") as string,
      requesterEmail: ls.get("email") as string,
      requesterRole: ls.get("roles") as string,
      numberOfRecords: params.limit || 10,
    };

    return this.makeRequest(env.userlist, data, "getApproved");
  }

  async getRejected(params: RequestPaginationParams = { offset: 0, limit: 10, status: "rejected" }): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      status: params.status || "rejected",
      offset: params.offset || 0,
      orgid: ls.get("orgid") as string,
      requesterEmail: ls.get("email") as string,
      requesterRole: ls.get("roles") as string,
      numberOfRecords: params.limit || 10,
    };

    return this.makeRequest(env.userlist, data, "getRejected");
  }

  async getSessionReport(sessionid: string): Promise<TableResponse<any>> {
    console.log("sessionid inside the session report", sessionid);
    const data = {
      inviteid: sessionid,
    };

    return this.makeRequest(env.sessionstats, data, "getSessionReport");
  }

  async getAutoNavData(sessionid: string): Promise<TableResponse<any>> {
    const data = {
      sessionId: sessionid,
    };

    return this.makeRequest(env.getAutoNavData, data, "getAutoNavData");
  }

  async searchTable(search: string, offset: number, limit: number): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      search,
      offset,
      limit,
    };

    return this.makeRequest(env.requesteduser, data, "searchTable");
  }

  async submitFeedback(data: FeedbackFormData): Promise<TableResponse<any>> {
    const requestData = {
      apikey: this.getApiKey(),
      session_id: data.sessionid,
      comment: data.feedback,
      rating: data.rating,
      source: "client portal",
      email: ls.get("email") as string,
    };

    return this.makeRequest(env.feedbackUrl, requestData, "submitFeedback");
  }

  async deleteSession(sessionid: string): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      session_id: sessionid,
    };

    return this.makeRequest(env.deletesession, data, "deleteSession");
  }

  async getPdfToJson(docid: string, redotemplate: boolean = false): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      doc_id: docid,
      redoTemplate: redotemplate,
    };

    return this.makeRequest(env.pdftojson, data, "getPdfToJson");
  }

  async getExtractTransactionData(data: ExtractTransactionParams): Promise<TableResponse<any>> {
    const requestData = {
      apikey: this.getApiKey(),
      doc_id: data.docid,
      session_id: data.sessionid,
    };

    return this.makeRequest(env.extractTransaction, requestData, "getExtractTransactionData");
  }

  async createTableData(data: any): Promise<TableResponse<any>> {
    // Assuming there's no specific endpoint for this in the environment variables
    // Using a placeholder URL. Replace with the correct one if available
    const url = `${env.userlist}/create`;
    return this.makeRequest(url, data, "createTableData");
  }

  async sendForReview(docid: string): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      doc_id: docid,
    };

    // No specific endpoint for this in the environment variables
    // Using a placeholder URL. Replace with the correct one if available
    const url = `${env.userlist}/sendForReview`;
    return this.makeRequest(url, data, "sendForReview");
  }

  async redoTransactionDoc(docid: string): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      doc_id: docid,
    };

    return this.makeRequest(env.redoTransactionDoc, data, "redoTransactionDoc");
  }

  async getAllUsers(): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
    };

    return this.makeRequest(env.getalluserdata, data, "getAllUsers");
  }

  async deleteButton(buttonId: string): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      button_id: buttonId,
    };

    return this.makeRequest(env.deletebutton, data, "deleteButton");
  }

  async getCallbackLogs(sessionId: string): Promise<TableResponse<any>> {
    const data = {
      apikey: this.getApiKey(),
      session_id: sessionId,
    };

    return this.makeRequest(env.callbacklogs, data, "getCallbackLogs");
  }
}

export const tableService = new TableService();
export default tableService;
