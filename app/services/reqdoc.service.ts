import axios, { AxiosResponse } from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { axiosService } from "./axios.service";
import { refreshAuthService } from "./refreshAuth.service";
import { apiService, ApiResponse } from "./api.service";

ls.config.encrypt = true;

export interface ReqDocResponse<T> extends ApiResponse<T> {}

class ReqDocService {
  constructor() {
    axiosService.setupAxiosDefaults();
  }

  async getInviteLink(json: any): Promise<ReqDocResponse<any>> {
    const response = await apiService.makeRefreshAuthRequest(env.getverificationlink, json);
    return {
      ...response,
      loading: false,
    };
  }

  async getTestPreview(json: any): Promise<ReqDocResponse<any>> {
    const response = await apiService.makeRefreshAuthRequest(env.getverificationlink, json);

    if (response.data && typeof response.data === "object" && "verificationlink" in response.data) {
      console.log("Verification link:", response.data.verificationlink);
    }

    return {
      ...response,
      loading: false,
    };
  }

  async sendRequest(json: any): Promise<ReqDocResponse<any>> {
    const response = await apiService.makeRefreshAuthRequest(env.sendsmsfororg, json);
    return {
      ...response,
      loading: false,
    };
  }
}

export const reqDocService = new ReqDocService();
