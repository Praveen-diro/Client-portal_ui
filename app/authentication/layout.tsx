"use client";

import type React from "react";
import MainLayout from "../components/layouts/MainLayout";

export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout showSidebar={false}>
      <div className="flex-1 lg:grid lg:grid-cols-2">{children}</div>
    </MainLayout>
  );
}
