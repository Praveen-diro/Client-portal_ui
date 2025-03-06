import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

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

    // If it's not a JSON string, return as is
    if (!value.startsWith("{") && !value.startsWith("[")) {
      return value;
    }

    // Otherwise try to parse as JSON, but handle errors gracefully
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error(`Error parsing cookie '${key}':`, e);
      return value; // Return the raw string value if parsing fails
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

interface AuthState {
  user: any;
  login_user: any;
  token: string | null;
  apikey: string | null;
  email: string | null;
  orgid: string | null;
  secrettoken: string | null;
  tempsecret: string | null;
  isAuthenticated: boolean;
  sandboxStatus: boolean;
  loading: boolean;
  regloading: boolean;
  orgloader: boolean;
  loadingcountry: boolean;
  forgot: string | null;
  loginmsg: any;
  loginError: string | { message: string } | null;
  statusCode: any;
  registersucc: any;
  registermsg: any;
  countries: any[];
  orgerr: any;
  orgerrbool: boolean;
  orgsuccess: boolean;
  callsuccess: boolean;
  callerr: any;
  callerrbool: boolean;
  loginloaders: boolean;
  roles: string | null;
  stripeid: string | null;
  authMode: number | null;
  onremove: any;
  onremoveerror: any[];
  samePasswordError: boolean;
  resetLinkExpired: boolean;
  isTwoFactor: boolean;
  twoFactorId: string;
  secret: string | null;
  secretBase32Encoded: string | null;
  multiFactorEnabled: boolean;
  method: string;
  qrLoading: boolean;
  recoverCodes: any[];
  loginOtp: string;
  methodId: string;
  isToken: boolean;
  forgetfail: boolean;
  isSandbox: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: (() => {
    try {
      const alldata = CookieService.get("alldata");
      return alldata || "";
    } catch (e) {
      console.error("Error parsing alldata cookie:", e);
      return "";
    }
  })(),
  login_user: (() => {
    try {
      const alldataa = CookieService.get("alldataa");
      return alldataa || "";
    } catch (e) {
      console.error("Error parsing alldataa cookie:", e);
      return "";
    }
  })(),
  token: CookieService.get("token") as string,
  apikey: CookieService.get("apikey") as string,
  email: CookieService.get("email") as string,
  orgid: CookieService.get("orgid") as string,
  secrettoken: CookieService.get("secrettoken") as string,
  tempsecret: CookieService.get("tempsecret") as string,
  isAuthenticated: CookieService.get("apikey") ? true : false,
  sandboxStatus: (() => {
    try {
      const authMode = CookieService.get("authMode");
      return authMode ? authMode === 2 : false;
    } catch (e) {
      console.error("Error parsing authMode cookie:", e);
      return false;
    }
  })(),
  loading: true,
  regloading: false,
  orgloader: false,
  loadingcountry: true,
  forgot: null,
  loginmsg: {},
  loginError: null,
  statusCode: {},
  registersucc: {},
  registermsg: {},
  countries: [],
  orgerr: {},
  orgerrbool: false,
  orgsuccess: false,
  callsuccess: false,
  callerr: {},
  callerrbool: false,
  loginloaders: true,
  roles: CookieService.get("roles") as string,
  stripeid: CookieService.get("stripeid") as string,
  authMode: (() => {
    try {
      const authMode = CookieService.get("authMode");
      return authMode || null;
    } catch (e) {
      console.error("Error parsing authMode cookie:", e);
      return null;
    }
  })(),
  onremove: {},
  onremoveerror: [],
  samePasswordError: false,
  resetLinkExpired: false,
  isTwoFactor: false,
  twoFactorId: "",
  secret: null,
  secretBase32Encoded: null,
  multiFactorEnabled: CookieService.get("multiFactorEnabled") ? true : false,
  method: "",
  qrLoading: true,
  recoverCodes: [],
  loginOtp: "",
  methodId: "",
  isToken: CookieService.get("token") ? true : false,
  forgetfail: false,
  isSandbox: false,
  error: null,
};

const clearCookies = () => {
  CookieService.remove("token");
  CookieService.remove("tokenTest");
  CookieService.remove("sandboxapi");
  CookieService.remove("liveapi");
  CookieService.remove("fileurl");
  CookieService.remove("alldata");
  CookieService.remove("alldataa");
  CookieService.remove("orgstripe_id");
  CookieService.remove("apikey");
  CookieService.remove("email");
  CookieService.remove("orgid");
  CookieService.remove("roles");
  CookieService.remove("stripeid");
  CookieService.remove("planid");
  CookieService.remove("nickname");
  CookieService.remove("flat_amount");
  CookieService.remove("refreshToken");
  CookieService.remove("firstbtnid");
  CookieService.remove("secrettoken");
  CookieService.remove("tempsecret");
  CookieService.clear();
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshToken: (state, action: PayloadAction<any>) => {
      CookieService.set("token", action.payload.headers.authorization);
      return { ...state, ...action.payload };
    },
    setAuthMode: (state, action: PayloadAction<number>) => {
      CookieService.set("authMode", action.payload);
      state.authMode = action.payload;
      state.sandboxStatus = action.payload === 2;
    },
    getCountries: (state, action: PayloadAction<any>) => {
      state.countries = action.payload.data;
      try {
        const alldata = CookieService.get("alldata");
        state.user = alldata || "";
      } catch (e) {
        console.error("Error parsing alldata cookie in getCountries:", e);
        state.user = "";
      }
      state.loadingcountry = false;
    },
    loginSandbox: (state, action: PayloadAction<any>) => {
      CookieService.set("authMode", 2);
      CookieService.set("email", action.payload.email);
      state.email = action.payload.email;
      state.isTwoFactor = true;
      state.isAuthenticated = false;
      state.loading = true;
      state.twoFactorId = action.payload.payload.twoFactorId;
      state.multiFactorEnabled = action.payload.payload.multiFactorEnabled;
      state.method = action.payload.payload.method;
      state.authMode = 2;
      state.sandboxStatus = true;
    },
    loginAuthenticated: (state, action: PayloadAction<any>) => {
      const sandbox = action.payload.payload.sandbox;
      CookieService.set("authMode", sandbox === true ? 2 : 1);

      state.email = action.payload.email;
      state.isTwoFactor = true;
      state.isAuthenticated = false;
      state.loading = true;
      state.twoFactorId = action.payload.payload.twoFactorId;
      state.multiFactorEnabled = action.payload.payload.multiFactorEnabled;
      state.method = action.payload.payload.method;
      state.methodId = action.payload.payload.methodId;
      state.authMode = sandbox === true ? 2 : 1;
      state.sandboxStatus = sandbox;
    },
    loginSandboxTwoFactor: (state, action: PayloadAction<any>) => {
      const { doc } = action.payload.payload;

      // Set tokens
      CookieService.set("token", doc.token || doc);
      CookieService.set("secrettoken", doc.sandbox.accesstoken);
      CookieService.set("tempsecret", "Bearer " + doc.dirotoken);
      CookieService.set("refreshToken", doc.refreshToken);

      // Set API keys
      CookieService.set("apikey", doc.sandbox.apikey);
      CookieService.set("liveapi", doc.apikey);
      CookieService.set("sandboxapi", doc.sandbox.apikey);
      CookieService.set("tokenTest", doc.sandbox.accesstoken);

      // Set user data
      CookieService.set("alldata", JSON.stringify(doc));
      CookieService.set("alldataa", JSON.stringify(doc));
      CookieService.set("stripeid", doc.stripeid);
      CookieService.set("planid", doc.planid);

      if (doc.roles) {
        CookieService.set("roles", doc.roles[0]);
      }

      CookieService.set("country", doc.country || "USA");
      CookieService.set("email", doc.email);
      CookieService.set("orgid", doc.data.orgid);
      CookieService.set("multiFactorEnabled", "true");
      CookieService.set("authMode", 2);

      // Update state
      state.isAuthenticated = true;
      state.loading = false;
      state.apikey = doc.apikey;
      state.email = doc.email;
      state.user = doc;
      state.login_user = doc;
      state.roles = doc.roles ? doc.roles[0] : null;
      state.stripeid = doc.stripeid;
      state.loginmsg = "";
      state.authMode = 2;
      state.isTwoFactor = false;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      const { doc } = action.payload.payload;
      const sandbox = doc.data?.sandbox;

      // Set tokens
      CookieService.set("token", action.payload.token);
      CookieService.set("secrettoken", "Bearer " + doc.dirotoken);
      CookieService.set("tempsecret", "Bearer " + doc.dirotoken);
      CookieService.set("refreshToken", action.payload.token);

      // Set API keys
      CookieService.set("apikey", doc.apikey);
      CookieService.set("liveapi", doc.apikey);
      CookieService.set("sandboxapi", doc.sandbox.apikey);
      CookieService.set("tokenTest", doc.sandbox.accesstoken);

      // Set user data
      CookieService.set("alldata", JSON.stringify(doc));
      CookieService.set("alldataa", JSON.stringify(doc));
      CookieService.set("stripeid", doc.stripeid);
      CookieService.set("planid", doc.planid);
      CookieService.set("roles", doc.roles?.[0]);
      CookieService.set("country", doc.country || "USA");
      CookieService.set("email", doc.email);
      CookieService.set("orgid", doc.data.orgid);
      CookieService.set("authMode", sandbox === true ? 2 : 1);

      // Update state
      state.isAuthenticated = true;
      state.loading = false;
      state.apikey = doc.apikey;
      state.email = doc.email;
      try {
        state.user = CookieService.get("alldata") || "";
      } catch (e) {
        console.error("Error getting alldata cookie:", e);
        state.user = "";
      }
      state.login_user = doc;
      state.roles = doc.roles?.[0];
      state.stripeid = doc.stripeid;
      state.loginmsg = action.payload.payload.message;
      state.authMode = sandbox === true ? 2 : 1;
    },
    updateOrg: (state, action: PayloadAction<any>) => {
      CookieService.set("alldata", JSON.stringify(action.payload));
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
      state.orgsuccess = true;
      state.orgerrbool = false;
      state.orgloader = false;
    },
    setOrgError: (state, action: PayloadAction<any>) => {
      state.orgerr = action.payload?.msg || null;
      state.orgerrbool = action.payload?.error || null;
      state.orgloader = false;
      state.orgsuccess = false;
    },
    updateCallback: (state, action: PayloadAction<any>) => {
      CookieService.set("alldata", JSON.stringify(action.payload));
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
      state.callsuccess = true;
    },
    setCallbackError: (state, action: PayloadAction<any>) => {
      state.callerr = action.payload.msg;
      state.callerrbool = action.payload.error;
    },
    forgotPassword: (state, action: PayloadAction<any>) => {
      state.forgot = action.payload.payload.message;
      state.regloading = false;
    },
    startQrCode: (state) => {
      state.secret = null;
      state.secretBase32Encoded = null;
      state.qrLoading = true;
    },
    setQrCode: (state, action: PayloadAction<any>) => {
      state.secret = action.payload.secret;
      state.secretBase32Encoded = action.payload.secretBase32Encoded;
      state.qrLoading = false;
    },
    qrCodeFail: (state, action: PayloadAction<any>) => {
      state.secret = action.payload.secret;
      state.secretBase32Encoded = action.payload.secretBase32Encoded;
      state.qrLoading = true;
    },
    loginFail: (state, action: PayloadAction<any>) => {
      state.loginmsg = action.payload?.payload;
    },
    registerSuccess: (state, action: PayloadAction<any>) => {
      state.registermsg = {};
      state.registersucc = action.payload.payload.message;
      state.regloading = action.payload.regloading;
    },
    registerFail: (state, action: PayloadAction<any>) => {
      state.registermsg = action.payload.payload?.message || action.payload.fieldErrors;
      state.regloading = false;
    },
    startRegLoader: (state) => {
      state.regloading = true;
    },
    startOrgLoader: (state) => {
      state.orgloader = true;
    },
    forgetPasswordFail: (state, action: PayloadAction<any>) => {
      state.forgetfail = action.payload;
    },
    logout: (state) => {
      clearCookies();
      return {
        ...initialState,
        token: null,
        alldata: null,
        apikey: null,
        email: null,
        isAuthenticated: false,
        loading: true,
        user: null,
        orgid: null,
        roles: null,
        stripeid: null,
      };
    },
    removeBackground: (state, action: PayloadAction<any>) => {
      state.onremove = action.payload;
    },
    removeBackgroundError: (state, action: PayloadAction<any>) => {
      state.onremoveerror = action.payload;
    },
    setPasswordError: (state, action: PayloadAction<boolean>) => {
      state.samePasswordError = action.payload;
      state.regloading = false;
    },
    setResetLinkExpired: (state, action: PayloadAction<boolean>) => {
      state.resetLinkExpired = action.payload;
      state.regloading = false;
    },
    enableTwoFactor: (state, action: PayloadAction<any>) => {
      state.recoverCodes = action.payload.data.recoveryCodes;
      state.loginOtp = action.payload.data.code;
      state.multiFactorEnabled = true;
    },
    enableTwoFactorError: (state, action: PayloadAction<any>) => {
      state.loginError = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    twoFactorLogin: (
      state,
      action: PayloadAction<{ email: string; otp: string; twoFactorId: string; sandboxStatus: boolean }>
    ) => {
      state.loading = true;
      state.loginError = null;
    },
    twoFactorLoginSuccess: (state, action: PayloadAction<any>) => {
      try {
        // Extract payload data safely
        const payload = action.payload.payload || {};
        const headers = action.payload.headers || {};
        console.log("Payload: here is the payload", payload);
        // Set token from headers if available
        if (headers.authorization) {
          console.log("Setting token from headers:", headers.authorization);
          CookieService.set("token", headers.authorization);
          state.token = headers.authorization;
        }

        // Handle email
        if (payload.doc.email) {
          console.log("Setting email:", payload.email);
          CookieService.set("email", payload.doc.email);
          state.email = payload.doc.email;
        }

        // Handle roles - can be array or string
        if (payload.doc.roles) {
          const role = Array.isArray(payload.roles) ? payload.roles[0] : payload.roles;
          console.log("Setting role:", role);
          CookieService.set("roles", role);
          state.roles = role;
        }
        if (payload.doc) {
          CookieService.set("alldata", JSON.stringify(payload.doc));
          state.user = payload.doc;
        }

        // Additional user data if available
        if (payload.data && payload.data.orgid) {
          console.log("Setting orgid:", payload.data.orgid);
          CookieService.set("orgid", payload.data.orgid);
          state.orgid = payload.data.orgid;
        }

        if (payload.data) {
          CookieService.set("apikey", payload.data.apikey);
          state.apikey = payload.data.apikey;
        }

        // Explicitly clear two-factor flags in cookies
        CookieService.remove("isTwoFactor");
        CookieService.remove("twoFactorId");
        CookieService.set("isAuthenticated", "true");

        // Update authentication state
        state.isAuthenticated = true;
        state.loading = false;
        state.loginError = null;
        state.isTwoFactor = false;
        state.twoFactorId = "";

        // Log the updated state
        console.log("Auth state after twoFactorLoginSuccess:", {
          isAuthenticated: state.isAuthenticated,
          email: state.email,
          roles: state.roles,
          token: state.token ? "exists" : "missing",
          apikey: state.apikey ? "exists" : "missing",
        });
      } catch (error) {
        console.error("Error in twoFactorLoginSuccess reducer:", error);
        // Even if there's an error, ensure user is authenticated if we have token
        if (action.payload.headers?.authorization) {
          state.isAuthenticated = true;
          state.token = action.payload.headers.authorization;
          state.apikey = action.payload.headers.authorization;
        }
      }
    },
    twoFactorLoginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.loginError = action.payload;
    },
    sendLoginOtp: (state, action: PayloadAction<{ twoFactorId: string; methodId: string }>) => {
      state.loading = true;
      state.loginError = null;
    },
    sendLoginOtpSuccess: (state) => {
      state.loading = false;
    },
    sendLoginOtpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.loginError = action.payload;
    },
    getUserFromCookies: (state) => {
      try {
        const alldata = CookieService.get("alldata");
        state.user = alldata || "";
      } catch (e) {
        console.error("Error parsing alldata cookie:", e);
        state.user = "";
      }
    },
  },
});

export const {
  refreshToken,
  setAuthMode,
  getCountries,
  loginSandbox,
  loginAuthenticated,
  loginSandboxTwoFactor,
  loginSuccess,
  updateOrg,
  setOrgError,
  updateCallback,
  setCallbackError,
  forgotPassword,
  startQrCode,
  setQrCode,
  qrCodeFail,
  loginFail,
  registerSuccess,
  registerFail,
  startRegLoader,
  startOrgLoader,
  forgetPasswordFail,
  logout,
  removeBackground,
  removeBackgroundError,
  setPasswordError,
  setResetLinkExpired,
  enableTwoFactor,
  enableTwoFactorError,
  setLoading,
  twoFactorLogin,
  twoFactorLoginSuccess,
  twoFactorLoginFailure,
  sendLoginOtp,
  sendLoginOtpSuccess,
  sendLoginOtpFailure,
  getUserFromCookies,
} = authSlice.actions;

export default authSlice.reducer;
