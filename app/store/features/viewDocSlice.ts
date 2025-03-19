import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for the state
interface ViewDocState {
  viewpdfdata: any;
  viewdata: any;
  view_loading: boolean;
  viewdoc_msg: boolean;
  s3_data: any[];
  error: Record<string, any>;
}

// Initial state with TypeScript types
const initialState: ViewDocState = {
  viewpdfdata: "",
  viewdata: "",
  view_loading: false,
  viewdoc_msg: false,
  s3_data: [],
  error: {},
};

// Create the slice
const viewDocSlice = createSlice({
  name: "viewDoc",
  initialState,
  reducers: {
    setViewDocLoading: (state) => {
      state.view_loading = true;
    },

    rejectDocument: () => {
      // Using window.open in a reducer isn't ideal, but replicating existing functionality
      window.open("/client/documents-received/review-pending", "_self");
      return initialState;
    },

    approveDocument: () => {
      // Using window.open in a reducer isn't ideal, but replicating existing functionality
      window.open("/client/documents-received/review-pending", "_self");
      return initialState;
    },

    setDataPdf: (state, action: PayloadAction<any>) => {
      state.viewpdfdata = action.payload;
      state.view_loading = false;
    },

    setDocumentData: (state, action: PayloadAction<any>) => {
      state.viewdata = action.payload;
      state.view_loading = false;
    },

    setViewDocMessage: (state) => {
      state.viewdoc_msg = true;
    },

    removeViewDocMessage: (state) => {
      state.viewdoc_msg = false;
    },

    setS3BucketData: (state, action: PayloadAction<any[]>) => {
      state.s3_data = action.payload;
    },
  },
});

// Export actions
export const {
  setViewDocLoading,
  rejectDocument,
  approveDocument,
  setDataPdf,
  setDocumentData,
  setViewDocMessage,
  removeViewDocMessage,
  setS3BucketData,
} = viewDocSlice.actions;

// Export the reducer
export default viewDocSlice.reducer;
