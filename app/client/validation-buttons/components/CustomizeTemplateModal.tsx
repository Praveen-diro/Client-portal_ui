import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ReminderRow } from "./TriggersEmailTab"; // Assuming ReminderRow is exported

interface CustomizeTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderRow | null;
  onSave: (updatedReminder: ReminderRow) => void;
}

export const CustomizeTemplateModal: React.FC<CustomizeTemplateModalProps> = ({ isOpen, onClose, reminder, onSave }) => {
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [organizationSubject, setOrganizationSubject] = useState("");
  const [organizationText, setOrganizationText] = useState("");
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (reminder) {
      setSubject(reminder.subject || "");
      setText(reminder.text || "");
      setOrganizationSubject(reminder.organization_Subject || "");
      setOrganizationText(reminder.organization_text || "");

      // Set the default active tab based on which toggles are enabled
      if (reminder.customerCheck) {
        setActiveTab("customer");
      } else if (reminder.organizationCheck) {
        setActiveTab("organization");
      } else {
        setActiveTab(undefined);
      }
    }
  }, [reminder]);

  const handleSave = () => {
    if (!reminder) return;
    const updatedReminder = {
      ...reminder,
      subject: subject,
      text: text,
      organization_Subject: organizationSubject,
      organization_text: organizationText,
    };
    onSave(updatedReminder);
  };

  // Determine which tabs to show
  const showCustomerTab = reminder?.customerCheck;
  const showOrganizationTab = reminder?.organizationCheck;
  const numberOfTabs = (showCustomerTab ? 1 : 0) + (showOrganizationTab ? 1 : 0);

  if (!reminder) {
    return null; // Or some loading/placeholder state
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] bg-white dark:bg-slate-950">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Customize Email Templates</DialogTitle>
          <DialogDescription>Edit the email templates for the selected reminder trigger and filter.</DialogDescription>
        </DialogHeader>

        <div className="py-4 px-1">
          {showCustomerTab || showOrganizationTab ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full mb-4 ${numberOfTabs === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                {showCustomerTab && <TabsTrigger value="customer">Customer</TabsTrigger>}
                {showOrganizationTab && <TabsTrigger value="organization">Organization</TabsTrigger>}
              </TabsList>

              {showCustomerTab && (
                <TabsContent value="customer">
                  <div className="space-y-4 p-1">
                    <div className="space-y-2">
                      <Label htmlFor="customer-subject">Email subject</Label>
                      <Input
                        id="customer-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Enter customer email subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-body">Email body</Label>
                      <Textarea
                        id="customer-body"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter customer email body..."
                        rows={10}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      {/* Add template variable hints here later */}
                    </div>
                  </div>
                </TabsContent>
              )}

              {showOrganizationTab && (
                <TabsContent value="organization">
                  <div className="space-y-4 p-1">
                    <div className="space-y-2">
                      <Label htmlFor="organization-subject">Email subject</Label>
                      <Input
                        id="organization-subject"
                        value={organizationSubject}
                        onChange={(e) => setOrganizationSubject(e.target.value)}
                        placeholder="Enter organization email subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="organization-body">Email body</Label>
                      <Textarea
                        id="organization-body"
                        value={organizationText}
                        onChange={(e) => setOrganizationText(e.target.value)}
                        placeholder="Enter organization email body..."
                        rows={10}
                        className="min-h-[200px] font-mono text-sm"
                      />
                      {/* Add template variable hints here later */}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No recipients selected for this reminder. Enable Customer or Organization toggle to customize templates.
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 dark:border-slate-800 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!showCustomerTab && !showOrganizationTab}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
