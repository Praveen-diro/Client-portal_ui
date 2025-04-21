import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cookies } from "../../services/cookie.service";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Cookie options for security
const cookieOptions = {
  expires: 7, // 7 days
  secure: true, // HTTPS only
  sameSite: "strict" as const, // Protect against CSRF
  path: "/",
};

// Helper function to ensure token has Bearer prefix
const ensureTokenHasBearer = (token: string): string => {
  if (!token) return token;
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  sandboxaccesstoken: string;
  sandboxapi: string;
  liveapi: string;
  fileurl: string;
  alldata: string | null;
  alldataa: string;
  orgstripe_id: string;
  apikey: string | null;
  email: string | null;
  orgid: string | null;
  roles: string | null;
  stripeid: string | null;
  planid: string;
  nickname: string;
  flat_amount: string;
  refreshToken: string;
  firstbtnid: string;
  secrettoken: string;
  tempsecret: string;
  user: string | null;
  login_user: string;
  countries: any[];
  authMode: number;
  sandboxStatus: boolean;
  isSandbox: boolean;
  error: string | null;
  regloading: boolean;
  orgloader: boolean;
  registersucc: any;
  registermsg: any;
  orgerr: any;
  orgerrbool: boolean;
  callerrbool: boolean;
  loginloaders: boolean;
  secret: string | null;
  secretBase32Encoded: string | null;
  multiFactorEnabled: boolean;
  method: string;
  qrLoading: boolean;
  recoverCodes: string[];
  loginOtp: string;
  methodId: string;
  isToken: boolean;
  forgetfail: boolean;
  onremove: any;
  onremoveerror: any[];
  twoFactorId: string;
  loadingcountry: boolean;
  loginmsg: any;
  orgsuccess: boolean;
  callsuccess: boolean;
  isTwoFactor: boolean;
  callerr: any;
  forgot: boolean;
  samePasswordError: boolean;
  resetLinkExpired: boolean;
  loginError: string | null;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
  token: cookies.get("token") || null,
  sandboxaccesstoken: cookies.get("sandboxaccesstoken") || "",
  sandboxapi: cookies.get("sandboxapi") || "",
  liveapi: cookies.get("liveapi") || "",
  fileurl: cookies.get("fileurl") || "",
  alldata: cookies.get("alldata") || null,
  alldataa: cookies.get("alldataa") || "",
  orgstripe_id: cookies.get("orgstripe_id") || "",
  apikey: cookies.get("apikey") || null,
  email: cookies.get("email") || null,
  orgid: cookies.get("orgid") || null,
  roles: cookies.get("roles") || null,
  stripeid: cookies.get("stripeid") || null,
  planid: cookies.get("planid") || "",
  nickname: cookies.get("nickname") || "",
  flat_amount: cookies.get("flat_amount") || "",
  refreshToken: cookies.get("refreshToken") || "",
  firstbtnid: cookies.get("firstbtnid") || "",
  secrettoken: cookies.get("secrettoken") || "",
  tempsecret: cookies.get("tempsecret") || "",
  user: null,
  login_user: "",
  countries: [],
  authMode: (() => {
    try {
      const mode = cookies.get("authMode");
      return mode ? parseInt(mode, 10) : 1; // Default to Production Mode (1)
    } catch (e) {
      console.error("Error parsing authMode cookie:", e);
      return 1; // Default to Production Mode (1)
    }
  })(),
  sandboxStatus: (() => {
    try {
      const mode = cookies.get("authMode");
      return mode ? parseInt(mode, 10) === 2 : false;
    } catch (e) {
      console.error("Error parsing authMode cookie for sandboxStatus:", e);
      return false;
    }
  })(),
  isSandbox: false,
  error: null,
  regloading: false,
  orgloader: false,
  registersucc: {},
  registermsg: {},
  orgerr: {},
  orgerrbool: false,
  callerrbool: false,
  loginloaders: true,
  secret: null,
  secretBase32Encoded: null,
  multiFactorEnabled: cookies.get("multiFactorEnabled") === "true",
  method: "",
  qrLoading: true,
  recoverCodes: [],
  loginOtp: "",
  methodId: "",
  isToken: cookies.get("token") ? true : false,
  forgetfail: false,
  onremove: {},
  onremoveerror: [],
  twoFactorId: "",
  loadingcountry: false,
  loginmsg: {},
  orgsuccess: false,
  callsuccess: false,
  isTwoFactor: false,
  callerr: {},
  forgot: false,
  samePasswordError: false,
  resetLinkExpired: false,
  loginError: null,
};

const clearCookies = () => {
  cookies.remove("token");
  cookies.remove("sandboxaccesstoken");
  cookies.remove("sandboxapi");
  cookies.remove("liveapi");
  cookies.remove("fileurl");
  cookies.remove("alldata");
  cookies.remove("alldataa");
  cookies.remove("orgstripe_id");
  cookies.remove("apikey");
  cookies.remove("email");
  cookies.remove("orgid");
  cookies.remove("roles");
  cookies.remove("stripeid");
  cookies.remove("planid");
  cookies.remove("nickname");
  cookies.remove("flat_amount");
  cookies.remove("refreshToken");
  cookies.remove("firstbtnid");
  cookies.remove("secrettoken");
  cookies.remove("tempsecret");
  cookies.clearAll();
};

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshToken: (state, action: PayloadAction<any>) => {
      const token = ensureTokenHasBearer(action.payload.headers.authorization);
      cookies.set("token", token);
      return { ...state, ...action.payload };
    },
    setAuthMode: (state, action: PayloadAction<number>) => {
      const mode = action.payload;
      cookies.set("authMode", mode.toString(), cookieOptions);
      state.authMode = mode;
      state.sandboxStatus = mode === 2;
      console.log("Auth mode updated:", { mode, sandboxStatus: state.sandboxStatus });
    },
    getCountries: (state, action: PayloadAction<any>) => {
      console.log("getCountries reducer called with payload:", action.payload);
      if (!action.payload) {
        console.error("getCountries received null/undefined payload");
        return;
      }
      state.countries = action.payload.data;
      // try {
      //   const alldata = cookies.get("alldata");
      //   console.log("Retrieved alldata from cookie:", alldata);
      //   state.alldata = alldata || "";
      // } catch (e) {
      //   console.error("Error parsing alldata cookie in getCountries:", e);
      //   state.alldata = "";
      // }
      state.loadingcountry = false;
      console.log("Updated state:", { countries: state.countries, user: state.user, loadingcountry: state.loadingcountry });
    },
    loginSandbox: (state, action: PayloadAction<any>) => {
      state.email = action.payload.email;
      state.isTwoFactor = true;
      state.isAuthenticated = false;
      state.loading = true;
      state.twoFactorId = action.payload.payload.twoFactorId;
      state.multiFactorEnabled = action.payload.payload.multiFactorEnabled;
      state.method = action.payload.payload.method;
      state.authMode = 2;
      state.sandboxStatus = true;
      state.methodId = action.payload.payload.methodId;
    },
    loginAuthenticated: (state, action: PayloadAction<any>) => {
      const sandbox = action.payload.payload.sandbox;
      cookies.set("authMode", sandbox === true ? "2" : "1");

      state.email = action.payload.email;
      state.isTwoFactor = true;
      state.isAuthenticated = false;
      state.loading = true;
      state.twoFactorId = action.payload.payload.twoFactorId;
      state.multiFactorEnabled = action.payload.payload.multiFactorEnabled;
      state.method = action.payload.payload.method;
      // state.methodId = action.payload.payload.methodId;
      state.sandboxStatus = sandbox;
    },
    loginSandboxTwoFactor: (state, action: PayloadAction<any>) => {
      const { doc } = action.payload.payload;
      state.alldata = doc;
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

      // Set tokens with Bearer prefix
      cookies.set("token", ensureTokenHasBearer(action.payload.token));
      cookies.set("secrettoken", ensureTokenHasBearer(doc.dirotoken));
      cookies.set("tempsecret", ensureTokenHasBearer(doc.dirotoken));
      cookies.set("refreshToken", action.payload.token);

      // Set API keys
      cookies.set("apikey", doc.apikey);
      cookies.set("liveapi", doc.apikey);
      cookies.set("sandboxapi", doc.sandbox.apikey);
      cookies.set("sandboxaccesstoken", doc.sandbox.accesstoken);

      // Set user data
      cookies.set("alldata", JSON.stringify(doc));

      cookies.set("alldataa", JSON.stringify(doc));
      cookies.set("stripeid", doc.stripeid);
      cookies.set("planid", doc.planid);
      cookies.set("roles", doc.roles?.[0]);
      cookies.set("country", doc.country || "USA");
      cookies.set("email", doc.email);
      cookies.set("orgid", doc.data.orgid);
      cookies.set("authMode", sandbox === true ? "2" : "1");

      // Update state
      state.isAuthenticated = true;
      state.loading = false;
      state.apikey = doc.apikey;
      state.email = doc.email;
      try {
        state.user = cookies.get("alldata") || "";
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
      cookies.set("alldata", JSON.stringify(action.payload));
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
      cookies.set("alldata", JSON.stringify(action.payload));
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
      console.log("twoFactorLoginSuccess reducer called with payload:", action.payload);
      try {
        // Extract payload data safely
        const payload = action.payload.payload || {};
        const headers = action.payload.headers || {};
        const doc = payload.doc || {};

        console.log("Payload: here is the payload", payload);

        // Set token from headers if available
        if (headers?.authorization) {
          console.log("Setting token from headers:", headers.authorization);
          const token = ensureTokenHasBearer(headers.authorization);
          cookies.set("token", token, cookieOptions);
          state.token = token;
        }

        // Handle email
        if (doc.email) {
          console.log("Setting email:", doc.email);
          cookies.set("email", doc.email, cookieOptions);
          state.email = doc.email;
        }

        // Handle roles - can be array or string
        if (doc.roles) {
          const role = Array.isArray(doc.roles) ? doc.roles[0] : doc.roles;
          console.log("Setting role:", role);
          cookies.set("roles", role, cookieOptions);
          state.roles = role;
        }

        // Store the whole doc data
        if (doc) {
          cookies.set("alldata", JSON.stringify(doc), cookieOptions);
          cookies.set("alldataa", JSON.stringify(doc), cookieOptions);
          state.user = doc;
          state.login_user = doc;
        }

        // Additional user data if available
        if (doc.data && doc.data.orgid) {
          console.log("Setting orgid:", doc.data.orgid);
          cookies.set("orgid", doc.data.orgid, cookieOptions);
          state.orgid = doc.data.orgid;
        }

        // Set API key
        if (doc.apikey) {
          cookies.set("apikey", doc.apikey, cookieOptions);
          state.apikey = doc.apikey;
        }

        // Set sandbox API if available
        if (doc.sandbox && doc.sandbox.apikey) {
          cookies.set("sandboxapi", doc.sandbox.apikey, cookieOptions);
        }

        // Explicitly clear two-factor flags in cookies
        cookies.remove("isTwoFactor");
        cookies.remove("twoFactorId");
        cookies.set("isAuthenticated", "true", cookieOptions);
        cookies.set("multiFactorEnabled", "true", cookieOptions);

        // Update authentication state
        state.isAuthenticated = true;
        state.loading = false;
        state.loginError = null;
        state.isTwoFactor = false;
        state.multiFactorEnabled = true;

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
          const token = ensureTokenHasBearer(action.payload.headers.authorization);
          cookies.set("token", token, cookieOptions);
          state.isAuthenticated = true;
          state.token = token;

          // Try to set API key from payload if available
          const doc = action.payload.payload?.doc;
          if (doc && doc.apikey) {
            cookies.set("apikey", doc.apikey, cookieOptions);
            state.apikey = doc.apikey;
          }
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
        const alldata = cookies.get("alldata");
        state.user = alldata || "";
      } catch (e) {
        console.error("Error parsing alldata cookie:", e);
        state.user = "";
      }
    },
    setLoadingCountry: (state, action: PayloadAction<boolean>) => {
      state.loadingcountry = action.payload;
    },
    setLoginMsg: (state, action: PayloadAction<any>) => {
      state.loginmsg = action.payload;
    },
    setOrgSuccess: (state, action: PayloadAction<boolean>) => {
      state.orgsuccess = action.payload;
    },
    setCallSuccess: (state, action: PayloadAction<boolean>) => {
      state.callsuccess = action.payload;
    },
    setIsTwoFactor: (state, action: PayloadAction<boolean>) => {
      state.isTwoFactor = action.payload;
    },
    setCallErr: (state, action: PayloadAction<any>) => {
      state.callerr = action.payload;
    },
    setForgot: (state, action: PayloadAction<boolean>) => {
      state.forgot = action.payload;
    },
    setSamePasswordError: (state, action: PayloadAction<boolean>) => {
      state.samePasswordError = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
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
  setLoadingCountry,
  setLoginMsg,
  setOrgSuccess,
  setCallSuccess,
  setIsTwoFactor,
  setCallErr,
  setForgot,
  setSamePasswordError,
  setLoginError,
} = authSlice.actions;

// Persist config for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "login_user", "authMode", "sandboxStatus"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer);

export default persistedAuthReducer;
