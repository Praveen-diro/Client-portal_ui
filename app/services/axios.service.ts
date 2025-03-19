import axios from "axios";
import { cookies } from "./cookie.service";

class AxiosService {
  /**
   * Sets up default axios headers with authentication token
   */
  setupAxiosDefaults(): void {
    const token = cookies.get("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = token as string;
    }
  }
}

// Export a singleton instance
export const axiosService = new AxiosService();
