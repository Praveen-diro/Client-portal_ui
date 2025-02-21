"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/ui/page-header";

export default function IntegrationsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <div className="flex-1">
          <PageHeader title="Integrations" description="Manage your integration settings and connections" />
          <div className="container mx-auto px-6 py-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Google Sheets Integration Card */}
              <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                <h3 className="font-semibold mb-2">Google Sheets</h3>
                <p className="text-sm text-muted-foreground mb-4">Export verification data directly to Google Sheets</p>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                  Connect
                </button>
              </div>

              {/* Zapier Integration Card */}
              <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                <h3 className="font-semibold mb-2">Zapier</h3>
                <p className="text-sm text-muted-foreground mb-4">Automate workflows with Zapier integration</p>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                  Connect
                </button>
              </div>

              {/* Webhook Integration Card */}
              <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                <h3 className="font-semibold mb-2">Webhooks</h3>
                <p className="text-sm text-muted-foreground mb-4">Set up webhook callbacks for verification events</p>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                  Configure
                </button>
              </div>

              {/* API Integration Card */}
              <div className="rounded-lg border p-4 hover:bg-accent transition-colors">
                <h3 className="font-semibold mb-2">API Access</h3>
                <p className="text-sm text-muted-foreground mb-4">View and manage API keys and tokens</p>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                  Manage Keys
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
