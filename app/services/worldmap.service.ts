import ls from "localstorage-slim";
import axios from "axios";
import { env } from "../config/environment";
import { cookies } from "./cookie.service";

export interface WorldMapResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
  loading?: boolean;
}

export interface CountryData {
  uniquekey: string;
  country: string;
  alpha2code: string;
}

export interface SourceData {
  category: string;
  country: string;
  countryid: string;
  id?: string;
  link: string;
  nickname: string;
  subcategory: string;
  type: string;
}

class WorldMapService {
  private subscribers: ((data: any) => void)[] = [];

  subscribe(callback: (data: any) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  private notifySubscribers(data: any): void {
    this.subscribers.forEach((callback) => callback(data));
  }

  private getApiKey(): string {
    return cookies.get("apikey") || "";
  }

  async getCategory(): Promise<WorldMapResponse<any>> {
    try {
      const response = await axios.get(env.worldmap);
      this.notifySubscribers({ type: "GET_COVERAGE_HEADER", data: response.data });
      return {
        success: true,
        data: response.data,
        loading: false,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        loading: false,
      };
    }
  }

  async getVerifiedCountries(): Promise<WorldMapResponse<CountryData[]>> {
    try {
      const response = await axios.get(env.getVerifiedCountry);
      console.log('API Response:', response); // Debug log
      
      // Check if response.data exists and has the expected structure
      if (response.data && Array.isArray(response.data.data)) {
        return {
          success: true,
          data: response.data.data,
          loading: false,
        };
      } else if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
          loading: false,
        };
      }
      
      console.error('Unexpected API response structure:', response.data);
      return {
        success: false,
        error: 'Invalid API response structure',
        loading: false,
        data: [],
      };
    } catch (error: any) {
      console.error('Error fetching countries:', error);
      return {
        success: false,
        error: error.message,
        loading: false,
        data: [],
      };
    }
  }

  async getCountryLinks(category: string, country: string, search: string = ""): Promise<WorldMapResponse<any>> {
    try {
      const data = {
        category,
        country,
        index: 0,
        offset: 100,
        search,
      };
      const response = await axios.post(env.fulltextsearch, data);
      return {
        success: true,
        data: response.data.data,
        loading: false,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        loading: false,
      };
    }
  }

  async createSource(data: SourceData): Promise<WorldMapResponse<any>> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'JWT token is missing or incorrect',
          loading: false
        };
      }

      const json = {
        ...data,
        submit: {
          apikey: apiKey,
          country: data.country,
          countryid: data.countryid,
          mobile: cookies.get("email"),
        },
      };

      const response = await axios.post(env.createsource, json);
      return {
        success: true,
        data: response.data,
        loading: false,
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'JWT token is missing or incorrect',
          loading: false
        };
      }
      return {
        success: false,
        error: error.message,
        loading: false,
      };
    }
  }

  async updateSource(data: SourceData): Promise<WorldMapResponse<any>> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'JWT token is missing or incorrect',
          loading: false
        };
      }

      const response = await axios.post(env.updatesource, data);
      return {
        success: true,
        data: response.data,
        loading: false,
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'JWT token is missing or incorrect',
          loading: false
        };
      }
      return {
        success: false,
        error: error.message,
        loading: false,
      };
    }
  }

  async deleteSource(data: any): Promise<WorldMapResponse<any>> {
    try {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'JWT token is missing or incorrect',
          loading: false
        };
      }

      const json = {
        category: data.category,
        country: data.country,
        countryid: data.uniquekey,
        id: data.id,
        link: data.link,
        nickname: "",
        subcategory: "",
        submit: {
          country: data.country,
          countryid: data.uniquekey,
          mobile: cookies.get("email"),
          apikey: apiKey,
        },
      };

      console.log('Delete payload:', json);
      const response = await axios.post(env.deletesource, json);
      
      return {
        success: true,
        data: response.data,
        loading: false,
      };
    } catch (error: any) {
      console.error('Error deleting source:', error);
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'JWT token is missing or incorrect',
          loading: false
        };
      }
      return {
        success: false,
        error: error.message,
        loading: false,
      };
    }
  }

  // Additional methods can be added here for future worldmap functionality
  // For example:
  // - getCoverageData
  // - getRegionDetails
  // - updateCoverage
}

export const worldMapService = new WorldMapService();
