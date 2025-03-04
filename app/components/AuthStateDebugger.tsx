"use client";

import { useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function AuthStateDebugger() {
  const auth = useAppSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  const [pageLoads, setPageLoads] = useState(0);
  const [navigationCount, setNavigationCount] = useState(0);
  const [storeInstanceId, setStoreInstanceId] = useState<string>("");

  useEffect(() => {
    setMounted(true);

    // Get or create a unique ID for the Redux store instance
    // This helps us verify that we're using the same store across navigations
    if (typeof window !== "undefined") {
      let id = sessionStorage.getItem("redux-store-instance-id");
      if (!id) {
        id = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem("redux-store-instance-id", id);
      }
      setStoreInstanceId(id);

      // Increment page load counter
      const currentLoads = parseInt(sessionStorage.getItem("pageLoads") || "0");
      sessionStorage.setItem("pageLoads", (currentLoads + 1).toString());
      setPageLoads(currentLoads + 1);

      // Set up navigation tracking
      const handleRouteChange = () => {
        setNavigationCount((prev) => prev + 1);
      };

      window.addEventListener("popstate", handleRouteChange);

      return () => {
        window.removeEventListener("popstate", handleRouteChange);
      };
    }
  }, []);

  // Check if we should hide the debugger
  if (!mounted || process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 dark:bg-black/70 p-3 rounded shadow-lg text-xs max-w-xs z-50 overflow-auto max-h-96">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold">Redux Debugger</h4>
        <div className="flex gap-1">
          <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs">Page loads: {pageLoads}</span>
          <span className="px-2 py-1 bg-green-500 text-white rounded-full text-xs">Navigations: {navigationCount}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
        <h4 className="font-semibold text-blue-600 dark:text-blue-400">Store ID: {storeInstanceId.substring(0, 6)}</h4>
        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mt-1">Auth State:</h4>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(
            {
              isAuthenticated: auth.isAuthenticated,
              email: auth.email,
              twoFactor: auth.isTwoFactor,
              loading: auth.loading,
              token: auth.token ? "exists" : "missing",
              apikey: auth.apikey ? "exists" : "missing",
              roles: auth.roles,
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
        <h4 className="font-semibold text-green-600 dark:text-green-400">Cookies:</h4>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(
            {
              token: Cookies.get("token") ? "exists" : "missing",
              apikey: Cookies.get("apikey") ? "exists" : "missing",
              email: Cookies.get("email"),
              isAuthenticated: Cookies.get("isAuthenticated"),
              isTwoFactor: Cookies.get("isTwoFactor"),
            },
            null,
            2
          )}
        </pre>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-1 mt-1 text-center text-xs text-gray-500">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
