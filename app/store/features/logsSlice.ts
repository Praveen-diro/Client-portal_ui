import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Request {
  stage: string;
  docid: string;
  sandbox: boolean;
  buttonid: string;
  category: string;
  email: string;
  message: string;
  name: string;
  sourcecountry: string;
  sourcename: string;
  type: string;
}

interface CallbackLog {
  date: string;
  orgid: string;
  request: Request;
  status: number;
}

interface ApiResponse {
  error: boolean;
  logs: CallbackLog[];
  message: string;
}

interface LogsState {
  callbackLogs: CallbackLog[];
  loading: boolean;
  error: any;
}

const initialState: LogsState = {
  callbackLogs: [],
  loading: false,
  error: null,
};

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setCallbackLogs: (state, action: PayloadAction<ApiResponse>) => {
      state.callbackLogs = action.payload.logs;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setCallbackLogs, setLoading, setError } = logsSlice.actions;

export default logsSlice.reducer;
