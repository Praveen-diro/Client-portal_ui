import axios from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { refreshAuthService } from "./refreshAuth.service";
import { GlobalDebug } from "./remove-console.service";

ls.config.encrypt = true;

if (!env.consoleLog) {
  GlobalDebug(false);
}

export interface ButtonResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}

export interface CountryLinkData {
  cat: string;
  key: string;
  search?: string;
  searching?: boolean;
}

export interface TableData {
  category: string;
  country: string;
  uniquekey: string;
  id: string;
  link: string;
  nickname?: string;
  subcategory?: string;
}

class ButtonService {
  constructor() {
    this.validateApiKey();
    this.setupAxiosDefaults();
  }

  private getApiKey(): string {
    return ls.get("apikey") || "";
  }

  private setupAxiosDefaults(): void {
    axios.defaults.headers.common["Authorization"] = ls.get("token");
  }

  private validateApiKey(): void {
    const apiKey = localStorage.getItem("apikey");
    if (apiKey && this.isAlphanumeric(apiKey)) {
      this.logout();
    }
  }

  private isAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str);
  }

  private generateGuid(): string {
    const s4 = (): string => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
  }

  private async makeRequest<T>(url: string, data: any): Promise<ButtonResponse<T>> {
    try {
      const response = await refreshAuthService.refreshAuth(async () => {
        return await axios.post(url, { ...data, apikey: this.getApiKey() });
      }, false);

      return {
        success: true,
        data: response?.data,
      };
    } catch (error: any) {
      console.error("Request failed:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async logout(): Promise<void> {
    ls.clear();
    localStorage.clear();
    sessionStorage.clear();
  }

  async getButtons(): Promise<ButtonResponse<any>> {
    this.setupAxiosDefaults();
    return this.makeRequest(env.requesteduser, {});
  }

  async getButton(buttonId: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.btn_data, { buttonid: buttonId });
  }

  async addButton(buttonData: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.add_link, buttonData);
  }

  async updateButton(buttonData: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.update_link, buttonData);
  }

  async deleteButton(buttonId: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.delete_link, { buttonid: buttonId });
  }

  async getCountryList(): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.country_with_states, {});
  }

  async getCountryLinks(data: CountryLinkData): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.banklinks, data);
  }

  async createTableData(data: TableData): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.createsource, data);
  }

  async updateTableData(data: TableData): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.updatesource, data);
  }

  async deleteTableData(id: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.deletesource, { id });
  }

  async getMasterFields(): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.getmasterfields, {});
  }

  async getEmailReminder(): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.getemailreminder, {});
  }

  async testEmailReminder(data: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.testEmailReminder, data);
  }
}

export const buttonService = new ButtonService();
