import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Sliders, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { buttonService } from "@/app/services/button.service";
import { toast } from "@/components/ui/use-toast";

interface AdvancedTabProps {
  proxyLocation: string;
  allowMethodSwitching: boolean;
  autoNavigation?: boolean;
  onProxyLocationChange: (value: string) => void;
  onAllowMethodSwitchingChange: (checked: boolean) => void;
  onAutoNavigationChange?: (checked: boolean) => void;
  onDelete: () => void;
  category?: string;
  verificationType?: string;
  buttonId?: string;
  buttonName?: string;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  proxyLocation,
  allowMethodSwitching,
  autoNavigation = false,
  onProxyLocationChange,
  onAllowMethodSwitchingChange,
  onAutoNavigationChange = () => {},
  onDelete,
  category = "",
  verificationType = "",
  buttonId = "",
  buttonName = "this button",
}) => {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Determine if auto navigation toggle should be disabled
  const isAutoNavigationDisabled = category !== "address" || verificationType === "capture" || verificationType === "upload";

  const handleDeleteClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!buttonId) {
      toast({
        title: "Error",
        description: "Button ID is missing. Unable to delete the button.",
        variant: "destructive",
      });
      setIsConfirmationOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await buttonService.deleteButton(buttonId);

      if (response.success) {
        toast({
          title: "Success",
          description: "Button has been successfully deleted.",
          variant: "default",
        });
        // Redirect to the buttons list page after successful deletion
        router.push("/client/validation-buttons");
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete button. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting button:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the button.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsConfirmationOpen(false);
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sliders className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Advanced Settings</h2>
                <p className="text-sm text-muted-foreground">Configure advanced verification settings</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Proxy Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base">Force local proxy based on end-customer device</Label>
                </div>
                <Select value={proxyLocation} onValueChange={onProxyLocationChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select proxy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="defaultproxy">USA only (default)</SelectItem>
                    <SelectItem value="customproxy">Use local country (may be slower)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Method Switching */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow switching between capture/download methods</Label>
                  <p className="text-sm text-muted-foreground">Enable users to switch verification methods</p>
                </div>
                <Switch
                  id="allow-method-switching"
                  checked={allowMethodSwitching}
                  onCheckedChange={onAllowMethodSwitchingChange}
                  disabled={verificationType === "upload"}
                />
              </div>

              <Separator />

              {/* Auto Navigation Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-navigation">Auto navigation</Label>
                  <p className="text-sm text-muted-foreground">Automatically navigate and download documents</p>
                  {isAutoNavigationDisabled && (verificationType === "capture" || verificationType === "upload") && (
                    <p className="text-sm text-red-500">Auto navigation is not available for this verification type</p>
                  )}
                </div>
                <Switch
                  id="auto-navigation"
                  checked={autoNavigation}
                  onCheckedChange={onAutoNavigationChange}
                  disabled={isAutoNavigationDisabled}
                />
              </div>

              <Separator />

              {/* Delete Button */}
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                  onClick={handleDeleteClick}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Button"
        description={`Are you sure you want to delete ${buttonName}? This action cannot be undone and all associated data will be permanently removed.`}
        cancelText="Cancel"
        confirmText="Delete"
        variant="delete"
        isLoading={isDeleting}
        icon={<Trash2 />}
        itemDetail={
          buttonId
            ? {
                label: "Button ID",
                value: buttonId,
              }
            : undefined
        }
      />
    </div>
  );
};
