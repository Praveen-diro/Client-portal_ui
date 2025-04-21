"use client";

import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { PersistGate } from "redux-persist/integration/react";

// TypeScript declaration for Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    __REDUX_STORE__?: any;
  }
}

// Performance-optimized Providers component
export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Initialize store on first load
  useEffect(() => {
    // Mark component as mounted
    setMounted(true);

    // Log the navigation for debugging
    console.log("Navigation to:", pathname);
  }, [pathname]);

  // Handle Redux DevTools and other non-critical setup
  useEffect(() => {
    // Only proceed once component is mounted
    if (!mounted) return;

    // Safely use requestIdleCallback with a fallback
    const requestIdleCallbackPolyfill = (callback: IdleRequestCallback, options?: IdleRequestOptions): number => {
      const start = Date.now();
      return window.setTimeout(() => {
        callback({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        });
      }, options?.timeout || 1);
    };

    // Use native requestIdleCallback if available, otherwise use the polyfill
    const requestIdle = window.requestIdleCallback || requestIdleCallbackPolyfill;
    const cancelIdle = window.cancelIdleCallback || window.clearTimeout;

    // Handle Redux DevTools connection in an idle callback
    const idleCallbackId = requestIdle(() => {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        // Avoid excessive console logging in production
        console.log("Redux store initialized");

        // Connect Redux DevTools when browser is idle
        if (window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_STORE__) {
          try {
            window.__REDUX_DEVTOOLS_EXTENSION__.connect();
          } catch (err) {
            // Silently handle error in production
            if (process.env.NODE_ENV === "development") {
              console.error("Redux DevTools connection error:", err);
            }
          }
        }
      }
    });

    return () => {
      // Clean up idle callback
      cancelIdle(idleCallbackId);
    };
  }, [mounted]);

  // Wrap non-critical features in Suspense to avoid blocking the UI
  return (
    <Provider store={store}>
      {mounted ? (
        <PersistGate loading={null} persistor={persistor}>
          {children}
          <Suspense fallback={null}>
            <GeoLocationLoader pathname={pathname} />
          </Suspense>
        </PersistGate>
      ) : null}
    </Provider>
  );
}

// Separate component for geolocation to avoid blocking the main render
function GeoLocationLoader({ pathname }: { pathname: string }) {
  useEffect(() => {
    // Only load geolocation data when navigation is complete and the page is visible
    if (document.visibilityState === "visible") {
      const timer = setTimeout(() => {
        import("./utils/geoLocation").then((module) => {
          try {
            module.default();
          } catch (error) {
            // Silently handle errors in production
            if (process.env.NODE_ENV === "development") {
              console.error("Geolocation error:", error);
            }
          }
        });
      }, 2000); // Longer delay to prioritize UI rendering

      return () => clearTimeout(timer);
    }
  }, [pathname]); // Re-run when pathname changes

  return null;
}
