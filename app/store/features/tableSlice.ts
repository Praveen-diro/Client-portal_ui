import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import tableService from "@/app/services/table.service";

// Define types for navigation logs
export interface NavLog {
  currentUrl: string;
  timestamp: string;
  title?: string;
  [key: string]: any;
}

export interface AutoNavDataType {
  navLogs: NavLog[];
  sessionId?: string;
  [key: string]: any;
}

// Define types for the state
export interface TableState {
  requests: any[];
  pendings: any[];
  completed: any[];
  reviews: any[];
  approved: any[];
  totalDocuments: any[];
  rejects: any[];
  deleted: any[];
  session_report: any[];
  allUserData: any[];
  loading: boolean;
  subheading: string;
  submitFeedalert: boolean;
  error: any;
  limit: number;
  limitapproves: number;
  limitrejets: number;
  limitrequest: number;
  pdf_loading: boolean;
  sendForRev: "loading" | "closed" | "pass" | "failed" | null;
  pdfjson: any;
  pdfjsonprocessing: any;
  searchAPI: boolean;
  callbacklog: any[];
  transactionData: any;
  AutoNavData: AutoNavDataType;
}

// Define the initial state
const initialState: TableState = {
  requests: [],
  pendings: [],
  completed: [],
  reviews: [],
  approved: [],
  totalDocuments: [],
  rejects: [],
  deleted: [],
  session_report: [],
  allUserData: [],
  loading: true,
  subheading: "",
  submitFeedalert: false,
  error: {},
  limit: 0,
  limitapproves: 0,
  limitrejets: 0,
  limitrequest: 0,
  pdf_loading: true,
  sendForRev: null,
  pdfjson: {},
  pdfjsonprocessing: {},
  searchAPI: false,
  callbacklog: [],
  transactionData: {},
  AutoNavData: {
    navLogs: [],
  },
};

// Async thunk for fetching session report
export const fetchSessionReport = createAsyncThunk("table/fetchSessionReport", async (sessionId: string, { dispatch }) => {
  dispatch(tableLoader());
  try {
    console.log("Fetching session report for:", sessionId);
    const response = await tableService.getSessionReport(sessionId);

    if (response.success && response.data) {
      dispatch(setSessionReportData({ data: response.data }));
      return response.data;
    } else {
      throw new Error("Failed to fetch session report");
    }
  } catch (error) {
    console.error("Error fetching session report:", error);
    dispatch(tableError(error));
    throw error;
  }
});

// Async thunk for fetching auto navigation data
export const fetchAutoNavData = createAsyncThunk("table/fetchAutoNavData", async (sessionId: string, { dispatch }) => {
  dispatch(tableLoader());
  try {
    console.log("Fetching auto nav data for:", sessionId);
    const response = await tableService.getAutoNavData(sessionId);

    if (response.success && response.data) {
      dispatch(setAutoNavData(response.data));
      return response.data;
    } else {
      throw new Error("Failed to fetch auto nav data");
    }
  } catch (error) {
    console.error("Error fetching auto nav data:", error);
    dispatch(tableError(error));
    throw error;
  }
});

// Async thunk for submitting feedback
export const submitFeedback = createAsyncThunk(
  "table/submitFeedback",
  async (feedbackData: { sessionId: string; comment: string; rating: number; email: string }, { dispatch }) => {
    dispatch(tableLoader());
    try {
      console.log("Submitting feedback:", feedbackData);
      const response = await tableService.submitFeedback({
        sessionid: feedbackData.sessionId,
        feedback: feedbackData.comment,
        rating: feedbackData.rating,
      });

      if (response.success) {
        dispatch(postFeedbackForm({ showAlert: true }));
        return response.data;
      } else {
        throw new Error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      dispatch(tableError(error));
      throw error;
    }
  }
);

// Create the slice
export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    postFeedbackForm: (state, action: PayloadAction<{ showAlert: boolean }>) => {
      state.submitFeedalert = action.payload.showAlert;
    },

    removeFeedbackAlert: (state) => {
      state.submitFeedalert = false;
    },

    getAllUserData: (state, action: PayloadAction<{ data: any[] }>) => {
      state.loading = false;
      state.allUserData = action.payload.data;
    },

    getRequests: (state, action: PayloadAction<{ limit: number; data: any[] }>) => {
      state.limitrequest = action.payload.limit;
      state.requests = action.payload.data;
      state.loading = false;
      state.subheading = "New Request";
      state.submitFeedalert = false;
    },

    getCompleted: (state, action: PayloadAction<{ data: any[] }>) => {
      state.completed = action.payload.data;
      state.loading = false;
      state.subheading = "Completed";
      state.submitFeedalert = false;
    },

    getReviews: (state, action: PayloadAction<{ data: any[] }>) => {
      state.reviews = action.payload.data;
      state.loading = false;
      state.subheading = "Review Pending";
      state.submitFeedalert = false;
    },

    getPendings: (state, action: PayloadAction<{ data: { data: any[]; limit: number } }>) => {
      state.pendings = action.payload.data.data;
      state.limit = action.payload.data.limit;
      state.loading = false;
      state.subheading = "Pending";
      state.submitFeedalert = false;
    },

    searchGetTrue: (state) => {
      state.searchAPI = true;
    },

    searchApiFalse: (state) => {
      state.searchAPI = false;
    },

    getApproves: (state, action: PayloadAction<{ data: { data: any[]; limit: number } }>) => {
      state.approved = action.payload.data.data;
      state.limitapproves = action.payload.data.limit;
      state.loading = false;
      state.subheading = "Approved";
      state.submitFeedalert = false;
    },

    getTotalDocuments: (state, action: PayloadAction<{ data: { data: any[] } }>) => {
      state.totalDocuments = action.payload.data.data;
      state.loading = false;
    },

    getCallbackLogs: (state, action: PayloadAction<{ data: { data: any[]; limit: number } }>) => {
      state.callbacklog = action.payload.data.data;
      state.limitrejets = action.payload.data.limit;
      state.loading = false;
      state.subheading = "callbacklog";
      state.submitFeedalert = false;
    },

    getRejects: (state, action: PayloadAction<{ data: { data: any[]; limit: number } }>) => {
      state.rejects = action.payload.data.data;
      state.limitrejets = action.payload.data.limit;
      state.loading = false;
      state.subheading = "Rejected";
      state.submitFeedalert = false;
    },

    getSearchResult: (state, action: PayloadAction<any>) => {
      state.rejects = action.payload;
      state.approved = action.payload;
      state.limitrejets = action.payload;
      state.pendings = action.payload;
      state.loading = false;
      state.subheading = "Rejected";
      state.submitFeedalert = false;
    },

    getSessionReport: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.session_report = [];
    },

    setSessionReportData: (state, action: PayloadAction<{ data: any[] }>) => {
      state.session_report = action.payload.data;
      state.loading = false;
      state.subheading = "New Request";
      state.submitFeedalert = false;
    },

    clearTable: (state) => {
      state.requests = [];
      state.pendings = [];
      state.completed = [];
      state.reviews = [];
      state.approved = [];
      state.rejects = [];
      state.session_report = [];
      state.subheading = "";
      state.loading = true;
    },

    tableError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
      state.loading = false;
    },

    tableLoader: (state) => {
      state.loading = true;
    },

    pdfLoader: (state) => {
      state.pdf_loading = true;
      state.sendForRev = "loading";
    },

    pdfToJsonData: (state, action: PayloadAction<any>) => {
      state.pdf_loading = false;
      state.pdfjson = action.payload;
      state.pdfjsonprocessing = action.payload.data;
      state.sendForRev = "closed";
    },

    sendReviewData: (state, action: PayloadAction<any>) => {
      state.pdf_loading = false;
      state.pdfjson = action.payload;
      state.pdfjsonprocessing = action.payload.data;
      state.sendForRev = "pass";
    },

    pdfToJsonError: (state, action: PayloadAction<{ data?: any }>) => {
      state.pdf_loading = false;
      state.pdfjson = action.payload?.data;
      state.sendForRev = "failed";
    },

    sendReviewReset: (state) => {
      state.sendForRev = "closed";
    },

    extractTransactionData: (state, action: PayloadAction<any>) => {
      state.transactionData = action.payload;
      state.loading = false;
    },

    extractTransactionError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
      state.loading = false;
    },

    redoTransactionDocLoading: (state) => {
      state.loading = true;
    },

    redoTransactionDocSuccess: (state) => {
      state.loading = false;
      state.sendForRev = "pass";
    },

    redoTransactionDocFailure: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.sendForRev = "failed";
    },

    getAutoNavData: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.AutoNavData = {
        navLogs: [],
      };
    },

    setAutoNavData: (state, action: PayloadAction<any>) => {
      state.AutoNavData = action.payload;
      state.loading = false;
    },

    resetFeedbackStatus: (state) => {
      state.submitFeedalert = false;
    },
  },
});

// Export actions
export const {
  postFeedbackForm,
  removeFeedbackAlert,
  getAllUserData,
  getRequests,
  getCompleted,
  getReviews,
  getPendings,
  searchGetTrue,
  searchApiFalse,
  getApproves,
  getTotalDocuments,
  getCallbackLogs,
  getRejects,
  getSearchResult,
  getSessionReport,
  setSessionReportData,
  clearTable,
  tableError,
  tableLoader,
  pdfLoader,
  pdfToJsonData,
  sendReviewData,
  pdfToJsonError,
  sendReviewReset,
  extractTransactionData,
  extractTransactionError,
  redoTransactionDocLoading,
  redoTransactionDocSuccess,
  redoTransactionDocFailure,
  getAutoNavData,
  setAutoNavData,
  resetFeedbackStatus,
} = tableSlice.actions;

// Export reducer
export default tableSlice.reducer;
