"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Get auth state from Redux
  const auth = useSelector((state: RootState) => state.auth);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Authentication check
  useEffect(() => {
    // Skip redirect on server or during hydration
    if (!mounted) return;

    // If not authenticated, redirect to login page
    if (!auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, router, mounted]);

  // Handle sidebar expansion
  const handleSidebarExpand = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  // Debug effect to log Redux state and cookies
  useEffect(() => {
    if (!mounted) return;

    if (process.env.NODE_ENV !== "production") {
      console.log("Client layout - Redux auth state:", {
        isAuthenticated: auth.isAuthenticated,
        email: auth.email,
        roles: auth.roles,
        token: auth.token ? "exists" : "missing",
        apikey: auth.apikey ? "exists" : "missing",
      });

      console.log("Client layout - Cookies:", {
        token: Cookies.get("token") ? "exists" : "missing",
        apikey: Cookies.get("apikey") ? "exists" : "missing",
        email: Cookies.get("email"),
        roles: Cookies.get("roles"),
      });
    }
  }, [auth, mounted]);

  // Always render the children on the server, then handle conditional rendering on the client after hydration
  return (
    <>
      <div className="flex h-screen">
        {mounted && auth.isAuthenticated && <Sidebar onExpandedChange={handleSidebarExpand} className="hidden lg:block" />}
        <div className="flex-1 overflow-auto">
          {children}

          {/* Debug component - only in development */}
          {mounted && process.env.NODE_ENV !== "production" && auth.isAuthenticated && (
            <div className="fixed bottom-4 right-4 bg-white/90 dark:bg-black/70 p-3 rounded shadow-lg text-xs max-w-xs z-50 overflow-auto max-h-48">
              <h4 className="font-bold mb-1">Redux Auth State:</h4>
              <pre className="overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    isAuthenticated: auth.isAuthenticated,
                    email: auth.email,
                    roles: auth.roles,
                    token: auth.token ? "exists" : "missing",
                    apikey: auth.apikey ? "exists" : "missing",
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
