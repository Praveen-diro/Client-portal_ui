import axios from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { setAuthToken } from "../utils/tools";
import { CookieService } from "./auth.service";

ls.config.encrypt = true;

export interface RefreshAuthResponse {
  success: boolean;
  message?: string;
  authorization?: string;
}

class RefreshAuthService {
  private async handleRefreshToken(): Promise<RefreshAuthResponse> {
    console.log("handleRefreshToken");
    const refreshToken = CookieService.get("refreshToken");
    if (!refreshToken) {
      return { success: false, message: "No refresh token found" };
    }

    try {
      const response = await axios.post(env.accesstoken, { refreshToken });

      if (response.data.message !== "Success!") {
        return { success: false, message: response.data.message };
      }

      if (response.headers.authorization) {
        CookieService.set("token", response.headers.authorization);
        setAuthToken(response.headers.authorization);
        return {
          success: true,
          authorization: response.headers.authorization,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error refreshing token:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async refreshAuth<T>(callback: () => Promise<T>, reloadAfterRefresh: boolean = true): Promise<T | void> {
    try {
      const refreshResult = await this.handleRefreshToken();

      if (!refreshResult.success) {
        // Clear user session
        ls.clear();
        if (reloadAfterRefresh) {
          window.location.reload();
        }
        return;
      }

      // Execute the callback function
      const result = await callback();

      if (reloadAfterRefresh) {
        window.location.reload();
      }

      return result;
    } catch (error) {
      console.error("Error in refreshAuth:", error);
      throw error;
    }
  }
}

export const refreshAuthService = new RefreshAuthService();
