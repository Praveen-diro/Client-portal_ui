"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { CopyIcon, CheckIcon, ExternalLinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VerificationResponse {
  url?: string;
  sessionid?: string;
  message?: string;
}

const ApiIntegrationPage = () => {
  const [formData, setFormData] = useState({
    buttonid: "",
    orgid: "",
    apikey: "",
    trackingid: "",
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"url" | "sessionid" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateVerificationLink();
  };

  const generateVerificationLink = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Call our server-side API route instead of directly calling the external API
      const res = await fetch("/api/capture-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          buttonid: formData.buttonid,
          orgid: formData.orgid,
          apikey: formData.apikey,
          ...(formData.trackingid && { trackingid: formData.trackingid }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate verification link");
      }

      setResponse(data);
    } catch (err) {
      console.error("Error generating verification link:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: "url" | "sessionid") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 3000);
  };

  return (
    <div className="container max-w-screen-xl mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Capture Process API Integration</h1>
        <p className="text-muted-foreground mt-1">
          Test and implement the Capture Process API for document verification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Generate Verification Link</CardTitle>
              <CardDescription>Enter your API credentials to test</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buttonid">Button ID</Label>
                  <Input
                    id="buttonid"
                    name="buttonid"
                    value={formData.buttonid}
                    onChange={handleInputChange}
                    placeholder="Enter button ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgid">Organization ID</Label>
                  <Input
                    id="orgid"
                    name="orgid"
                    value={formData.orgid}
                    onChange={handleInputChange}
                    placeholder="Enter organization ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apikey">API Key</Label>
                  <Input
                    id="apikey"
                    name="apikey"
                    value={formData.apikey}
                    onChange={handleInputChange}
                    placeholder="Enter API key"
                    type="password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trackingid">Tracking ID (Optional)</Label>
                  <Input
                    id="trackingid"
                    name="trackingid"
                    value={formData.trackingid}
                    onChange={handleInputChange}
                    placeholder="Enter tracking ID (optional)"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={loading || !formData.buttonid || !formData.orgid || !formData.apikey}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Generating...
                    </>
                  ) : (
                    "Generate Verification Link"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Response</CardTitle>
              <CardDescription>View and copy the generated verification link</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {response && (
                <div className="space-y-4">
                  {response.url && (
                    <div className="space-y-2">
                      <Label>Verification URL</Label>
                      <div className="flex mt-1">
                        <Input value={response.url} readOnly className="flex-1 font-mono text-xs" />
                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={() => copyToClipboard(response.url!, "url")}
                        >
                          {copied === "url" ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {response.sessionid && (
                    <div className="space-y-2">
                      <Label>Session ID</Label>
                      <div className="flex mt-1">
                        <Input value={response.sessionid} readOnly className="flex-1 font-mono text-xs" />
                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-2"
                          onClick={() => copyToClipboard(response.sessionid!, "sessionid")}
                        >
                          {copied === "sessionid" ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <Tabs defaultValue="iframe">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="iframe">Iframe Integration</TabsTrigger>
                        <TabsTrigger value="direct">Direct Link</TabsTrigger>
                      </TabsList>
                      <TabsContent value="iframe" className="p-4 border rounded-md mt-2">
                        <p className="text-sm text-muted-foreground mb-2">Add this code to your website to embed the verification iframe:</p>
                        <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto">
                          {`<iframe 
  src="${response.url || '[VERIFICATION_URL]'}" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>

<script>
  // Listen for messages from the iframe
  window.addEventListener("message", function(event) {
    if (event.data && event.data.sessionid) {
      console.log("Progress status:", event.data.progress_status);
      // Handle different statuses here
    }
  });
</script>`}
                        </div>
                      </TabsContent>
                      <TabsContent value="direct" className="p-4 border rounded-md mt-2">
                        <p className="text-sm text-muted-foreground mb-2">To redirect users directly to the verification page:</p>
                        <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono">
                          {`// JavaScript Redirect
window.location.href = "${response.url || '[VERIFICATION_URL]'}";

// Or use this HTML link
<a href="${response.url || '[VERIFICATION_URL]'}" target="_blank">Verify Your Document</a>`}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}

              {!response && !error && !loading && (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Fill out the form and click "Generate Verification Link" to see the response here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold tracking-tight mb-4">Implementation Guide</h2>
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="iframe">Iframe Setup</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                <TabsTrigger value="events">Event Handling</TabsTrigger>
                <TabsTrigger value="schema">API Schema</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4 mt-2">
                <h3 className="text-base font-medium mb-2">Capture Process API</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The Capture Process API allows you to generate verification links for document verification workflows.
                  These links can be embedded in your website or sent to users via email or SMS.
                </p>
                <h4 className="text-sm font-medium mt-4 mb-2">Required Parameters:</h4>
                <ul className="list-disc text-sm ml-5 space-y-1 text-muted-foreground">
                  <li><span className="font-medium text-foreground">buttonid</span> - The ID of the verification button</li>
                  <li><span className="font-medium text-foreground">orgid</span> - Your organization ID</li>
                  <li><span className="font-medium text-foreground">apikey</span> - Your API key for authentication</li>
                </ul>
                <h4 className="text-sm font-medium mt-4 mb-2">Optional Parameters:</h4>
                <ul className="list-disc text-sm ml-5 text-muted-foreground">
                  <li><span className="font-medium text-foreground">trackingid</span> - A custom identifier to track the verification session</li>
                </ul>
              </TabsContent>
              <TabsContent value="iframe" className="p-4 mt-2">
                <h3 className="text-base font-medium mb-2">Iframe Integration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The recommended way to integrate the verification flow is by embedding it in an iframe on your website.
                  This approach provides a seamless user experience without leaving your site.
                </p>
                <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                  {`<iframe 
  src="[VERIFICATION_URL]" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>`}
                </div>
                <p className="text-sm text-muted-foreground">
                  Set an appropriate width and height for the iframe. We recommend a minimum height of 600px
                  for the best user experience.
                </p>
              </TabsContent>
              <TabsContent value="webhooks" className="p-4 mt-2">
                <h3 className="text-base font-medium mb-2">Webhook Configuration</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Webhooks allow you to receive real-time notifications about verification events.
                  You'll need to configure a webhook URL to receive these notifications.
                </p>
                <h4 className="text-sm font-medium mt-4 mb-2">Webhook Events:</h4>
                <ul className="list-disc text-sm ml-5 space-y-2 text-muted-foreground">
                  <li>
                    <span className="font-medium text-foreground">Pending</span> - Triggered when the capture process is completed and the file is submitted
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Verified</span> - Triggered when the document is verified and approved
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Rejected</span> - Triggered when the document is rejected
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="events" className="p-4 mt-2">
                <h3 className="text-base font-medium mb-2">Event Handling</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  When using the iframe integration, you can listen for events from the verification process
                  using the window.postMessage API.
                </p>
                <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                  {`<script>
  window.addEventListener("message", function(event) {
    if (event.data && event.data.sessionid) {
      console.log("Session ID:", event.data.sessionid);
      console.log("Button ID:", event.data.buttonid);
      console.log("Progress status:", event.data.progress_status);
      
      // Handle different statuses
      switch(event.data.progress_status) {
        case "Started":
          // User started the verification process
          break;
        case "Opened link":
          // User opened the verification link
          break;
        case "Verifying":
          // Document is being verified
          break;
        case "Submitted":
          // Document was submitted successfully
          break;
        // Handle other statuses as needed
      }
    }
  });
</script>`}
                </div>
                <p className="text-sm text-muted-foreground">
                  The progress_status values include: Started, Selected source link, Opened link, Saw preview,
                  Tried to find info / Tried help, Cancelled preview, Tried download, Verifying, Submitted.
                </p>
              </TabsContent>
              <TabsContent value="schema" className="p-4 mt-2">
                <h3 className="text-base font-medium mb-2">API Schema</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Below is the schema for requests and responses when using the Capture Process API.
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mt-4 mb-2">Request Schema:</h4>
                  <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                    {`{
  "buttonid": "string", // Required: Button ID for verification
  "orgid": "string",    // Required: Organization ID
  "apikey": "string",   // Required: API key for authentication
  "trackingid": "string" // Optional: Tracking ID for the verification
}`}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mt-4 mb-2">Success Response (200):</h4>
                  <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                    {`{
  "url": "string",      // The verification URL
  "sessionid": "string" // Session ID for the verification
}`}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mt-4 mb-2">Error Responses:</h4>
                  <p className="text-sm text-muted-foreground mb-2">400 Bad Request:</p>
                  <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                    {`{
  "message": "Api key cannot be null or empty"
}

// Or
{
  "message": "Button id cannot be null or empty"
}

// Or
{
  "message": "JSON parse error: Unexpected end-of-input: expected close marker for Object"
}`}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 mt-4">401 Unauthorized:</p>
                  <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                    {`{
  "message": "Api key is not valid"
}`}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2 mt-4">404 Not Found:</p>
                  <div className="bg-secondary/50 p-3 rounded-md text-xs font-mono overflow-x-auto mb-4">
                    {`{
  "message": "Button with id not found"
}`}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiIntegrationPage; 