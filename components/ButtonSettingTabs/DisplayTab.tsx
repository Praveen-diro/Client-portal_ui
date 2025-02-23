import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Palette, Globe, Settings, FileText, Lock, X, ChevronDown, AlertCircle, ExternalLink } from "lucide-react";

interface DisplayTabProps {
  startWithFullScreen: boolean;
  showPreview: boolean;
  desktopWarning: string;
  desktopCustomMessage: string;
  colorValue: string;
  includeFaqPage: boolean;
  includeQrCode: boolean;
  noPasswordText: string;
  strongPrivacyText: string;
  secureText: string;
  dataPurgeText: string;
  loginText: string;
  instructionText: string;
  successHeading: string;
  successMessage: string;
  failureHeading: string;
  failureMessage: string;
  organizationName: string;
  onStartWithFullScreenChange: (checked: boolean) => void;
  onShowPreviewChange: (checked: boolean) => void;
  onDesktopWarningChange: (value: string) => void;
  onDesktopCustomMessageChange: (value: string) => void;
  onColorValueChange: (value: string) => void;
  onIncludeFaqPageChange: (checked: boolean) => void;
  onIncludeQrCodeChange: (checked: boolean) => void;
  onNoPasswordTextChange: (value: string) => void;
  onStrongPrivacyTextChange: (value: string) => void;
  onSecureTextChange: (value: string) => void;
  onDataPurgeTextChange: (value: string) => void;
  onLoginTextChange: (value: string) => void;
  onInstructionTextChange: (value: string) => void;
  onSuccessHeadingChange: (value: string) => void;
  onSuccessMessageChange: (value: string) => void;
  onFailureHeadingChange: (value: string) => void;
  onFailureMessageChange: (value: string) => void;
  onOrganizationNameChange: (value: string) => void;
}

export const DisplayTab: React.FC<DisplayTabProps> = ({
  startWithFullScreen,
  showPreview,
  desktopWarning,
  desktopCustomMessage,
  colorValue,
  includeFaqPage,
  includeQrCode,
  noPasswordText,
  strongPrivacyText,
  secureText,
  dataPurgeText,
  loginText,
  instructionText,
  successHeading,
  successMessage,
  failureHeading,
  failureMessage,
  organizationName,
  onStartWithFullScreenChange,
  onShowPreviewChange,
  onDesktopWarningChange,
  onDesktopCustomMessageChange,
  onColorValueChange,
  onIncludeFaqPageChange,
  onIncludeQrCodeChange,
  onNoPasswordTextChange,
  onStrongPrivacyTextChange,
  onSecureTextChange,
  onDataPurgeTextChange,
  onLoginTextChange,
  onInstructionTextChange,
  onSuccessHeadingChange,
  onSuccessMessageChange,
  onFailureHeadingChange,
  onFailureMessageChange,
  onOrganizationNameChange,
}) => {
  return (
    <div className="lg:col-span-3">
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">Display Settings</h2>
                <p className="text-sm text-muted-foreground">Configure display and appearance settings</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Browser Settings */}
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Configure browser settings</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="border-t p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Start with full screen</Label>
                    <Switch checked={startWithFullScreen} onCheckedChange={onStartWithFullScreenChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show preview</Label>
                    <Switch checked={showPreview} onCheckedChange={onShowPreviewChange} />
                  </div>
                </div>
              </div>

              {/* Desktop Preference */}
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">Show preference for desktop on mobile devices</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="border-t p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Warning</Label>
                    <Input
                      value={desktopWarning}
                      onChange={(e) => onDesktopWarningChange(e.target.value)}
                      placeholder="Enter warning message"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Custom message</Label>
                    <Input
                      value={desktopCustomMessage}
                      onChange={(e) => onDesktopCustomMessageChange(e.target.value)}
                      placeholder="Enter custom message"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Color Customization */}
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="font-medium">Customize color</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="border-t p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      value={colorValue}
                      onChange={(e) => onColorValueChange(e.target.value)}
                      placeholder="Write color name/code"
                      className="w-full"
                    />
                    <p className="text-sm text-red-500">*Do not select white color code.</p>
                  </div>
                </div>
              </div>

              {/* Certified PDF */}
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Certified PDF</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="border-t p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Include a FAQ page at the end</Label>
                    <Switch checked={includeFaqPage} onCheckedChange={onIncludeFaqPageChange} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Include QR code</Label>
                    <Switch checked={includeQrCode} onCheckedChange={onIncludeQrCodeChange} />
                  </div>
                </div>
              </div>

              {/* Customize messaging for users section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Customize messaging for users</h3>

                {/* Privacy Screen */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span className="font-medium">Privacy screen</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <div className="border-t p-4 space-y-6">
                    {/* No password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>No password</Label>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">0 / 75</span>
                      </div>
                      <Input
                        value={noPasswordText}
                        onChange={(e) => onNoPasswordTextChange(e.target.value)}
                        placeholder="We do not store or share any password or login credentials."
                        maxLength={75}
                        className="w-full"
                      />
                    </div>

                    {/* Strong privacy */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Strong privacy</Label>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">0 / 75</span>
                      </div>
                      <Input
                        value={strongPrivacyText}
                        onChange={(e) => onStrongPrivacyTextChange(e.target.value)}
                        placeholder="We do not share any data with third parties without your consent."
                        maxLength={75}
                        className="w-full"
                      />
                    </div>

                    {/* Secure */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Secure</Label>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">0 / 75</span>
                      </div>
                      <Input
                        value={secureText}
                        onChange={(e) => onSecureTextChange(e.target.value)}
                        placeholder="Your data stays fully encrypted using highest industry standard."
                        maxLength={75}
                        className="w-full"
                      />
                    </div>

                    {/* Data purge */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Data purge</Label>
                          <span className="text-xs text-muted-foreground">(Enable auto deletion from Privacy tab)</span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">0 / 75</span>
                      </div>
                      <Input
                        value={dataPurgeText}
                        onChange={(e) => onDataPurgeTextChange(e.target.value)}
                        placeholder="Your data will be purged following completion of the verification activity."
                        maxLength={75}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-end">
                      <div className="flex items-center gap-2">
                        <img src="/sample-screen.png" alt="Sample screen" className="w-40 h-auto rounded border" />
                        <Label className="text-sm text-muted-foreground">Sample screen</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide Screen */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Guide screen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">shows 3 steps during verification to customers</p>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="border-t p-4 space-y-6">
                    {/* Login text */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Login text</Label>
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">0 / 65</span>
                      </div>
                      <Input
                        value={loginText}
                        onChange={(e) => onLoginTextChange(e.target.value)}
                        placeholder="Please login"
                        maxLength={65}
                        className="w-full"
                      />
                    </div>

                    {/* Instruction text */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Label>Instruction text</Label>
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">0 / 65</span>
                      </div>
                      <Input
                        value={instructionText}
                        onChange={(e) => onInstructionTextChange(e.target.value)}
                        placeholder="Find info/Download your latest bank statement"
                        maxLength={65}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-end">
                      <div className="flex items-center gap-2">
                        <img src="/sample-screen.png" alt="Sample screen" className="w-40 h-auto rounded border" />
                        <Label className="text-sm text-muted-foreground">Sample screen</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exit Screen */}
                <div className="border rounded-lg overflow-hidden mb-4">
                  <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      <span className="font-medium">Exit screen</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <div className="border-t p-4 space-y-6">
                    {/* On success section */}
                    <div className="space-y-4">
                      <h3 className="font-medium">On success</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            value={successHeading}
                            onChange={(e) => onSuccessHeadingChange(e.target.value)}
                            placeholder="Thank You"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Input
                            value={successMessage}
                            onChange={(e) => onSuccessMessageChange(e.target.value)}
                            placeholder="Your verification is complete"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* On failure section */}
                    <div className="space-y-4">
                      <h3 className="font-medium">On failure</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Heading</Label>
                          <Input
                            value={failureHeading}
                            onChange={(e) => onFailureHeadingChange(e.target.value)}
                            placeholder="Sorry"
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Message</Label>
                          <Input
                            value={failureMessage}
                            onChange={(e) => onFailureMessageChange(e.target.value)}
                            placeholder="Unable to verify"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Sample screen</Label>
                      </div>
                      <div className="flex items-center gap-4">
                        <img src="/sample-screen.png" alt="Success screen" className="w-40 h-auto rounded border" />
                        <img src="/sample-screen.png" alt="Failure screen" className="w-40 h-auto rounded border" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Override Organization Details */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span className="font-medium">Override organization details</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <div className="border-t p-4 space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Organization name</Label>
                        <Input
                          value={organizationName}
                          onChange={(e) => onOrganizationNameChange(e.target.value)}
                          placeholder="Enter org. name"
                          className="w-full"
                        />
                      </div>
                      <Button variant="secondary" className="w-full sm:w-auto bg-gray-500 text-white hover:bg-gray-600">
                        Upload Logo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
