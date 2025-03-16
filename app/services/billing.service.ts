import axios from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";
import { cookies } from "./cookie.service";
ls.config.encrypt = true;

export interface BillingResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface TransactionParams {
  customerid: string;
}

export interface RedirectParams extends TransactionParams {
  returnurl: string;
}

export interface RedirectResponse {
  url: string;
}

class BillingService {
  private getApiKey(): string {
    return cookies.get("apikey") || "";
  }

  private async makeRequest<T>(url: string, data: any): Promise<BillingResponse<T>> {
    try {
      const response = await refreshAuthService.refreshAuth(async () => {
        return await axios.post(url, { ...data, apikey: this.getApiKey() });
      }, false);

      return {
        success: true,
        data: response?.data,
      };
    } catch (error) {
      console.error("Request failed:", error);
      return {
        success: false,
        error,
      };
    }
  }

  async getUrlTransactions(stripeid: string): Promise<BillingResponse<any>> {
    const params: TransactionParams = {
      customerid: cookies.get("stripeid") || stripeid,
    };
    return this.makeRequest(env.transactions, params);
  }

  async getTransactions(orgstripe_id: string): Promise<BillingResponse<any>> {
    const params: TransactionParams = {
      customerid: orgstripe_id,
    };
    return this.makeRequest(env.transactions, params);
  }

  async redirectUser(id: string): Promise<BillingResponse<RedirectResponse>> {
    const params: RedirectParams = {
      customerid: id,
      returnurl: env.returnurl,
    };

    try {
      const response = await this.makeRequest<RedirectResponse>(env.striperedirect, params);
      if (response.success && response.data?.url) {
        window.open(response.data.url, "_blank");
      }
      return response;
    } catch (error) {
      console.error("Failed to redirect user:", error);
      return {
        success: false,
        error,
      };
    }
  }
}

export const billingService = new BillingService();
