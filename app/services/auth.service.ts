import axios, { AxiosResponse, AxiosError } from "axios";
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
  startQrCode,
  setQrCode,
  qrCodeFail,
  setPasswordError,
  setResetLinkExpired,
} from "../store/features/authSlice";
import { dispatchAction } from "../store/hooks";

// Add a router reference that can be set from components
let globalRouter: any = null;

// Function to set the router reference
export const setAuthRouter = (router: any) => {
  globalRouter = router;
  console.log("Auth router set:", router ? "Router available" : "No router");
};

// Helper function for navigation that uses router when available
const navigateTo = (path: string) => {
  if (globalRouter) {
    // Use router for client-side navigation
    console.log("Navigating with Next.js router:", path);
    globalRouter.push(path);
  } else if (typeof window !== "undefined") {
    // Fallback to window.location only when router is not available
    console.log("Navigating with window.location:", path);
    window.location.href = path;
  }
};

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

// Make CookieService a properly exported object
export const CookieService = {
  set(key: string, value: any) {
    Cookies.set(key, typeof value === "object" ? JSON.stringify(value) : String(value), cookieOptions);
  },

  get(key: string) {
    const cookieValue = Cookies.get(key);
    if (cookieValue) return cookieValue;
    return null;
  },

  remove(key: string) {
    Cookies.remove(key, cookieOptions);
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
    console.time("recaptchaValidation");

    // Cache the recaptcha validation results for 2 minutes to avoid repeated calls
    const cacheKey = `recaptcha_${token.substring(0, 20)}`;
    const cachedResult = localStorage.getItem(cacheKey);

    if (cachedResult) {
      try {
        const parsedResult = JSON.parse(cachedResult);
        const cacheTime = parsedResult.timestamp;

        // Use cached result if it's less than 2 minutes old
        if (Date.now() - cacheTime < 120000) {
          console.log("Using cached reCAPTCHA validation result");
          console.timeEnd("recaptchaValidation");
          return parsedResult.result;
        }
      } catch (e) {
        // If there's an error parsing the cached result, proceed with the API call
        console.error("Error parsing cached reCAPTCHA result:", e);
      }
    }

    try {
      // Set a timeout of 5 seconds for reCAPTCHA validation
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const result = await axios.post(
        env.recaptcha, // Use the existing recaptcha endpoint from environment
        { token },
        {
          timeout: 5000,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // Cache the result
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          result: result.data,
          timestamp: Date.now(),
        })
      );

      console.timeEnd("recaptchaValidation");
      return result.data;
    } catch (error: any) {
      console.error("reCAPTCHA validation error:", error);
      console.timeEnd("recaptchaValidation");

      // If request timed out or network error, assume score is good enough
      // This is a fallback to prevent blocking users if reCAPTCHA service is slow
      if (error.code === "ECONNABORTED" || error.name === "AbortError") {
        console.log("reCAPTCHA validation timed out, using fallback score");
        return { success: true, score: 0.7 };
      }

      // Return a default response with a medium score
      return { success: true, score: 0.5 };
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    dispatchAction(setLoading(true));

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

      // Process the response and dispatch appropriate Redux actions
      if (response.data.error === true) {
        console.log("login failed");
        // Dispatch login failure to Redux
        dispatchAction(loginFail({ payload: response.data }));
      } else if (response.data.statusCode === 242) {
        console.log("login passed");
        if (response.data.sandbox === false || response.data.sandbox === "1") {
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

            // Ensure multiFactorEnabled is set with the correct value
            if (response.data.multiFactorEnabled !== undefined) {
              console.log("Setting multiFactorEnabled cookie:", response.data.multiFactorEnabled);
              CookieService.set("multiFactorEnabled", response.data.multiFactorEnabled ? "true" : "false");
            } else {
              console.log("multiFactorEnabled not found in response, defaulting to false");
              CookieService.set("multiFactorEnabled", "false");
            }
          }

          // Dispatch login authenticated action
          dispatchAction(
            loginAuthenticated({
              headers: response.headers,
              payload: response.data,
              email: credentials.email,
            })
          );
        } else {
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

            // Ensure multiFactorEnabled is set with the correct value
            if (response.data.multiFactorEnabled !== undefined) {
              console.log("Setting multiFactorEnabled cookie (sandbox):", response.data.multiFactorEnabled);
              CookieService.set("multiFactorEnabled", response.data.multiFactorEnabled ? "true" : "false");
            } else {
              console.log("multiFactorEnabled not found in response (sandbox), defaulting to false");
              CookieService.set("multiFactorEnabled", "false");
            }
          }

          // Dispatch sandbox login action
          dispatchAction(
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
        dispatchAction(loginSuccess({ headers: response.headers, payload: response.data }));
      }

      return response;
    } catch (error: any) {
      console.error("Login failed with error:", error.response?.data?.message, error.response?.status);
      // Dispatch login failure action
      if (error.response?.status === 403) {
        console.log("login catch block 403");
        dispatchAction(loginFail({ payload: error.response?.data?.message }));
      } else {
        dispatchAction(loginFail({ payload: error.response?.data || { message: "Login request failed" } }));
      }
      throw error;
    }
  }

  async register(signupData: SignupData) {
    // Dispatch loading action
    dispatchAction(startRegLoader());

    try {
      const response = await axios.post(env.signup, signupData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Dispatch success action
      dispatchAction(
        registerSuccess({
          payload: response.data,
          regloading: false,
        })
      );

      return response;
    } catch (error: any) {
      // Dispatch failure action
      dispatchAction(
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
      dispatchAction(logoutAction());

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      // Still dispatch logout action to Redux even if API calls fail
      dispatchAction(logoutAction());
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
    dispatchAction(setAuthMode(mode));

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
      dispatchAction(setAuthMode(response.data.sandbox === true ? 2 : 1));
    } catch (error) {
      console.error("Final failure in switching the Modes:", error);
      // Default to mode 1 (live) if there's an error
      dispatchAction(setAuthMode(1));
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
      dispatchAction(
        enableTwoFactorAction({
          data: response.data,
        })
      );

      // Send recovery codes via email
      console.log("", response.data.data.recoveryCodes);
      const recoveryCodes = response.data.data.recoveryCodes;
      const emailPayload = this.generateEmailPayload(email, recoveryCodes);

      // Send email reminder

      const emailReminderRes = await axios.post(env.emailReminderUrl, emailPayload);
      console.log("Email reminder response:", emailReminderRes.data);
      console.log("here is the response data ", response.data.data.code);

      // Log in with two-factor authentication
      const twoFactorResponse = await this.twoFactorLogin(email, response.data.data.code, twoFactorId, false);
      if (twoFactorResponse.success) {
        dispatchAction(twoFactorLoginSuccess({ headers: twoFactorResponse.data.headers, payload: twoFactorResponse.data }));
      } else {
        dispatchAction(twoFactorLoginFailure(twoFactorResponse.data));
      }
    } catch (error: any) {
      console.log(error.response?.data, "payload msg");

      // Dispatch error action
      dispatchAction(enableTwoFactorError(error.response?.data || { message: "Failed to enable two-factor authentication" }));

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
    dispatchAction(startQrCode());

    try {
      const response = await axios.post(env.qrCode, null, {
        headers: {
          "Content-Type": "text/html",
        },
      });

      console.log("QR data", response.data);

      // Dispatch success action with the QR code data
      dispatchAction(
        setQrCode({
          secret: response.data.secret,
          secretBase32Encoded: response.data.secretBase32Encoded,
        })
      );
    } catch (error) {
      console.error("QR ERROR", error);

      // Dispatch failure action with error data
      dispatchAction(
        qrCodeFail({
          secret: null,
          secretBase32Encoded: null,
        })
      );
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
    dispatchAction({ type: "START_REG_LOADER" });

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
      dispatchAction({
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
    dispatchAction({ type: "START_REG_LOADER" });

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
        dispatchAction(setPasswordError(false));

        // Expire refresh token if email is provided
        if (forgotData.userEmail) {
          const body = {
            email: forgotData.userEmail,
          };
          await axios.delete(env.expireRefreshtoken, { ...config, data: body });
        }
      } else if (response.data.statusCode === 410) {
        // Dispatch reset link expired
        dispatchAction(setResetLinkExpired(true));
      } else if (response.data.message === "Your new password cannot be the same as your previous password.") {
        // Dispatch password error true
        dispatchAction(setPasswordError(true));
        return response;
      }

      return response;
    } catch (error) {
      console.log("in auth service resetpassword");
      dispatchAction({
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
    dispatchAction({ type: "START_REG_LOADER" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(env.forgot, forgotData, config);

      // Dispatch success action
      dispatchAction({
        type: "FORGOT_PASSWORD",
        payload: { payload: response.data },
      });

      return response;
    } catch (error) {
      console.log("in auth service forgotPassword");

      // Dispatch failure action
      dispatchAction({
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
    console.log("Two-factor login attempt for:", email);

    // Add back the bypass email functionality
    let body;
    const bypassEmails = env.bypassEmails;

    // Bypass email of deepak for testing
    if (bypassEmails.includes(email)) {
      console.log("Calling the specified API for deepak@diro.io");
      try {
        const response = await axios.post(env.twofactorAutomatedOtp, { email });
        console.log("API response for deepak@diro.io:", response.data);
        console.log("otp", response.data.data.code);
        console.log("body of the 2fa " + body);
        body = {
          email,
          fusionotp: response.data.data.code,
          twoFactorId: response.data.data.twoFactorId,
        };
      } catch (error: unknown) {
        // Type assertion for AxiosError
        const axiosError = error as AxiosError;
        console.error("Error calling the specified API:", axiosError.response?.data || axiosError.message);
      }
    } else {
      body = {
        email,
        fusionotp: otp,
        twoFactorId,
      };
    }

    const requestBody = {
      ...body,
      authMode: CookieService.get("authMode") || 1,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      console.log("calling an api");
      const res = await axios.post(env.twoFactorLogin, requestBody, config);

      console.log("res **** " + JSON.stringify(res));
      console.log("res login data " + res.data);
      console.log("res login " + res.data.error);
      console.log("res header " + JSON.stringify(res.headers));
      console.log(res.data.statusCode, "status code");

      if (res.data.message === "Invalid otp!") {
        console.log("error block of the twofa enable");

        // Dispatch login fail action
        dispatchAction(loginFail({ payload: res.data.message }));

        sendLogs("Org Login failed", res.data, "services/auth.service.ts");

        return {
          success: false,
          data: res.data,
        };
      } else if (res.data.statusCode === 200) {
        console.log("Two-factor authentication successful");

        if (res.data.sandbox === false || res.data.sandbox === "1") {
          console.log("live mode");

          // Clear two-factor cookies and set authenticated
          CookieService.remove("isTwoFactor");
          CookieService.remove("twoFactorId");
          CookieService.set("isAuthenticated", "true");

          // Create session
          if (res.headers.authorization) {
            CookieService.set("token", res.headers.authorization);
          }
          CookieService.set("apikey", res.data.doc.apikey);
          CookieService.set("refreshToken", res.data.doc.refreshToken);

          // Set organization data
          if (res.data.doc.orgid) {
            CookieService.set("orgid", res.data.doc.orgid);
          }
          if (res.data.doc.roles) {
            CookieService.set("roles", res.data.doc.roles[0]);
          }

          // Dispatch login success action for live mode
          dispatchAction(twoFactorLoginSuccess({ headers: res.headers, payload: res.data }));

          sendLogs("Org Login success", "Org logged in successfully", "services/auth.service.ts");

          // Redirect to dashboard if in browser - USE NAVIGATETO INSTEAD OF DIRECT WINDOW LOCATION
          if (typeof window !== "undefined") {
            console.log("Redirecting to validation buttons");
            navigateTo("/client/validation-buttons");
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
          CookieService.remove("requiresTwoFactor");
          CookieService.set("isAuthenticated", "true");

          // Dispatch login success action for sandbox
          dispatchAction(twoFactorLoginSuccess({ headers: res.headers, payload: res.data }));

          sendLogs("Sandbox Login", "Sandbox logged in successfully", "services/auth.service.ts");

          // Redirect to dashboard if in browser - USE NAVIGATETO INSTEAD OF DIRECT WINDOW LOCATION
          if (typeof window !== "undefined") {
            console.log("Redirecting to validation buttons in sandbox mode");
            navigateTo("/client/validation-buttons");
          }

          return {
            success: true,
            data: res.data,
          };
        }
      } else {
        console.log("login fail");

        // Dispatch default login fail action
        dispatchAction(loginFail({ payload: res.data }));

        return {
          success: false,
          data: res.data,
        };
      }
    } catch (error: any) {
      console.log("error block", error.response?.data);

      // Dispatch two-factor error action
      dispatchAction(loginFail(error.response?.data || { message: "Two-factor authentication failed" }));

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
