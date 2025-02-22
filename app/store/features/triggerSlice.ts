import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TriggerState {
  emailToOrganization: string;
  includePdfInEmail: boolean;
  submissionNotificationViaEmail: boolean;
  emailToOrganizationEnabled: boolean;
  enableEngagementCallback: boolean;
  autoJson: boolean;
  callbackUrl: string;
  addGoogleSheetUrl: boolean;
  enableSalesforce: boolean;
}

const initialState: TriggerState = {
  emailToOrganization: "",
  includePdfInEmail: false,
  submissionNotificationViaEmail: false,
  emailToOrganizationEnabled: false,
  enableEngagementCallback: false,
  autoJson: false,
  callbackUrl: "",
  addGoogleSheetUrl: false,
  enableSalesforce: false,
};

export const triggerSlice = createSlice({
  name: "trigger",
  initialState,
  reducers: {
    setEmailToOrganization: (state, action: PayloadAction<string>) => {
      state.emailToOrganization = action.payload;
    },
    setIncludePdfInEmail: (state, action: PayloadAction<boolean>) => {
      state.includePdfInEmail = action.payload;
    },
    setSubmissionNotificationViaEmail: (state, action: PayloadAction<boolean>) => {
      state.submissionNotificationViaEmail = action.payload;
    },
    setEmailToOrganizationEnabled: (state, action: PayloadAction<boolean>) => {
      state.emailToOrganizationEnabled = action.payload;
    },
    setEnableEngagementCallback: (state, action: PayloadAction<boolean>) => {
      state.enableEngagementCallback = action.payload;
    },
    setAutoJson: (state, action: PayloadAction<boolean>) => {
      state.autoJson = action.payload;
    },
    setCallbackUrl: (state, action: PayloadAction<string>) => {
      state.callbackUrl = action.payload;
    },
    setAddGoogleSheetUrl: (state, action: PayloadAction<boolean>) => {
      state.addGoogleSheetUrl = action.payload;
    },
    setEnableSalesforce: (state, action: PayloadAction<boolean>) => {
      state.enableSalesforce = action.payload;
    },
  },
});

export const {
  setEmailToOrganization,
  setIncludePdfInEmail,
  setSubmissionNotificationViaEmail,
  setEmailToOrganizationEnabled,
  setEnableEngagementCallback,
  setAutoJson,
  setCallbackUrl,
  setAddGoogleSheetUrl,
  setEnableSalesforce,
} = triggerSlice.actions;

export default triggerSlice.reducer;
