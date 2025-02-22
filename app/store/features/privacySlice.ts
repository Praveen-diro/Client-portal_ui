import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface VerificationField {
  fieldLabel: string;
  type: string;
  sampleText: string;
  tag: string;
}

interface PrivacyState {
  autoDeletionEnabled: boolean;
  autoDeletionDays: number;
  shareOnlyJson: boolean;
  showFieldLabels: boolean;
  disableWebpagePrompts: boolean;
  showDetailedJson: boolean;
  transactionsExtraction: boolean;
  verificationFields: VerificationField[];
}

const initialState: PrivacyState = {
  autoDeletionEnabled: false,
  autoDeletionDays: 7,
  shareOnlyJson: false,
  showFieldLabels: false,
  disableWebpagePrompts: false,
  showDetailedJson: false,
  transactionsExtraction: false,
  verificationFields: [
    {
      fieldLabel: "First name",
      type: "text",
      sampleText: "Jane",
      tag: "",
    },
    {
      fieldLabel: "Last name",
      type: "text",
      sampleText: "Smith",
      tag: "",
    },
    {
      fieldLabel: "anything",
      type: "text",
      sampleText: "anything",
      tag: "",
    },
  ],
};

export const privacySlice = createSlice({
  name: "privacy",
  initialState,
  reducers: {
    setAutoDeletion: (state, action: PayloadAction<{ enabled: boolean; days?: number }>) => {
      state.autoDeletionEnabled = action.payload.enabled;
      if (action.payload.days) {
        state.autoDeletionDays = action.payload.days;
      }
    },
    setShareOnlyJson: (state, action: PayloadAction<boolean>) => {
      state.shareOnlyJson = action.payload;
    },
    setShowFieldLabels: (state, action: PayloadAction<boolean>) => {
      state.showFieldLabels = action.payload;
    },
    setDisableWebpagePrompts: (state, action: PayloadAction<boolean>) => {
      state.disableWebpagePrompts = action.payload;
    },
    setShowDetailedJson: (state, action: PayloadAction<boolean>) => {
      state.showDetailedJson = action.payload;
    },
    setTransactionsExtraction: (state, action: PayloadAction<boolean>) => {
      state.transactionsExtraction = action.payload;
    },
    addVerificationField: (state, action: PayloadAction<VerificationField>) => {
      state.verificationFields.push(action.payload);
    },
    removeVerificationField: (state, action: PayloadAction<number>) => {
      state.verificationFields.splice(action.payload, 1);
    },
    updateVerificationField: (state, action: PayloadAction<{ index: number; field: Partial<VerificationField> }>) => {
      state.verificationFields[action.payload.index] = {
        ...state.verificationFields[action.payload.index],
        ...action.payload.field,
      };
    },
  },
});

export const {
  setAutoDeletion,
  setShareOnlyJson,
  setShowFieldLabels,
  setDisableWebpagePrompts,
  setShowDetailedJson,
  setTransactionsExtraction,
  addVerificationField,
  removeVerificationField,
  updateVerificationField,
} = privacySlice.actions;

export default privacySlice.reducer;
