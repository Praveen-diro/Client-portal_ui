"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Wait for hydration to complete before rendering
  useEffect(() => {
    setMounted(true);

    // Attempt to force connection with Redux DevTools on initial load and navigation
    if (typeof window !== "undefined") {
      // @ts-ignore
      if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_STORE__) {
        try {
          // @ts-ignore
          window.__REDUX_DEVTOOLS_EXTENSION__.connect();
        } catch (err) {
          console.error("Failed to connect to Redux DevTools:", err);
        }
      }
    }
  }, []);

  // This part is crucial - by using the same store instance globally,
  // we ensure that state persists across client-side navigations
  return <Provider store={store}>{children}</Provider>;
}
