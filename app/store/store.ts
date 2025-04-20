import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import authReducer from "./features/authSlice";
import tableReducer from "./features/tableSlice";
import organizationReducer from "./features/organizationSlice";
import billingReducer from "./features/billingSlice";
import viewDocReducer from "./features/viewDocSlice";
import buttonReducer from "./features/buttonSlice";
import sourceReducer from "./features/sourceSlice";
import logsReducer from "./features/logsSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  table: tableReducer,
  organization: organizationReducer,
  billing: billingReducer,
  viewDoc: viewDocReducer,
  buttons: buttonReducer,
  source: sourceReducer,
  logs: logsReducer,
});

// Use a closure to maintain a single store instance across the application lifecycle
const createStore = () => {
  // To ensure we only create the store once in the client
  if (typeof window !== "undefined") {
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
    devTools: true, // Always enable DevTools regardless of environment
  });

  // Save the store reference in the window object to ensure it persists across page navigation
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.__REDUX_STORE__ = store;

    // Explicitly connect to Redux DevTools
    // @ts-ignore
    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
      // @ts-ignore
      window.__REDUX_DEVTOOLS_EXTENSION__.connect();
    }
  }

  return store;
};

// Create the store instance
export const store = createStore();
export const persistor = persistStore(store);

// Enable hot reloading in development
if (
  process.env.NODE_ENV !== "production" &&
  typeof module !== "undefined" &&
  // @ts-ignore - Module hot loading is available in some environments
  module.hot
) {
  // @ts-ignore - Module hot loading is available in some environments
  module.hot.accept(
    [
      "./features/authSlice",
      "./features/userSlice",
      "./features/tableSlice",
      "./features/organizationSlice",
      "./features/billingSlice",
      "./features/viewDocSlice",
      "./features/buttonSlice",
      "./features/sourceSlice",
    ],
    () => {
      store.replaceReducer(rootReducer);
    }
  );
}

// Export types for TypeScript
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
