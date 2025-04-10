import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Ban, FileText, Plus, Trash, X } from "lucide-react";
import { MultiSelectDropdown, OptionType } from "@/components/ui/multi-select-dropdown";
import { FormEvent, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RejectionTabProps {
  disallowedDocTypes: string[];
  masterFields?: any; // Master fields data from API
  masterFieldsLoading?: boolean; // Loading state for master fields
  masterFieldsError?: string; // Error message for master fields
  onDisallowedDocTypesChange: (value: string[]) => void;
  category?: string; // Added category prop to determine document options
  rejectionReasons?: string[]; // Array of rejection reasons - make optional
  onRejectionReasonsChange: (reasons: string[]) => void; // Callback for when reasons change
}

/**
 * Returns document type options based on the selected category
 */
const getDocumentTypeOptions = (category?: string): OptionType[] => {
  if (category === "address") {
    return [
      { value: "invoice", label: "Invoice" },
      { value: "payment-receipts", label: "Payment receipts" },
      { value: "paystub", label: "Paystub" },
      { value: "connection-letter", label: "Connection letter" },
      { value: "disconnection-notice", label: "Disconnection notice" },
    ];
  } else if (category === "bank") {
    return [
      { value: "bank-statements", label: "Bank statements" },
      { value: "credit-card-statements", label: "Credit card statements" },
      { value: "loan-statements", label: "Loan statements" },
      { value: "mortgage-statements", label: "Mortgage statements" },
      { value: "investment-statements", label: "Investment statements" },
      { value: "certificate-of-deposit-statements", label: "Certificate of deposit (CD) statements" },
    ];
  } else {
    return [];
  }
};

export const RejectionTab: React.FC<RejectionTabProps> = ({
  disallowedDocTypes = [],
  masterFields,
  masterFieldsLoading,
  masterFieldsError,
  onDisallowedDocTypesChange,
  category,
  rejectionReasons = [], // Default to empty array if undefined
  onRejectionReasonsChange,
}) => {
  // State for the add reason dialog
  const [isAddReasonDialogOpen, setIsAddReasonDialogOpen] = useState(false);
  const [newReason, setNewReason] = useState("");

  console.log("category from index", category);
  console.log("rejection reasons:", rejectionReasons);

  // Get document type options based on category
  const documentTypeOptions = useMemo(() => getDocumentTypeOptions(category), [category]);

  // Convert disallowedDocTypes to the format expected by MultiSelectDropdown
  const selectedDocTypes = useMemo(() => {
    return (disallowedDocTypes || []).map((docType) => {
      // Find the matching option to get the label
      const option = documentTypeOptions.find((opt) => opt.value === docType);
      return option ? option : { value: docType, label: docType };
    });
  }, [disallowedDocTypes, documentTypeOptions]);

  // Determine if the dropdown should be disabled
  const isDropdownDisabled = !(category === "bank" || category === "address");

  // Handle the selection change
  const handleDocTypesChange = (newValues: string[]) => {
    console.log("New doc types selected:", newValues);
    onDisallowedDocTypesChange(newValues);
  };

  // Handle deleting a rejection reason
  const handleDeleteReason = (reasonToDelete: string) => {
    const updatedReasons = (rejectionReasons || []).filter((reason) => reason !== reasonToDelete);
    onRejectionReasonsChange(updatedReasons);
  };

  // Handle adding a new rejection reason
  const handleAddReason = (e: FormEvent) => {
    e.preventDefault();
    if (newReason.trim()) {
      const updatedReasons = [...(rejectionReasons || []), newReason.trim()];
      onRejectionReasonsChange(updatedReasons);
      setNewReason("");
      setIsAddReasonDialogOpen(false);
    }
  };

  // Ensure rejectionReasons is always an array
  const safeRejectionReasons = Array.isArray(rejectionReasons) ? rejectionReasons : [];

  return (
    <div className="lg:col-span-3">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Ban className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Rejection Settings</h2>
                <p className="text-sm text-muted-foreground">Configure document rejection rules</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Disallow document types */}
              <div className="space-y-4">
                <Label className="text-base">Disallow document types</Label>
                <div className="space-y-2">
                  <MultiSelectDropdown
                    options={documentTypeOptions}
                    selected={disallowedDocTypes || []}
                    onChange={handleDocTypesChange}
                    placeholder="Select document types to disallow"
                    emptyMessage={isDropdownDisabled ? "Select a valid category first" : "No document types available"}
                    className={isDropdownDisabled ? "opacity-50" : ""}
                    disabled={isDropdownDisabled}
                  />
                  {isDropdownDisabled && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Select bank or address category to enable document selection
                    </p>
                  )}
                </div>
              </div>

              {/* Reasons for rejection */}
              <div className="space-y-4">
                <Label className="text-base">Reasons for rejection for documents received</Label>
                <div className="space-y-3">
                  {safeRejectionReasons.length > 0 ? (
                    safeRejectionReasons.map((reason) => (
                      <div
                        key={reason}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <span>{reason}</span>
                        <button
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                          onClick={() => handleDeleteReason(reason)}
                          aria-label={`Remove ${reason}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No rejection reasons added yet. Add reasons to explain why documents might be rejected.
                    </div>
                  )}
                </div>

                <Button variant="outline" className="mt-4" onClick={() => setIsAddReasonDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add reason
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Reason Dialog */}
      <Dialog open={isAddReasonDialogOpen} onOpenChange={setIsAddReasonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Rejection Reason</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddReason}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="Enter rejection reason"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddReasonDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newReason.trim()}>
                Add Reason
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
