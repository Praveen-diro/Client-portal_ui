import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import buttonSettingsReducer from "./features/buttonSettingsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    buttonSettings: buttonSettingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
