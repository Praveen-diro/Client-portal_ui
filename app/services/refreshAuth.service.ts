import axios from "axios";
import ls from "localstorage-slim";
import { env } from "../config/environment";
import { setAuthToken } from "../utils/tools";
import { cookies } from "./cookie.service";

ls.config.encrypt = true;

export interface RefreshAuthResponse {
  success: boolean;
  message?: string;
  authorization?: string;
}

class RefreshAuthService {
  private async handleRefreshToken(): Promise<RefreshAuthResponse> {
    console.log("handleRefreshToken");
    const refreshToken = cookies.get("refreshToken");
    if (!refreshToken) {
      return { success: false, message: "No refresh token found" };
    }

    try {
      const response = await axios.post(env.accesstoken, { refreshToken });

      if (response.data.message !== "Success!") {
        return { success: false, message: response.data.message };
      }

      if (response.headers.authorization) {
        cookies.set("token", response.headers.authorization);
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
        // Only clear session and reload if not in sandbox/test mode
        const authMode = cookies.get("authMode");
        const isSandboxMode = authMode === "2";

        // Only clear cookies if we're in live mode (authMode !== "2") and token refresh failed
        if (!isSandboxMode) {
          console.log("Token refresh failed in live mode, clearing cookies");
          cookies.clearAll();
          if (reloadAfterRefresh) {
            window.location.reload();
          }
          return;
        } else {
          // In sandbox mode, try to continue without clearing cookies
          console.log("Token refresh failed in sandbox mode, attempting to continue");
        }
      }

      // Execute the callback function
      const result = await callback();

      if (reloadAfterRefresh) {
        window.location.reload();
      }

      return result;
    } catch (error) {
      console.error("Error in refreshAuth:", error);

      // Check if we're in sandbox/test mode
      const authMode = cookies.get("authMode");
      const isSandboxMode = authMode === "2";

      // Only clear cookies on error if not in sandbox mode
      if (!isSandboxMode) {
        cookies.clearAll();
      }

      throw error;
    }
  }
}

export const refreshAuthService = new RefreshAuthService();
