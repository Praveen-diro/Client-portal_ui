import { cookies } from "@/app/services/cookie.service";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Button {
  buttonid: string;
  btndata: {
    eptime: number;
    coverage?: {
      category?: string;
      direct_link?: string;
      fixedurl?: boolean;
    };
    name?: string;
    category?: string;
    subcategory?: string[];
    documentCheck?: string[];
    type?: string;
    setcolor?: string;
    direct_link?: string;
    reject_reasons?: string[];
    liveFeedbackInstruction?: string;
    documentexpiryvalue?: string;
    fullscreenmode?: boolean;
    engagement_callback?: boolean;
    include_pdf?: boolean;
    diro_certificate?: boolean;
    original_doc?: boolean;
    proxy?: string;
    testDocId?: string;
    multidownload?: boolean;
    enableCustomTemplate?: boolean;
    allowMissingStatement?: boolean;
    allowNonContinuousStatement?: boolean;
    allowOverridePeriod?: boolean;
    validDateRange?: any;
    includeQRCode?: boolean;
    maxNumberOfFiles?: string;
    expectedDays?: string;
    lockurl?: boolean;
    showpreview?: boolean;
    livefeedbackMode?: boolean;
    imageUpload?: boolean;
    resubmission?: boolean;
    includeFaqInPdf?: boolean;
    showgoogle?: boolean;
    limitcountry?: boolean;
    mobileview?: string;
    hybridMode?: boolean;
    autoNavigation?: boolean;
    autoConfirmation?: boolean;
    field_label?: boolean;
    hidediscover_popup?: boolean;
    account_details?: boolean;
    transactionsExtraction?: boolean;
    url_text?: string;
    url_class?: string;
    url_id?: string;
    expiry?: string;
    note?: string;
    emailnotetemplate?: string;
    emailOrgTemplate?: string;
    logintext?: string;
    customMobileWarningText?: string;
    gototext?: string;
    successheading?: string;
    successmessage?: string;
    failureheading?: string;
    failuremessage?: string;
    overrideorgname?: string;
    redirectmessage?: string;
    nopassword?: string;
    strongtext?: string;
    securetext?: string;
    datapurge?: string;
    nopassword_heading?: string;
    strongtext_heading?: string;
    securetext_heading?: string;
    datapurge_heading?: string;
    logourl?: string;
    logourl2?: string;
    selectedCountries?: Array<
      | string
      | {
          flag?: string;
          label: string;
          uniquekey?: string;
          value: string;
        }
    >;
    redirecturl?: string;
    replytoemail?: string;
    notifysubmissionto?: string;
    callbackurl?: string;
    browserconfig?: string;
    envconfig?: string;
    warn_case?: any[];
    reminders?: any[];
    testreminder?: any[];
    smtp?: any[];
    org_info?: string;
    user_info?: string;
    autocapture?: boolean;
    allow_search?: boolean;
    prompt_for_capture?: boolean;
    verification_toggle?: boolean;
    verification_link?: string;
    uploadVerification_link?: string;
    fixedurl?: boolean;
    sandboxid?: string | null;
    autodeleteenable?: boolean;
    auto_reject_baddoc?: boolean;
    shareonlyjson?: boolean;
    googleSheet?: boolean;
    enableSalesforce?: boolean;
    salesforce?: any;
    googlesheeturl?: string;
    sharerequestedfieldsonly?: boolean;
    notifySubmission?: boolean;
    autojson?: boolean;
    country?: string;
    alpha2code?: string;
    allowOutsidePeriodFile?: boolean;
    calculateBalanceAsOnDate?: boolean;
    extractAllTransaction?: boolean;
    showDetailedJson?: boolean;
    mode?: {
      type?: string;
    };
    adminAccess?: boolean;
    advanceSetting?: boolean;
    instructionText?: string;
    desktopWarning?: string;
    emailToOrganizationEnabled?: boolean;
  };
}

interface CountryList {
  loader: boolean;
  data: any | null;
  err: any | null;
}

interface CountryLinks {
  searching: boolean;
  loader: boolean;
  data: any | null;
  err: any | null;
}

interface BtnSettingDelBtn {
  num: number;
  title: string | null;
  msg: string | null;
  reset: any | null;
}

interface ButtonState {
  buttons: Button[];
  button: Button | null;
  btn: any;
  btndata?: {
    country?: string;
    alpha2code?: string;
  };
  firstbtnid: string | null;
  buttonid: string | null;
  loading: boolean;
  deleteAlert: boolean;
  deleteMsg: string | null;
  btnsuccess: boolean;
  loadingTestEmailReminder: boolean;
  error: Record<string, any>;
  Tag: any[];
  emailreminderdata: any[];
  testEmailReminderResponse: string;
  countryList: CountryList;
  countryLinks: CountryLinks;
  btnSettingDelBtn: BtnSettingDelBtn;
  deleteTableData: boolean;
  updateTableData: boolean;
  createSource: boolean;
  verificationCategory?: string;
  searchResults: any;
}

const initialState: ButtonState = {
  buttons: [],
  button: null,
  btn: "",
  btndata: {},
  firstbtnid: null,
  buttonid: null,
  loading: true,
  deleteAlert: false,
  deleteMsg: null,
  btnsuccess: false,
  loadingTestEmailReminder: true,
  error: {},
  Tag: [],
  emailreminderdata: [],
  testEmailReminderResponse: "",
  countryList: {
    loader: false,
    data: null,
    err: null,
  },
  countryLinks: {
    searching: false,
    loader: false,
    data: null,
    err: null,
  },
  btnSettingDelBtn: { num: 0, title: null, msg: null, reset: null },
  deleteTableData: false,
  updateTableData: false,
  createSource: false,
  searchResults: null,
};

const buttonSlice = createSlice({
  name: "button",
  initialState,
  reducers: {
    getApiButton: (state, action: PayloadAction<{ payload: { btndata: Button }; buttonid: string }>) => {
      state.button = action.payload.payload.btndata;
      state.buttonid = action.payload.buttonid;
      state.loading = false;
    },
    getButton: (state, action: PayloadAction<any>) => {
      // Store button data in btn property
      state.btn = action.payload.btndata;
      state.loading = false;
    },
    updateButton: (state, action: PayloadAction<any>) => {
      // Filter out empty values before updating state
      const filteredData = Object.fromEntries(
        Object.entries(action.payload.data || {}).filter(([_, value]) => {
          // Keep boolean values (including false)
          if (typeof value === "boolean") return true;
          // Keep numeric values (including 0)
          if (typeof value === "number") return true;
          // Filter out null, undefined, empty strings, empty arrays
          return (
            value !== null &&
            value !== undefined &&
            (typeof value !== "string" || value !== "") &&
            (!Array.isArray(value) || value.length > 0)
          );
        })
      );

      // Create a new object with filtered data
      const updatedPayload = {
        ...action.payload,
        data: filteredData,
      };

      Object.assign(state, updatedPayload);
      state.btn = updatedPayload.data;
      state.btnsuccess = true;
      state.loading = false;
    },
    addButton: (state, action: PayloadAction<string>) => {
      state.buttonid = action.payload;
      state.loading = true;
      state.deleteAlert = false;
    },
    getButtons: (state, action: PayloadAction<{ data: Button[] }>) => {
      console.log("action.payload?.data", action.payload?.data);
      // Save the buttons array directly to state
      state.buttons = action.payload.data || [];
      state.firstbtnid = action.payload.data[0]?.buttonid || null;
      state.loading = false;
    },
    postButton: (state, action: PayloadAction<{ data: Button }>) => {
      state.button = action.payload.data;
      state.loading = false;
    },
    clearButton: (state) => {
      state.buttons = [];
      state.button = null;
      state.loading = true;
    },
    loadButton: (state) => {
      state.loading = true;
      state.deleteAlert = false;
      state.deleteMsg = null;
      state.btnsuccess = false;
    },
    deleteButton: (state, action: PayloadAction<{ message: string }>) => {
      state.deleteMsg = action.payload.message;
      state.deleteAlert = true;
      state.loading = false;
    },
    removeButtonAlert: (state) => {
      state.deleteMsg = null;
      state.deleteAlert = false;
    },
    getMasterFieldData: (state, action: PayloadAction<{ fieldx: any[] }>) => {
      state.Tag = action.payload.fieldx;
    },
    getEmailReminderData: (state, action: PayloadAction<any[]>) => {
      state.emailreminderdata = action.payload;
    },
    testEmailReminder: (state, action: PayloadAction<any>) => {
      state.testEmailReminderResponse = action.payload.error ? action.payload.message : action.payload;
      state.loadingTestEmailReminder = false;
    },
    loadCountryList: (state) => {
      state.countryList = {
        loader: true,
        data: null,
        err: null,
      };
    },
    getCountryListData: (state, action: PayloadAction<any>) => {
      state.countryList = {
        loader: false,
        data: action.payload,
        err: null,
      };
    },
    errCountryList: (state, action: PayloadAction<any>) => {
      state.countryList = {
        loader: false,
        data: null,
        err: action.payload,
      };
    },
    loadCountryLinks: (state) => {
      state.btnsuccess = false;
      state.countryLinks = {
        searching: false,
        loader: true,
        data: null,
        err: null,
      };
    },
    getCountryLinks: (state, action: PayloadAction<{ res: any; searching: boolean; cat: string }>) => {
      state.countryLinks = {
        searching: action.payload.searching,
        loader: false,
        data: action.payload.res.data.data,
        err: null,
      };
      if (state.btn?.coverage) {
        state.btn.coverage.category = action.payload.cat;
      }
    },
    errCountryLinks: (state, action: PayloadAction<any>) => {
      state.countryLinks = {
        searching: false,
        loader: false,
        data: null,
        err: action.payload,
      };
    },
    resetCountry: (state) => {
      state.countryLinks = {
        searching: false,
        loader: false,
        data: null,
        err: null,
      };
    },
    resetDirectLink: (state) => {
      if (state.btn?.coverage) {
        state.btn.coverage.direct_link = "";
      }
    },
    setAlphaCode: (state, action: PayloadAction<{ item: string; alpha: string }>) => {
      if (state.btndata) {
        state.btndata.country = action.payload.item;
        state.btndata.alpha2code = action.payload.alpha;
      }
    },
    setCategory: (state, action: PayloadAction<string>) => {
      if (state.btn?.coverage) {
        state.btn.coverage.category = action.payload;
      }
    },
    buttonDelete: (state, action: PayloadAction<{ num: number; title: string; msg: string }>) => {
      state.btnSettingDelBtn = {
        ...state.btnSettingDelBtn,
        num: action.payload.num,
        title: action.payload.title,
        msg: action.payload.msg,
        reset: null,
      };
    },
    buttonDelSuccess: (state) => {
      state.btnSettingDelBtn = {
        num: 0,
        title: null,
        msg: null,
        reset: null,
      };
    },
    buttonDelError: (state, action: PayloadAction<{ num: number; title: string; msg: string; reset: any }>) => {
      state.btnSettingDelBtn = {
        num: action.payload.num,
        title: action.payload.title,
        msg: action.payload.msg,
        reset: action.payload.reset,
      };
    },
    deleteTableDataSuccess: (state) => {
      state.deleteTableData = !state.deleteTableData;
    },
    updateTableData: (state) => {
      state.updateTableData = !state.updateTableData;
    },
    createSource: (state) => {
      state.createSource = !state.createSource;
    },
    setBtn: (state, action: PayloadAction<any>) => {
      state.btn = action.payload;
    },
    setName: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.name = action.payload;
      }
    },
    setType: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.mode.type = action.payload;
      }
    },
    setFixedUrl: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.coverage.fixedurl = action.payload;
      }
    },
    setCountry: (state, action: PayloadAction<string | { uniquekey: string; alpha2code: string; countryName: string }>) => {
      console.log("action.payload setCountry", action.payload);
      if (state.btn?.btndata) {
        if (typeof action.payload === "string") {
          // For backward compatibility
          state.btn.btndata.country = action.payload;
          state.btn.btndata.countryUniqueKey = action.payload;
        } else {
          // Store all three pieces of information
          state.btn.btndata.countryUniqueKey = action.payload.uniquekey;
          state.btn.btndata.alpha2code = action.payload.alpha2code;
          state.btn.btndata.country = action.payload.countryName;
        }
      }
    },
    setLimitCountry: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.limitcountry = action.payload;
      }
    },
    setSelectedCountries: (
      state,
      action: PayloadAction<Array<string | { flag?: string; label: string; uniquekey?: string; value: string }>>
    ) => {
      console.log("Redux reducer: setSelectedCountries called with values:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current selectedCountries value:", state.btn.btndata.selectedCountries);

      // Update the state with the new value
      state.btn.btndata.selectedCountries = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated selectedCountries value:", state.btn.btndata.selectedCountries);
    },
    setAllowOverridePeriod: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.allowOverridePeriod = action.payload;
      }
    },
    setAllowMissingStatement: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.allowMissingStatement = action.payload;
      }
    },
    setAutoDeletion: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.autodeleteenable = action.payload;
      }
    },
    setShareOnlyJson: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.shareonlyjson = action.payload;
      }
    },
    setShowFieldLabels: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.field_label = action.payload;
      }
    },
    setDisableWebpagePrompts: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.hidediscover_popup = action.payload;
      }
    },
    setShowDetailedJson: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.showDetailedJson = action.payload;
      }
    },
    setTransactionsExtraction: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.transactionsExtraction = action.payload;
      }
    },
    setShowGoogleSearch: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setShowGoogleSearch called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current showgoogle value:", state.btn.btndata.showgoogle);

      // Update the state with the new value
      state.btn.btndata.showgoogle = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated showgoogle value:", state.btn.btndata.showgoogle);
    },
    setEmailToOrganization: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.notifysubmissionto = action.payload;
      }
    },
    setIncludePdfInEmail: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.include_pdf = action.payload;
      }
    },
    setSubmissionNotificationViaEmail: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.notifySubmission = action.payload;
      }
    },
    setEmailToOrganizationEnabled: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.emailToOrganizationEnabled = action.payload;
      }
    },
    setEnableEngagementCallback: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.engagement_callback = action.payload;
      }
    },
    setAutoJson: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.autojson = action.payload;
      }
    },
    setCallbackUrl: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.callbackurl = action.payload;
      }
    },
    setAddGoogleSheetUrl: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.googleSheet = action.payload;
      }
    },
    setEnableSalesforce: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.enableSalesforce = action.payload;
      }
    },
    setRejectReasons: (state, action: PayloadAction<string[]>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.reject_reasons = action.payload;
      }
    },
    setProxy: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.proxy = action.payload;
      }
    },
    setHybridMode: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.hybridMode = action.payload;
      }
    },
    setVerificationCategory: (state, action: PayloadAction<string>) => {
      state.verificationCategory = action.payload;
      if (state.btn?.btndata) {
        state.btn.btndata.coverage.category = action.payload;
      }
    },
    setVerificationSubCategory: (state, action: PayloadAction<string[]>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.subcategory = action.payload;
      }
    },
    setFixedUrlAddress: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        if (!state.btn.btndata.coverage) {
          state.btn.btndata.coverage = {};
        }
        // Only store as direct_link
        state.btn.btndata.coverage.direct_link = action.payload;
      }
    },
    setDisplaySettings: (state, action: PayloadAction<Record<string, any>>) => {
      const settings = action.payload;

      // Update btndata if it exists
      if (state.btn?.btndata) {
        Object.keys(settings).forEach((key) => {
          if (key !== "btn") {
            state.btn.btndata[key] = settings[key];
          }
        });
      }
    },
    setExpiry: (state, action: PayloadAction<string>) => {
      console.log("Redux reducer: setExpiry called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current expiry value:", state.btn.btndata.expiry);

      // Special handling for empty string - we'll store null instead
      // This allows us to differentiate between "no value set" and "user intentionally cleared"
      if (action.payload === "") {
        state.btn.btndata.expiry = null;
      } else {
        // Update the state with the new value
        state.btn.btndata.expiry = action.payload;
      }

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated expiry value:", state.btn.btndata.expiry);
    },
    setResubmission: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setResubmission called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current resubmission value:", state.btn.btndata.resubmission);

      // Update the state with the new value
      state.btn.btndata.resubmission = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated resubmission value:", state.btn.btndata.resubmission);
    },
    setLiveFeedback: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setLiveFeedback called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current livefeedback value:", state.btn.btndata.livefeedbackMode);

      // Update the state with the new value
      state.btn.btndata.livefeedbackMode = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated livefeedback value:", state.btn.btndata.livefeedbackMode);
    },
    setMultiDownload: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setMultiDownload called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current multidownload value:", state.btn.btndata.multidownload);

      // Update the state with the new value
      state.btn.btndata.multidownload = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated multidownload value:", state.btn.btndata.multidownload);
    },
    setImageUpload: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setImageUpload called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current imageUpload value:", state.btn.btndata.imageUpload);

      // Update the state with the new value
      state.btn.btndata.imageUpload = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated imageUpload value:", state.btn.btndata.imageUpload);
    },
    setExtractAllTransaction: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setExtractAllTransaction called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current extractAllTransaction value:", state.btn.btndata.extractAllTransaction);

      // Update the state with the new value
      state.btn.btndata.extractAllTransaction = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated extractAllTransaction value:", state.btn.btndata.extractAllTransaction);
    },
    setCalculateBalanceAsOnDate: (state, action: PayloadAction<boolean>) => {
      console.log("Redux reducer: setCalculateBalanceAsOnDate called with value:", action.payload);

      // Initialize btndata if not exists
      if (!state.btn) {
        state.btn = { btndata: {} };
      }

      if (!state.btn.btndata) {
        state.btn.btndata = {};
      }

      // Log current state
      console.log("Current calculateBalanceAsOnDate value:", state.btn.btndata.calculateBalanceAsOnDate);

      // Update the state with the new value
      state.btn.btndata.calculateBalanceAsOnDate = action.payload;

      // Force the state update by creating a new reference
      state.btn = { ...state.btn, btndata: { ...state.btn.btndata } };

      console.log("Updated calculateBalanceAsOnDate value:", state.btn.btndata.calculateBalanceAsOnDate);
    },
    setFullTextSearchData: (state, action: PayloadAction<any>) => {
      state.searchResults = action.payload;
    },
  },
});

export const {
  getApiButton,
  getButton,
  updateButton,
  addButton,
  getButtons,
  postButton,
  clearButton,
  loadButton,
  deleteButton,
  removeButtonAlert,
  getMasterFieldData,
  getEmailReminderData,
  testEmailReminder,
  loadCountryList,
  getCountryListData,
  errCountryList,
  loadCountryLinks,
  getCountryLinks,
  errCountryLinks,
  resetCountry,
  resetDirectLink,
  setAlphaCode,
  setCategory,
  buttonDelete,
  buttonDelSuccess,
  buttonDelError,
  deleteTableDataSuccess,
  updateTableData,
  createSource,
  setBtn,
  setName,
  setType,
  setFixedUrl,
  setCountry,
  setLimitCountry,
  setSelectedCountries,
  setAllowOverridePeriod,
  setAllowMissingStatement,
  setAutoDeletion,
  setShareOnlyJson,
  setShowFieldLabels,
  setDisableWebpagePrompts,
  setShowDetailedJson,
  setTransactionsExtraction,
  setShowGoogleSearch,
  setEmailToOrganization,
  setIncludePdfInEmail,
  setSubmissionNotificationViaEmail,
  setEmailToOrganizationEnabled,
  setEnableEngagementCallback,
  setAutoJson,
  setCallbackUrl,
  setAddGoogleSheetUrl,
  setEnableSalesforce,
  setRejectReasons,
  setProxy,
  setHybridMode,
  setVerificationCategory,
  setVerificationSubCategory,
  setFixedUrlAddress,
  setDisplaySettings,
  setExpiry,
  setResubmission,
  setLiveFeedback,
  setMultiDownload,
  setImageUpload,
  setExtractAllTransaction,
  setCalculateBalanceAsOnDate,
  setFullTextSearchData,
} = buttonSlice.actions;

export default buttonSlice.reducer;
