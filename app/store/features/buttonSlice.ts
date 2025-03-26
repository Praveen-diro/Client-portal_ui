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
    };
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
      Object.assign(state, action.payload);
      state.btn = action.payload.btndata;
      state.loading = false;
    },
    updateButton: (state, action: PayloadAction<any>) => {
      Object.assign(state, action.payload);
      state.btn = action.payload.data;
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
      state.buttons = action.payload.data;
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
    getCountryList: (state, action: PayloadAction<any>) => {
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
        data: action.payload.res,
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
  getCountryList,
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
} = buttonSlice.actions;

export default buttonSlice.reducer;
