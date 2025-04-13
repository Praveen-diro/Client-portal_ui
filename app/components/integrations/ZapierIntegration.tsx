"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

interface ZapierIntegrationProps {
  zapierInviteUrl?: string;
}

export const ZapierIntegration = ({
  zapierInviteUrl = "https://zapier.com/developer/public-invite/185121/bfeaf532ef70ef94ce075bce0cbef6e5/",
}: ZapierIntegrationProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        className="bg-white hover:bg-orange-50 border-orange-200 hover:border-orange-300 text-orange-700"
        asChild
      >
        <a href={zapierInviteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
          Integrate with Zapier
        </a>
      </Button>

      <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(true)} className="h-9 w-9">
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
      </Button>

      <p className="text-sm text-muted-foreground">
        Using Zapier you can generate a webhook URL and integrate our callbacks with your workflow.
      </p>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Zapier Integration</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 text-sm">
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
                <br />
                First is default callback URL which is account based and works for all buttons, you can set it up by clicking
                settings icon from header inside Callback Logs under Developers section.
                <br />
                Second way is to set the webhook URL for individual buttons which you can do by going to Triggers under Button
                settings. This will override the default callback URL for that individual button.
              </p>
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

            <div>
              <h3 className="font-semibold mb-2">Types of callback that you will receive:</h3>
              <p className="text-muted-foreground">
                You can identify different callbacks based on the{" "}
                <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">type</span> and{" "}
                <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">message</span> keys.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  Engagement callback{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(type = Engagementstatus)</span>
                  <ul className="list-disc pl-6 mt-1">
                    <li>On closing a session</li>
                    <li>On technical errors</li>
                    <li>On session complete</li>
                  </ul>
                </li>
                <li>
                  On document upload{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(type = uploadsuccess)</span>
                </li>
                <li>
                  On Interim JSON response{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(type = interim-pdftojson)</span>
                </li>
                <li>
                  On Final JSON response{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(type = final-pdftojson)</span>
                </li>
                <li>
                  In case of bad document{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(type = json-failure)</span>
                </li>
                <li>
                  On approving a document from the client portal{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(message = document verified)</span>
                </li>
                <li>
                  On rejecting a document from the client portal{" "}
                  <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">(message = document rejected)</span>
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
