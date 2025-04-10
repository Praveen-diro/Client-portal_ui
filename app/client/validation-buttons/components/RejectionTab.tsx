import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Ban, FileText, Plus, X } from "lucide-react";
import { MultiSelectDropdown, OptionType } from "@/components/ui/multi-select-dropdown";
import { useMemo } from "react";

interface RejectionTabProps {
  disallowedDocTypes: string[];
  masterFields?: any; // Master fields data from API
  masterFieldsLoading?: boolean; // Loading state for master fields
  masterFieldsError?: string; // Error message for master fields
  onDisallowedDocTypesChange: (value: string[]) => void;
  category?: string; // Added category prop to determine document options
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
  disallowedDocTypes,
  masterFields,
  masterFieldsLoading,
  masterFieldsError,
  onDisallowedDocTypesChange,
  category,
}) => {
  console.log("category from index", category);
  // Get document type options based on category
  const documentTypeOptions = useMemo(() => getDocumentTypeOptions(category), [category]);

  // Convert disallowedDocTypes to the format expected by MultiSelectDropdown
  const selectedDocTypes = useMemo(() => {
    return disallowedDocTypes.map((docType) => {
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
                    selected={disallowedDocTypes}
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
                  {/* Duplicate submission */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span>Duplicate submission</span>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Not a bank statement */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span>Not a bank statement/utility bill</span>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Does not contain full name */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span>Does not contain full name</span>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add reason
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
