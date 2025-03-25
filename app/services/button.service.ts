import { env } from "../config/environment";
import { axiosService } from "./axios.service";
import { refreshAuthService } from "./refreshAuth.service";
import { GlobalDebug } from "./remove-console.service";
import { cookies } from "./cookie.service";
import { apiService, ApiResponse } from "./api.service";
import { dispatchAction } from "../store/hooks";
import { updateButton, getButtons } from "../store/features/buttonSlice";

if (!env.consoleLog) {
  GlobalDebug(false);
}

export interface ButtonResponse<T> extends ApiResponse<T> {}

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

// Interface for deepCompareJson return type
export interface CompareJsonResult {
  status: boolean;
  differences: Record<string, any>;
}

// Define button data structure
export interface ButtonCoverage {
  category?: string;
  note?: string;
  direct_link?: string;
  [key: string]: any;
}

export interface ButtonData {
  apikey: string;
  buttonid: string;
  coverage?: ButtonCoverage;
  eptime?: string;
  crtime?: string;
  org_info?: any;
  [key: string]: any;
}

export interface ButtonSandboxResponse {
  success: boolean;
  data?: {
    error?: boolean;
    data?: ButtonData;
    [key: string]: any;
  };
  error?: any;
}

class ButtonService {
  private buttonAddCount: number = 0;

  constructor() {
    this.validateApiKey();
    axiosService.setupAxiosDefaults();
  }

  private getApiKey(): string {
    return cookies.get("apikey") || "";
  }

  private validateApiKey(): void {
    const apiKey = cookies.get("apikey");
    if (apiKey && apiKey.length < 10 && this.isAlphanumeric(apiKey)) {
      const authMode = cookies.get("authMode");
      const isSandboxMode = authMode === "2";

      if (!isSandboxMode) {
        console.warn("Invalid API key detected in live mode");
        this.logout();
      } else {
        console.warn("Invalid API key detected in sandbox mode, continuing anyway");
      }
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
    const requestData = { ...data, apikey: this.getApiKey() };
    return apiService.makeRefreshAuthRequest<T>(url, requestData);
  }

  async logout(): Promise<void> {
    cookies.clearAll();
  }

  async getButtons(): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.btnStateList, {});
  }

  async getButton(buttonId: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.userlist, { buttonid: buttonId });
  }

  async addButton(buttonData: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.create_button, buttonData);
  }

  async updateButton(buttonData: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.update_btn, buttonData);
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

  /**
   * Duplicates a button by creating a new one with similar data
   * @param data Button data to be duplicated
   * @returns Promise with button data or error
   */
  async duplicateBtnAdd(data: any): Promise<ButtonResponse<any>> {
    try {
      const response = await this.makeRequest<any>(env.getbtndata, data);
      console.log("Add button " + JSON.stringify(response));

      // Log success
      console.log("buttonAdd", "buttonAdd success");

      // Reset counter on success
      this.buttonAddCount = 0;
      return response;
    } catch (error: any) {
      console.log("buttonAdd Failed", error.message);
      console.log("auth err: " + error);

      // Return error response
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Transfers a button from sandbox to production environment
   * @param data Button data to be transferred
   * @returns Promise with standard ButtonResponse
   */
  async buttonAddSendboxToProduction(data: any): Promise<ButtonSandboxResponse> {
    try {
      // Make the API request using axios service
      const response = await this.makeRequest<any>(env.getbtndata, data);
      console.log("here is the res in addsandboxto production data", response);

      if (response?.data?.error === false) {
        if (response.success && response.data?.data) {
          const updateJson = response.data;

          // Remove note from coverage if exists
          if (updateJson.data?.coverage?.note) {
            delete updateJson.data.coverage.note;
          }

          // Prepare payload for updating the button
          const payload = {
            apikey: updateJson.data.apikey,
            buttonid: updateJson.data.buttonid,
            data: { ...updateJson.data },
          };

          // Dispatch update action
          dispatchAction(updateButton(payload));

          // Refresh buttons list
          this.getButtons().then((buttonsResponse) => {
            if (buttonsResponse.success && buttonsResponse.data) {
              dispatchAction(getButtons({ data: buttonsResponse.data.data || [] }));
            }
          });
        }

        return response;
      } else {
        console.log("inside else of btnadd");
        return response;
      }
    } catch (error: any) {
      console.error("Error in buttonAddSendboxToProduction:", error);
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Compare two JSON objects and return their differences
   * @param json1 First JSON object
   * @param json2 Second JSON object
   * @returns Object containing status (true if differences exist) and the differences
   */
  deepCompareJson(json1: Record<string, any>, json2: Record<string, any>): CompareJsonResult {
    const excludedKeys = ["buttonid", "apikey", "sandboxid", "eptime", "crtime", "org_info", "note"];

    // Helper function to check if an argument is an object or array
    const isObjectOrArray = (arg: any): boolean => typeof arg === "object" && arg !== null;

    // Helper function to get keys excluding the specified keys
    const getFilteredKeys = (obj: Record<string, any>): string[] => Object.keys(obj).filter((key) => !excludedKeys.includes(key));

    const findDifferences = (a: any, b: any): any => {
      let differences: Record<string, any> = {};

      if (isObjectOrArray(a) !== isObjectOrArray(b)) {
        return a; // Return the updated value from json1 if the types differ
      }

      if (!isObjectOrArray(a) && !isObjectOrArray(b)) {
        if (a !== b) {
          return a; // Return only the differing value from json1
        }
        return null; // No difference
      }

      const keysA = getFilteredKeys(a);

      for (let key of keysA) {
        if (!(key in b)) {
          differences[key] = a[key]; // Key exists in json1 but not in json2
        } else {
          const diff = findDifferences(a[key], b[key]);
          if (diff !== null) {
            differences[key] = diff; // Collect only the differing values
          }
        }
      }

      return Object.keys(differences).length ? differences : null;
    };

    const differences = findDifferences(json1, json2);
    return {
      status: !!differences, // true if there are differences, false if none
      differences: differences || {}, // Return only the differences from json1
    };
  }
}

export const buttonService = new ButtonService();
