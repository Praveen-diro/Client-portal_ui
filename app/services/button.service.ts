import { env } from "../config/environment";
import { axiosService } from "./axios.service";
import { refreshAuthService } from "./refreshAuth.service";
import { GlobalDebug } from "./remove-console.service";
import { cookies } from "./cookie.service";
import { apiService, ApiResponse } from "./api.service";
import { dispatchAction } from "../store/hooks";
import { updateButton, getButtons } from "../store/features/buttonSlice";
import axios from "axios";

if (!env.consoleLog) {
  GlobalDebug(false);
}

export interface ButtonResponse<T> extends ApiResponse<T> {}

export interface CountryLinkData {
  category: string;
  country: string;
  search?: string;
  index?: number;
  offset?: number;
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

interface CallbackResponse {
  statusCode?: number;
  status?: number;
  message?: string;
  [key: string]: any;
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

  private async makeRequest<T>(url: string, data: any, skipAddingApiKey: boolean = false): Promise<ButtonResponse<T>> {
    const requestData = skipAddingApiKey ? data : { ...data, apikey: this.getApiKey() };
    return apiService.makeRefreshAuthRequest<T>(url, requestData);
  }

  /**
   * Makes a GET request to the specified URL with proper authentication and API key handling
   * @param url The endpoint URL to make the GET request to
   * @param params Optional query parameters to include (API key will be added automatically)
   * @returns Promise with ButtonResponse containing the data or error
   */
  private async makeGetRequest<T>(url: string, params: Record<string, any> = {}): Promise<ButtonResponse<T>> {
    // Use the API service's makeRefreshAuthGetRequest method for token refresh capabilities
    return apiService.makeRefreshAuthGetRequest<T>(url);
  }

  async logout(): Promise<void> {
    cookies.clearAll();
  }

  async getButtons(): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.btnStateList, {});
  }

  async getButton(buttonId: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.getbtndata, { buttonid: buttonId });
  }

  async addButton(buttonData: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.create_button, buttonData);
  }

  async updateButton(buttonData: any): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.update_btn, buttonData);
  }

  async deleteButton(buttonId: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.deletebutton, { buttonid: buttonId });
  }

  async getCountryList(): Promise<ButtonResponse<any>> {
    return this.makeGetRequest(env.verifiedcountrylist, {});
  }

  async getCountryLinks(data: CountryLinkData): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.fulltextsearch, data, true);
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
    return this.makeGetRequest(env.getmasterfields);
  }

  async getEmailReminder(): Promise<ButtonResponse<any>> {
    return this.makeGetRequest(env.getemailreminder);
  }

  /**
   * Performs a full text search on links using the specified search criteria
   * @param searchQuery The text to search for
   * @param options Optional search parameters like filters or pagination
   * @returns Promise with search results
   */
  async fullTextSearch(searchQuery: string, options: Record<string, any> = {}): Promise<ButtonResponse<any>> {
    const data = {
      searchText: searchQuery,
      ...options,
    };
    return this.makeRequest(env.fulltextsearch, data);
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
      // Make the API request using axios service without adding apiKey from getApiKey()
      const response = await this.makeRequest<any>(env.create_button, data, true);
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
    // Exclude these keys from comparison
    const excludedKeys = ["crtime", "eptime", "_id", "buttonid", "id", "apikey"];

    const isObjectOrArray = (arg: any): boolean => typeof arg === "object" && arg !== null;

    const getFilteredKeys = (obj: Record<string, any>): string[] => Object.keys(obj).filter((key) => !excludedKeys.includes(key));

    const findDifferences = (a: any, b: any): any => {
      // If one doesn't exist or is null/undefined
      if (!a || !b) return { a, b };

      const diffs: Record<string, any> = {};
      let status = true;

      // Compare simple types directly
      if (!isObjectOrArray(a) || !isObjectOrArray(b)) {
        if (a !== b) {
          status = false;
          return { a, b, status };
        }
        return { status };
      }

      // For arrays, convert to objects with indices as keys
      if (Array.isArray(a) && Array.isArray(b)) {
        const maxLength = Math.max(a.length, b.length);
        for (let i = 0; i < maxLength; i++) {
          if (i >= a.length || i >= b.length) {
            diffs[i] = { a: a[i], b: b[i] };
            status = false;
          } else {
            const result = findDifferences(a[i], b[i]);
            if (!result.status) {
              diffs[i] = result;
              status = false;
            }
          }
        }
        return { status, differences: diffs };
      }

      // For objects, recursively compare each property
      const aKeys = getFilteredKeys(a);
      const bKeys = getFilteredKeys(b);
      const allKeys = new Set([...aKeys, ...bKeys]);

      for (const key of allKeys) {
        if (!aKeys.includes(key) || !bKeys.includes(key)) {
          diffs[key] = { a: a[key], b: b[key] };
          status = false;
        } else {
          const result = findDifferences(a[key], b[key]);
          if (!result.status) {
            diffs[key] = result;
            status = false;
          }
        }
      }

      return { status, differences: diffs };
    };

    const result = findDifferences(json1, json2);
    return {
      status: result.status,
      differences: result.differences || {},
    };
  }

  /**
   * Get button data by button ID
   * @param buttonId ID of the button to retrieve
   * @returns Promise with button data response
   */
  async getButtonData(buttonId: string): Promise<ButtonResponse<any>> {
    return this.makeRequest(env.getbtndata, {
      buttonid: buttonId,
      usertoken: this.generateGuid(),
    });
  }

  /**
   * Duplicates a button and optionally renames it
   * @param buttonId Original button ID to duplicate
   * @param newName Optional new name for the duplicated button
   * @returns Promise with the new button data
   */
  async duplicateButton(buttonId: string, newName?: string): Promise<ButtonResponse<any>> {
    try {
      // Get the original button data
      const response = await this.getButtonData(buttonId);

      if (!response.success || !response.data?.btndata) {
        throw new Error("Failed to get original button data");
      }

      const btnJson = response.data.btndata;

      // Remove properties that shouldn't be copied
      delete btnJson?.sandboxid;

      // Create new button with duplicated data
      const newButtonId = this.generateGuid();
      const jsonDuplicate = {
        apikey: this.getApiKey(),
        buttonid: newButtonId,
        data: btnJson,
      };

      // If new name is provided, update it
      if (newName && newName.trim() !== "") {
        jsonDuplicate.data.name = newName;
      }

      // Add the duplicated button
      const duplicateResponse = await this.addButton(jsonDuplicate);

      if (duplicateResponse.success) {
        // Refresh buttons list
        this.getButtons().then((buttonsResponse) => {
          if (buttonsResponse.success && buttonsResponse.data) {
            dispatchAction(getButtons({ data: buttonsResponse.data.data || [] }));
          }
        });
      }

      return duplicateResponse;
    } catch (error: any) {
      console.error("Error duplicating button:", error);
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Updates a button's Google Sheet URL
   * @param buttonId ID of the button to update
   * @param googleSheetUrl New Google Sheet URL (or empty string to remove)
   * @returns Promise with button update response
   */
  async updateGoogleSheetUrl(buttonId: string, googleSheetUrl: string): Promise<ButtonResponse<any>> {
    try {
      // Get current button data
      const response = await this.getButtonData(buttonId);

      if (!response.success || !response.data?.btndata) {
        throw new Error("Failed to get button data");
      }

      const btnJson = response.data.btndata;

      // If URL is empty, remove Google Sheet properties
      if (googleSheetUrl === "") {
        delete btnJson.googlesheeturl;
        delete btnJson.googleSheet;
        if (btnJson.coverage?.note) {
          delete btnJson.coverage.note;
        }
      } else {
        btnJson.googlesheeturl = googleSheetUrl;
      }

      // Update the button
      const updateData = {
        apikey: this.getApiKey(),
        buttonid: buttonId,
        data: btnJson,
      };

      return this.updateButton(updateData);
    } catch (error: any) {
      console.error("Error updating Google Sheet URL:", error);
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Copies a button from sandbox to production environment with optional Google Sheet URL update
   * @param sandboxButtonId ID of the sandbox button to copy to production
   * @param googleSheetUrl Optional Google Sheet URL to set for the production button
   * @returns Promise with response including new button ID and status
   */
  async copyToProduction(sandboxButtonId: string, googleSheetUrl?: string, prodApiKey?: string): Promise<ButtonSandboxResponse> {
    try {
      // Get sandbox button data
      const response = await this.getButtonData(sandboxButtonId);

      if (!response.success || !response.data?.btndata) {
        throw new Error("Failed to get sandbox button data");
      }

      const btnData = response.data.btndata;

      // Prepare for production
      btnData.org_info.apikey = this.getApiKey();
      if (btnData.coverage?.note) {
        delete btnData.coverage.note;
      }

      // Create production button payload
      const productionPayload = {
        apikey: prodApiKey,
        buttonid: this.generateGuid(),
        data: {
          ...btnData,
          sandboxid: sandboxButtonId,
          ...(googleSheetUrl && { googlesheeturl: googleSheetUrl }),
        },
      };

      console.log("productionPayload", productionPayload);

      // Copy to production
      const prodResponse = await this.buttonAddSendboxToProduction(productionPayload);

      if (prodResponse.success && prodResponse.data?.data) {
        // Optional: Update Google Sheet URL if needed but different from provided
        if (googleSheetUrl && googleSheetUrl !== btnData.googlesheeturl) {
          await this.updateGoogleSheetUrl(prodResponse.data.data.buttonid, googleSheetUrl);
        }
      }

      return prodResponse;
    } catch (error: any) {
      console.error("Error copying to production:", error);
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Checks if a button already exists in production
   * @param sandboxButtonId ID of the sandbox button to check in production
   * @returns Promise with boolean indicating if button exists
   */
  async checkButtonExistsInProduction(sandboxButtonId: string): Promise<ButtonResponse<boolean>> {
    try {
      // This is a simplified implementation - you'll need to adjust based on your actual API
      const buttons = await this.getButtons();

      if (!buttons.success || !buttons.data?.data) {
        return { success: false, error: "Failed to get buttons list" };
      }

      // Check if any button has the given sandbox ID
      const exists = buttons.data.data.some((button: any) => button.sandboxid === sandboxButtonId);

      return { success: true, data: exists };
    } catch (error: any) {
      console.error("Error checking button existence:", error);
      return {
        success: false,
        error: error.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Tests a callback URL by sending a test request
   * @param url The callback URL to test
   * @returns Promise with the test response
   */
  async testCallbackUrl(url: string): Promise<ButtonResponse<CallbackResponse>> {
    try {
      // Validate URL using regex pattern
      const isValidURL =
        /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
          url
        );

      if (!isValidURL) {
        return {
          success: false,
          error: "Invalid URL format",
          data: {
            statusCode: 400,
            type: "validation_error",
          },
        };
      }

      const testData = {
        callbackUrl: url,
        date: new Date().toISOString(),
        request: {
          type: "Sample",
          sandbox: cookies.get("authMode") === "2",
          stage: "Sample",
          docid: "Sample",
        },
        testcallback: true,
      };

      const response = await this.makeRequest<CallbackResponse>(env.getSingleRequestCallback, testData, true);

      // Map response status codes to meaningful messages
      const statusMessages: Record<number, { success: boolean; message: string; type: string }> = {
        200: { success: true, message: "Callback URL tested successfully.", type: "success" },
        401: { success: false, message: "Unauthorized access. Please check your credentials.", type: "error" },
        403: { success: false, message: "Forbidden. Please verify CORS configuration and URL whitelist.", type: "error" },
        404: { success: false, message: "Callback URL not found.", type: "not-found" },
        405: {
          success: false,
          message: "Method not allowed. Please check the callback URL configuration.",
          type: "method-not-allowed",
        },
        500: { success: false, message: "Internal server error occurred.", type: "server-error" },
      };

      const status = response.data?.statusCode || response.data?.status || 500;
      const responseInfo = statusMessages[status] || { success: false, message: "Unknown error occurred", type: "error" };

      return {
        success: responseInfo.success,
        data: {
          statusCode: status,
          type: responseInfo.type,
          message: responseInfo.message,
          ...(response.data || {}),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to test callback URL",
        data: {
          statusCode: 500,
          type: "error",
          message: "An unexpected error occurred while testing the callback URL",
        },
      };
    }
  }
}

// Create and export the singleton instance
export const buttonService = new ButtonService();
