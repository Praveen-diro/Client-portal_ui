import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Bell,
  FileText,
  Link,
  ArrowRight,
  Info,
  Plus,
  Mail,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  ExternalLink,
  Send,
  Zap,
  FileJson,
  Laptop,
  Server,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FancyCheckbox } from "@/components/ui/fancy-checkbox";
import { ZapierIntegration } from "./integrations/ZapierIntegration";
import { Textarea } from "@/components/ui/textarea";
import { buttonService } from "../../../services/button.service";

interface TriggersEmailTabProps {
  emailToOrganization: string;
  includePdfInEmail: boolean;
  submissionNotifyEmail: boolean;
  emailToOrganizationEnabled: boolean;
  enableEngagementCallback: boolean;
  autoJson: boolean;
  callbackUrl: string;
  addGoogleSheetUrl: boolean;
  googleSheetUrl?: string;
  enableSalesforce: boolean;
  includeOriginalFilename: boolean;
  enableCustomTemplate: boolean;
  emailReminder?: any;
  emailReminderLoading?: boolean;
  emailReminderError?: string;
  diroCertificate?: boolean;
  originalDoc?: boolean;
  shareOnlyJson?: boolean;
  emailTemplate?: string;
  salesforceConfig?: Record<string, string>;
  smtpConfig?: Array<{
    server: string;
    password: string;
    security: boolean;
    port: string;
    username: string;
  }>;
  redirecturl?: string;
  redirectmessage?: string;
  onEmailToOrganizationChange: (value: string) => void;
  onIncludePdfInEmailChange: (checked: boolean) => void;
  onSubmissionNotificationViaEmailChange: (checked: boolean) => void;
  onEmailToOrganizationEnabledChange: (checked: boolean) => void;
  onEnableEngagementCallbackChange: (checked: boolean) => void;
  onAutoJsonChange: (checked: boolean) => void;
  onCallbackUrlChange: (value: string) => void;
  onAddGoogleSheetChange: (checked: boolean) => void;
  onGoogleSheetUrlChange: (value: string) => void;
  onEnableSalesforceChange: (checked: boolean) => void;
  onSalesforceConfigChange?: (config: Record<string, string>) => void;
  onSmtpConfigChange?: (
    config: Array<{
      server: string;
      password: string;
      security: boolean;
      port: string;
      username: string;
    }>
  ) => void;
  onDiroCertificateChange?: (checked: boolean) => void;
  onOriginalDocChange?: (checked: boolean) => void;
  onIncludeOriginalFilenameChange: (checked: boolean) => void;
  onEnableCustomTemplateChange: (checked: boolean) => void;
  onEmailTemplateChange?: (value: string) => void;
  onRedirectUrlChange?: (value: string) => void;
  onRedirectMessageChange?: (value: string) => void;
}

// Section type for navigation
type Section = "Triggers" | "callbacks" | "integrations" | "smtp" | "Customer Reminders" | "Redirection";

export const TriggersEmailTab: React.FC<TriggersEmailTabProps> = ({
  emailToOrganization,
  includePdfInEmail,
  submissionNotifyEmail,
  emailToOrganizationEnabled,
  enableEngagementCallback,
  autoJson,
  callbackUrl,
  addGoogleSheetUrl,
  googleSheetUrl,
  enableSalesforce,
  includeOriginalFilename,
  enableCustomTemplate,
  emailReminder,
  emailReminderLoading,
  emailReminderError,
  diroCertificate,
  originalDoc,
  shareOnlyJson,
  emailTemplate,
  salesforceConfig = {},
  smtpConfig = [],
  redirecturl = "",
  redirectmessage = "",
  onEmailToOrganizationChange,
  onIncludePdfInEmailChange,
  onSubmissionNotificationViaEmailChange,
  onEmailToOrganizationEnabledChange,
  onEnableEngagementCallbackChange,
  onAutoJsonChange,
  onCallbackUrlChange,
  onAddGoogleSheetChange,
  onGoogleSheetUrlChange,
  onEnableSalesforceChange,
  onSalesforceConfigChange = () => {},
  onSmtpConfigChange = () => {},
  onDiroCertificateChange = () => {},
  onOriginalDocChange = () => {},
  onIncludeOriginalFilenameChange,
  onEnableCustomTemplateChange,
  onEmailTemplateChange = () => {},
  onRedirectUrlChange = () => {},
  onRedirectMessageChange = () => {},
}) => {
  // Active section state
  const [activeSection, setActiveSection] = useState<Section>("Triggers");

  // State for callback test
  const [testingCallback, setTestingCallback] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const [callbackModalState, setCallbackModalState] = useState<{
    type: string;
    message: string;
    loading: boolean;
  }>({
    type: "",
    message: "",
    loading: false,
  });

  // Email reminders
  const [reminderRows, setReminderRows] = useState([
    { id: 1, trigger: "submission_completed", filter: "all", active: true, customer: true, organization: false, delay: 0 },
  ]);

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const addReminderRow = () => {
    setReminderRows([
      ...reminderRows,
      {
        id: Date.now(),
        trigger: "submission_completed",
        filter: "all",
        active: true,
        customer: true,
        organization: false,
        delay: 0,
      },
    ]);
  };

  // Test callback function
  const testCallback = async () => {
    if (!callbackUrl) return;

    setIsCallbackModalOpen(true);
    setCallbackModalState({
      type: "loading",
      message: "Testing your callback URL...",
      loading: true,
    });

    try {
      const response = await buttonService.testCallbackUrl(callbackUrl);

      if (response.success) {
        setCallbackModalState({
          type: "success",
          message: response.data?.message ?? "Callback URL tested successfully",
          loading: false,
        });
      } else {
        const message =
          response.data?.type === "error"
            ? `Please ensure:\n${response.data?.message ?? ""}`
            : response.data?.message ?? "An error occurred";

        setCallbackModalState({
          type: response.data?.type ?? "error",
          message,
          loading: false,
        });
      }
    } catch (error: any) {
      setCallbackModalState({
        type: "error",
        message: error.message || "An unexpected error occurred",
        loading: false,
      });
    }
  };

  const handleCallbackClose = () => {
    setIsCallbackModalOpen(false);
    setCallbackModalState({
      type: "",
      message: "",
      loading: false,
    });
  };

  const handleForceSave = (e: React.MouseEvent) => {
    // Implement your force save logic here
    handleCallbackClose();
  };

  return (
    <div className="lg:col-span-3 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-2">
            <div className="mb-4">
              <h3 className="text-xl font-medium">Settings</h3>
              <p className="text-sm text-muted-foreground">Configure triggers and integrations</p>
            </div>

            <Button
              variant={activeSection === "Triggers" ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setActiveSection("Triggers")}
            >
              <Bell className="h-4 w-4 mr-2" />
              <span> Triggers</span>
            </Button>

            <Button
              variant={activeSection === "callbacks" ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setActiveSection("callbacks")}
            >
              <Link className="h-4 w-4 mr-2" />
              <span>Callbacks</span>
            </Button>

            <Button
              variant={activeSection === "integrations" ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setActiveSection("integrations")}
            >
              <Laptop className="h-4 w-4 mr-2" />
              <span>Integrations</span>
            </Button>

            <Button
              variant={activeSection === "smtp" ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setActiveSection("smtp")}
            >
              <Server className="h-4 w-4 mr-2" />
              <span>SMTP Settings</span>
            </Button>

            <Button
              variant={activeSection === "Customer Reminders" ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setActiveSection("Customer Reminders")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              <span>Customer Reminders</span>
            </Button>

            <Button
              variant={activeSection === "Redirection" ? "default" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => setActiveSection("Redirection")}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              <span>Redirection</span>
            </Button>

            <div className="h-10"></div>
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3">
          {/* Notifications Section */}
          {activeSection === "Triggers" && (
            <Card>
              <CardHeader>
                {/* <CardTitle>Email Notifications</CardTitle> */}
                {/* <CardDescription>Configure notifications sent after verification</CardDescription> */}
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email to the organization</h4>
                        <p className="text-sm text-muted-foreground">Configure where verification results are sent</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          id="org-email"
                          value={emailToOrganization}
                          onChange={(e) => onEmailToOrganizationChange(e.target.value)}
                          placeholder="<trackid>@yourdomain.com"
                          className="flex-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use <code>&lt;trackid&gt;</code> as a placeholder for the verification ID
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="flex items-center space-x-4 p-4">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-grow space-y-1">
                      <p className="font-medium">Enable custom template</p>
                      <p className="text-sm text-muted-foreground">Use a custom email template for organization emails</p>
                    </div>

                    <Switch checked={enableCustomTemplate} onCheckedChange={onEnableCustomTemplateChange} />
                  </div>

                  {enableCustomTemplate && (
                    <div className="px-4 pb-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-template">Email Template</Label>
                          <Button
                            variant="link"
                            className="text-sm text-primary hover:text-primary/80"
                            onClick={() => setIsTemplateModalOpen(true)}
                          >
                            View template variables
                          </Button>
                        </div>
                        <Textarea
                          id="email-template"
                          value={emailTemplate}
                          rows={10}
                          onChange={(e) => onEmailTemplateChange(e.target.value)}
                          placeholder="Enter your custom email template content here..."
                          className="min-h-[200px] font-mono text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <p className="font-medium">Embed the original filename within the PDF filename</p>
                    <p className="text-sm text-muted-foreground">Include original filename in the generated PDF name</p>
                  </div>

                  <Switch checked={includeOriginalFilename} onCheckedChange={onIncludeOriginalFilenameChange} />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <p className="font-medium">Submission notification via email</p>
                    <p className="text-sm text-muted-foreground">Notify when verification is completed</p>
                  </div>

                  <Switch checked={submissionNotifyEmail} onCheckedChange={onSubmissionNotificationViaEmailChange} />
                </div>

                <div className="flex items-center space-x-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <FileJson className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <p className="font-medium">Auto JSON</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate JSON data for each verification
                      {shareOnlyJson && <span className="text-xs ml-1">(Required when 'share only JSON' is enabled)</span>}
                    </p>
                  </div>

                  <Switch disabled={shareOnlyJson} checked={shareOnlyJson ? true : autoJson} onCheckedChange={onAutoJsonChange} />
                </div>

                <div className="rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="p-4 flex items-center space-x-4">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-grow space-y-1">
                      <p className="font-medium">Include PDF attachments</p>
                      <p className="text-sm text-muted-foreground">Attach PDF documents to email notifications</p>
                    </div>

                    <Switch checked={includePdfInEmail} onCheckedChange={onIncludePdfInEmailChange} />
                  </div>

                  {includePdfInEmail && (
                    <div className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      <div className="p-3 pl-14">
                        <div className="grid gap-3">
                          <div className="flex items-center">
                            <Checkbox
                              id="diro_certificate"
                              checked={diroCertificate}
                              onCheckedChange={(checked) => onDiroCertificateChange(checked as boolean)}
                              className="mr-2"
                            />
                            <Label
                              htmlFor="diro_certificate"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              DIRO certificate
                            </Label>
                          </div>

                          <div className="flex items-center">
                            <Checkbox
                              id="original_doc"
                              checked={originalDoc}
                              onCheckedChange={(checked) => onOriginalDocChange(checked as boolean)}
                              disabled={shareOnlyJson}
                              className="mr-2"
                            />
                            <Label
                              htmlFor="original_doc"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Original doc
                            </Label>
                            {shareOnlyJson && (
                              <span className="text-xs text-muted-foreground ml-2">(Disabled when 'share only JSON' is on)</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Callbacks Section */}
          {activeSection === "callbacks" && (
            <Card>
              <CardHeader>
                <CardTitle>Callback Configuration</CardTitle>
                <CardDescription>Configure how data is sent to external systems</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <p className="font-medium">Enable engagement callback</p>
                    <p className="text-sm text-muted-foreground">Send engagement data to your callback URL</p>
                  </div>

                  <Switch checked={enableEngagementCallback} onCheckedChange={onEnableEngagementCallbackChange} />
                </div>

                <div className="space-y-4">
                  {/* <div className="font-medium">Callback URL</div> */}
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="space-y-3">
                      <Label htmlFor="callback-url">Override default callback url</Label>
                      <div className="flex gap-2">
                        <Input
                          id="callback-url"
                          value={callbackUrl}
                          onChange={(e) => onCallbackUrlChange(e.target.value)}
                          placeholder="Enter your callback URL"
                          className="flex-1 h-12 px-4"
                        />
                        <Button
                          variant="outline"
                          onClick={testCallback}
                          disabled={testingCallback || !callbackUrl}
                          className="whitespace-nowrap"
                        >
                          {testingCallback ? (
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Send className="h-4 w-4 mr-2" />
                          )}
                          Test URL
                        </Button>
                      </div>

                      {testResult && (
                        <div
                          className={`text-sm px-4 py-2 rounded-md mt-2 flex items-center ${
                            testResult.success
                              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                              : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                          }`}
                        >
                          {testResult.success ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                          {testResult.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Section */}
          {activeSection === "integrations" && (
            <Card>
              <CardHeader>
                <CardTitle>Third-Party Integrations</CardTitle>
                <CardDescription>Connect to external services</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex flex-col p-4 border rounded-lg space-y-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-emerald-50 p-2 rounded-full dark:bg-emerald-900/30">
                        <svg
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M3 3V21H21V3H3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M3 8H21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M8 8V21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Google Sheets</p>
                        <p className="text-sm text-muted-foreground">Push data to Google Sheets</p>
                      </div>
                      <Switch checked={addGoogleSheetUrl} onCheckedChange={onAddGoogleSheetChange} />
                    </div>

                    {addGoogleSheetUrl && (
                      <>
                        <Separator />
                        <div className="pl-11 space-y-1">
                          <Label htmlFor="google-sheet-url">Google sheet URL</Label>
                          <Input
                            id="google-sheet-url"
                            placeholder="Enter a google sheet URL"
                            className="h-11"
                            value={googleSheetUrl || ""}
                            onChange={(e) => onGoogleSheetUrlChange(e.target.value)}
                          />
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground flex items-start">
                              <span className="mr-2">*</span>
                              To enable this feature share the editor access of the google sheet to
                              diro-335@teak-spot-238407.iam.gserviceaccount.com
                            </p>
                            <p className="text-xs text-muted-foreground flex items-start">
                              <span className="mr-2">*</span>
                              Please keep the sheet empty and don't enter any data manually.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col p-4 border rounded-lg space-y-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-blue-50 p-2 rounded-full dark:bg-blue-900/30">
                        <svg
                          className="h-5 w-5 text-blue-600 dark:text-blue-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 16.5C20 18.433 18.433 20 16.5 20C14.567 20 13 18.433 13 16.5C13 14.567 14.567 13 16.5 13C18.433 13 20 14.567 20 16.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M11 7.5C11 9.433 9.433 11 7.5 11C5.567 11 4 9.433 4 7.5C4 5.567 5.567 4 7.5 4C9.433 4 11 5.567 11 7.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M13 7.5C13 5.567 14.567 4 16.5 4C18.433 4 20 5.567 20 7.5C20 9.433 18.433 11 16.5 11C14.567 11 13 9.433 13 7.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M4 16.5C4 14.567 5.567 13 7.5 13C9.433 13 11 14.567 11 16.5C11 18.433 9.433 20 7.5 20C5.567 20 4 18.433 4 16.5Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">Salesforce</p>
                        <p className="text-sm text-muted-foreground">Integrate with Salesforce CRM</p>
                      </div>
                      <Switch checked={enableSalesforce} onCheckedChange={onEnableSalesforceChange} />
                    </div>

                    {enableSalesforce && (
                      <>
                        <Separator />
                        <div className="pl-11 space-y-4">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="authurl">Auth URL</Label>
                              <Input
                                id="authurl"
                                placeholder="https://login.salesforce.com/services/oauth2/token"
                                value={salesforceConfig?.authurl || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ authurl: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="apiurl">API URL</Label>
                              <Input
                                id="apiurl"
                                placeholder="https://yourdomain.my.salesforce.com/services/data/v50.0/"
                                value={salesforceConfig?.apiurl || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ apiurl: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="username">Username</Label>
                              <Input
                                id="username"
                                placeholder="username@example.com"
                                value={salesforceConfig?.username || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ username: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="password">Password</Label>
                              <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={salesforceConfig?.password || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ password: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="clientID">Client ID</Label>
                              <Input
                                id="clientID"
                                placeholder="Client ID from Salesforce"
                                value={salesforceConfig?.clientID || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ clientID: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="clientSecret">Client Secret</Label>
                              <Input
                                id="clientSecret"
                                type="password"
                                placeholder="••••••••"
                                value={salesforceConfig?.clientSecret || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ clientSecret: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="ownerid">Owner ID</Label>
                              <Input
                                id="ownerid"
                                placeholder="Salesforce Owner ID"
                                value={salesforceConfig?.ownerid || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ ownerid: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input
                                id="location"
                                placeholder="Location"
                                value={salesforceConfig?.location || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ location: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="firstPublishLocationId">First Publish Location ID</Label>
                              <Input
                                id="firstPublishLocationId"
                                placeholder="Location ID"
                                value={salesforceConfig?.firstPublishLocationId || ""}
                                onChange={(e) => onSalesforceConfigChange?.({ firstPublishLocationId: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col p-4 border rounded-lg space-y-4 bg-slate-50 dark:bg-slate-900">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 bg-orange-50 p-2 rounded-full dark:bg-orange-900/30">
                        <svg
                          className="h-5 w-5 text-orange-600 dark:text-orange-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
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
                      <div className="flex-grow">
                        <p className="font-medium">Zapier Integration</p>
                        <p className="text-sm text-muted-foreground">
                          Using Zapier you can generate a webhook URL and integrate our callbacks with your workflow.
                        </p>
                      </div>
                      <ZapierIntegration />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SMTP Settings Section */}
          {activeSection === "smtp" && (
            <Card>
              <CardHeader>
                <CardTitle>SMTP Configuration</CardTitle>
                <CardDescription>Configure email server settings</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">SMTP Username</Label>
                      <Input
                        id="smtp-username"
                        placeholder="username@example.com"
                        value={smtpConfig[0]?.username || ""}
                        onChange={(e) => {
                          const newConfig = smtpConfig.length
                            ? smtpConfig.map((item, index) => (index === 0 ? { ...item, username: e.target.value } : { ...item }))
                            : [{ server: "", password: "", security: false, port: "", username: e.target.value }];
                          onSmtpConfigChange(newConfig);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">SMTP Password</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        placeholder="••••••••"
                        value={smtpConfig[0]?.password || ""}
                        onChange={(e) => {
                          const newConfig = smtpConfig.length
                            ? smtpConfig.map((item, index) => (index === 0 ? { ...item, password: e.target.value } : { ...item }))
                            : [{ server: "", password: e.target.value, security: false, port: "", username: "" }];
                          onSmtpConfigChange(newConfig);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-server">SMTP Server</Label>
                      <Input
                        id="smtp-server"
                        placeholder="smtp.example.com"
                        value={smtpConfig[0]?.server || ""}
                        onChange={(e) => {
                          const newConfig = smtpConfig.length
                            ? smtpConfig.map((item, index) => (index === 0 ? { ...item, server: e.target.value } : { ...item }))
                            : [{ server: e.target.value, password: "", security: false, port: "", username: "" }];
                          onSmtpConfigChange(newConfig);
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        placeholder="587"
                        value={smtpConfig[0]?.port || ""}
                        onChange={(e) => {
                          const newConfig = smtpConfig.length
                            ? smtpConfig.map((item, index) => (index === 0 ? { ...item, port: e.target.value } : { ...item }))
                            : [{ server: "", password: "", security: false, port: e.target.value, username: "" }];
                          onSmtpConfigChange(newConfig);
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="smtp-security"
                        checked={smtpConfig[0]?.security || false}
                        onCheckedChange={(checked) => {
                          const newConfig = smtpConfig.length
                            ? smtpConfig.map((item, index) => (index === 0 ? { ...item, security: checked } : { ...item }))
                            : [{ server: "", password: "", security: checked, port: "", username: "" }];
                          onSmtpConfigChange(newConfig);
                        }}
                      />
                      <Label htmlFor="smtp-security">Enable security</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <Info className="h-3 w-3 inline-block mr-1" />
                      Common SMTP ports: 25 (default), 465 (SSL), 587 (TLS)
                    </p>
                  </div>
                </div>

                {/* <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Test Connection
                  </Button>
                  <Button>Save SMTP Settings</Button>
                </div> */}
              </CardContent>
            </Card>
          )}

          {/* Reminders Section */}
          {activeSection === "Customer Reminders" && (
            <Card>
              <CardHeader>
                <CardTitle>Reminder Schedules</CardTitle>
                <CardDescription>Configure automated email Customer Reminders</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {emailReminderLoading ? (
                  <div className="flex justify-center items-center p-8 border rounded-lg bg-slate-50 dark:bg-slate-900">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2 text-primary" />
                    <span>Loading reminder settings...</span>
                  </div>
                ) : emailReminderError ? (
                  <div className="flex items-start p-6 border rounded-lg bg-red-50 dark:bg-red-900/30">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-700 dark:text-red-400">Failed to load reminder settings</h4>
                      <p className="text-sm text-red-600 dark:text-red-300 mt-1">{emailReminderError}</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                        This won't affect your ability to save other settings.
                      </p>
                      <Button variant="outline" className="mt-3 text-sm px-3 py-1 h-auto">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Configure automated email reminders to be sent based on verification status
                      </p>
                    </div>

                    {reminderRows.map((row, index) => (
                      <div key={row.id} className="border rounded-lg overflow-hidden mb-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-3 flex justify-between items-center">
                          <div className="font-medium">Reminder #{index + 1}</div>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Trigger Event</Label>
                            <Select defaultValue={row.trigger}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="submission_completed">Submission completed</SelectItem>
                                <SelectItem value="verification_pending">Verification pending</SelectItem>
                                <SelectItem value="verification_rejected">Verification rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Additional Filter</Label>
                            <Select defaultValue={row.filter}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All submissions</SelectItem>
                                <SelectItem value="first_time">First-time users</SelectItem>
                                <SelectItem value="returning">Returning users</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Delay (days)</Label>
                            <div className="flex items-center">
                              <Input type="number" className="w-20" defaultValue={row.delay} />
                              <span className="text-sm text-muted-foreground ml-2">days after trigger</span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Button variant="outline" size="sm" className="mb-2">
                              Edit Email Template
                            </Button>

                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="flex items-center">
                                  <CheckSquare className="h-4 w-4 mr-2" />
                                  Send to customer
                                </Label>
                                <Switch checked={row.customer} />
                              </div>

                              <div className="flex items-center justify-between">
                                <Label className="flex items-center">
                                  <CheckSquare className="h-4 w-4 mr-2" />
                                  Send to organization
                                </Label>
                                <Switch checked={row.organization} />
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-2 pt-2 flex justify-between items-center border-t">
                            <p className="text-sm text-muted-foreground">Enable this reminder</p>
                            <Switch checked={row.active} />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button className="w-full" variant="outline" onClick={addReminderRow}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Reminder
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Redirection Section */}
          {activeSection === "Redirection" && (
            <Card>
              <CardHeader>
                <CardTitle>Redirect Configuration</CardTitle>
                <CardDescription>Configure redirect behavior after verification</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-grow space-y-1">
                    <p className="font-medium">Post-verification Redirection</p>
                    <p className="text-sm text-muted-foreground">Direct users to specific pages after verification completes</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="redirect-url">Redirect URL</Label>
                        <Input
                          id="redirect-url"
                          placeholder="https://example.com/thank-you"
                          value={redirecturl}
                          onChange={(e) => onRedirectUrlChange(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Users will be redirected to this URL after verification is complete
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="redirect-msg">Redirect message</Label>
                        <Input
                          id="redirect-msg"
                          placeholder="You are being redirected to..."
                          value={redirectmessage}
                          onChange={(e) => onRedirectMessageChange(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-950">
          <DialogHeader className="border-b border-slate-200 dark:border-slate-800">
            <DialogTitle className="text-lg font-semibold pb-2">How to write your email template</DialogTitle>
          </DialogHeader>

          <div className="p-4">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <div className="text-sm">
                  You may customise the email invite as following.
                  <ul className="list-disc pl-5 mt-3 space-y-2">
                    <li>first line is used as subject of email</li>
                    <li>You can add track ID by using &lt;trackid&gt; field.</li>
                    <li>You can add link to view your document.</li>
                    <li>You can add your logo by adding &lt;org logo&gt;</li>
                    <li>You can add DIRO logo by adding &lt;DIRO logo&gt;</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 dark:bg-slate-900 p-4 rounded border border-slate-200 dark:border-slate-800">
              <div className="text-sm font-medium mb-2">Example</div>
              <div className="text-sm space-y-2">
                <p>DIRO support account verification</p>
                <p>Hello &lt;firstname&gt;/&lt;orgname&gt;,</p>
                <p>
                  User has submitted their document for verification via no-code verification link. Please review the submission
                  to approve/reject the document.
                </p>
                <p>https://client.diro.io/viewdoc/&lt;sessionid&gt;</p>
                <p>Thank you,</p>
                <p>&lt;org logo&gt;</p>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-slate-200 dark:border-slate-800 pt-2">
            <Button variant="secondary" onClick={() => setIsTemplateModalOpen(false)} className="px-6">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCallbackModalOpen} onOpenChange={setIsCallbackModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {callbackModalState.loading
                ? "Testing Callback URL"
                : callbackModalState.type === "success"
                ? "Callback URL Test Result"
                : "Callback URL Error"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {callbackModalState.loading ? (
              <div className="flex justify-center items-center">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Testing callback URL...</span>
              </div>
            ) : (
              <div
                className={`text-sm ${
                  callbackModalState.type === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {callbackModalState.type === "error" && <h5 className="font-medium mb-2">Please ensure:</h5>}
                <p className="whitespace-pre-line">{callbackModalState.message}</p>
              </div>
            )}
          </div>

          {!callbackModalState.loading && (
            <DialogFooter className="sm:justify-center">
              {callbackModalState.type === "success" ||
              callbackModalState.type === "not-found" ||
              callbackModalState.type === "method-not-allowed" ? (
                <Button variant="default" onClick={handleCallbackClose}>
                  Close
                </Button>
              ) : callbackModalState.type === "error" ? (
                <div className="space-x-2">
                  <Button variant="default" onClick={handleForceSave}>
                    Yes
                  </Button>
                  <Button variant="destructive" onClick={handleCallbackClose}>
                    No
                  </Button>
                </div>
              ) : null}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
