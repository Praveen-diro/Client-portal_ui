import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cookies } from "../../services/cookie.service";

// Types
interface Organization {
  id?: string;
  usage?: number;
  nickname?: string[];
  subscriptions?: {
    data: Array<{
      plan: {
        nickname: string;
        tiers: Array<{
          flat_amount: number;
        }>;
      };
    }>;
  };
  [key: string]: any;
}

interface OrganizationState {
  requestorg: Organization | null;
  nickname: string | null;
  flatamt: number | null;
  orgdetails: Organization | null;
  orgstripe_id: string | null;
  loading: boolean;
  nicknamedata: string[];
  usage: number;
  error: any;
}

const initialState: OrganizationState = {
  requestorg: null,
  nickname: cookies.get("nickname") || null,
  flatamt: cookies.get("flat_amount") ? Number(cookies.get("flat_amount")) : null,
  orgdetails: null,
  orgstripe_id: null,
  loading: true,
  nicknamedata: [],
  usage: 0,
  error: {},
};

export const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {
    getOrgItem: (state, action: PayloadAction<Organization>) => {
      // Clear existing cookies
      cookies.remove("nickname");
      cookies.remove("flat_amount");

      // Set new orgstripe_id in cookies
      if (action.payload.id) {
        cookies.set("orgstripe_id", action.payload.id);
      }

      // Update state
      state.requestorg = action.payload;
      state.usage = action.payload.usage || 0;
      state.orgstripe_id = action.payload.id || null;
      state.nicknamedata = action.payload.nickname || [];
      state.loading = false;

      // Optional: Update other fields if needed based on subscriptions data
      if (action.payload.subscriptions?.data?.[0]?.plan) {
        const plan = action.payload.subscriptions.data[0].plan;
        cookies.set("nickname", plan.nickname);
        if (plan.tiers?.[0]?.flat_amount) {
          cookies.set("flat_amount", plan.tiers[0].flat_amount.toString());
        }
      }
    },

    clearOrg: (state) => {
      state.orgdetails = null;
      state.loading = true;
      // Clear cookies when clearing org
      cookies.remove("nickname");
      cookies.remove("flat_amount");
      cookies.remove("orgstripe_id");
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<any>) => {
      // Only set error if it's not empty
      if (action.payload && (typeof action.payload === "string" || Object.keys(action.payload).length > 0)) {
        state.error = action.payload;
      } else {
        state.error = null; // or state.error = {}; depending on your preference
      }
      state.loading = false;
    },

    // Uncomment if you need updateOrg functionality
    updateOrg: (state, action: PayloadAction<{ data: Organization }>) => {
      state.orgdetails = action.payload.data;
      state.loading = false;
    },
  },
});

export const {
  getOrgItem,
  clearOrg,
  setLoading,
  setError,
  // updateOrg
} = organizationSlice.actions;

export default organizationSlice.reducer;
