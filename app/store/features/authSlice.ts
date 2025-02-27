import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ls from "localstorage-slim";

ls.config.encrypt = true;

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
  user: ls.get("alldata") ? JSON.parse(ls.get("alldata") as string) : "",
  login_user: ls.get("alldataa") ? JSON.parse(ls.get("alldataa") as string) : "",
  token: ls.get("token") as string,
  apikey: ls.get("apikey") as string,
  email: ls.get("email") as string,
  orgid: ls.get("orgid") as string,
  secrettoken: ls.get("secrettoken") as string,
  tempsecret: ls.get("tempsecret") as string,
  isAuthenticated: ls.get("apikey") ? true : false,
  sandboxStatus: JSON.parse(ls.get("authMode") as string) === 2,
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
  roles: ls.get("roles") as string,
  stripeid: ls.get("stripeid") as string,
  authMode: JSON.parse(ls.get("authMode") as string),
  onremove: {},
  onremoveerror: [],
  samePasswordError: false,
  resetLinkExpired: false,
  isTwoFactor: false,
  twoFactorId: "",
  secret: null,
  secretBase32Encoded: null,
  multiFactorEnabled: ls.get("multifactor") ? true : false,
  method: "",
  qrLoading: true,
  recoverCodes: [],
  loginOtp: "",
  methodId: "",
  isToken: ls.get("token") ? true : false,
  forgetfail: false,
  isSandbox: false,
  error: null,
};

const clearLocalStorage = () => {
  ls.remove("token");
  ls.remove("tokenTest");
  ls.remove("sandboxapi");
  ls.remove("liveapi");
  ls.remove("fileurl");
  ls.remove("alldata");
  ls.remove("alldataa");
  ls.remove("orgstripe_id");
  ls.remove("apikey");
  ls.remove("email");
  ls.remove("orgid");
  ls.remove("roles");
  ls.remove("stripeid");
  ls.remove("planid");
  ls.remove("nickname");
  ls.remove("flat_amount");
  ls.remove("refreshToken");
  ls.remove("firstbtnid");
  ls.remove("secrettoken");
  ls.remove("tempsecret");
  ls.clear();

  // Also clear regular localStorage
  localStorage.clear();
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshToken: (state, action: PayloadAction<any>) => {
      ls.set("token", action.payload.headers.authorization);
      return { ...state, ...action.payload };
    },
    setAuthMode: (state, action: PayloadAction<number>) => {
      ls.set("authMode", action.payload);
      state.authMode = action.payload;
      state.sandboxStatus = action.payload === 2;
    },
    getCountries: (state, action: PayloadAction<any>) => {
      state.countries = action.payload.data;
      state.user = ls.get("alldata") ? JSON.parse(ls.get("alldata") as string) : "";
      state.loadingcountry = false;
    },
    loginSandbox: (state, action: PayloadAction<any>) => {
      ls.set("authMode", 2);
      state.email = action.payload.email;
      state.isTwoFactor = true;
      state.isAuthenticated = false;
      state.loading = true;
      state.twoFactorId = action.payload.payload.twoFactorId;
      state.multiFactorEnabled = action.payload.payload.multiFactorEnabled;
      state.method = action.payload.payload.method;
      state.methodId = action.payload.payload.methodId;
      state.authMode = 2;
      state.sandboxStatus = true;
    },
    loginAuthenticated: (state, action: PayloadAction<any>) => {
      const sandbox = action.payload.payload.sandbox;
      ls.set("authMode", sandbox === true ? 2 : 1);

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
      ls.set("token", doc.token || doc);
      ls.set("secrettoken", doc.sandbox.accesstoken);
      ls.set("tempsecret", "Bearer " + doc.dirotoken);
      ls.set("refreshToken", doc.refreshToken);

      // Set API keys
      ls.set("apikey", doc.sandbox.apikey);
      ls.set("liveapi", doc.apikey);
      ls.set("sandboxapi", doc.sandbox.apikey);
      ls.set("tokenTest", doc.sandbox.accesstoken);

      // Set user data
      ls.set("alldata", JSON.stringify(doc));
      ls.set("alldataa", JSON.stringify(doc));
      ls.set("stripeid", doc.stripeid);
      ls.set("planid", doc.planid);
      ls.set("roles", doc.roles?.[0]);
      ls.set("country", doc.country || "USA");
      ls.set("email", doc.email);
      ls.set("orgid", doc.data.orgid);
      ls.set("multifactor", "true");
      ls.set("authMode", 2);

      // Update state
      state.isAuthenticated = true;
      state.loading = false;
      state.apikey = doc.apikey;
      state.email = doc.email;
      state.user = doc;
      state.login_user = doc;
      state.roles = doc.roles?.[0];
      state.stripeid = doc.stripeid;
      state.loginmsg = "";
      state.authMode = 2;
      state.isTwoFactor = false;
    },
    loginSuccess: (state, action: PayloadAction<any>) => {
      const { doc } = action.payload.payload;
      const sandbox = doc.data?.sandbox;

      // Set tokens
      ls.set("token", action.payload.token);
      ls.set("secrettoken", "Bearer " + doc.dirotoken);
      ls.set("tempsecret", "Bearer " + doc.dirotoken);
      ls.set("refreshToken", action.payload.token);

      // Set API keys
      ls.set("apikey", doc.apikey);
      ls.set("liveapi", doc.apikey);
      ls.set("sandboxapi", doc.sandbox.apikey);
      ls.set("tokenTest", doc.sandbox.accesstoken);

      // Set user data
      ls.set("alldata", JSON.stringify(doc));
      ls.set("alldataa", JSON.stringify(doc));
      ls.set("stripeid", doc.stripeid);
      ls.set("planid", doc.planid);
      ls.set("roles", doc.roles?.[0]);
      ls.set("country", doc.country || "USA");
      ls.set("email", doc.email);
      ls.set("orgid", doc.data.orgid);
      ls.set("authMode", sandbox === true ? 2 : 1);

      // Update state
      state.isAuthenticated = true;
      state.loading = false;
      state.apikey = doc.apikey;
      state.email = doc.email;
      state.user = doc;
      state.login_user = doc;
      state.roles = doc.roles?.[0];
      state.stripeid = doc.stripeid;
      state.loginmsg = action.payload.payload.message;
      state.authMode = sandbox === true ? 2 : 1;
    },
    updateOrg: (state, action: PayloadAction<any>) => {
      ls.set("alldata", JSON.stringify(action.payload));
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
      ls.set("alldata", JSON.stringify(action.payload));
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
      clearLocalStorage();
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
      const { doc } = action.payload;
      const sandbox = doc.data?.sandbox;

      // Set tokens
      ls.set("token", action.payload.token);
      ls.set("secrettoken", "Bearer " + doc.dirotoken);
      ls.set("tempsecret", "Bearer " + doc.dirotoken);
      ls.set("refreshToken", action.payload.token);

      // Set API keys
      ls.set("apikey", doc.apikey);
      ls.set("liveapi", doc.apikey);
      ls.set("sandboxapi", doc.sandbox.apikey);
      ls.set("tokenTest", doc.sandbox.accesstoken);

      // Set user data
      ls.set("alldata", JSON.stringify(doc));
      ls.set("alldataa", JSON.stringify(doc));
      ls.set("stripeid", doc.stripeid);
      ls.set("planid", doc.planid);
      ls.set("roles", doc.roles?.[0]);
      ls.set("country", doc.country || "USA");
      ls.set("email", doc.email);
      ls.set("orgid", doc.data.orgid);
      ls.set("authMode", sandbox === true ? 2 : 1);

      // Update state
      state.isAuthenticated = true;
      state.loading = false;
      state.apikey = doc.apikey;
      state.email = doc.email;
      state.user = doc;
      state.login_user = doc;
      state.roles = doc.roles?.[0];
      state.stripeid = doc.stripeid;
      state.loginmsg = "";
      state.authMode = sandbox === true ? 2 : 1;
      state.isTwoFactor = false;
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
} = authSlice.actions;

export default authSlice.reducer;
