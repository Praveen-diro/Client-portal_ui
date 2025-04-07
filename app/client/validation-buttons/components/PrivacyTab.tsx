import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FancySwitchToggle } from "@/components/ui/fancy-switch-toggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, ClipboardList, Eye, FileJson, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";

interface PrivacyTabProps {
  autoDeletionEnabled: boolean;
  shareOnlyJson: boolean;
  showFieldLabels: boolean;
  disableWebpagePrompts: boolean;
  showDetailedJson: boolean;
  transactionsExtraction: boolean;
  documentExpiryValue: number;
  onAutoDeletionChange: (checked: boolean) => void;
  onShareOnlyJsonChange: (checked: boolean) => void;
  onShowFieldLabelsChange: (checked: boolean) => void;
  onDisableWebpagePromptsChange: (checked: boolean) => void;
  onShowDetailedJsonChange: (checked: boolean) => void;
  onTransactionsExtractionChange: (checked: boolean) => void;
  onDocumentExpiryValueChange: (days: number) => void;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  autoDeletionEnabled,
  shareOnlyJson,
  showFieldLabels,
  disableWebpagePrompts,
  showDetailedJson,
  transactionsExtraction,
  documentExpiryValue,
  onAutoDeletionChange,
  onShareOnlyJsonChange,
  onShowFieldLabelsChange,
  onDisableWebpagePromptsChange,
  onShowDetailedJsonChange,
  onTransactionsExtractionChange,
  onDocumentExpiryValueChange,
}) => {
  const [shareRequestedFieldsOnly, setShareRequestedFieldsOnly] = useState(false);
  const [localDays, setLocalDays] = useState<string>("");

  // Update local state when props change from outside
  useEffect(() => {
    if (documentExpiryValue) {
      setLocalDays(documentExpiryValue.toString());
    }
  }, [documentExpiryValue]);

  // Handle input change locally
  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalDays(e.target.value);
  };

  // Handle blur to update parent state
  const handleDaysBlur = () => {
    const numValue = parseInt(localDays);
    if (!isNaN(numValue) && numValue > 0) {
      onDocumentExpiryValueChange(numValue);
    }
  };

  // Handle increment/decrement
  const handleIncrement = () => {
    const current = parseInt(localDays) || 0;
    const newValue = current + 1;
    setLocalDays(newValue.toString());
    onDocumentExpiryValueChange(newValue);
  };

  const handleDecrement = () => {
    const current = parseInt(localDays) || 0;
    const newValue = Math.max(1, current - 1);
    setLocalDays(newValue.toString());
    onDocumentExpiryValueChange(newValue);
  };

  return (
    <div className="w-full max-w-8xl mx-auto">
      <Accordion type="multiple" defaultValue={[]} className="space-y-4">
        {/* Privacy Accordion */}
        <AccordionItem value="privacy" className="border-0 rounded-lg overflow-hidden bg-card shadow-sm">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium text-foreground">Privacy</h3>
                <p className="text-sm text-muted-foreground">manage data deletion and sharing</p>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-0 border-t border-border">
            <div className="p-6 space-y-6 bg-card">
              {/* Settings tiles in a grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Auto Deletion Settings */}
                <div
                  className={`rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${
                    autoDeletionEnabled ? "ring-1 ring-border" : "ring-1 ring-border/70"
                  }`}
                >
                  <div className={`p-4 ${autoDeletionEnabled ? "bg-accent/20" : "bg-card"}`}>
                    <div className="flex items-center">
                      <FancySwitchToggle checked={autoDeletionEnabled} onCheckedChange={onAutoDeletionChange} className="mr-3" />
                      <span className="text-foreground font-medium">Enable auto deletion</span>
                    </div>
                  </div>

                  {autoDeletionEnabled && (
                    <div className="p-5 bg-background border-t border-border">
                      <div className="flex items-center">
                        <span className="text-foreground mr-3">Auto-delete data after</span>
                        <div className="relative h-9 w-16 overflow-hidden rounded-md bg-muted text-foreground flex items-center shadow-sm">
                          <input
                            type="number"
                            min="1"
                            placeholder="7"
                            value={localDays}
                            onChange={handleDaysChange}
                            onBlur={handleDaysBlur}
                            className="w-full h-full px-2 text-center bg-transparent 
                             text-foreground text-base font-medium
                             border-0 focus:ring-0 focus:outline-none"
                          />
                          <div className="absolute right-0 top-0 bottom-0 w-5 flex flex-col border-l border-border">
                            <button
                              className="flex-1 flex items-center justify-center hover:bg-accent/30 text-foreground"
                              onClick={handleIncrement}
                              type="button"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <div className="w-full h-px bg-border" />
                            <button
                              className="flex-1 flex items-center justify-center hover:bg-accent/30 text-foreground"
                              onClick={handleDecrement}
                              type="button"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <span className="ml-2 text-foreground">days</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* JSON Settings */}
                <div
                  className={`rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${
                    shareOnlyJson ? "ring-1 ring-border" : "ring-1 ring-border/70"
                  }`}
                >
                  <div className={`p-4 ${shareOnlyJson ? "bg-accent/20" : "bg-card"}`}>
                    <div className="flex items-center">
                      <FancySwitchToggle checked={shareOnlyJson} onCheckedChange={onShareOnlyJsonChange} className="mr-3" />
                      <span className="text-foreground font-medium">Share only JSON (do not generate PDF)</span>
                    </div>
                  </div>

                  {shareOnlyJson && (
                    <div className="p-5 bg-background border-t border-border">
                      <div className="flex items-center">
                        <FancySwitchToggle
                          checked={shareRequestedFieldsOnly}
                          onCheckedChange={setShareRequestedFieldsOnly}
                          className="mr-3"
                        />
                        <span className="text-foreground">Share requested fields only</span>
                      </div>
                      <div className="flex mt-3">
                        <div className="ml-9 py-2 px-3 bg-muted rounded-md">
                          <p className="text-xs text-muted-foreground flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1.5" />
                            To enable this, add atleast one tag under verification fields
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Verification Fields Accordion */}
        <AccordionItem value="verification" className="border-0 rounded-lg overflow-hidden bg-card shadow-sm">
          <AccordionTrigger className="p-4 hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="text-muted-foreground">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-medium text-foreground">Verification fields</h3>
                <p className="text-sm text-muted-foreground">
                  used for prompts when customer information is found on webpage and later during PDF approval
                </p>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-6 border-t border-border bg-card">
            {/* Field Definition Row Labels */}
            <div className="grid grid-cols-4 gap-4 mb-3">
              <div>
                <Label className="text-sm text-muted-foreground flex items-center">
                  Field label <span className="text-destructive ml-1">*</span>
                </Label>
                <p className="text-xs text-muted-foreground/70">(What to find)</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Type</Label>
                <p className="text-xs text-muted-foreground/70">&nbsp;</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Sample text</Label>
                <p className="text-xs text-muted-foreground/70">(Hint for data entry in form)</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Tag</Label>
                <p className="text-xs text-muted-foreground/70">(For mapping field in json)</p>
              </div>
            </div>

            {/* Field Input Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <input
                  type="text"
                  placeholder="full name"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
              <div>
                <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background appearance-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors">
                  <option>text</option>
                  <option>number</option>
                  <option>date</option>
                  <option>email</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Sample help text"
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
                />
              </div>
              <div className="flex items-center">
                <select className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background appearance-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors">
                  <option>Select tag</option>
                  <option>name</option>
                  <option>email</option>
                  <option>address</option>
                  <option>phone</option>
                </select>
              </div>
            </div>

            {/* Add Field Button */}
            <div className="flex justify-end mb-8">
              <Button variant="secondary" className="shadow-sm transition-colors">
                <span className="mr-1">+</span> Add field
              </Button>
            </div>

            {/* Toggles and Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                {/* Toggles */}
                <div className="p-4 bg-accent/10 rounded-lg border border-border hover:border-border/80 transition-colors">
                  <div className="flex items-center">
                    <FancySwitchToggle checked={showFieldLabels} onCheckedChange={onShowFieldLabelsChange} className="mr-3" />
                    <span className="text-foreground">Show field labels on find info screen</span>
                  </div>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border border-border hover:border-border/80 transition-colors">
                  <div className="flex items-center">
                    <FancySwitchToggle
                      checked={disableWebpagePrompts}
                      onCheckedChange={onDisableWebpagePromptsChange}
                      className="mr-3"
                    />
                    <span className="text-foreground">Do not prompt user for capture when a keyword is found on webpage</span>
                  </div>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border border-border hover:border-border/80 transition-colors">
                  <div className="flex items-center">
                    <FancySwitchToggle checked={showDetailedJson} onCheckedChange={onShowDetailedJsonChange} className="mr-3" />
                    <span className="text-foreground">Show account in detail in the final JSON</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Sample Screen */}
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">Sample screen</Label>
                  <div className="bg-muted/50 rounded-lg overflow-hidden p-1 shadow-sm">
                    <div className="bg-muted rounded-lg">
                      <img
                        src="/sample-screen-preview.png"
                        alt="Sample Screen Preview"
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML =
                              '<div class="flex items-center justify-center h-40 text-muted-foreground p-4 text-center"><p>Preview of field detection interface</p></div>';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
