import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import buttonSettingsReducer from "./features/buttonSettingsSlice";
import authReducer from "./features/authSlice";
import { combineReducers } from "@reduxjs/toolkit";

declare const module: any;

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  buttonSettings: buttonSettingsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["your-non-serializable-action-type"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["items.dates"],
      },
      immutableCheck: { warnAfter: 128 },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Enable hot reloading in development
if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./features/userSlice", () => {
    const nextRootReducer = combineReducers({
      auth: authReducer,
      user: userReducer,
      buttonSettings: buttonSettingsReducer,
    });
    store.replaceReducer(nextRootReducer);
  });
}
