import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface Transaction {
  [key: string]: any;
}

interface BillingState {
  transaction: Transaction | null;
  transactions: Transaction[];
  loading: boolean;
  error: any;
}

interface TransactionPayload {
  data: Transaction;
}

const initialState: BillingState = {
  transaction: null,
  transactions: [],
  loading: false,
  error: {},
};

export const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    getTransaction: (state, action: PayloadAction<TransactionPayload>) => {
      state.transaction = action.payload.data;
      state.loading = false;
    },

    getTransactions: (state, action: PayloadAction<TransactionPayload>) => {
      state.transaction = action.payload.data;
      state.loading = false;
    },

    transactionError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
      state.loading = false;
    },

    getBilling: (state, action: PayloadAction<TransactionPayload>) => {
      state.transaction = action.payload.data;
      state.loading = false;
    },

    billingError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
      state.loading = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { getTransaction, getTransactions, transactionError, getBilling, billingError, setLoading } = billingSlice.actions;

export default billingSlice.reducer;
