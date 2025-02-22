import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import privacyReducer from "./features/privacySlice";
import triggerReducer from "./features/triggerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    privacy: privacyReducer,
    trigger: triggerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
