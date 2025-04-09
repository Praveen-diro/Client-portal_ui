import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, FileText, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TriggersEmailTabProps {
  emailToOrganization: string;
  includePdfInEmail: boolean;
  submissionNotificationViaEmail: boolean;
  emailToOrganizationEnabled: boolean;
  enableEngagementCallback: boolean;
  autoJson: boolean;
  callbackUrl: string;
  addGoogleSheetUrl: boolean;
  enableSalesforce: boolean;
  emailReminder?: any; // Email reminder data from API
  emailReminderLoading?: boolean; // Loading state for email reminder
  emailReminderError?: string; // Error message for email reminder
  onEmailToOrganizationChange: (value: string) => void;
  onIncludePdfInEmailChange: (checked: boolean) => void;
  onSubmissionNotificationViaEmailChange: (checked: boolean) => void;
  onEmailToOrganizationEnabledChange: (checked: boolean) => void;
  onEnableEngagementCallbackChange: (checked: boolean) => void;
  onAutoJsonChange: (checked: boolean) => void;
  onCallbackUrlChange: (value: string) => void;
  onAddGoogleSheetUrlChange: (checked: boolean) => void;
  onEnableSalesforceChange: (checked: boolean) => void;
}

export const TriggersEmailTab: React.FC<TriggersEmailTabProps> = ({
  emailToOrganization,
  includePdfInEmail,
  submissionNotificationViaEmail,
  emailToOrganizationEnabled,
  enableEngagementCallback,
  autoJson,
  callbackUrl,
  addGoogleSheetUrl,
  enableSalesforce,
  emailReminder,
  emailReminderLoading,
  emailReminderError,
  onEmailToOrganizationChange,
  onIncludePdfInEmailChange,
  onSubmissionNotificationViaEmailChange,
  onEmailToOrganizationEnabledChange,
  onEnableEngagementCallbackChange,
  onAutoJsonChange,
  onCallbackUrlChange,
  onAddGoogleSheetUrlChange,
  onEnableSalesforceChange,
}) => {
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    trigger: true,
    redirection: true,
    emailSmtp: true,
    emailReminder: true,
  });

  // Toggle function for each section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* After Verification Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">After verification</h2>
                <p className="text-sm text-muted-foreground">Configure actions to be taken after verification</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Trigger Section */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left"
                  onClick={() => toggleSection("trigger")}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">Trigger</span>
                  </div>
                  {expandedSections.trigger ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.trigger && (
                  <div className="border-t p-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Email to the organization</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={emailToOrganization}
                          onChange={(e) => onEmailToOrganizationChange(e.target.value)}
                          placeholder="<trackid>@yourdomain.com"
                          className="flex-1"
                        />
                        <Button variant="outline" className="whitespace-nowrap">
                          CRM integration <span className="ml-1 text-xs">ℹ️</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Include pdf in email</Label>
                      <Switch checked={includePdfInEmail} onCheckedChange={onIncludePdfInEmailChange} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Submission notification via email</Label>
                      <Switch checked={submissionNotificationViaEmail} onCheckedChange={onSubmissionNotificationViaEmailChange} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Email to organization</Label>
                      <Switch checked={emailToOrganizationEnabled} onCheckedChange={onEmailToOrganizationEnabledChange} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Enable engagement callback</Label>
                      <Switch checked={enableEngagementCallback} onCheckedChange={onEnableEngagementCallbackChange} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Auto JSON</Label>
                      <Switch checked={autoJson} onCheckedChange={onAutoJsonChange} />
                    </div>

                    <div className="space-y-2">
                      <Label>Override default callback url</Label>
                      <div className="flex gap-2">
                        <Input
                          value={callbackUrl}
                          onChange={(e) => onCallbackUrlChange(e.target.value)}
                          placeholder="Enter callback url"
                          className="flex-1"
                        />
                        <Button variant="outline">Test custom callback url</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Add google sheet URL</Label>
                      <Switch checked={addGoogleSheetUrl} onCheckedChange={onAddGoogleSheetUrlChange} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Enable Salesforce</Label>
                      <Switch checked={enableSalesforce} onCheckedChange={onEnableSalesforceChange} />
                    </div>

                    <div>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 text-orange-500 border-orange-200 hover:bg-orange-50"
                      >
                        <div className="p-1 bg-orange-100 rounded">
                          <FileText className="h-4 w-4" />
                        </div>
                        Integrate with Zapier
                        <span className="ml-1 text-xs">ℹ️</span>
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1 ml-1">
                        Using Zapier you can generate a webhook URL and integrate our callbacks with your workflow.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Redirection Section */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left"
                  onClick={() => toggleSection("redirection")}
                >
                  <div className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-medium">Redirection</span>
                  </div>
                  {expandedSections.redirection ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.redirection && (
                  <div className="border-t p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">after verification is complete / on exit</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label>Redirect url</Label>
                      </div>
                      <Input placeholder="Enter redirect url" className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <Label>Redirect message</Label>
                      <Input placeholder="You are redirecting to" className="w-full" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Setup Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Email setup</h2>
                <p className="text-sm text-muted-foreground">Configure email settings and reminders</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email SMTP Setup Section */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left"
                  onClick={() => toggleSection("emailSmtp")}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Email SMTP setup</span>
                  </div>
                  {expandedSections.emailSmtp ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.emailSmtp && (
                  <div className="border-t p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SMTP username</Label>
                        <p className="text-xs text-muted-foreground">(to your _email@gmail.com)</p>
                        <Input placeholder="username" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label>SMTP password</Label>
                        <p className="text-xs text-muted-foreground">(to your password)</p>
                        <Input type="password" placeholder="password" className="w-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>SMTP server</Label>
                        <Input placeholder="smtp.serveraddress.com" className="w-full" />
                      </div>
                      <div className="space-y-2">
                        <Label>SMTP port</Label>
                        <Input placeholder="8080" className="w-full" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Reminders Section */}
              <div className="border rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left"
                  onClick={() => toggleSection("emailReminder")}
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="font-medium">Email reminder</span>
                  </div>
                  {expandedSections.emailReminder ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {expandedSections.emailReminder && (
                  <div className="border-t p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">configure emails to be sent to customers</p>

                    {emailReminderLoading ? (
                      <div className="text-center py-4">Loading email reminder settings...</div>
                    ) : emailReminderError ? (
                      <div className="text-center py-4 text-red-500">
                        Error loading email reminder settings: {emailReminderError}
                      </div>
                    ) : (
                      <div className="border rounded-lg">
                        <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50">
                          <div className="text-sm font-medium">Trigger</div>
                          <div className="text-sm font-medium">Additional filter</div>
                          <div className="text-sm font-medium">Templates</div>
                          <div className="text-sm font-medium">Customer</div>
                          <div className="text-sm font-medium">Organization</div>
                          <div className="text-sm font-medium">Delay(days)</div>
                          <div className="text-sm font-medium">Activate</div>
                        </div>

                        <div className="border-t">
                          <div className="grid grid-cols-7 gap-4 p-4">
                            <div>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Submission completed" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="submission_completed">Submission completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="option1">Option 1</SelectItem>
                                  <SelectItem value="option2">Option 2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Button variant="outline" size="sm" className="text-blue-500">
                                Edit
                              </Button>
                            </div>
                            <div>
                              <Switch />
                            </div>
                            <div>
                              <Switch />
                            </div>
                            <div className="flex items-center gap-2">
                              <Input type="number" className="w-20" defaultValue="0" />
                              <span className="text-sm text-muted-foreground">0 hours</span>
                            </div>
                            <div>
                              <Switch />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button variant="outline" className="gap-2">
                        <span className="text-lg">+</span> Add reminder
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
