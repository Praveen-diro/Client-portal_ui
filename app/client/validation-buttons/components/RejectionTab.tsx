import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ban, FileText, Plus, X } from "lucide-react";

interface RejectionTabProps {
  disallowedDocTypes: string[];
  masterFields?: any; // Master fields data from API
  masterFieldsLoading?: boolean; // Loading state for master fields
  masterFieldsError?: string; // Error message for master fields
  onDisallowedDocTypesChange: (value: string[]) => void;
}

const MultiSelect = ({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  children: React.ReactNode;
}) => {
  const formatSelectedValue = (values: string[]) => {
    if (values.length === 0) return placeholder;
    return values
      .map((v) => {
        switch (v) {
          case "loan-statements":
            return "Loan statements";
          case "bank-statement":
            return "Bank Statement";
          case "utility-bill":
            return "Utility Bill";
          case "tax-document":
            return "Tax Document";
          default:
            return v;
        }
      })
      .join(", ");
  };

  return (
    <Select
      value=""
      onValueChange={(newValue) => {
        if (!value.includes(newValue)) {
          onValueChange([...value, newValue]);
        } else {
          onValueChange(value.filter((v) => v !== newValue));
        }
      }}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center justify-between w-full">
          <span className="truncate">{formatSelectedValue(value)}</span>
          {value.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onValueChange([]);
              }}
              className="shrink-0 hover:text-[#00A5B8] ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
};

export const RejectionTab: React.FC<RejectionTabProps> = ({
  disallowedDocTypes,
  masterFields,
  masterFieldsLoading,
  masterFieldsError,
  onDisallowedDocTypesChange,
}) => {
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
                  <MultiSelect
                    value={disallowedDocTypes}
                    onValueChange={onDisallowedDocTypesChange}
                    placeholder="Select document types to disallow"
                  >
                    <SelectItem value="loan-statements">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Loan statements</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank-statement">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Bank Statement</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="utility-bill">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Utility Bill</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tax-document">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Tax Document</span>
                      </div>
                    </SelectItem>
                  </MultiSelect>
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
