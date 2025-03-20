import React from "react";

export const metadata = {
  title: "API Integration - Capture Process",
  description: "Test and implement the Capture Process API for document verification",
};

export default function APIIntegrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {children}
    </section>
  );
} 