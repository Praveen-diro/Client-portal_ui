"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex bg-background">
        <Sidebar onExpandedChange={setIsSidebarExpanded} />
        <main
          className="flex-1 overflow-hidden transition-all duration-300"
          style={{
            marginLeft: isSidebarExpanded ? "240px" : "64px",
          }}
        >
          <div className="h-full overflow-auto">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
