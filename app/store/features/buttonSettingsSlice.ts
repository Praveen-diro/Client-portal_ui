import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ButtonSettingsState {
  basic: {
    verificationMethod: string;
    directUrlEnabled: boolean;
    selectedCountry: string;
    limitCountryEnabled: boolean;
    selectedCountries: string[];
    allowSubmissionOverride: boolean;
    allowMissingStatements: boolean;
  };
  privacy: {
    autoDeletionEnabled: boolean;
    shareOnlyJson: boolean;
    showFieldLabels: boolean;
    disableWebpagePrompts: boolean;
    showDetailedJson: boolean;
    transactionsExtraction: boolean;
    verificationFields: any[]; // Define proper type if needed
  };
  trigger: {
    emailToOrganization: string;
    includePdfInEmail: boolean;
    submissionNotificationViaEmail: boolean;
    emailToOrganizationEnabled: boolean;
    enableEngagementCallback: boolean;
    autoJson: boolean;
    callbackUrl: string;
    addGoogleSheetUrl: boolean;
    enableSalesforce: boolean;
  };
  display: {
    startWithFullScreen: boolean;
    showPreview: boolean;
    desktopWarning: string;
    desktopCustomMessage: string;
    colorValue: string;
    includeFaqPage: boolean;
    includeQrCode: boolean;
    noPasswordText: string;
    strongPrivacyText: string;
    secureText: string;
    dataPurgeText: string;
    loginText: string;
    instructionText: string;
    successHeading: string;
    successMessage: string;
    failureHeading: string;
    failureMessage: string;
    organizationName: string;
  };
  rejection: {
    disallowedDocTypes: string[];
  };
  advanced: {
    proxyLocation: string;
    allowMethodSwitching: boolean;
  };
}

const initialState: ButtonSettingsState = {
  basic: {
    verificationMethod: "download",
    directUrlEnabled: false,
    selectedCountry: "",
    limitCountryEnabled: false,
    selectedCountries: [],
    allowSubmissionOverride: false,
    allowMissingStatements: false,
  },
  privacy: {
    autoDeletionEnabled: false,
    shareOnlyJson: false,
    showFieldLabels: false,
    disableWebpagePrompts: false,
    showDetailedJson: false,
    transactionsExtraction: false,
    verificationFields: [],
  },
  trigger: {
    emailToOrganization: "",
    includePdfInEmail: false,
    submissionNotificationViaEmail: false,
    emailToOrganizationEnabled: false,
    enableEngagementCallback: false,
    autoJson: false,
    callbackUrl: "",
    addGoogleSheetUrl: false,
    enableSalesforce: false,
  },
  display: {
    startWithFullScreen: false,
    showPreview: false,
    desktopWarning: "",
    desktopCustomMessage: "Start this session from your desktop vs. mobile device for an optimized user experience.",
    colorValue: "",
    includeFaqPage: false,
    includeQrCode: false,
    noPasswordText: "",
    strongPrivacyText: "",
    secureText: "",
    dataPurgeText: "",
    loginText: "",
    instructionText: "",
    successHeading: "Thank You",
    successMessage: "Your verification is complete",
    failureHeading: "Sorry",
    failureMessage: "Unable to verify",
    organizationName: "",
  },
  rejection: {
    disallowedDocTypes: ["loan-statements"],
  },
  advanced: {
    proxyLocation: "usa",
    allowMethodSwitching: false,
  },
};

export const buttonSettingsSlice = createSlice({
  name: "buttonSettings",
  initialState,
  reducers: {
    // Basic tab actions
    setVerificationMethod: (state, action: PayloadAction<string>) => {
      state.basic.verificationMethod = action.payload;
    },
    setDirectUrlEnabled: (state, action: PayloadAction<boolean>) => {
      state.basic.directUrlEnabled = action.payload;
    },
    setSelectedCountry: (state, action: PayloadAction<string>) => {
      state.basic.selectedCountry = action.payload;
    },
    setLimitCountryEnabled: (state, action: PayloadAction<boolean>) => {
      state.basic.limitCountryEnabled = action.payload;
    },
    setSelectedCountries: (state, action: PayloadAction<string[]>) => {
      state.basic.selectedCountries = action.payload;
    },
    setAllowSubmissionOverride: (state, action: PayloadAction<boolean>) => {
      state.basic.allowSubmissionOverride = action.payload;
    },
    setAllowMissingStatements: (state, action: PayloadAction<boolean>) => {
      state.basic.allowMissingStatements = action.payload;
    },

    // Privacy tab actions
    setAutoDeletion: (state, action: PayloadAction<{ enabled: boolean }>) => {
      state.privacy.autoDeletionEnabled = action.payload.enabled;
    },
    setShareOnlyJson: (state, action: PayloadAction<boolean>) => {
      state.privacy.shareOnlyJson = action.payload;
    },
    setShowFieldLabels: (state, action: PayloadAction<boolean>) => {
      state.privacy.showFieldLabels = action.payload;
    },
    setDisableWebpagePrompts: (state, action: PayloadAction<boolean>) => {
      state.privacy.disableWebpagePrompts = action.payload;
    },
    setShowDetailedJson: (state, action: PayloadAction<boolean>) => {
      state.privacy.showDetailedJson = action.payload;
    },
    setTransactionsExtraction: (state, action: PayloadAction<boolean>) => {
      state.privacy.transactionsExtraction = action.payload;
    },

    // Trigger tab actions
    setEmailToOrganization: (state, action: PayloadAction<string>) => {
      state.trigger.emailToOrganization = action.payload;
    },
    setIncludePdfInEmail: (state, action: PayloadAction<boolean>) => {
      state.trigger.includePdfInEmail = action.payload;
    },
    setSubmissionNotificationViaEmail: (state, action: PayloadAction<boolean>) => {
      state.trigger.submissionNotificationViaEmail = action.payload;
    },
    setEmailToOrganizationEnabled: (state, action: PayloadAction<boolean>) => {
      state.trigger.emailToOrganizationEnabled = action.payload;
    },
    setEnableEngagementCallback: (state, action: PayloadAction<boolean>) => {
      state.trigger.enableEngagementCallback = action.payload;
    },
    setAutoJson: (state, action: PayloadAction<boolean>) => {
      state.trigger.autoJson = action.payload;
    },
    setCallbackUrl: (state, action: PayloadAction<string>) => {
      state.trigger.callbackUrl = action.payload;
    },
    setAddGoogleSheetUrl: (state, action: PayloadAction<boolean>) => {
      state.trigger.addGoogleSheetUrl = action.payload;
    },
    setEnableSalesforce: (state, action: PayloadAction<boolean>) => {
      state.trigger.enableSalesforce = action.payload;
    },

    // Display tab actions
    setDisplaySettings: (state, action: PayloadAction<Partial<ButtonSettingsState["display"]>>) => {
      state.display = { ...state.display, ...action.payload };
    },

    // Rejection tab actions
    setDisallowedDocTypes: (state, action: PayloadAction<string[]>) => {
      state.rejection.disallowedDocTypes = action.payload;
    },

    // Advanced tab actions
    setProxyLocation: (state, action: PayloadAction<string>) => {
      state.advanced.proxyLocation = action.payload;
    },
    setAllowMethodSwitching: (state, action: PayloadAction<boolean>) => {
      state.advanced.allowMethodSwitching = action.payload;
    },
  },
});

export const {
  // Basic tab actions
  setVerificationMethod,
  setDirectUrlEnabled,
  setSelectedCountry,
  setLimitCountryEnabled,
  setSelectedCountries,
  setAllowSubmissionOverride,
  setAllowMissingStatements,

  // Privacy tab actions
  setAutoDeletion,
  setShareOnlyJson,
  setShowFieldLabels,
  setDisableWebpagePrompts,
  setShowDetailedJson,
  setTransactionsExtraction,

  // Trigger tab actions
  setEmailToOrganization,
  setIncludePdfInEmail,
  setSubmissionNotificationViaEmail,
  setEmailToOrganizationEnabled,
  setEnableEngagementCallback,
  setAutoJson,
  setCallbackUrl,
  setAddGoogleSheetUrl,
  setEnableSalesforce,

  // Display tab actions
  setDisplaySettings,

  // Rejection tab actions
  setDisallowedDocTypes,

  // Advanced tab actions
  setProxyLocation,
  setAllowMethodSwitching,
} = buttonSettingsSlice.actions;

export default buttonSettingsSlice.reducer;
