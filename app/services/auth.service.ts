import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/environment";
import ls from "localstorage-slim";

ls.config.encrypt = true;

export interface LoginCredentials {
  email: string;
  password: string;
  authMode?: number;
}

export interface SignupData {
  email?: string;
  country?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  companyname?: string;
  building?: string;
  roleincompany?: string;
}

export interface EmailPayload {
  to: string;
  port: number;
  host: string;
  user: string;
  password: string;
  html: string;
  subject: string;
}

class AuthService {
  private async axiosWithRetry(url: string, data: any, retries = 3, delay = 1000): Promise<AxiosResponse> {
    for (let i = 0; i < retries; i++) {
      try {
        return await axios.post(url, data);
      } catch (error) {
        if (i < retries - 1) {
          console.warn(`Retrying request... Attempt ${i + 1}`);
          await new Promise((res) => setTimeout(res, delay * (i + 1))); // Exponential backoff
        } else {
          throw error;
        }
      }
    }
    throw new Error("Max retries reached");
  }

  async validateRecaptcha(token: string) {
    const idempotencyKey = uuidv4();
    try {
      const response = await axios.post(
        env.recaptcha,
        { token },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Idempotency-Key": idempotencyKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials: LoginCredentials) {
    // Clear local storage before login
    ls.remove("token");
    ls.remove("alldata");
    ls.remove("apikey");
    ls.remove("email");
    ls.remove("orgid");
    ls.remove("roles");
    ls.set("roles", "null");
    ls.remove("stripeid");
    ls.remove("planid");
    ls.clear();

    const idempotencyKey = uuidv4();
    try {
      const response = await axios.post(env.login, credentials, {
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(signupData: SignupData) {
    try {
      const response = await axios.post(env.signup, signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async verifyTwoFactor(twoFactorId: string, code: string) {
    try {
      const response = await axios.post(env.twoFactorLogin, {
        twoFactorId,
        code,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateOrg(formData: any) {
    try {
      const response = await axios.post(env.updateorganization, formData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCountries() {
    try {
      const response = await axios.get(env.verifiedcountrylist, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      // Blacklist current token
      await this.blacklistToken();

      // Expire refresh token
      const email = ls.get("email");
      await axios.delete(env.expireRefreshtoken, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { email },
      });

      // Clear local storage
      ls.clear();

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  private async blacklistToken() {
    const token = ls.get("token");
    if (!token) {
      console.warn("No token found to blacklist.");
      return;
    }

    const authHeader = `Bearer ${token}`;
    axios.defaults.headers.common["Authorization"] = authHeader;

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await axios.post(env.blacklisttoken);
        console.log("Token blacklisted successfully");
        return;
      } catch (error) {
        attempt++;
        console.error(`Error blacklisting token (Attempt ${attempt}):`, error);

        if (attempt >= maxRetries) {
          console.error("Max retries reached. Could not blacklist token.");
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  generateEmailPayload(toEmail: string, recoveryCodes: string[]): EmailPayload {
    const username = toEmail.split("@")[0];
    const userNameUppercase = username.charAt(0).toUpperCase() + username.slice(1);

    return {
      to: toEmail,
      port: Number(env.emailPort),
      host: env.emailHost,
      user: env.emailAccount,
      password: env.emailPassword,
      html: `<strong>Hi ${userNameUppercase},</strong> <br/>...`, // Rest of the HTML
      subject: "Your DIRO Account Recovery Codes",
    };
  }
}

export const authService = new AuthService();
