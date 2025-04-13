"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { InfoIcon } from "lucide-react";

interface ZapierIntegrationProps {
  zapierInviteUrl?: string;
}

export const ZapierIntegration = ({
  zapierInviteUrl = "https://zapier.com/developer/public-invite/185121/bfeaf532ef70ef94ce075bce0cbef6e5/",
}: ZapierIntegrationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="group relative flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent blur-xl transition-all duration-500 group-hover:blur-2xl" />
        <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl border border-orange-100 dark:border-orange-900/50 shadow-lg shadow-orange-900/5 transition-all duration-300 group-hover:shadow-orange-900/10">
          <Button variant="ghost" className="relative h-auto px-4 py-2.5 text-orange-700 dark:text-orange-400" asChild>
            <a href={zapierInviteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-inner shadow-white/10">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.3638 8.63623L7.63623 17.3638C7.27298 17.727 6.6734 17.727 6.31015 17.3638C5.9469 17.0005 5.9469 16.401 6.31015 16.0377L15.0377 7.31015C15.401 6.9469 16.0005 6.9469 16.3638 7.31015C16.727 7.6734 16.727 8.27298 16.3638 8.63623Z"
                    fill="currentColor"
                  />
                  <path
                    d="M17.0377 17.3638L8.31015 8.63623C7.9469 8.27298 7.9469 7.6734 8.31015 7.31015C8.6734 6.9469 9.27298 6.9469 9.63623 7.31015L18.3638 16.0377C18.727 16.401 18.727 17.0005 18.3638 17.3638C18.0005 17.727 17.401 17.727 17.0377 17.3638Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold">Connect with Zapier</span>
                <span className="text-xs text-orange-600/70 dark:text-orange-400/70">Automate your workflow</span>
              </div>
            </a>
          </Button>

          <div className="h-8 w-px bg-orange-100 dark:bg-orange-800/30 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsModalOpen(true)}
            className="mr-2 h-8 w-8 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
          >
            <InfoIcon className="h-4 w-4 text-orange-600/70 dark:text-orange-400/70" />
          </Button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>Zapier Integration</DialogTitle>
          </DialogHeader>

          <ScrollArea className="px-6 pb-6" style={{ maxHeight: "calc(85vh - 120px)" }}>
            <div className="space-y-6 text-sm pr-4">
              <div className="bg-orange-50/50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800">
                <h3 className="font-semibold mb-2 text-orange-800 dark:text-orange-300">Quick Start</h3>
                <p className="text-orange-700 dark:text-orange-400">
                  Connect DIRO with hundreds of apps through Zapier's automation platform. Get started by generating a webhook URL
                  and setting it up in your client portal.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 1. (Generate the webhook URL using DIRO's app on Zapier)</h3>
                <p className="text-muted-foreground">
                  Click on the button and log in to Zapier. Start building your integration by selecting DIRO as trigger from the
                  list of apps. Once you have selected the DIRO app as trigger you will get a webhook URL.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 2. (Paste the webhook URL inside DIRO's client portal)</h3>
                <p className="text-muted-foreground">
                  Once you have the webhook URL you can paste it inside client portal, where you have two options:
                </p>
                <ul className="mt-2 space-y-2 list-disc pl-6 text-muted-foreground">
                  <li>
                    <span className="font-medium">Default callback URL:</span> Account based and works for all buttons. Set it up
                    by clicking settings icon from header inside Callback Logs under Developers section.
                  </li>
                  <li>
                    <span className="font-medium">Button-specific URL:</span> Set the webhook URL for individual buttons under
                    Triggers in Button settings. This will override the default callback URL for that individual button.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step 3. (Start building your integration)</h3>
                <p className="text-muted-foreground">
                  Once you have set the webhook URL inside client portal. You will start receiving the callback data inside the
                  Zapier, from where you can add custom integration for your workflow.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How to test a Zap?</h3>
                <p className="text-muted-foreground">
                  After setting the webhook URL you can start a verification session from DIRO's client portal and start receiving
                  callbacks on Zapier.
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <h3 className="font-semibold mb-3">Types of callback that you will receive:</h3>
                <p className="text-muted-foreground mb-4">
                  You can identify different callbacks based on the{" "}
                  <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-yellow-900 dark:text-yellow-300 font-mono text-sm">
                    type
                  </code>{" "}
                  and{" "}
                  <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-yellow-900 dark:text-yellow-300 font-mono text-sm">
                    message
                  </code>{" "}
                  keys.
                </p>
                <ul className="list-none space-y-4">
                  <li className="border-b pb-3">
                    <div className="font-medium mb-2">Engagement callback</div>
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                      type = Engagementstatus
                    </code>
                    <ul className="list-disc pl-6 mt-2 text-muted-foreground">
                      <li>On closing a session</li>
                      <li>On technical errors</li>
                      <li>On session complete</li>
                    </ul>
                  </li>
                  <li className="border-b pb-3">
                    <div className="font-medium mb-2">Document Upload</div>
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                      type = uploadsuccess
                    </code>
                  </li>
                  <li className="border-b pb-3">
                    <div className="font-medium mb-2">JSON Responses</div>
                    <div className="space-y-2">
                      <div>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                          type = interim-pdftojson
                        </code>
                        <span className="text-muted-foreground ml-2">Interim JSON response</span>
                      </div>
                      <div>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                          type = final-pdftojson
                        </code>
                        <span className="text-muted-foreground ml-2">Final JSON response</span>
                      </div>
                      <div>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                          type = json-failure
                        </code>
                        <span className="text-muted-foreground ml-2">Bad document case</span>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="font-medium mb-2">Document Status Updates</div>
                    <div className="space-y-2">
                      <div>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                          message = document verified
                        </code>
                        <span className="text-muted-foreground ml-2">Document approved</span>
                      </div>
                      <div>
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono">
                          message = document rejected
                        </code>
                        <span className="text-muted-foreground ml-2">Document rejected</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
