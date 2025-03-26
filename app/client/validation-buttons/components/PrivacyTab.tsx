import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Shield, Lock, ClipboardList, Eye, FileJson, AlertCircle } from "lucide-react";

interface PrivacyTabProps {
  autoDeletionEnabled: boolean;
  shareOnlyJson: boolean;
  showFieldLabels: boolean;
  disableWebpagePrompts: boolean;
  showDetailedJson: boolean;
  transactionsExtraction: boolean;
  onAutoDeletionChange: (checked: boolean) => void;
  onShareOnlyJsonChange: (checked: boolean) => void;
  onShowFieldLabelsChange: (checked: boolean) => void;
  onDisableWebpagePromptsChange: (checked: boolean) => void;
  onShowDetailedJsonChange: (checked: boolean) => void;
  onTransactionsExtractionChange: (checked: boolean) => void;
}

export const PrivacyTab: React.FC<PrivacyTabProps> = ({
  autoDeletionEnabled,
  shareOnlyJson,
  showFieldLabels,
  disableWebpagePrompts,
  showDetailedJson,
  transactionsExtraction,
  onAutoDeletionChange,
  onShareOnlyJsonChange,
  onShowFieldLabelsChange,
  onDisableWebpagePromptsChange,
  onShowDetailedJsonChange,
  onTransactionsExtractionChange,
}) => {
  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Data Protection Card */}
          <Card className="border-border shadow-sm">
            <div className="bg-muted px-6 py-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Shield className="h-5 w-5" />
                <h3 className="text-lg font-medium">Data Protection Controls</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">Auto Data Deletion</Label>
                      <p className="text-muted-foreground text-sm">Automatically purge data after 7 days</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={autoDeletionEnabled ? "border-border bg-muted" : ""}>
                        {autoDeletionEnabled ? "Active" : "Inactive"}
                      </Badge>
                      <Switch checked={autoDeletionEnabled} onCheckedChange={onAutoDeletionChange} />
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-4 border border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-base font-medium">JSON-Only Mode</Label>
                      <p className="text-muted-foreground text-sm">Share data in JSON format without PDFs</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={shareOnlyJson ? "border-border bg-muted" : ""}>
                        {shareOnlyJson ? "JSON Only" : "JSON + PDF"}
                      </Badge>
                      <Switch checked={shareOnlyJson} onCheckedChange={onShareOnlyJsonChange} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Settings Card */}
          <Card className="border-border shadow-sm">
            <div className="bg-muted px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ClipboardList className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Field Settings</h3>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Field Visibility Section */}
                <div className="bg-muted rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-background p-3 rounded-lg">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Field Visibility</h4>
                      <p className="text-muted-foreground text-sm">Control how fields appear during verification</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Field Labels</Label>
                          <p className="text-muted-foreground text-xs mt-1">Display field names during scanning</p>
                        </div>
                        <Switch checked={showFieldLabels} onCheckedChange={onShowFieldLabelsChange} />
                      </div>
                    </div>

                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Smart Prompts</Label>
                          <p className="text-muted-foreground text-xs mt-1">Auto-hide prompts when detected</p>
                        </div>
                        <Switch checked={disableWebpagePrompts} onCheckedChange={onDisableWebpagePromptsChange} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Extraction Section */}
                <div className="bg-muted rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-background p-3 rounded-lg">
                      <FileJson className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Data Extraction</h4>
                      <p className="text-muted-foreground text-sm">Configure data processing settings</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Detailed JSON Output</Label>
                          <p className="text-muted-foreground text-xs mt-1">Include comprehensive metadata</p>
                        </div>
                        <Switch checked={showDetailedJson} onCheckedChange={onShowDetailedJsonChange} />
                      </div>
                    </div>

                    <div className="bg-background rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Transaction Analysis</Label>
                          <p className="text-muted-foreground text-xs mt-1">Process transaction data</p>
                        </div>
                        <Switch checked={transactionsExtraction} onCheckedChange={onTransactionsExtractionChange} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="border-border shadow-sm">
            <div className="bg-muted px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-base font-medium">Privacy Status</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Data Protection</span>
                  <Badge variant="outline" className="bg-muted">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Encryption</span>
                  <Badge variant="outline" className="bg-muted">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Auto-Delete</span>
                  <Badge variant="outline" className="bg-muted">
                    7 Days
                  </Badge>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  View Security Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
