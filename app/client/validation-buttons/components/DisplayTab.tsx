import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Palette,
  Globe,
  Settings,
  FileText,
  Lock,
  X,
  AlertCircle,
  ExternalLink,
  Upload,
  MessageSquare,
  Info,
  CheckCircle2,
  XCircle,
  Layers,
  Monitor,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  GanttChart,
  UserCog,
  Briefcase,
  MessageCircle,
  Pencil,
  Trash2,
  Image,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageCropper } from "@/components/ui/image-cropper";

// Define the privacytext object structure type
interface PrivacyText {
  nopassword_heading: string;
  strongtext_heading: string;
  securetext_heading: string;
  datapurge_heading: string;
  nopassword: string;
  strongtext: string;
  securetext: string;
  datapurge: string;
}

interface DisplayTabProps {
  startWithFullScreen: boolean;
  showPreview: boolean;
  mobileview: string;
  desktopCustomMessage: string;
  colorValue: string;
  includeFaqPage: boolean;
  includeQrCode: boolean;
  noPasswordText: string;
  strongPrivacyText: string;
  secureText: string;
  dataPurgeText: string;
  loginText: string;
  gototext: string;
  successHeading: string;
  successMessage: string;
  failureHeading: string;
  failureMessage: string;
  organizationName: string;
  noPasswordHeading?: string;
  strongPrivacyHeading?: string;
  secureTextHeading?: string;
  dataPurgeHeading?: string;
  organizationLogo?: string;
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
  onNoPasswordHeadingChange?: (value: string) => void;
  onStrongPrivacyHeadingChange?: (value: string) => void;
  onSecureTextHeadingChange?: (value: string) => void;
  onDataPurgeHeadingChange?: (value: string) => void;
  onLoginTextChange: (value: string) => void;
  onInstructionTextChange: (value: string) => void;
  onSuccessHeadingChange: (value: string) => void;
  onSuccessMessageChange: (value: string) => void;
  onFailureHeadingChange: (value: string) => void;
  onFailureMessageChange: (value: string) => void;
  onOrganizationNameChange: (value: string) => void;
  onOrganizationLogoChange?: (logo: string | null) => void;
}

export const DisplayTab: React.FC<DisplayTabProps> = ({
  startWithFullScreen,
  showPreview,
  mobileview,
  desktopCustomMessage,
  colorValue,
  includeFaqPage,
  includeQrCode,
  noPasswordText,
  strongPrivacyText,
  secureText,
  dataPurgeText,
  loginText,
  gototext,
  successHeading,
  successMessage,
  failureHeading,
  failureMessage,
  organizationName,
  noPasswordHeading,
  strongPrivacyHeading,
  secureTextHeading,
  dataPurgeHeading,
  organizationLogo,
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
  onNoPasswordHeadingChange,
  onStrongPrivacyHeadingChange,
  onSecureTextHeadingChange,
  onDataPurgeHeadingChange,
  onLoginTextChange,
  onInstructionTextChange,
  onSuccessHeadingChange,
  onSuccessMessageChange,
  onFailureHeadingChange,
  onFailureMessageChange,
  onOrganizationNameChange,
  onOrganizationLogoChange,
}) => {
  // Helper function to handle character count displays
  const characterCount = (text: string | undefined, max: number) => {
    return `${text?.length || 0}/${max}`;
  };

  // State to track toggle values
  const [fullscreenMode, setFullscreenMode] = useState(startWithFullScreen);
  const [previewMode, setPreviewMode] = useState(showPreview);
  const [themeColor, setThemeColor] = useState(colorValue || "#000000");

  // Initialize the privacytext object with defaults or provided values
  const [privacytext, setPrivacytext] = useState<PrivacyText>({
    nopassword_heading: noPasswordHeading || "No password",
    strongtext_heading: strongPrivacyHeading || "Strong privacy",
    securetext_heading: secureTextHeading || "Secure",
    datapurge_heading: dataPurgeHeading || "Data purge",
    nopassword: noPasswordText || "",
    strongtext: strongPrivacyText || "",
    securetext: secureText || "",
    datapurge: dataPurgeText || "",
  });

  // State for editing headings
  const [isEditingHeading, setIsEditingHeading] = useState({
    heading1: false,
    heading2: false,
    heading3: false,
    heading4: false,
  });

  // State for organization logo
  const [logoImage, setLogoImage] = useState<string | null>(organizationLogo || null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with props
  useEffect(() => {
    setFullscreenMode(startWithFullScreen);
    setPreviewMode(showPreview);
    setThemeColor(colorValue || "#000000");

    // Update privacytext state when props change
    setPrivacytext((prev) => ({
      ...prev,
      nopassword_heading: noPasswordHeading || "No password",
      strongtext_heading: strongPrivacyHeading || "Strong privacy",
      securetext_heading: secureTextHeading || "Secure",
      datapurge_heading: dataPurgeHeading || "Data purge",
      nopassword: noPasswordText || "",
      strongtext: strongPrivacyText || "",
      securetext: secureText || "",
      datapurge: dataPurgeText || "",
    }));

    // Update logo state when prop changes
    setLogoImage(organizationLogo || null);
  }, [
    startWithFullScreen,
    showPreview,
    colorValue,
    noPasswordText,
    strongPrivacyText,
    secureText,
    dataPurgeText,
    noPasswordHeading,
    strongPrivacyHeading,
    secureTextHeading,
    dataPurgeHeading,
    organizationLogo,
  ]);

  // Handle toggle changes
  const handleFullscreenToggle = (checked: boolean) => {
    setFullscreenMode(checked);
    onStartWithFullScreenChange(checked);
    // Save to localStorage with the key 'fullscreenmode'
    localStorage.setItem("fullscreenmode", checked ? "true" : "false");
  };

  const handlePreviewToggle = (checked: boolean) => {
    setPreviewMode(checked);
    onShowPreviewChange(checked);
    // Save to localStorage with the key 'showpreview'
    localStorage.setItem("showpreview", checked ? "true" : "false");
  };

  // Handle color change
  const handleColorChange = (value: string) => {
    setThemeColor(value);
    onColorValueChange(value);
    // Save to localStorage with the key 'setcolor'
    localStorage.setItem("setcolor", value);
  };

  // Handle heading edit toggling
  const handleIsEditing = (headingType: string) => {
    setIsEditingHeading((prev) => ({
      ...prev,
      [headingType]: !prev[headingType as keyof typeof prev],
    }));
  };

  // Handle privacy text changes for both headings and content
  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the privacytext state
    setPrivacytext((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Call appropriate prop change handlers to update parent state
    switch (name) {
      case "nopassword":
        onNoPasswordTextChange(value);
        break;
      case "strongtext":
        onStrongPrivacyTextChange(value);
        break;
      case "securetext":
        onSecureTextChange(value);
        break;
      case "datapurge":
        onDataPurgeTextChange(value);
        break;
      case "nopassword_heading":
        if (onNoPasswordHeadingChange) {
          onNoPasswordHeadingChange(value);
        }
        break;
      case "strongtext_heading":
        if (onStrongPrivacyHeadingChange) {
          onStrongPrivacyHeadingChange(value);
        }
        break;
      case "securetext_heading":
        if (onSecureTextHeadingChange) {
          onSecureTextHeadingChange(value);
        }
        break;
      case "datapurge_heading":
        if (onDataPurgeHeadingChange) {
          onDataPurgeHeadingChange(value);
        }
        break;
    }

    // Save to localStorage if needed
    localStorage.setItem(name, value);
  };

  // Constants for character limits
  const MAX_HEADING_LENGTH = 25;
  const MAX_MESSAGE_LENGTH = 75;

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setTempImage(reader.result as string);
        setIsCropperOpen(true);
      };

      reader.readAsDataURL(file);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle crop complete
  const handleCropComplete = (croppedImageUrl: string) => {
    setLogoImage(croppedImageUrl);
    setIsCropperOpen(false);
    setTempImage(null);

    // Call the parent component's handler if available
    if (onOrganizationLogoChange) {
      onOrganizationLogoChange(croppedImageUrl);
    }
  };

  // Handle cropper cancel
  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setTempImage(null);
  };

  // Handle logo delete
  const handleDeleteLogo = () => {
    setLogoImage(null);

    // Call the parent component's handler if available
    if (onOrganizationLogoChange) {
      onOrganizationLogoChange(null);
    }
  };

  return (
    <div className="lg:col-span-3">
      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Configure the appearance and behavior of your verification portal</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Messages</span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Organization</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6 mt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Browser Settings</CardTitle>
                  <CardDescription>Configure how the verification portal behaves in the browser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label className="text-sm font-medium">Start with full screen</Label>
                        <p className="text-xs text-muted-foreground mt-1">Launch verification in fullscreen mode</p>
                      </div>
                      <Switch
                        checked={fullscreenMode}
                        onCheckedChange={handleFullscreenToggle}
                        id="fullscreenmode"
                        name="fullscreenmode"
                        aria-label="Toggle fullscreen mode"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label className="text-sm font-medium">Show preview</Label>
                        <p className="text-xs text-muted-foreground mt-1">Display a preview of the verification process</p>
                      </div>
                      <Switch
                        checked={previewMode}
                        onCheckedChange={handlePreviewToggle}
                        id="showpreview"
                        name="showpreview"
                        aria-label="Toggle preview mode"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Mobile Experience</CardTitle>
                  <CardDescription>Show preference for desktop on mobile devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Warning Message</Label>
                      <Select value={mobileview || "No warning"} onValueChange={onDesktopWarningChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select warning option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No warning">No warning</SelectItem>
                          <SelectItem value="Warning">Warning</SelectItem>
                          <SelectItem value="Disable">Disable</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Choose how to handle mobile device access</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Custom Message</Label>
                      <Input
                        value={desktopCustomMessage || ""}
                        onChange={(e) => onDesktopCustomMessageChange(e.target.value)}
                        placeholder="Enter custom message for mobile users"
                      />
                      <p className="text-xs text-muted-foreground">Additional information for mobile users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Certified PDF Options</CardTitle>
                  <CardDescription>Configure PDF output settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label className="text-sm font-medium">Include FAQ Page</Label>
                        <p className="text-xs text-muted-foreground mt-1">Add a FAQ page at the end of the PDF</p>
                      </div>
                      <Switch checked={includeFaqPage} onCheckedChange={onIncludeFaqPageChange} />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label className="text-sm font-medium">Include QR Code</Label>
                        <p className="text-xs text-muted-foreground mt-1">Add a QR code to the PDF for verification</p>
                      </div>
                      <Switch checked={includeQrCode} onCheckedChange={onIncludeQrCodeChange} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6 mt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Theme Color</CardTitle>
                  <CardDescription>Set the primary color for your verification flow interface</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-md border shadow-sm" style={{ backgroundColor: themeColor }}></div>
                    <div className="flex-1">
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          value={themeColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-12 h-10 p-1 rounded"
                          id="setcolor"
                          name="setcolor"
                        />
                        <Input
                          value={themeColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          placeholder="#000000"
                          className="flex-1"
                          aria-label="Theme color hexadecimal value"
                        />
                      </div>
                      <div className="text-xs text-destructive flex items-center gap-1.5 mt-2">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Do not select white color code (#FFFFFF)
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages" className="space-y-6 mt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Privacy Messages</CardTitle>
                  <CardDescription>Customize privacy information shown to users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* No Password Message */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {isEditingHeading.heading1 ? (
                          <div className="flex-1 space-y-1">
                            <Input
                              type="text"
                              name="nopassword_heading"
                              value={privacytext.nopassword_heading}
                              onChange={handlePrivacyChange}
                              maxLength={MAX_HEADING_LENGTH}
                              placeholder="No password"
                              className={cn(
                                "font-medium",
                                privacytext.nopassword_heading.length >= MAX_HEADING_LENGTH && "border-red-500"
                              )}
                              onBlur={() => handleIsEditing("heading1")}
                              autoFocus
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {characterCount(privacytext.nopassword_heading, MAX_HEADING_LENGTH)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-medium">
                            <span>{privacytext.nopassword_heading || "No password"}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleIsEditing("heading1")}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit heading</span>
                            </Button>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs font-normal">
                          {characterCount(privacytext.nopassword, MAX_MESSAGE_LENGTH)}
                        </Badge>
                      </div>

                      <Input
                        type="text"
                        name="nopassword"
                        value={privacytext.nopassword}
                        onChange={handlePrivacyChange}
                        placeholder="We do not store login credentials"
                        maxLength={MAX_MESSAGE_LENGTH}
                        className={cn(privacytext.nopassword.length >= MAX_MESSAGE_LENGTH && "border-red-500")}
                      />
                    </div>

                    <Separator />

                    {/* Strong Privacy Message */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {isEditingHeading.heading2 ? (
                          <div className="flex-1 space-y-1">
                            <Input
                              type="text"
                              name="strongtext_heading"
                              value={privacytext.strongtext_heading}
                              onChange={handlePrivacyChange}
                              maxLength={MAX_HEADING_LENGTH}
                              placeholder="Strong privacy"
                              className={cn(
                                "font-medium",
                                privacytext.strongtext_heading.length >= MAX_HEADING_LENGTH && "border-red-500"
                              )}
                              onBlur={() => handleIsEditing("heading2")}
                              autoFocus
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {characterCount(privacytext.strongtext_heading, MAX_HEADING_LENGTH)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-medium">
                            <span>{privacytext.strongtext_heading || "Strong privacy"}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleIsEditing("heading2")}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit heading</span>
                            </Button>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs font-normal">
                          {characterCount(privacytext.strongtext, MAX_MESSAGE_LENGTH)}
                        </Badge>
                      </div>

                      <Input
                        type="text"
                        name="strongtext"
                        value={privacytext.strongtext}
                        onChange={handlePrivacyChange}
                        placeholder="We don't share data with third parties"
                        maxLength={MAX_MESSAGE_LENGTH}
                        className={cn(privacytext.strongtext.length >= MAX_MESSAGE_LENGTH && "border-red-500")}
                      />
                    </div>

                    <Separator />

                    {/* Security Message */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {isEditingHeading.heading3 ? (
                          <div className="flex-1 space-y-1">
                            <Input
                              type="text"
                              name="securetext_heading"
                              value={privacytext.securetext_heading}
                              onChange={handlePrivacyChange}
                              maxLength={MAX_HEADING_LENGTH}
                              placeholder="Secure"
                              className={cn(
                                "font-medium",
                                privacytext.securetext_heading.length >= MAX_HEADING_LENGTH && "border-red-500"
                              )}
                              onBlur={() => handleIsEditing("heading3")}
                              autoFocus
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {characterCount(privacytext.securetext_heading, MAX_HEADING_LENGTH)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-medium">
                            <span>{privacytext.securetext_heading || "Secure"}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleIsEditing("heading3")}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit heading</span>
                            </Button>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs font-normal">
                          {characterCount(privacytext.securetext, MAX_MESSAGE_LENGTH)}
                        </Badge>
                      </div>

                      <Input
                        type="text"
                        name="securetext"
                        value={privacytext.securetext}
                        onChange={handlePrivacyChange}
                        placeholder="Your data stays fully encrypted"
                        maxLength={MAX_MESSAGE_LENGTH}
                        className={cn(privacytext.securetext.length >= MAX_MESSAGE_LENGTH && "border-red-500")}
                      />
                    </div>

                    <Separator />

                    {/* Data Retention Message */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        {isEditingHeading.heading4 ? (
                          <div className="flex-1 space-y-1">
                            <Input
                              type="text"
                              name="datapurge_heading"
                              value={privacytext.datapurge_heading}
                              onChange={handlePrivacyChange}
                              maxLength={MAX_HEADING_LENGTH}
                              placeholder="Data purge"
                              className={cn(
                                "font-medium",
                                privacytext.datapurge_heading.length >= MAX_HEADING_LENGTH && "border-red-500"
                              )}
                              onBlur={() => handleIsEditing("heading4")}
                              autoFocus
                            />
                            <div className="text-xs text-muted-foreground text-right">
                              {characterCount(privacytext.datapurge_heading, MAX_HEADING_LENGTH)}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-medium">
                            <span>{privacytext.datapurge_heading || "Data purge"}</span>
                            <span className="text-xs text-muted-foreground">(Enable auto deletion from Privacy tab)</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleIsEditing("heading4")}>
                              <Pencil className="h-3.5 w-3.5" />
                              <span className="sr-only">Edit heading</span>
                            </Button>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs font-normal">
                          {characterCount(privacytext.datapurge, MAX_MESSAGE_LENGTH)}
                        </Badge>
                      </div>

                      <Input
                        type="text"
                        name="datapurge"
                        value={privacytext.datapurge}
                        onChange={handlePrivacyChange}
                        placeholder="Data is purged after verification"
                        maxLength={MAX_MESSAGE_LENGTH}
                        className={cn(privacytext.datapurge.length >= MAX_MESSAGE_LENGTH && "border-red-500")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Guide Screen Messages</CardTitle>
                  <CardDescription>Shows 3 steps during verification to customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Login Instructions</Label>
                        <Badge variant="outline" className="text-xs font-normal">
                          {characterCount(loginText, 65)}
                        </Badge>
                      </div>
                      <Input
                        value={loginText || ""}
                        onChange={(e) => onLoginTextChange(e.target.value)}
                        placeholder="Please login"
                        maxLength={65}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Process Instructions</Label>
                        <Badge variant="outline" className="text-xs font-normal">
                          {characterCount(gototext, 65)}
                        </Badge>
                      </div>
                      <Input
                        value={gototext || ""}
                        onChange={(e) => onInstructionTextChange(e.target.value)}
                        placeholder="Find or download your information"
                        maxLength={65}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Shows during verification steps</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Exit Screens</CardTitle>
                  <CardDescription>Customize success and failure messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Success Screen */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <h4 className="text-sm font-medium">Success Screen</h4>
                      </div>

                      <div className="pl-7 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Heading</Label>
                          <Input
                            value={successHeading || ""}
                            onChange={(e) => onSuccessHeadingChange(e.target.value)}
                            placeholder="Thank You"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Message</Label>
                          <Input
                            value={successMessage || ""}
                            onChange={(e) => onSuccessMessageChange(e.target.value)}
                            placeholder="Verification complete"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Failure Screen */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <h4 className="text-sm font-medium">Failure Screen</h4>
                      </div>

                      <div className="pl-7 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Heading</Label>
                          <Input
                            value={failureHeading || ""}
                            onChange={(e) => onFailureHeadingChange(e.target.value)}
                            placeholder="Sorry"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Message</Label>
                          <Input
                            value={failureMessage || ""}
                            onChange={(e) => onFailureMessageChange(e.target.value)}
                            placeholder="Unable to verify"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organization Tab */}
            <TabsContent value="organization" className="space-y-6 mt-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Override Organization Details</CardTitle>
                  <CardDescription>Customize organization name and logo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Organization Name</Label>
                      <Input
                        value={organizationName || ""}
                        onChange={(e) => onOrganizationNameChange(e.target.value)}
                        placeholder="Enter organization name"
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Organization Logo</Label>

                      <div className="flex flex-col space-y-4">
                        {logoImage ? (
                          <div className="relative border rounded-lg p-2 flex flex-col items-center">
                            <div className="absolute top-2 right-2 flex gap-2">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7 rounded-full"
                                onClick={handleDeleteLogo}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete logo</span>
                              </Button>
                            </div>
                            <img src={logoImage} alt="Organization logo" className="w-full max-h-40 object-contain" />
                            <p className="text-xs text-muted-foreground mt-2">Logo preview</p>
                          </div>
                        ) : (
                          <div className="flex items-start gap-4">
                            <div
                              className="flex-1 border border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Image className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium mb-1">Upload organization logo</p>
                              <p className="text-xs text-muted-foreground text-center">Drag and drop or click to select</p>
                              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                              />
                            </div>
                          </div>
                        )}

                        {logoImage && (
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload New Logo</span>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleFileSelect}
                            />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ImageCropper component (outside tabs but inside the main container) */}
      {tempImage && (
        <ImageCropper
          imageSrc={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={3 / 2}
          open={isCropperOpen}
        />
      )}
    </div>
  );
};
