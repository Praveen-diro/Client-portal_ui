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
    subcategory?: (
      | string
      | {
          value: string;
          label: string;
          flag?: string;
          uniquekey?: string;
        }
    )[];
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
    submissionNotifyEmail?: boolean;
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
      state.btn.btndata.selectedCountries = action.payload;
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
      if (state.btn && state.btn.btndata) {
        state.btn.btndata.autodeleteenable = action.payload;
      }
    },
    setShareOnlyJson: (state, action: PayloadAction<boolean>) => {
      if (state.btn && state.btn.btndata) {
        state.btn.btndata.shareonlyjson = action.payload;
      }
    },
    setDocumentExpiryValue: (state, action: PayloadAction<number>) => {
      if (state.btn && state.btn.btndata) {
        state.btn.btndata.documentexpiryvalue = action.payload;
      }
    },
    setShowFieldLabels: (state, action: PayloadAction<boolean>) => {
      if (state.btn && state.btn.btndata) {
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
      state.btn.btndata.showgoogle = action.payload;
    },
    setEmailToOrganization: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.replytoemail = action.payload;
      }
    },

    setIncludeOriginalFilename: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.includeOriginalFilename = action.payload;
      }
    },
    setEnableCustomTemplate: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.enableCustomTemplate = action.payload;
      }
    },
    setIncludePdfInEmail: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.include_pdf = action.payload;
      }
    },
    setSubmissionNotificationViaEmail: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.submissionNotifyEmail = action.payload;
      }
    },
    setEmailToOrganizationEnabled: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.replytoemail = action.payload;
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
    setGooglesheet: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.googleSheet = action.payload;
      }
    },
    setGooglesheeturl: (state, action: PayloadAction<string>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.googlesheeturl = action.payload;
      }
    },
    setEnableSalesforce: (state, action: PayloadAction<boolean>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.enableSalesforce = action.payload;
      }
    },
    setSalesforceConfig: (state, action: PayloadAction<Record<string, string>>) => {
      if (state.btn?.btndata) {
        // Initialize privacytext object if it doesn't exist
        if (!state.btn.btndata.salesforce) {
          state.btn.btndata.salesforce = {};
        }
        Object.keys(action.payload).forEach((key) => {
          state.btn.btndata.salesforce[key] = action.payload[key];
        });
      }
    },
    setRejectReasons: (state, action: PayloadAction<string[]>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.reject_reasons = action.payload;
      }
    },
    setDocumentSelect: (state, action: PayloadAction<string[]>) => {
      if (state.btn?.btndata) {
        state.btn.btndata.documentSelect = action.payload;
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
    setVerificationSubCategory: (state, action: PayloadAction<(string | { label: string; value: string })[]>) => {
      if (state.btn?.btndata) {
        // Extract just the values if objects are passed
        const values = action.payload.map((item) => (typeof item === "string" ? item : item.value));
        state.btn.btndata.subcategory = values;
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

    setDisplayPrivacyItems: (state, action: PayloadAction<Record<string, string>>) => {
      if (state.btn?.btndata) {
        // Initialize privacytext object if it doesn't exist
        if (!state.btn.btndata.privacytext) {
          state.btn.btndata.privacytext = {};
        }

        Object.keys(action.payload).forEach((key) => {
          state.btn.btndata.privacytext[key] = action.payload[key];
        });
      }
    },

    setDisplayExitItems: (state, action: PayloadAction<Record<string, string>>) => {
      if (state.btn?.btndata) {
        // Initialize exitpage object if it doesn't exist
        if (!state.btn.btndata.exitpage) {
          state.btn.btndata.exitpage = {};
        }

        Object.keys(action.payload).forEach((key) => {
          state.btn.btndata.exitpage[key] = action.payload[key];
        });
      }
    },

    setDisplayGuideItems: (state, action: PayloadAction<Record<string, string>>) => {
      if (state.btn?.btndata) {
        // Initialize welcomePage object if it doesn't exist
        if (!state.btn.btndata.welcomePage) {
          state.btn.btndata.welcomePage = {};
        }

        Object.keys(action.payload).forEach((key) => {
          state.btn.btndata.welcomePage[key] = action.payload[key];
        });
      }
    },

    setExpiry: (state, action: PayloadAction<string>) => {
      if (action.payload === "") {
        state.btn.btndata.expiry = null;
      } else {
        state.btn.btndata.expiry = action.payload;
      }
    },

    setResubmission: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.resubmission = action.payload;
    },

    setLiveFeedback: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.livefeedbackMode = action.payload;
    },

    setMultiDownload: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.multidownload = action.payload;
    },

    setAutoNavigation: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.autoNavigation = action.payload;
    },

    setImageUpload: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.imageUpload = action.payload;
    },

    setExtractAllTransaction: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.extractAllTransaction = action.payload;
    },

    setCalculateBalanceAsOnDate: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.calculateBalanceAsOnDate = action.payload;
    },

    setDiroCertificate: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.diro_certificate = action.payload;
    },

    setOriginalDoc: (state, action: PayloadAction<boolean>) => {
      state.btn.btndata.original_doc = action.payload;
    },

    setFullTextSearchData: (state, action: PayloadAction<any>) => {
      state.searchResults = action.payload;
    },

    setEmailTemplate: (state, action: PayloadAction<string>) => {
      state.btn.btndata.emailnotetemplate = action.payload;
    },

    setRedirectUrl: (state, action: PayloadAction<string>) => {
      state.btn.btndata.redirecturl = action.payload;
    },

    setRedirectMessage: (state, action: PayloadAction<string>) => {
      state.btn.btndata.redirectmessage = action.payload;
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
  setDocumentExpiryValue,
  setShowFieldLabels,
  setDisableWebpagePrompts,
  setShowDetailedJson,
  setTransactionsExtraction,
  setShowGoogleSearch,
  setEmailToOrganization,
  setIncludeOriginalFilename,
  setEnableCustomTemplate,
  setIncludePdfInEmail,
  setSubmissionNotificationViaEmail,
  setEmailToOrganizationEnabled,
  setEnableEngagementCallback,
  setAutoJson,
  setCallbackUrl,
  setGooglesheet,
  setGooglesheeturl,
  setEnableSalesforce,
  setSalesforceConfig,
  setRejectReasons,
  setDocumentSelect,
  setProxy,
  setHybridMode,
  setVerificationCategory,
  setVerificationSubCategory,
  setFixedUrlAddress,
  setDisplaySettings,
  setDisplayPrivacyItems,
  setDisplayExitItems,
  setDisplayGuideItems,
  setExpiry,
  setResubmission,
  setLiveFeedback,
  setMultiDownload,
  setAutoNavigation,
  setImageUpload,
  setExtractAllTransaction,
  setCalculateBalanceAsOnDate,
  setDiroCertificate,
  setOriginalDoc,
  setFullTextSearchData,
  setEmailTemplate,
  setRedirectUrl,
  setRedirectMessage,
} = buttonSlice.actions;

export default buttonSlice.reducer;
