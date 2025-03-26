import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Sliders } from "lucide-react";

interface AdvancedTabProps {
  proxyLocation: string;
  allowMethodSwitching: boolean;
  onProxyLocationChange: (value: string) => void;
  onAllowMethodSwitchingChange: (checked: boolean) => void;
  onDelete: () => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({
  proxyLocation,
  allowMethodSwitching,
  onProxyLocationChange,
  onAllowMethodSwitchingChange,
  onDelete,
}) => {
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
                    <SelectItem value="usa">USA only (default)</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
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
                <Switch checked={allowMethodSwitching} onCheckedChange={onAllowMethodSwitchingChange} />
              </div>

              <Separator />

              {/* Delete Button */}
              <div className="flex justify-end">
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
