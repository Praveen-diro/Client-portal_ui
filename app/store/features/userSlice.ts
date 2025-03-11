import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
interface User {
  _id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

interface UserState {
  isAuthenticated: boolean;
  users: User[];
  user: User | null;
  users_error: any;
  loading: boolean;
  subheading: string;
  usererror: string;
  userdelerror: boolean;
  adduseralert: boolean;
  addusererror: boolean;
  edituseralert: boolean;
  edituser: boolean;
  transferOwnershipAlert: boolean;
  ownerEmail: string;
}

interface GetUsersPayload {
  workers: User[];
  error: any;
  ownerEmail: string;
}

interface AddUserErrorPayload {
  data: {
    message: string;
  };
}

const initialState: UserState = {
  isAuthenticated: false,
  users: [],
  user: null,
  users_error: null,
  loading: true,
  subheading: "",
  usererror: "",
  userdelerror: false,
  adduseralert: false,
  addusererror: false,
  edituseralert: false,
  edituser: false,
  transferOwnershipAlert: false,
  ownerEmail: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    addUser: (state) => {
      state.adduseralert = true;
      state.addusererror = false;
      state.userdelerror = false;
      state.loading = false;
      state.subheading = "Users";
      state.edituser = false;
    },

    editUser: (state) => {
      state.edituseralert = true;
      state.users = [];
    },

    getUsers: (state, action: PayloadAction<GetUsersPayload>) => {
      state.users = action.payload.workers;
      state.users_error = action.payload.error;
      state.loading = false;
      state.subheading = "Users";
      state.ownerEmail = action.payload.ownerEmail;
    },

    addUserError: (state, action: PayloadAction<AddUserErrorPayload>) => {
      state.usererror = action.payload.data.message;
      state.userdelerror = false;
      state.adduseralert = false;
      state.addusererror = true;
    },

    getUsersError: (state, action: PayloadAction<{ error: any }>) => {
      state.users_error = action.payload.error;
      state.loading = false;
      state.subheading = "Users";
    },

    getUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },

    deleteUsers: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
      state.usererror = "";
      state.userdelerror = true;
      state.adduseralert = false;
      state.addusererror = false;
      state.loading = false;
    },

    editUsers: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
    },

    clearUser: (state) => {
      state.users = [];
      state.user = null;
      state.subheading = "";
      state.loading = true;
    },

    transferOwnership: (state) => {
      state.transferOwnershipAlert = true;
      state.users = [];
    },

    stopUserAlert: (state) => {
      state.userdelerror = false;
      state.users_error = false;
      state.adduseralert = false;
      state.addusererror = false;
      state.edituseralert = false;
    },
  },
});

export const {
  setUser,
  logout,
  addUser,
  editUser,
  getUsers,
  addUserError,
  getUsersError,
  getUser,
  deleteUsers,
  editUsers,
  clearUser,
  transferOwnership,
  stopUserAlert,
} = userSlice.actions;

export default userSlice.reducer;
