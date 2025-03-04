"use client";

import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Wait for hydration to complete before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // This part is crucial - by using the same store instance globally,
  // we ensure that state persists across client-side navigations
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
