import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import successpng from "@/public/assets/screenshot/success.png";
import failurepng from "@/public/assets/screenshot/failure.png";
import guidepng from "@/public/assets/screenshot/guide.png";
import privacypng from "@/public/assets/screenshot/privacyScn.png";

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
  Maximize2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ImageCropper } from "@/components/ui/image-cropper";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FancySwitchToggle } from "@/components/ui/fancy-switch-toggle";

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
  verificationMethod?: string;
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
  verificationMethod = "download",
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
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for image preview
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Helper for download/screenshot mode
  const isDownloadOrScreenshot = verificationMethod === "download" || verificationMethod === "screenshot";

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

      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        setLogoError("Image size should not exceed 5MB");
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setLogoError(null); // Clear any previous errors
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
            <TabsList className={`grid ${isDownloadOrScreenshot ? "grid-cols-4" : "grid-cols-3"} mb-6`}>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              {isDownloadOrScreenshot && (
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>Messages</span>
                </TabsTrigger>
              )}
              <TabsTrigger value="organization" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>Organization</span>
              </TabsTrigger>
            </TabsList>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-6 mt-2">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {/* Browser Settings: download/screenshot only */}
                {isDownloadOrScreenshot && (
                  <AccordionItem value="browser-settings" className="border rounded-lg">
                    <AccordionTrigger className="px-6 [&>svg]:w-4 [&>svg]:h-4 [&[data-state=open]]:no-underline hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-muted-foreground" />
                        <div className="text-left">
                          <h4 className="text-sm font-medium">Browser Settings</h4>
                          <p className="text-xs text-muted-foreground">Configure how the verification portal behaves</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <Label className="text-sm font-medium">Start with full screen</Label>
                            <p className="text-xs text-muted-foreground mt-1">Launch verification in fullscreen mode</p>
                          </div>
                          <FancySwitchToggle
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
                          <FancySwitchToggle
                            checked={previewMode}
                            onCheckedChange={handlePreviewToggle}
                            id="showpreview"
                            name="showpreview"
                            aria-label="Toggle preview mode"
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                {/* Mobile Experience: always visible */}
                <AccordionItem value="mobile-experience" className="border rounded-lg">
                  <AccordionTrigger className="px-6 [&>svg]:w-4 [&>svg]:h-4 [&[data-state=open]]:no-underline hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <div className="text-left">
                        <h4 className="text-sm font-medium">Mobile Experience</h4>
                        <p className="text-xs text-muted-foreground">Show preference for desktop on mobile devices</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
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
                  </AccordionContent>
                </AccordionItem>

                {/* Certified PDF Options: always visible */}
                <AccordionItem value="pdf-options" className="border rounded-lg">
                  <AccordionTrigger className="px-6 [&>svg]:w-4 [&>svg]:h-4 [&[data-state=open]]:no-underline hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div className="text-left">
                        <h4 className="text-sm font-medium">Certified PDF Options</h4>
                        <p className="text-xs text-muted-foreground">Configure PDF output settings</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <Label className="text-sm font-medium">Include FAQ Page</Label>
                          <p className="text-xs text-muted-foreground mt-1">Add a FAQ page at the end of the PDF</p>
                        </div>
                        <FancySwitchToggle checked={includeFaqPage} onCheckedChange={onIncludeFaqPageChange} />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <Label className="text-sm font-medium">Include QR Code</Label>
                          <p className="text-xs text-muted-foreground mt-1">Add a QR code to the PDF for verification</p>
                        </div>
                        <FancySwitchToggle checked={includeQrCode} onCheckedChange={onIncludeQrCodeChange} />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6 mt-2">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardDescription>Set the primary color for your verification process</CardDescription>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10">
                      <Palette className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Color Display */}
                    <div className="flex items-center gap-6 p-6 rounded-lg border bg-muted/50">
                      <div className="relative">
                        <div
                          className="w-16 h-16 rounded-lg shadow-lg ring-1 ring-border/50"
                          style={{ backgroundColor: themeColor }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background shadow-sm ring-1 ring-border flex items-center justify-center">
                          <Palette className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Selected Color</p>
                        <div className="flex items-center gap-2">
                          <code className="px-2 py-0.5 rounded bg-muted font-mono text-sm">{themeColor.toUpperCase()}</code>
                          <span className="text-sm text-muted-foreground">
                            This color will be used across your verification process
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Custom Color Input */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Custom Color</Label>
                        <div className="flex gap-3">
                          <div className="relative">
                            <Input
                              type="color"
                              value={themeColor}
                              onChange={(e) => handleColorChange(e.target.value)}
                              className="w-[60px] h-[38px] p-1 rounded-md cursor-pointer border-2"
                              id="setcolor"
                              name="setcolor"
                              title="Choose color"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="relative">
                              <Input
                                value={themeColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                placeholder="#000000"
                                className="pl-9 font-mono w-full"
                              />
                              <div
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded"
                                style={{ backgroundColor: themeColor }}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Warning Message */}
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-destructive">Color Restrictions</p>
                            <p className="text-sm text-muted-foreground">
                              White color (#FFFFFF) is not permitted for visibility reasons. Choose a color that provides good
                              contrast.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Preset Colors */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Preset Colors</Label>
                        <div className="grid grid-cols-8 gap-2">
                          {[
                            "#0ea5e9",
                            "#6366f1",
                            "#8b5cf6",
                            "#ec4899",
                            "#f43f5e",
                            "#ef4444",
                            "#f97316",
                            "#eab308",
                            "#22c55e",
                            "#10b981",
                            "#1e293b",
                            "#334155",
                            "#0f172a",
                            "#18181b",
                            "#64748b",
                            "#94a3b8",
                          ].map((color) => (
                            <button
                              key={color}
                              onClick={() => handleColorChange(color)}
                              className={cn(
                                "h-[38px] rounded-md transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                themeColor === color && "ring-2 ring-primary ring-offset-2"
                              )}
                              style={{ backgroundColor: color }}
                            >
                              <span className="sr-only">Select color {color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab: only show if isDownloadOrScreenshot */}
            {isDownloadOrScreenshot && (
              <TabsContent value="messages" className="space-y-6 mt-2">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {/* Privacy Messages */}
                  <AccordionItem value="privacy-messages" className="border rounded-lg">
                    <AccordionTrigger className="px-6 [&>svg]:w-4 [&>svg]:h-4 [&[data-state=open]]:no-underline hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <div className="text-left">
                          <h4 className="text-sm font-medium">Privacy Messages</h4>
                          <p className="text-xs text-muted-foreground">Customize privacy information shown to users</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="grid gap-6">
                        <div className="grid md:grid-cols-[3fr,1fr] gap-6">
                          {/* Left side - Privacy Messages */}
                          <div className="space-y-6">
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
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleIsEditing("heading1")}
                                    >
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
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleIsEditing("heading2")}
                                    >
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
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleIsEditing("heading3")}
                                    >
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
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={() => handleIsEditing("heading4")}
                                    >
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

                          {/* Right side - Image Preview */}
                          <div className="relative h-full">
                            <div className="sticky top-0 h-full rounded-lg overflow-hidden border bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/10 dark:to-purple-900/30">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button
                                  variant="ghost"
                                  className="p-0 h-auto hover:bg-transparent"
                                  onClick={() => {
                                    setPreviewImage(privacypng.src);
                                    setIsPreviewOpen(true);
                                  }}
                                >
                                  <img
                                    src={privacypng.src}
                                    alt="Privacy screen preview"
                                    className="w-[-webkit-fill-available] h-fit object-contain opacity-90"
                                  />
                                </Button>
                              </div>
                              <div className="absolute top-2 right-2">
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
                                  onClick={() => {
                                    setPreviewImage(privacypng.src);
                                    setIsPreviewOpen(true);
                                  }}
                                >
                                  <Maximize2 className="h-3.5 w-3.5" />
                                  <span className="sr-only">View full screen</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  {/* Guide Screen */}
                  <AccordionItem value="guide-messages" className="border rounded-lg">
                    <AccordionTrigger className="px-6 [&>svg]:w-4 [&>svg]:h-4 [&[data-state=open]]:no-underline hover:no-underline">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <div className="text-left">
                          <h4 className="text-sm font-medium">Guide Screen Messages</h4>
                          <p className="text-xs text-muted-foreground">Shows 3 steps during verification to customers</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="grid gap-5">
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                            {/* Text Inputs */}
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Login Instructions</Label>
                                <Input
                                  value={loginText || ""}
                                  onChange={(e) => onLoginTextChange(e.target.value)}
                                  placeholder="Please login"
                                  maxLength={65}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Process Instructions</Label>
                                <Input
                                  value={gototext || ""}
                                  onChange={(e) => onInstructionTextChange(e.target.value)}
                                  placeholder="Find or download your information"
                                  maxLength={65}
                                />
                                <p className="text-xs text-muted-foreground">Shows during verification steps</p>
                              </div>
                            </div>

                            {/* Image Preview */}
                            <div className="relative">
                              <div className="aspect-[3/2] rounded-lg overflow-hidden border bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/30">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    className="p-0 h-auto hover:bg-transparent"
                                    onClick={() => {
                                      setPreviewImage("/assets/images/guide.png");
                                      setIsPreviewOpen(true);
                                    }}
                                  >
                                    <img
                                      src="/assets/images/guide.png"
                                      alt="Guide screen preview"
                                      className="w-20 h-20 object-contain opacity-90"
                                    />
                                  </Button>
                                </div>
                                <div className="absolute top-2 right-2">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
                                    onClick={() => {
                                      setPreviewImage("/assets/images/guide.png");
                                      setIsPreviewOpen(true);
                                    }}
                                  >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">View full screen</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  {/* Exit Screens */}
                  <AccordionItem value="exit-screens" className="border rounded-lg">
                    <AccordionTrigger className="px-6 [&>svg]:w-4 [&>svg]:h-4 [&[data-state=open]]:no-underline hover:no-underline">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                        <div className="text-left">
                          <h4 className="text-sm font-medium">Exit Screens</h4>
                          <p className="text-xs text-muted-foreground">Customize success and failure messages</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-6">
                        {/* Success Screen */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="text-sm font-medium">Success Screen</h4>
                          </div>

                          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                            {/* Text Inputs */}
                            <div className="space-y-4">
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

                            {/* Image Preview */}
                            <div className="relative">
                              <div className="aspect-[3/2] rounded-lg overflow-hidden border bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/30">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Button
                                    variant="ghost"
                                    className="p-0 h-auto hover:bg-transparent"
                                    onClick={() => {
                                      setPreviewImage(successpng.src);
                                      setIsPreviewOpen(true);
                                    }}
                                  >
                                    <img
                                      src={successpng.src}
                                      alt="Success screen preview"
                                      className="w-20 h-20 object-contain opacity-90"
                                    />
                                  </Button>
                                </div>
                                <div className="absolute top-2 right-2">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
                                    onClick={() => {
                                      setPreviewImage("/assets/images/ic-happy.svg");
                                      setIsPreviewOpen(true);
                                    }}
                                  >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">View full screen</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Failure Screen */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                            <h4 className="text-sm font-medium">Failure Screen</h4>
                          </div>

                          <div className="grid md:grid-cols-[2fr,1fr] gap-6">
                            {/* Text Inputs */}
                            <div className="space-y-4">
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

                            {/* Image Preview */}
                            <div className="relative">
                              <div className="aspect-[3/2] rounded-lg overflow-hidden border bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-900/30">
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-[2px] rounded-lg">
                                    <img
                                      src="/assets/images/ic-sad.svg"
                                      alt="Failure screen preview"
                                      className="w-16 h-16 object-contain"
                                    />
                                    <div className="text-center">
                                      <p className="font-medium text-sm">{failureHeading || "Sorry"}</p>
                                      <p className="text-sm text-muted-foreground">{failureMessage || "Unable to verify"}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute top-2 right-2">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-7 w-7 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
                                    onClick={() => {
                                      setPreviewImage("/assets/images/ic-sad.svg");
                                      setIsPreviewOpen(true);
                                    }}
                                  >
                                    <Maximize2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">View full screen</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            )}

            {/* Organization Tab */}
            <TabsContent value="organization" className="space-y-6 mt-2">
              {/* Organization Profile Card */}
              <Card>
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-semibold">Organization Profile</CardTitle>
                      <CardDescription>Manage your organization's identity and branding settings</CardDescription>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-[1fr,1px,1fr] gap-8">
                    {/* Left Column - Organization Details */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          Basic Information
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="orgName">Organization Name</Label>
                            <div className="relative">
                              <Input
                                id="orgName"
                                value={organizationName || ""}
                                onChange={(e) => onOrganizationNameChange(e.target.value)}
                                placeholder="Enter organization name"
                                className="pl-9"
                              />
                              <Building2 className="h-4 w-4 text-muted-foreground absolute left-3 top-3" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This name will appear on all verification screens and documents
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          Logo Requirements
                        </h3>
                        <div className="rounded-lg border bg-muted/30 p-4">
                          <div className="flex gap-3">
                            <div className="space-y-2">
                              <ul className="grid gap-2 text-xs text-muted-foreground">
                                <li className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  Maximum file size: 5MB
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  Recommended size: 800x400 pixels
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  Transparent background preferred
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  Supported formats: JPG, JPEG, PNG, WEBP
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px bg-border" />

                    {/* Right Column - Logo Management */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                          <Image className="h-4 w-4 text-muted-foreground" />
                          Logo Management
                        </h3>

                        {logoImage ? (
                          <div className="space-y-4">
                            <div className="relative group">
                              <div className="aspect-[3/2] rounded-lg overflow-hidden bg-gradient-to-b from-background/50 to-background/80 p-8 border">
                                <div className="w-full h-full flex items-center justify-center bg-white rounded-md shadow-sm overflow-hidden">
                                  <img src={logoImage} alt="Organization logo" className="max-w-full max-h-full object-contain" />
                                </div>
                              </div>
                              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-2">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-sm bg-background/90 backdrop-blur-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                  >
                                    <Pencil className="h-5 w-5 text-foreground" />
                                    <span className="sr-only">Change logo</span>
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-sm bg-background/90 backdrop-blur-sm"
                                    onClick={handleDeleteLogo}
                                  >
                                    <Trash2 className="h-5 w-5 text-foreground" />
                                    <span className="sr-only">Delete logo</span>
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Image className="h-4 w-4" />
                                <span>Current Logo</span>
                              </div>
                              <Badge variant="secondary" className="font-normal">
                                800x400px recommended
                              </Badge>
                            </div>
                            {logoError && (
                              <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>{logoError}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer">
                              <div className="aspect-[3/2] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-muted/50 transition-all">
                                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                  <Upload className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <div className="text-center px-4">
                                  <p className="font-medium mb-1 group-hover:text-primary transition-colors">
                                    Click to upload your logo
                                  </p>
                                  <p className="text-sm text-muted-foreground">JPG, JPEG, PNG or WEBP</p>
                                </div>
                              </div>
                            </div>
                            {logoError && (
                              <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>{logoError}</span>
                              </div>
                            )}
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleFileSelect}
                        />
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

      {/* Image Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            {previewImage && <img src={previewImage} alt="Screen preview" className="w-full h-full object-contain" />}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close preview</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
