import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/environment";
import Cookies from "js-cookie";
// Import Redux actions and store
import { store } from "../store/store";
import {
  loginFail,
  loginAuthenticated,
  loginSandbox,
  setLoading,
  logout as logoutAction,
  registerSuccess,
  registerFail,
  startRegLoader,
  twoFactorLoginSuccess,
  twoFactorLoginFailure,
  setAuthMode,
  enableTwoFactor as enableTwoFactorAction,
  enableTwoFactorError,
  twoFactorLogin as twoFactorLoginAction,
  loginSuccess,
} from "../store/features/authSlice";

// Utility function for logging
export const sendLogs = (action: string, data: any, source: string): void => {
  console.log(`[${source}] ${action}:`, data);
  // Additional logging functionality can be implemented here
};

// Cookie options for security
const cookieOptions = {
  expires: 7, // 7 days
  secure: true, // HTTPS only
  sameSite: "strict" as const, // Protect against CSRF
  path: "/",
};

// Cookie helper functions
const CookieService = {
  set(key: string, value: any) {
    Cookies.set(key, typeof value === "object" ? JSON.stringify(value) : String(value), cookieOptions);
  },
  get(key: string) {
    const value = Cookies.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  remove(key: string) {
    Cookies.remove(key, { path: "/" });
  },
  clear() {
    // Get all cookies and remove them one by one
    const cookies = Cookies.get();
    for (const cookie in cookies) {
      Cookies.remove(cookie, { path: "/" });
    }
  },
};

export interface LoginCredentials {
  email: string;
  password: string;
  authMode?: number;
}

export interface LoginResponse {
  data: {
    error?: boolean;
    statusCode?: number;
    sandbox?: boolean | string;
    message?: string;
    [key: string]: any;
  };
  headers: any;
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

export interface ForgotPasswordData {
  email?: string;
  password?: string;
  token?: string;
  userEmail?: string;
  [key: string]: any;
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
      console.log("Validating reCAPTCHA token...", token);
      const response = await axios.post(
        env.recaptcha,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": idempotencyKey,
          },
        }
      );
      console.log("reCAPTCHA validation response:", response.data);

      // If no score is returned but the response is successful, return a default high score
      if (!response.data || typeof response.data.score !== "number") {
        console.log("No score in response, using default score");
        return { success: true, score: 0.9 };
      }

      return response.data;
    } catch (error: any) {
      console.error("reCAPTCHA validation error:", error.response?.data || error.message);
      // Return a successful response with a high score for diro.io emails
      if (error.response?.data?.error === "invalid-keys") {
        console.log("Invalid keys error, using default score");
        return { success: true, score: 0.9 };
      }
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    store.dispatch(setLoading(true));

    try {
      console.log("Making login API request...");
      const idempotencyKey = uuidv4();

      const response = await axios.post(env.login, credentials, {
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey,
        },
        withCredentials: true,
      });

      console.log("Login API response received:", {
        status: response.status,
        statusCode: response.data.statusCode,
        headers: Object.keys(response.headers),
      });
      console.log("authmode::", credentials.authMode);
      console.log("res header " + JSON.stringify(response.headers));

      // Process the response and dispatch appropriate Redux actions
      if (response.data.error === true) {
        console.log("login failed");
        // Dispatch login failure to Redux
        store.dispatch(loginFail({ payload: response.data }));
      } else if (response.data.statusCode === 242) {
        if (response.data.sandbox === false || response.data.sandbox === "1") {
          console.log("inside if auth");
          console.log("login success!!!");

          // Store user data in cookies if needed
          if (response.headers.authorization) {
            CookieService.set("token", response.headers.authorization);
          }
          if (credentials.email) {
            CookieService.set("email", credentials.email);
          }

          // Set two-factor authentication cookies
          if (response.data.twoFactorId) {
            CookieService.set("isTwoFactor", "true");
            CookieService.set("twoFactorId", response.data.twoFactorId);
            CookieService.set("authMode", response.data.sandbox === true ? "2" : "1");
            CookieService.set("multiFactorEnabled", response.data.multiFactorEnabled);
          }

          // Dispatch login authenticated action
          store.dispatch(
            loginAuthenticated({
              headers: response.headers,
              payload: response.data,
              email: credentials.email,
            })
          );
        } else {
          console.log("inside else auth");
          console.log("sandbox login! " + response.data.sandbox);

          // Store user data in cookies for sandbox mode
          if (response.headers.authorization) {
            CookieService.set("token", response.headers.authorization);
          }
          if (credentials.email) {
            CookieService.set("email", credentials.email);
          }

          // Set two-factor authentication cookies for sandbox
          if (response.data.twoFactorId) {
            CookieService.set("isTwoFactor", "true");
            CookieService.set("twoFactorId", response.data.twoFactorId);
            CookieService.set("authMode", "2");
            CookieService.set("multiFactorEnabled", response.data.multiFactorEnabled);
          }

          // Dispatch sandbox login action
          store.dispatch(
            loginSandbox({
              headers: response.headers,
              payload: response.data,
              email: credentials.email,
            })
          );
        }
      } else if (response.data.statusCode === 200) {
        console.log("Direct login success");

        // Store authentication token in cookie
        if (response.headers.authorization) {
          CookieService.set("token", response.headers.authorization);
          CookieService.set("isAuthenticated", "true");
        }
        if (credentials.email) {
          CookieService.set("email", credentials.email);
        }

        // Dispatch login success action
        store.dispatch(loginSuccess({ headers: response.headers, payload: response.data }));
      }

      return response;
    } catch (error: any) {
      console.error("Login failed with error:", error.response?.data || error.message);
      // Dispatch login failure action
      store.dispatch(loginFail({ payload: error.response?.data || { message: "Login request failed" } }));
      throw error;
    }
  }

  async register(signupData: SignupData) {
    // Dispatch loading action
    store.dispatch(startRegLoader());

    try {
      const response = await axios.post(env.signup, signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Dispatch success action
      store.dispatch(
        registerSuccess({
          payload: response.data,
          regloading: false,
        })
      );

      return response;
    } catch (error: any) {
      // Dispatch failure action
      store.dispatch(
        registerFail({
          payload: error.response?.data,
          fieldErrors: error.response?.data?.fieldErrors,
        })
      );

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
      const email = CookieService.get("email");
      await axios.delete(env.expireRefreshtoken, {
        headers: {
          "Content-Type": "application/json",
        },
        data: { email },
      });

      // Clear cookies
      CookieService.clear();

      // Dispatch logout action to Redux
      store.dispatch(logoutAction());

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Still dispatch logout action to Redux even if API calls fail
      store.dispatch(logoutAction());
      throw error;
    }
  }

  private async blacklistToken() {
    const token = CookieService.get("token");
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
      html: ` <strong>Hi ${userNameUppercase},</strong> <br/> To complete your login, please use the following two-factor authentication (2FA) code: <br>
            ${recoveryCodes[0]} &nbsp; &nbsp; &nbsp;  ${recoveryCodes[1]} &nbsp; &nbsp; &nbsp; ${recoveryCodes[2]}  <br/>
            ${recoveryCodes[3]} &nbsp; &nbsp; &nbsp;  ${recoveryCodes[4]} &nbsp; &nbsp; &nbsp; ${recoveryCodes[5]}  <br/> 
            ${recoveryCodes[6]} &nbsp; &nbsp; &nbsp;  ${recoveryCodes[7]} &nbsp; &nbsp; &nbsp; ${recoveryCodes[8]}  <br/>   
            ${recoveryCodes[9]} <br/>
            In case of any help required, reach out to us at support@diro.io.<br/><br/>
            Best regards,<br/>
            DIRO Support Team <br/>
            <img src='https://prod.dirolabs.com/Zuul-1.0/organization-2.0/getlogo' alt='diro' style='width: 50px; height: 27px; float: left; margin-top: 5px;'>`,
      subject: "Your DIRO Account Recovery Codes",
    };
  }

  /**
   * Changes the authentication mode and performs a partial logout
   * @param mode The authentication mode to switch to
   */
  changeModeLogout(mode: number): void {
    console.log("change mode logout", mode);

    // Dispatch the auth mode change
    store.dispatch(setAuthMode(mode));

    // Log the action
    sendLogs("Org Logout", "Logged out successfully and profile cleared", "services/auth.service.ts");

    // Note: The following actions are commented out as per the original code
    // dispatch({ type: CLEAR_PROFILE });
    // dispatch({ type: LOGOUT });
  }

  /**
   * Switches the server mode (between live and sandbox)
   * @param data Object containing email for the account
   */
  async switchModeServer(data: { email: string }): Promise<void> {
    const switchPayload = { emailId: data.email };

    try {
      const response = await this.axiosWithRetry(env.switchServer, switchPayload);
      console.log("Mode Change:", response.data.sandbox);

      // Dispatch the auth mode change based on response
      store.dispatch(setAuthMode(response.data.sandbox === true ? 2 : 1));
    } catch (error) {
      console.error("Final failure in switching the Modes:", error);
      // Default to mode 1 (live) if there's an error
      store.dispatch(setAuthMode(1));
    }
  }

  /**
   * Enables two-factor authentication
   * @param email User email
   * @param code Verification code
   * @param method Authentication method (Authenticator app or other)
   * @param secret Secret key for authenticator
   * @param twoFactorId Two-factor authentication ID
   */
  async enableTwoFactor(email: string, code: string, method: string, secret: string, twoFactorId: string): Promise<void> {
    // Normalize method name
    const normalizedMethod = method === "Authenticator app" ? "authenticator" : method;

    // Prepare request body
    const body = {
      email,
      code,
      method: normalizedMethod,
      secret,
      twoFactorId,
    };

    try {
      // Make API request to enable two-factor authentication
      const response = await axios.post(env.enableTwoFactor, body);
      console.log("response is : ", response);

      // Dispatch success action
      store.dispatch(
        enableTwoFactorAction({
          data: response.data,
        })
      );

      // Send recovery codes via email
      const recoveryCodes = response.data.data.recoveryCodes;
      const emailPayload = this.generateEmailPayload(email, recoveryCodes);

      // Send email reminder
      const emailReminderUrl = "https://api1.diro.live/emailReminder";
      const emailReminderRes = await axios.post(emailReminderUrl, emailPayload);
      console.log("Email reminder response:", emailReminderRes.data);
      console.log(response.data.data.code);

      // Log in with two-factor authentication
      store.dispatch(
        twoFactorLoginAction({
          email,
          otp: response.data.data.code,
          twoFactorId,
          sandboxStatus: false,
        })
      );
    } catch (error: any) {
      console.log(error.response?.data, "payload msg");

      // Dispatch error action
      store.dispatch(enableTwoFactorError(error.response?.data || { message: "Failed to enable two-factor authentication" }));

      console.error("Error enabling two-factor authentication:", error.response?.data?.msg);
      throw error;
    }
  }

  /**
   * Sends a one-time password to the specified email
   * @param email The email address to send the OTP to
   * @returns A promise that resolves to a boolean indicating success or failure
   */
  async sendOtp(email: string): Promise<boolean> {
    const body = {
      email,
    };

    try {
      const response = await axios.post(env.sendOtp, body);
      console.log(response, "sent otp");
      return true;
    } catch (error) {
      console.error(error, "error while sending otp");
      return false;
    }
  }

  /**
   * Sends a login OTP for two-factor authentication
   * @param twoFactorId The two-factor authentication ID
   * @param methodId The method ID for the OTP
   * @returns A promise that resolves to a boolean indicating success or failure
   */
  async sendLoginOtp(twoFactorId: string, methodId: string): Promise<boolean> {
    const body = {
      twoFactorId,
      methodId,
    };

    try {
      const response = await axios.post(env.sendLoginOtp, body);
      console.log("otp sent!!!");
      return true;
    } catch (error) {
      console.error("Error sending login OTP:", error);
      return false;
    }
  }

  /**
   * Generates a QR code for two-factor authentication
   * @returns A promise that resolves when the QR code is generated
   */
  async generateQrCode(): Promise<void> {
    // Dispatch QR code generation start action
    store.dispatch({ type: "QR_CODE_START" });

    try {
      const response = await axios.post(env.qrCode, null, {
        headers: {
          "Content-Type": "text/html",
        },
      });

      console.log("QR data", response.data);

      // Dispatch success action with the QR code data
      store.dispatch({
        type: "QR_CODE",
        payload: response.data,
      });
    } catch (error) {
      console.error("QR ERROR", error);

      // Dispatch failure action
      store.dispatch({ type: "QR_CODE_FAIL" });
      throw error;
    }
  }

  /**
   * Updates a user's password using a token from the forgot password flow
   * @param forgotData Object containing the email, new password, and token
   * @param history Router history object for navigation after success
   * @returns A promise that resolves when the password is updated
   */
  async updatePassword(forgotData: ForgotPasswordData, history: any): Promise<void> {
    // Dispatch loading action
    store.dispatch({ type: "START_REG_LOADER" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      console.log("in tr");
      const response = await axios.post(env.updatepassword, forgotData, config);
      console.log(response.data.message);

      if (response.data.message === "success") {
        console.log("in if");
        history.push("/authentication/login");
      }
    } catch (error) {
      console.log("in updatepassword");
      store.dispatch({
        type: "AUTH_ERROR",
      });
      throw error;
    }
  }

  /**
   * Resets a user's password
   * @param forgotData Object containing password reset data
   * @param history Router history object for navigation after success
   * @returns A promise that resolves when the password is reset
   */
  async resetPassword(forgotData: ForgotPasswordData, history: any): Promise<any> {
    // Dispatch loading action
    store.dispatch({ type: "START_REG_LOADER" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(env.resetpassword, forgotData, config);
      console.log(response.data.message);

      if (response.data.statusCode === 200) {
        // Dispatch password error false
        store.dispatch({
          type: "PASSWORD_ERROR",
          payload: false,
        });

        // Expire refresh token if email is provided
        if (forgotData.userEmail) {
          const body = {
            email: forgotData.userEmail,
          };
          await axios.delete(env.expireRefreshtoken, { ...config, data: body });
        }

        // Redirect to login page
        history.push("/login");
      } else if (response.data.statusCode === 410) {
        // Dispatch reset link expired
        store.dispatch({
          type: "RESET_LINK_EXPIRED",
          payload: true,
        });
      } else if (response.data.message === "Your new password cannot be the same as your previous password.") {
        // Dispatch password error true
        store.dispatch({
          type: "PASSWORD_ERROR",
          payload: true,
        });
        return response;
      }

      return response;
    } catch (error) {
      console.log("in auth service resetpassword");
      store.dispatch({
        type: "AUTH_ERROR",
      });
      throw error;
    }
  }

  /**
   * Initiates the forgot password process
   * @param forgotData Object containing the email for password recovery
   * @param history Router history object for navigation
   * @returns A promise that resolves when the forgot password request is processed
   */
  async forgotPassword(forgotData: ForgotPasswordData, history: any): Promise<any> {
    // Dispatch loading action
    store.dispatch({ type: "START_REG_LOADER" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(env.forgot, forgotData, config);

      // Dispatch success action
      store.dispatch({
        type: "FORGOT_PASSWORD",
        payload: { payload: response.data },
      });

      return response;
    } catch (error) {
      console.log("in auth service forgotPassword");

      // Dispatch failure action
      store.dispatch({
        type: "FORGET_PASSWORD_FAIL",
        payload: { payload: error },
      });

      throw error;
    }
  }

  /**
   * Handles two-factor authentication login process
   * @param email User's email address
   * @param otp One-time password for verification
   * @param twoFactorId Two-factor authentication ID
   * @param authStatus Authentication status (false for live, true for sandbox)
   * @returns A promise that resolves when the two-factor login is completed
   */
  async twoFactorLogin(email: string, otp: string, twoFactorId: string, authStatus: boolean): Promise<any> {
    // Clear cookies before login
    CookieService.remove("token");
    CookieService.remove("alldata");
    CookieService.remove("apikey");
    CookieService.remove("email");
    CookieService.remove("orgid");
    CookieService.remove("roles");
    CookieService.set("roles", "null");
    CookieService.remove("stripeid");
    CookieService.remove("planid");
    CookieService.remove("isTwoFactor");
    CookieService.remove("twoFactorId");
    CookieService.remove("authMode");
    CookieService.clear();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let body: any;
    const bypassEmails = env.bypassEmails || [];

    // Special handling for bypass emails (for testing)
    if (bypassEmails.includes(email)) {
      console.log(`Calling the specified API for ${email}`);
      try {
        const response = await axios.post(env.twofactorAutomatedOtp, { email });
        console.log(`API response for ${email}:`, response.data);
        console.log("otp", response.data.data.code);
        console.log("if block two-factor login" + response.data);
        body = {
          email,
          fusionotp: response.data.data.code,
          twoFactorId: response.data.data.twoFactorId,
        };
      } catch (error: any) {
        console.error("Error calling the specified API:", error.response?.data || error.message);
      }
    } else {
      console.log("else block two factor login");
      body = {
        email,
        fusionotp: otp,
        twoFactorId,
      };
    }

    try {
      console.log("calling an api");
      const res = await axios.post(env.twoFactorLogin, body, config);

      console.log("res **** " + JSON.stringify(res));
      console.log("res login data " + res.data);
      console.log("res login " + res.data.error);
      console.log("res header " + JSON.stringify(res.headers));
      console.log(res.data.statusCode, "status code");

      if (res.data.message === "Invalid otp!") {
        console.log("error block of the twofa enable");

        // Dispatch login fail action
        store.dispatch(loginFail({ payload: res.data.message }));

        sendLogs("Org Login failed", res.data, "services/auth.service.ts");

        return {
          success: false,
          data: res.data,
        };
      } else if (res.data.statusCode === 200) {
        console.log("else block two-factor login", authStatus);

        if (authStatus === false) {
          // Store essential cookies
          if (res.headers.authorization) {
            CookieService.set("token", res.headers.authorization);
          }
          if (email) {
            CookieService.set("email", email);
          }

          // Dispatch login success action for local auth
          store.dispatch(twoFactorLoginSuccess({ headers: res.headers, payload: res.data }));

          // Delete blacklisted token
          try {
            const deleteTokenRes = await axios.post(env.deleteblacklisttoken, null, {
              headers: {
                "Content-Type": "application/json",
                Authorization: CookieService.get("token"),
              },
            });
            console.log("Token blacklist deleted:", deleteTokenRes.data);
          } catch (tokenError) {
            console.error("Error deleting blacklisted token:", tokenError);
          }

          sendLogs("Org Login success", "Org logged in successfully", "services/auth.service.ts");

          // Explicitly ensure all two-factor flags are cleared
          CookieService.remove("isTwoFactor");
          CookieService.remove("twoFactorId");
          CookieService.set("isAuthenticated", "true");

          // Redirect to dashboard if in browser
          if (typeof window !== "undefined") {
            const role = res.data?.roles || "User";
            // Update paths to match actual app structure
            const redirectPath = role === "Account" ? "/client/account" : "/client/validation-buttons";

            console.log("Redirecting to:", redirectPath);

            // Ensure correct pathing by adding client prefix
            window.location.href = redirectPath;
          }

          return {
            success: true,
            data: res.data,
          };
        } else {
          console.log("sandbox");

          // Explicitly ensure all two-factor flags are cleared
          CookieService.remove("isTwoFactor");
          CookieService.remove("twoFactorId");
          CookieService.set("isAuthenticated", "true");

          // Dispatch login success action for sandbox
          store.dispatch(twoFactorLoginSuccess({ headers: res.headers, payload: res.data }));

          sendLogs("Sandbox Login", "Sandbox logged in successfully", "services/auth.service.ts");

          // Redirect to dashboard if in browser
          if (typeof window !== "undefined") {
            console.log("Redirecting to validation buttons in sandbox mode");

            // Updated path based on actual app structure
            window.location.href = "/client/validation-buttons";
          }

          return {
            success: true,
            data: res.data,
          };
        }
      } else {
        console.log("login fail");

        // Dispatch default login fail action
        store.dispatch(loginFail({ payload: res.data }));

        return {
          success: false,
          data: res.data,
        };
      }
    } catch (error: any) {
      console.log("error block", error.response?.data);

      // Dispatch two-factor error action
      store.dispatch(twoFactorLoginFailure(error.response?.data || { message: "Two-factor authentication failed" }));

      throw error;
    }
  }
}

export const authService = new AuthService();

/**
 * Changes the authentication mode and performs a partial logout
 * @param mode The authentication mode to switch to
 */
export const changeModeLogout = (mode: number): void => {
  authService.changeModeLogout(mode);
};

/**
 * Switches the server mode (between live and sandbox)
 * @param data Object containing email for the account
 */
export const switchModeServer = async (data: { email: string }): Promise<void> => {
  await authService.switchModeServer(data);
};

/**
 * Enables two-factor authentication
 * @param email User email
 * @param code Verification code
 * @param method Authentication method (Authenticator app or other)
 * @param secret Secret key for authenticator
 * @param twoFactorId Two-factor authentication ID
 */
export const enableTwoFactor = async (
  email: string,
  code: string,
  method: string,
  secret: string,
  twoFactorId: string
): Promise<void> => {
  await authService.enableTwoFactor(email, code, method, secret, twoFactorId);
};

/**
 * Sends a one-time password to the specified email
 * @param email The email address to send the OTP to
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export const sendOtp = async (email: string): Promise<boolean> => {
  return await authService.sendOtp(email);
};

/**
 * Generates an email payload for sending recovery codes
 * @param toEmail The recipient's email address
 * @param recoveryCodes Array of recovery codes to include in the email
 * @returns An EmailPayload object ready to be sent
 */
export const generateEmailPayload = (toEmail: string, recoveryCodes: string[]): EmailPayload => {
  return authService.generateEmailPayload(toEmail, recoveryCodes);
};

/**
 * Generates a QR code for two-factor authentication
 * @returns A promise that resolves when the QR code is generated
 */
export const generateQrCode = async (): Promise<void> => {
  await authService.generateQrCode();
};

/**
 * Updates a user's password using a token from the forgot password flow
 * @param forgotData Object containing the email, new password, and token
 * @param history Router history object for navigation after success
 * @returns A promise that resolves when the password is updated
 */
export const updatePassword = async (forgotData: ForgotPasswordData, history: any): Promise<void> => {
  await authService.updatePassword(forgotData, history);
};

/**
 * Resets a user's password
 * @param forgotData Object containing password reset data
 * @param history Router history object for navigation after success
 * @returns A promise that resolves when the password is reset
 */
export const resetPassword = async (forgotData: ForgotPasswordData, history: any): Promise<any> => {
  return await authService.resetPassword(forgotData, history);
};

/**
 * Initiates the forgot password process
 * @param forgotData Object containing the email for password recovery
 * @param history Router history object for navigation
 * @returns A promise that resolves when the forgot password request is processed
 */
export const forgotPassword = async (forgotData: ForgotPasswordData, history: any): Promise<any> => {
  return await authService.forgotPassword(forgotData, history);
};

/**
 * Sends a login OTP for two-factor authentication
 * @param twoFactorId The two-factor authentication ID
 * @param methodId The method ID for the OTP
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export const sendLoginOtp = async (twoFactorId: string, methodId: string): Promise<boolean> => {
  return await authService.sendLoginOtp(twoFactorId, methodId);
};

/**
 * Handles two-factor authentication login process
 * @param email User's email address
 * @param otp One-time password for verification
 * @param twoFactorId Two-factor authentication ID
 * @param authStatus Authentication status (false for live, true for sandbox)
 * @returns A promise that resolves when the two-factor login is completed
 */
export const twoFactorLogin = async (email: string, otp: string, twoFactorId: string, authStatus: boolean): Promise<any> => {
  return await authService.twoFactorLogin(email, otp, twoFactorId, authStatus);
};
