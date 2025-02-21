"use client";

import { ThemeProvider } from "next-themes";
import { Sidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
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
      <div className="flex h-screen">
        {showSidebar && <Sidebar onExpandedChange={(expanded) => {}} />}
        <div className="flex-1">{children}</div>
      </div>
    </ThemeProvider>
  );
}
