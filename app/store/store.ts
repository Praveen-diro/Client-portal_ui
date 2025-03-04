import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import buttonSettingsReducer from "./features/buttonSettingsSlice";
import authReducer from "./features/authSlice";
import { combineReducers } from "@reduxjs/toolkit";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  buttonSettings: buttonSettingsReducer,
});

// Use a closure to maintain a single store instance across the application lifecycle
const createStore = () => {
  // To ensure we only create the store once in the client
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window.__REDUX_STORE__) {
      // @ts-ignore
      return window.__REDUX_STORE__;
    }
  }

  // Create the store with middleware and DevTools
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for non-serializable data
      }),
    devTools: process.env.NODE_ENV !== "production",
  });

  // Save the store reference in the window object to ensure it persists across page navigation
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__REDUX_STORE__ = store;
  }

  return store;
};

// Create the store instance
export const store = createStore();

// Enable hot reloading in development
if (process.env.NODE_ENV !== "production" && typeof module !== 'undefined' && module.hot) {
  module.hot.accept("./features/authSlice", () => {
    store.replaceReducer(rootReducer);
  });
}

// Export types for TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
