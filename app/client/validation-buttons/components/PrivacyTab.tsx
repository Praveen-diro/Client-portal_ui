import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FancySwitchToggle } from "@/components/ui/fancy-switch-toggle";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, ClipboardList, Eye, FileJson, AlertCircle, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VerificationField {
  message: string;
  type: string;
  hinttext: string;
  tagfield: string;
}

interface PrivacyTabProps {
  autoDeletionEnabled: boolean;
  shareOnlyJson: boolean;
  showFieldLabels: boolean;
  disableWebpagePrompts: boolean;
  showDetailedJson: boolean;
  transactionsExtraction: boolean;
  documentExpiryValue: number;
  captureFields?: VerificationField[];
  onAutoDeletionChange: (checked: boolean) => void;
  onShareOnlyJsonChange: (checked: boolean) => void;
  onShowFieldLabelsChange: (checked: boolean) => void;
  onDisableWebpagePromptsChange: (checked: boolean) => void;
  onShowDetailedJsonChange: (checked: boolean) => void;
  onTransactionsExtractionChange: (checked: boolean) => void;
  onDocumentExpiryValueChange: (days: number) => void;
  onCaptureFieldsChange?: (fields: VerificationField[]) => void;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  autoDeletionEnabled,
  shareOnlyJson,
  showFieldLabels,
  disableWebpagePrompts,
  showDetailedJson,
  transactionsExtraction,
  documentExpiryValue,
  captureFields = [],
  onAutoDeletionChange,
  onShareOnlyJsonChange,
  onShowFieldLabelsChange,
  onDisableWebpagePromptsChange,
  onShowDetailedJsonChange,
  onTransactionsExtractionChange,
  onDocumentExpiryValueChange,
  onCaptureFieldsChange,
}) => {
  const [shareRequestedFieldsOnly, setShareRequestedFieldsOnly] = useState(false);
  const [localDays, setLocalDays] = useState<string>("");
  const [verificationFields, setVerificationFields] = useState<VerificationField[]>(
    captureFields.length > 0 ? captureFields : [{ message: "", type: "text", hinttext: "", tagfield: "" }]
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Available tag options
  const tagOptions = [
    // Address group
    { value: "address", label: "address (full)", group: "Address", categories: ["address", "all"] },
    { value: "street", label: "street", group: "Address", categories: ["address", "all"] },
    { value: "city", label: "city", group: "Address", categories: ["address", "all"] },
    { value: "state", label: "state", group: "Address", categories: ["address", "all"] },
    { value: "zip", label: "zip code", group: "Address", categories: ["address", "all"] },
    { value: "country", label: "country", group: "Address", categories: ["address", "all"] },
    { value: "billingaddress", label: "billing address (full)", group: "BillingAddress", categories: ["address", "all"] },

    // Account group
    { value: "account_number", label: "account number (multiple)", group: "Account", categories: ["bank", "all"] },
    { value: "iban", label: "iban (multiple)", group: "Account", categories: ["bank", "all"] },
    { value: "routingnumber", label: "routing number", group: "Account", categories: ["bank", "all"] },
    { value: "accounttype", label: "account type", group: "Account", categories: ["bank", "all"] },
    { value: "balance", label: "balance", group: "Account", categories: ["bank", "all"] },

    // Contact group
    { value: "email", label: "email", group: "Contact", categories: ["all"] },
    { value: "phone", label: "phone", group: "Contact", categories: ["all"] },

    // Date group
    { value: "dob", label: "date of birth", group: "Date", categories: ["all"] },
    { value: "date", label: "date", group: "Date", categories: ["all"] },
    { value: "startdate", label: "start date", group: "Date", categories: ["bank", "all"] },
    { value: "enddate", label: "end date", group: "Date", categories: ["bank", "all"] },

    // Entity group
    { value: "entitytype", label: "entity type", group: "Entity", categories: ["all"] },
    { value: "businessname", label: "business name", group: "Entity", categories: ["all"] },

    // Name group
    { value: "name", label: "name (full)", group: "Name", categories: ["all"] },
    { value: "firstname", label: "first name", group: "Name", categories: ["all"] },
    { value: "lastname", label: "last name", group: "Name", categories: ["all"] },

    // Transaction group
    { value: "totalcharges", label: "total charges", group: "Transaction", categories: ["bank", "all"] },
    { value: "referencenumber", label: "reference number", group: "Transaction", categories: ["bank", "all"] },

    // Others group
    { value: "id_number", label: "ID number", group: "Others", categories: ["all"] },
    { value: "custom", label: "custom field", group: "Others", categories: ["all"] },
  ];

  // Group tags by their group property for select dropdown
  const getGroupedTags = () => {
    // Define a sorted array for the groups to maintain a consistent order
    const groupOrder = ["Address", "BillingAddress", "Account", "Contact", "Date", "Entity", "Name", "Transaction", "Others"];

    // Create a map to hold the groups
    const groups: Record<string, typeof tagOptions> = {};

    // Initialize all groups
    groupOrder.forEach((group) => {
      groups[group] = [];
    });

    // Group each tag by its group property
    tagOptions.forEach((tag) => {
      if (groups[tag.group]) {
        groups[tag.group].push(tag);
      }
    });

    // Special sorting for Address group (if needed)
    if (groups["Address"]) {
      groups["Address"].sort((a, b) => {
        return a.value === "address" ? -1 : b.value === "address" ? 1 : 0;
      });
    }

    // Filter out empty groups and sort according to groupOrder
    return groupOrder.map((group) => ({ group, tags: groups[group] })).filter((groupData) => groupData.tags.length > 0);
  };

  // Prepare grouped tags for the dropdown
  const groupedTags = getGroupedTags();

  // Update local state when props change from outside
  useEffect(() => {
    if (documentExpiryValue) {
      setLocalDays(documentExpiryValue.toString());
    }
  }, [documentExpiryValue]);

  useEffect(() => {
    if (captureFields && captureFields.length > 0) {
      setVerificationFields(captureFields);
    }
  }, [captureFields]);

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

  // Handle field change in verification fields
  const handleFieldChange = (index: number, field: string, value: string) => {
    const updatedFields = [...verificationFields];
    updatedFields[index] = { ...updatedFields[index], [field]: value };

    // Validation logic
    const errors = { ...fieldErrors };

    // Validate message (field name)
    if (field === "message" && !value.trim()) {
      errors[`message_${index}`] = "Field name is required";
    } else if (field === "message") {
      delete errors[`message_${index}`];
    }

    // Validate tag field
    if (field === "type" && value !== "trackid") {
      if (!updatedFields[index].tagfield) {
        errors[`tagfield_${index}`] = "Tag is required for this field type";
      }
    } else if (field === "tagfield" && updatedFields[index].type !== "trackid") {
      if (!value) {
        errors[`tagfield_${index}`] = "Tag is required";
      } else {
        delete errors[`tagfield_${index}`];
      }
    }

    setFieldErrors(errors);
    setVerificationFields(updatedFields);

    // Notify parent component if provided
    if (onCaptureFieldsChange) {
      onCaptureFieldsChange(updatedFields);
    }
  };

  // Add new field row
  const addField = () => {
    setVerificationFields([...verificationFields, { message: "", type: "text", hinttext: "", tagfield: "" }]);
  };

  // Remove field row
  const removeField = (index: number) => {
    if (verificationFields.length === 1) {
      return; // Don't remove the last field
    }

    const updatedFields = verificationFields.filter((_, i) => i !== index);

    // Clean up any errors for the removed field
    const updatedErrors = { ...fieldErrors };
    delete updatedErrors[`message_${index}`];
    delete updatedErrors[`tagfield_${index}`];

    setFieldErrors(updatedErrors);
    setVerificationFields(updatedFields);

    // Notify parent component if provided
    if (onCaptureFieldsChange) {
      onCaptureFieldsChange(updatedFields);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto">
      <Accordion type="single" collapsible defaultValue="privacy" className="space-y-4">
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
            <div className="grid grid-cols-12 gap-4 mb-3">
              <div className="col-span-3">
                <Label className="text-sm text-muted-foreground flex items-center">
                  Field label <span className="text-destructive ml-1">*</span>
                </Label>
                <p className="text-xs text-muted-foreground/70">(What to find)</p>
              </div>
              <div className="col-span-2">
                <Label className="text-sm text-muted-foreground">Type</Label>
                <p className="text-xs text-muted-foreground/70">&nbsp;</p>
              </div>
              <div className="col-span-3">
                <Label className="text-sm text-muted-foreground">Sample text</Label>
                <p className="text-xs text-muted-foreground/70">(Hint for data entry in form)</p>
              </div>
              <div className="col-span-3">
                <Label className="text-sm text-muted-foreground">Tag</Label>
                <p className="text-xs text-muted-foreground/70">(For mapping field in json)</p>
              </div>
              <div className="col-span-1">
                <Label className="text-sm text-muted-foreground">&nbsp;</Label>
              </div>
            </div>

            {/* Dynamic Field Rows */}
            <div className="space-y-4 mb-6">
              {verificationFields.map((field, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Field name"
                        value={field.message}
                        onChange={(e) => handleFieldChange(index, "message", e.target.value)}
                        className={fieldErrors[`message_${index}`] ? "border-destructive" : ""}
                      />
                      {fieldErrors[`message_${index}`] && (
                        <p className="text-xs text-destructive mt-1">{fieldErrors[`message_${index}`]}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Select value={field.type} onValueChange={(value) => handleFieldChange(index, "type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">text</SelectItem>
                        <SelectItem value="date">date</SelectItem>
                        <SelectItem value="trackid">trackid</SelectItem>
                        <SelectItem value="number">number</SelectItem>
                        <SelectItem value="email">email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="text"
                      placeholder="Sample help text"
                      value={field.hinttext}
                      onChange={(e) => handleFieldChange(index, "hinttext", e.target.value)}
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="relative">
                      <Select
                        value={field.tagfield || undefined}
                        onValueChange={(value) => handleFieldChange(index, "tagfield", value)}
                        disabled={field.type === "trackid"}
                      >
                        <SelectTrigger className={fieldErrors[`tagfield_${index}`] ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select tag" />
                        </SelectTrigger>
                        <SelectContent>
                          {groupedTags.map((group, groupIndex) => (
                            <div key={`group-${groupIndex}`} className="pb-2">
                              <div className="text-xs text-muted-foreground px-2 py-1.5 font-medium">{group.group}</div>
                              {group.tags.map((tag) => (
                                <SelectItem key={tag.value} value={tag.value}>
                                  {tag.label}
                                </SelectItem>
                              ))}
                              {groupIndex < groupedTags.length - 1 && <div className="h-px bg-muted my-1"></div>}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldErrors[`tagfield_${index}`] && (
                        <p className="text-xs text-destructive mt-1">{fieldErrors[`tagfield_${index}`]}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center h-10">
                    {verificationFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Field Button */}
            <div className="flex justify-end mb-8">
              <Button variant="secondary" onClick={addField} className="shadow-sm transition-colors">
                <Plus className="h-4 w-4 mr-1" /> Add field
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
