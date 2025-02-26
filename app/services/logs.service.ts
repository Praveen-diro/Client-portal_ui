import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";

ls.config.encrypt = true;

export interface LogResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface LogParams {
  offset: number;
  limit: number;
  order: string;
  search?: string;
}

export interface LogMessage {
  short_message: string;
  full_message: any;
  timestamp: number;
  level?: string;
  facility: string;
  app_name: string;
  user?: string | null;
  _ENV: string;
}

export interface LogError {
  error: string;
  timestamp: string;
  errorCode: number;
}

class LogService {
  private readonly DEFAULT_LIMIT = 10;
  private readonly DEFAULT_ORDER = "desc";
  private readonly LOGS_URL = "https://api2.diro.live/logs/logs";

  constructor() {
    this.setupAxiosDefaults();
  }

  private getApiKey(): string {
    return ls.get("apikey") || "";
  }

  private setupAxiosDefaults(): void {
    axios.defaults.headers.common["Authorization"] = ls.get("token");
  }

  private async makeRequest<T>(url: string, data: any): Promise<LogResponse<T>> {
    try {
      const response = await refreshAuthService.refreshAuth<AxiosResponse<T>>(async () => {
        return await axios.post<T>(url, { ...data, apikey: this.getApiKey() });
      }, false);

      if (!response?.data || response?.status === 204) {
        return {
          success: false,
          error: {
            error: "No logs found",
            timestamp: new Date().toISOString(),
            errorCode: response?.status || 204,
          },
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Request failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getLogs(params: Partial<LogParams> = {}): Promise<LogResponse<any>> {
    const requestParams: LogParams = {
      offset: params.offset || 0,
      limit: params.limit || this.DEFAULT_LIMIT,
      order: params.order || this.DEFAULT_ORDER,
      ...(params.search && { search: params.search }),
    };

    return this.makeRequest(env.callbacklogs, requestParams);
  }

  async sendLogs(shortmsg: string, longmsg: any, facility: string, level?: string): Promise<LogResponse<any>> {
    const logMessage: LogMessage = {
      short_message: shortmsg,
      full_message: longmsg,
      timestamp: Date.now() / 1000,
      level,
      facility,
      app_name: "client-portal",
      user: ls.get("email"),
      _ENV: env.env,
    };

    try {
      const response = await axios.post(this.LOGS_URL, logMessage);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Failed to send logs:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Header state management methods - these could be moved to a separate UI state service if needed
  getHeaderState(headerType: string): { type: string } {
    return { type: headerType };
  }

  getNoCodeIntegrationHeader(): { type: string } {
    return this.getHeaderState("GET_NOCODE_INTEGRATION_HEADER");
  }

  getSetupOrganizationHeader(): { type: string } {
    return this.getHeaderState("GET_SETUP_ORGANIZATION_HEADER");
  }

  getHmacKeyDocumentHeader(): { type: string } {
    return this.getHeaderState("GET_SETUP_HMACKEY_HEADER");
  }

  getSetupVerificationBtnHeader(): { type: string } {
    return this.getHeaderState("GET_SETUP_VERIFICATION_BTN_HEADER");
  }

  getAfterDocumentSubHeader(): { type: string } {
    return this.getHeaderState("AFTER_DOCUMENT_SUBMISSION_HEADER");
  }

  getForDevelopersNotification(): { type: string } {
    return this.getHeaderState("FOR_DEVELOPERS_NOTIFICATION_HEADER");
  }

  getBeforeGoLive(): { type: string } {
    return this.getHeaderState("BEFORE_YOU_GO_LIVE");
  }

  getUserPermissionLanding(): { type: string } {
    return this.getHeaderState("USER_PERMISION_LANDING");
  }

  getConfigureVerification(): { type: string } {
    return this.getHeaderState("CONFIGURE_VERIFICATION");
  }

  getDuringVerify(): { type: string } {
    return this.getHeaderState("DURING_ADVANCE_VERIFICATION");
  }

  getSetYourLogo(): { type: string } {
    return this.getHeaderState("SET_YOUR_LOGO");
  }

  getDeleteDoc(): { type: string } {
    return this.getHeaderState("DELETE_DOC");
  }
}

export const logService = new LogService();
