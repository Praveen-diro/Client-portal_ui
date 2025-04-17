import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Building,
  Clock,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FancyCheckbox } from "@/components/ui/fancy-checkbox";
import { ZapierIntegration } from "./integrations/ZapierIntegration";
import { Textarea } from "@/components/ui/textarea";
import { buttonService } from "../../../services/button.service";
import { CustomizeTemplateModal } from "./CustomizeTemplateModal";
import { store } from "@/app/store/store";
import { useDispatch, useSelector } from "react-redux";
import { updateButton } from "@/app/store/features/buttonSlice";

// Utility functions for formatting days and hours
const formatDays = (days: string): string => {
  return parseFloat(days || "0").toFixed(1);
};

const daysToHours = (days: string): string => {
  return (parseFloat(days || "0") * 24).toFixed(0);
};

// Define types for the email reminder data structure
interface EmailTemplate {
  condition: string;
  id: string;
  subject: string;
  templatetext: string;
}

interface EmailReminderGroup {
  data: EmailTemplate[];
  name: string;
}

type EmailReminderData = EmailReminderGroup[];

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
  emailReminderData: EmailReminderData;
}

// Section type for navigation
type Section = "Triggers" | "callbacks" | "integrations" | "smtp" | "Customer Reminders" | "Redirection";

// Define the structure for a reminder row
export interface ReminderRow {
  id: number;
  trigger: string;
  additional_filter: string;
  customerCheck: boolean;
  organizationCheck: boolean;
  delay: string;
  activate: boolean;
  subject?: string;
  text?: string;
  organization_Subject?: string;
  organization_text?: string;
}

// Helper function to find a specific template by its condition name
const getTemplateByCondition = (condition: string, emailReminderData: any): { subject: string; text: string } => {
  if (!condition || !emailReminderData || !Array.isArray(emailReminderData)) {
    return { subject: "", text: "" };
  }

  // First try looking directly at the indices we know
  const submissionCompletedGroup = emailReminderData[3]?.data; // index 3 for Submission completed
  const documentNotSubmittedGroup = emailReminderData[4]?.data; // index 4 for document not submitted

  console.log("submissionCompletedGroup", submissionCompletedGroup);
  // Look in submission completed group
  if (submissionCompletedGroup) {
    for (const template of submissionCompletedGroup) {
      if (template.condition === condition) {
        return { subject: template.subject || "", text: template.templatetext || "" };
      }
    }
  }

  // Look in document not submitted group
  if (documentNotSubmittedGroup) {
    for (const template of documentNotSubmittedGroup) {
      if (template.condition === condition) {
        return { subject: template.subject || "", text: template.templatetext || "" };
      }
    }
  }

  // Fallback to checking all groups
  for (const group of emailReminderData) {
    if (group?.data && Array.isArray(group.data)) {
      const template = group.data.find((t: any) => t.condition === condition);
      if (template) {
        return { subject: template.subject || "", text: template.templatetext || "" };
      }
    }
  }

  return { subject: "", text: "" }; // Return empty if not found
};

// Helper function to find default templates using the new keys
const getDefaultTemplates = (
  trigger: string,
  additional_filter: string,
  emailReminderData: any
): { subject: string; text: string; organization_Subject: string; organization_text: string } => {
  let customerCondition = "";
  let orgCondition = "";

  // Map trigger/additional_filter to specific condition names
  if (trigger === "Document not submitted") {
    if (additional_filter === "Live feedback accepted") {
      customerCondition = "Live feedback accepted, but documents not submitted customer";
      orgCondition = "Live feedback accepted, but documents not submitted organization";
    } else if (additional_filter === "Live feedback rejection") {
      customerCondition = "Live feedback rejected, but documents not submitted by customer";
      orgCondition = "Live feedback rejected, but documents not submitted organization";
    }
  } else if (trigger === "Submission completed") {
    if (additional_filter === "Document accepted") {
      customerCondition = "Document accepted";
      orgCondition = "Document Submission Accepted Org";
    } else if (additional_filter === "Document rejected") {
      customerCondition = "Document rejected";
      orgCondition = "Document rejected Org";
    } else if (additional_filter === "Bad Document") {
      customerCondition = "Bad Document";
      orgCondition = "Bad Document Org";
    }
  }

  console.log("Looking for templates with conditions:", { customerCondition, orgCondition });

  // Get templates using the helper function
  const customerTemplate = getTemplateByCondition(customerCondition, emailReminderData);
  console.log("customerTemplate", customerTemplate);
  const orgTemplate = getTemplateByCondition(orgCondition, emailReminderData);

  console.log("Found templates:", { customerTemplate, orgTemplate });

  return {
    subject: customerTemplate.subject,
    text: customerTemplate.text,
    organization_Subject: orgTemplate.subject,
    organization_text: orgTemplate.text,
  };
};

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
  emailReminderData = [],
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

  // Redux integration
  const dispatch = useDispatch();
  const buttonData = useSelector((state: any) => state.buttons.btn?.btndata);
  const emailReminderTemplates = useSelector((state: any) => state.buttons.emailreminderdata);
  const buttonId = useSelector((state: any) => state.buttons.buttonid);

  // Initialize reminders from Redux state
  const [reminderRows, setReminderRows] = useState<ReminderRow[]>(buttonData?.reminders || []);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderRow | null>(null);

  // Sync with Redux state when it changes
  useEffect(() => {
    if (buttonData?.reminders) {
      setReminderRows(buttonData.reminders);
    }
  }, [buttonData?.reminders]);

  // Function to update a specific reminder in Redux
  const updateReminder = (index: number, updatedData: Partial<ReminderRow>) => {
    const updatedReminders = reminderRows.map((reminder, idx) => (idx === index ? { ...reminder, ...updatedData } : reminder));

    // Update local state
    setReminderRows(updatedReminders);

    // Dispatch to Redux
    dispatch(
      updateButton({
        buttonid: buttonId,
        data: {
          reminders: updatedReminders,
        },
      })
    );
  };

  // Handle trigger change
  const handleTriggerChange = (triggerId: number, value: string) => {
    const reminderIndex = reminderRows.findIndex((row) => row.id === triggerId);
    if (reminderIndex === -1) return;

    const newTemplates = getDefaultTemplates(value, "", emailReminderTemplates);
    updateReminder(reminderIndex, {
      trigger: value,
      additional_filter: "",
      ...newTemplates,
    });
  };

  // Handle filter change
  const handleFilterChange = (triggerId: number, value: string) => {
    const reminderIndex = reminderRows.findIndex((row) => row.id === triggerId);
    if (reminderIndex === -1) return;

    const newTemplates = getDefaultTemplates(reminderRows[reminderIndex].trigger, value, emailReminderTemplates);
    updateReminder(reminderIndex, {
      additional_filter: value,
      ...newTemplates,
    });
  };

  // Handle toggle changes
  const handleToggleChange = (
    triggerId: number,
    toggleName: "customerCheck" | "organizationCheck" | "activate",
    checked: boolean
  ) => {
    const reminderIndex = reminderRows.findIndex((row) => row.id === triggerId);
    if (reminderIndex === -1) return;

    updateReminder(reminderIndex, {
      [toggleName]: checked,
    });
  };

  // Handle delay changes
  const handleDelayChange = (triggerId: number, value: string) => {
    if (!/^\d*\.?\d?$/.test(value) && value !== "") return;

    const reminderIndex = reminderRows.findIndex((row) => row.id === triggerId);
    if (reminderIndex === -1) return;

    updateReminder(reminderIndex, {
      delay: value,
    });
  };

  // Add new reminder
  const addReminderRow = () => {
    const defaultTrigger = "Submission completed";
    const defaultFilter = "";
    const defaultTemplates = getDefaultTemplates(defaultTrigger, defaultFilter, emailReminderTemplates);

    const newReminder: ReminderRow = {
      id: Date.now(),
      trigger: defaultTrigger,
      additional_filter: defaultFilter,
      customerCheck: false,
      organizationCheck: false,
      delay: "0.0",
      activate: false,
      ...defaultTemplates,
    };

    const updatedReminders = [...reminderRows, newReminder];
    setReminderRows(updatedReminders);

    dispatch(
      updateButton({
        buttonid: buttonId,
        data: {
          reminders: updatedReminders,
        },
      })
    );
  };

  // Save customized template
  const handleSaveCustomizedTemplate = (updatedReminder: ReminderRow) => {
    const reminderIndex = reminderRows.findIndex((row) => row.id === updatedReminder.id);
    if (reminderIndex === -1) return;

    updateReminder(reminderIndex, updatedReminder);
    handleCloseCustomizeModal();
  };

  // Function to open the customize template modal
  const handleOpenCustomizeModal = (reminder: ReminderRow) => {
    console.log("Opening customize modal for reminder:", reminder);
    setEditingReminder(reminder);
    setIsCustomizeModalOpen(true);
    console.log("State after setting: isCustomizeModalOpen=", true, "editingReminder=", reminder);
  };

  // Function to close the customize template modal
  const handleCloseCustomizeModal = () => {
    setEditingReminder(null);
    setIsCustomizeModalOpen(false);
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
        <div className="lg:col-span-1/2">
          <div className="sticky top-4 space-y-3 space-x-2">
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
                <CardTitle className="text-xl font-semibold tracking-tight">Email Notifications</CardTitle>
                <CardDescription>Configure notifications sent after verification</CardDescription>
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
                <CardTitle className="text-xl font-semibold tracking-tight">Callback Configuration</CardTitle>
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

          {/* Customer Reminders Section */}
          {activeSection === "Customer Reminders" && (
            <Card className="shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-semibold tracking-tight">Customer Reminders</CardTitle>
                      <CardDescription>Automate notifications throughout the verification process</CardDescription>
                    </div>
                  </div>
                  <Button onClick={addReminderRow} className="shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {emailReminderLoading && (
                  <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative h-12 w-12">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                        <Calendar className="h-6 w-6 text-primary/60 absolute inset-0 m-auto" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Loading reminders...</span>
                    </div>
                  </div>
                )}

                {!emailReminderLoading && emailReminderError && (
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-6 border border-red-100 dark:border-red-900/20 shadow-sm animate-in fade-in duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full flex-shrink-0">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-medium text-red-800 dark:text-red-400">Unable to load reminders</h3>
                        <p className="text-sm text-red-600 dark:text-red-300">{emailReminderError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/40 dark:text-red-400"
                        >
                          <RefreshCw className="h-3.5 w-3.5 mr-2" />
                          Retry
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!emailReminderLoading && !emailReminderError && (
                  <>
                    {reminderRows.length === 0 ? (
                      <div className="py-20 text-center">
                        <div className="max-w-md mx-auto">
                          <div className="mb-6 relative">
                            <div className="bg-primary/5 p-6 rounded-full h-24 w-24 flex items-center justify-center mx-auto">
                              <Calendar className="h-10 w-10 text-primary/40" />
                            </div>
                            <div className="absolute top-3 right-3 border-2 border-dashed border-primary/20 w-6 h-6 rounded-full"></div>
                            <div className="absolute bottom-1 left-1 border-2 border-dashed border-primary/20 w-8 h-8 rounded-full"></div>
                          </div>
                          <h3 className="text-xl font-medium mb-3 text-slate-900 dark:text-slate-100">No reminders configured</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                            Create automated reminders to keep customers engaged and improve completion rates for your
                            verification process.
                          </p>
                          <Button onClick={addReminderRow} className="shadow-sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Your First Reminder
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Accordion type="multiple" className="space-y-4">
                        {reminderRows.map((row, index) => {
                          // Define theme colors based on trigger type
                          let accentColor = "text-green-600 dark:text-green-500";
                          let borderColor = "border-green-200 dark:border-green-900/40";
                          let bgColor = "bg-green-50 dark:bg-green-900/10";
                          let iconBg = "bg-green-100 dark:bg-green-900/30";
                          let icon = <CheckCircle className="h-4 w-4" />;
                          let statusBg = row.activate
                            ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";

                          if (row.trigger === "verification_pending" || row.trigger === "Document not submitted") {
                            accentColor = "text-amber-600 dark:text-amber-500";
                            borderColor = "border-amber-200 dark:border-amber-900/40";
                            bgColor = "bg-amber-50 dark:bg-amber-900/10";
                            iconBg = "bg-amber-100 dark:bg-amber-900/30";
                            icon = <Clock className="h-4 w-4" />;
                            statusBg = row.activate
                              ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
                          } else if (row.trigger === "verification_rejected") {
                            accentColor = "text-red-600 dark:text-red-500";
                            borderColor = "border-red-200 dark:border-red-900/40";
                            bgColor = "bg-red-50 dark:bg-red-900/10";
                            iconBg = "bg-red-100 dark:bg-red-900/30";
                            icon = <XCircle className="h-4 w-4" />;
                            statusBg = row.activate
                              ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
                          }

                          return (
                            <AccordionItem
                              key={`${index}-${row.trigger}`}
                              value={`reminder-${row.id || index}`}
                              className={`border rounded-lg shadow-sm ${borderColor} overflow-hidden`}
                            >
                              <AccordionTrigger
                                className={`${bgColor} p-4 px-5 hover:no-underline group [&[data-state=open]>svg]:rotate-180`}
                              >
                                <div className="flex items-center justify-between w-full pr-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`${iconBg} p-2 rounded-full ${accentColor}`}>{icon}</div>
                                    <div className="text-left">
                                      <p className="font-medium text-base">Customer Reminder-{index + 1}</p>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {row.trigger === "submission completed" && "Submission Completed"}
                                        {row.trigger === "Document not submitted" && "Document not submitted"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className={`${statusBg} px-2.5 py-1 rounded-full text-xs font-medium hidden md:flex`}>
                                      {row.activate ? "Active" : "Inactive"}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-500"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateReminder(index, { activate: false });
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </AccordionTrigger>

                              <AccordionContent className="p-0">
                                <div className="p-5 pt-2 border-t border-slate-100 dark:border-slate-800">
                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-6 space-y-5 gap-4">
                                      <div className="grid grid-cols-6 gap-4">
                                        <div className="col-span-6 sm:col-span-6 space-y-2">
                                          <Label className="text-md">Trigger</Label>
                                          <Select
                                            defaultValue={row.trigger}
                                            onValueChange={(value) => handleTriggerChange(row.id, value)}
                                          >
                                            <SelectTrigger className="bg-white dark:bg-slate-800 h-10">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="Document not submitted">
                                                <div className="flex items-center font-medium">
                                                  <XCircle className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                                                  Document not submitted
                                                </div>
                                              </SelectItem>
                                              <SelectItem value="Submission completed">
                                                <div className="flex items-center font-medium">
                                                  <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                                                  Submission completed
                                                </div>
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="col-span-6 sm:col-span-6 space-y-2">
                                          <Label className="text-md">Additional Filter</Label>
                                          <Select
                                            value={row.additional_filter}
                                            onValueChange={(value) => handleFilterChange(row.id, value)}
                                          >
                                            <SelectTrigger className="bg-white dark:bg-slate-800 h-10">
                                              <SelectValue placeholder="Select a additional_filter" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {row.trigger === "Submission completed" ? (
                                                <>
                                                  <SelectItem value="Bad Document">Bad Document</SelectItem>
                                                  <SelectItem value="Document rejected">Document rejected</SelectItem>
                                                  <SelectItem value="Document accepted">Document accepted</SelectItem>
                                                </>
                                              ) : (
                                                <>
                                                  <SelectItem value="Live feedback accepted">Live feedback accepted</SelectItem>
                                                  <SelectItem value="Live feedback rejection">Live feedback rejection</SelectItem>
                                                </>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="col-span-12 sm:col-span-6 space-y-2">
                                          <div className="flex items-center justify-between">
                                            <Label className="text-md">Delay (In days)</Label>
                                            <div className="text-xs text-slate-500">
                                              {parseFloat(row.delay || "0") > 0 ? (
                                                <span className="font-medium">
                                                  {formatDays(row.delay)} day{parseFloat(row.delay) !== 1 && "s"} (
                                                  {daysToHours(row.delay)} hours)
                                                </span>
                                              ) : (
                                                <span className="font-medium">0.0 days</span>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex space-x-2">
                                            <Input
                                              type="text"
                                              className="bg-white dark:bg-slate-800 h-10"
                                              value={row.delay}
                                              placeholder="0.0"
                                              onChange={(e) => handleDelayChange(row.id, e.target.value)}
                                              style={{ width: "100%" }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center space-x-2">
                                        <Label className="text-sm">Activate reminder</Label>
                                        <Switch
                                          checked={row.activate}
                                          onCheckedChange={(checked) =>
                                            handleToggleChange(row.id, "activate", checked as boolean)
                                          }
                                          className="data-[state=checked]:bg-primary"
                                        />
                                      </div>
                                    </div>

                                    <div className="md:col-span-6 mt-4">
                                      <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                                          <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 flex items-center">
                                            <Mail className="h-3.5 w-3.5 mr-2 text-slate-500" />
                                            Notification Recipients
                                          </h4>
                                        </div>

                                        <div className="p-4 space-y-3">
                                          <div className="flex items-center justify-between py-2 border-b border-dashed border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center">
                                              <CheckSquare className="h-4 w-4 text-slate-500 mr-3" />
                                              <div>
                                                <p className="text-sm font-medium">Customer</p>
                                                <p className="text-xs text-slate-500">End user verification</p>
                                              </div>
                                            </div>
                                            <Switch
                                              checked={row.customerCheck}
                                              onCheckedChange={(checked) =>
                                                handleToggleChange(row.id, "customerCheck", checked as boolean)
                                              }
                                              className="data-[state=checked]:bg-primary"
                                              disabled={!row.additional_filter}
                                            />
                                          </div>

                                          <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center">
                                              <Building className="h-4 w-4 text-slate-500 mr-3" />
                                              <div>
                                                <p className="text-sm font-medium">Organization</p>
                                                <p className="text-xs text-slate-500">Admin account</p>
                                              </div>
                                            </div>
                                            <Switch
                                              checked={row.organizationCheck}
                                              onCheckedChange={(checked) =>
                                                handleToggleChange(row.id, "organizationCheck", checked as boolean)
                                              }
                                              className="data-[state=checked]:bg-primary"
                                              disabled={!row.additional_filter}
                                            />
                                          </div>

                                          <Separator className="my-2" />

                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-2 border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                                            onClick={() => handleOpenCustomizeModal(row)}
                                            disabled={!row.customerCheck && !row.organizationCheck}
                                          >
                                            <FileText className="h-3.5 w-3.5 mr-1.5" />
                                            Customize templates
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    )}
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
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="redirect-url">Redirect URL</Label>
                        <Input
                          id="redirect-url"
                          placeholder="https://example.com/thank-you"
                          value={redirecturl}
                          onChange={(e) => onRedirectUrlChange?.(e.target.value)}
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
                          onChange={(e) => onRedirectMessageChange?.(e.target.value)}
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

      {/* Render the CustomizeTemplateModal */}
      {(() => {
        console.log("Rendering check: isCustomizeModalOpen=", isCustomizeModalOpen, "editingReminder=", editingReminder);
        if (editingReminder) {
          return (
            <CustomizeTemplateModal
              isOpen={isCustomizeModalOpen}
              onClose={handleCloseCustomizeModal}
              reminder={editingReminder}
              onSave={handleSaveCustomizedTemplate}
            />
          );
        }
        return null;
      })()}

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
