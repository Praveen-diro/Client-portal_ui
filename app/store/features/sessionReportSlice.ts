import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { tableService } from "@/app/services/table.service";

// Types
interface SessionReport {
  id: string;
  data: any; // Replace with more specific type based on your needs
}

interface AutoNavLog {
  currentUrl: string;
  timestamp: number;
}

interface AutoNavData {
  sessionId: string;
  navLogs: AutoNavLog[];
}

interface FeedbackData {
  email: string;
  sessionId: string;
  comment: string;
  source: string;
}

interface SessionReportState {
  sessionReport: SessionReport | null;
  autoNavData: AutoNavData | null;
  loading: boolean;
  error: string | null;
  feedbackSubmitted: boolean;
}

// Initial state
const initialState: SessionReportState = {
  sessionReport: null,
  autoNavData: null,
  loading: false,
  error: null,
  feedbackSubmitted: false,
};

// Async thunks
export const fetchSessionReport = createAsyncThunk(
  "sessionReport/fetchSessionReport",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await tableService.getSessionReport(sessionId);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch session report");
      }

      return { id: sessionId, data: response.data };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }
);

export const fetchAutoNavData = createAsyncThunk(
  "sessionReport/fetchAutoNavData",
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await tableService.getAutoNavData(sessionId);

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch auto navigation data");
      }

      return {
        sessionId,
        navLogs: response.data?.navLogs || [],
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "sessionReport/submitFeedback",
  async (feedbackData: FeedbackData, { rejectWithValue }) => {
    try {
      const response = await tableService.submitFeedback({
        sessionid: feedbackData.sessionId,
        feedback: feedbackData.comment,
        rating: 5, // Default rating if not provided
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to submit feedback");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }
);

// Slice
const sessionReportSlice = createSlice({
  name: "sessionReport",
  initialState,
  reducers: {
    clearSessionReport: (state) => {
      state.sessionReport = null;
    },
    clearAutoNavData: (state) => {
      state.autoNavData = null;
    },
    resetFeedbackStatus: (state) => {
      state.feedbackSubmitted = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Session Report
      .addCase(fetchSessionReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionReport.fulfilled, (state, action: PayloadAction<SessionReport>) => {
        state.loading = false;
        state.sessionReport = action.payload;
      })
      .addCase(fetchSessionReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Auto Nav Data
      .addCase(fetchAutoNavData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAutoNavData.fulfilled, (state, action: PayloadAction<AutoNavData>) => {
        state.loading = false;
        state.autoNavData = action.payload;
      })
      .addCase(fetchAutoNavData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.feedbackSubmitted = false;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.loading = false;
        state.feedbackSubmitted = true;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.feedbackSubmitted = false;
      });
  },
});

export const { clearSessionReport, clearAutoNavData, resetFeedbackStatus } = sessionReportSlice.actions;
export default sessionReportSlice.reducer;
