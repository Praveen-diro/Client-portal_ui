"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageContainer } from "@/components/ui/page-container";
import { Sidebar } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Settings,
  Link,
  Globe,
  Lock,
  Bell,
  Palette,
  Ban,
  Sliders,
  AlertCircle,
  FileText,
  ExternalLink,
  Copy,
  Camera,
  Upload,
  X,
  ChevronDown,
  Plus,
  Hash,
  Calendar,
  Trash2,
  FileJson,
  Settings2,
  Eye,
  BellOff,
  BarChart2,
  HelpCircle,
  Play,
  ClipboardList,
  Shield,
  ChartBar,
  Check,
  FileCheck,
  Fingerprint,
  Zap,
  Download,
  History,
  Files,
  Receipt,
  BookOpen,
  MessageSquare,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  setAutoDeletion,
  setShareOnlyJson,
  setShowFieldLabels,
  setDisableWebpagePrompts,
  setShowDetailedJson,
  setTransactionsExtraction,
  addVerificationField,
  removeVerificationField,
  updateVerificationField,
} from "@/app/store/features/privacySlice";
import {
  setEmailToOrganization,
  setIncludePdfInEmail,
  setSubmissionNotificationViaEmail,
  setEmailToOrganizationEnabled,
  setEnableEngagementCallback,
  setAutoJson,
  setCallbackUrl,
  setAddGoogleSheetUrl,
  setEnableSalesforce,
} from "@/app/store/features/triggerSlice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import React from "react";

interface Tab {
  name: string;
  icon: LucideIcon;
}

const TABS: Tab[] = [
  { name: "Basic", icon: Settings },
  { name: "Integration", icon: Link },
  { name: "Privacy", icon: Lock },
  { name: "Triggers & Emails", icon: Bell },
  { name: "Display", icon: Palette },
  { name: "Rejection", icon: Ban },
  { name: "Advanced", icon: Sliders },
];

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
  const [tempValue, setTempValue] = useState("");

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
      value={tempValue}
      onValueChange={(newValue) => {
        if (!value.includes(newValue)) {
          onValueChange([...value, newValue]);
        } else {
          onValueChange(value.filter((v) => v !== newValue));
        }
        setTempValue("");
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

export default function EditButton() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Move all selectors to the top
  const {
    autoDeletionEnabled,
    shareOnlyJson,
    showFieldLabels,
    disableWebpagePrompts,
    showDetailedJson,
    transactionsExtraction,
    verificationFields,
  } = useAppSelector((state) => state.privacy);

  const {
    emailToOrganization,
    includePdfInEmail,
    submissionNotificationViaEmail,
    emailToOrganizationEnabled,
    enableEngagementCallback,
    autoJson,
    callbackUrl,
    addGoogleSheetUrl,
    enableSalesforce,
  } = useAppSelector((state) => state.trigger);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState<string>("download");
  const [directUrlEnabled, setDirectUrlEnabled] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [limitCountryEnabled, setLimitCountryEnabled] = useState<boolean>(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [disallowedDocTypes, setDisallowedDocTypes] = useState<string[]>(["loan-statements"]);
  const [allowSubmissionOverride, setAllowSubmissionOverride] = useState<boolean>(false);
  const [allowMissingStatements, setAllowMissingStatements] = useState<boolean>(false);
  const [triggerExpanded, setTriggerExpanded] = useState<boolean>(false);
  const [redirectionExpanded, setRedirectionExpanded] = useState<boolean>(false);
  const [emailSetupExpanded, setEmailSetupExpanded] = useState<boolean>(false);
  const [customerRemindersExpanded, setCustomerRemindersExpanded] = useState<boolean>(false);
  const [browserSettingsExpanded, setBrowserSettingsExpanded] = useState<boolean>(false);
  const [startWithFullScreen, setStartWithFullScreen] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [desktopPreferenceExpanded, setDesktopPreferenceExpanded] = useState<boolean>(false);
  const [desktopWarning, setDesktopWarning] = useState<string>("");
  const [desktopCustomMessage, setDesktopCustomMessage] = useState<string>(
    "Start this session from your desktop vs. mobile device for an optimized user experience."
  );
  const [colorExpanded, setColorExpanded] = useState<boolean>(false);
  const [certifiedPdfExpanded, setCertifiedPdfExpanded] = useState<boolean>(false);
  const [colorValue, setColorValue] = useState<string>("");
  const [includeFaqPage, setIncludeFaqPage] = useState<boolean>(false);
  const [includeQrCode, setIncludeQrCode] = useState<boolean>(false);
  const [privacyScreenExpanded, setPrivacyScreenExpanded] = useState<boolean>(false);
  const [noPasswordText, setNoPasswordText] = useState<string>("");
  const [strongPrivacyText, setStrongPrivacyText] = useState<string>("");
  const [secureText, setSecureText] = useState<string>("");
  const [dataPurgeText, setDataPurgeText] = useState<string>("");
  const [guideScreenExpanded, setGuideScreenExpanded] = useState<boolean>(false);
  const [loginText, setLoginText] = useState<string>("");
  const [instructionText, setInstructionText] = useState<string>("");
  const [exitScreenExpanded, setExitScreenExpanded] = useState<boolean>(false);
  const [successHeading, setSuccessHeading] = useState<string>("Thank You");
  const [successMessage, setSuccessMessage] = useState<string>("Your verification is complete");
  const [failureHeading, setFailureHeading] = useState<string>("Sorry");
  const [failureMessage, setFailureMessage] = useState<string>("Unable to verify");
  const [organizationDetailsExpanded, setOrganizationDetailsExpanded] = useState<boolean>(false);
  const [organizationName, setOrganizationName] = useState<string>("");

  const handleVerificationMethodChange = (value: string) => {
    setVerificationMethod(value);
    // Reset related states when verification method changes
    setDirectUrlEnabled(false);
    setSelectedCountry("");
  };

  const handleDirectUrlChange = (checked: boolean) => {
    setDirectUrlEnabled(checked);
    if (!checked) {
      setSelectedCountry("");
    }
  };

  const renderTabIcon = (tab: Tab) => {
    const TabIcon = tab.icon;
    return <TabIcon className="h-4 w-4" />;
  };

  const renderIntegrationContent = () => {
    if (verificationMethod === "download") {
      return (
        <>
          {/* Widget Integration for Download */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-all">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">Recommended</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Download Integration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Document download workflow</p>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Secure document download with verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Automated document processing and validation</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Sample Flow
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Link Integration for Download */}
          <Card className="border-2 hover:border-purple-500 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Link className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Integration Links</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct download integration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Verification Link</Label>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                      <code className="text-sm text-gray-800 dark:text-gray-200">
                        https://verification.example.com/download/123456
                      </code>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Iframe Link</Label>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                      <code className="text-sm text-gray-800 dark:text-gray-200">
                        https://verification.example.com/iframe/download/123456
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else if (verificationMethod === "smart-upload") {
      return (
        <>
          {/* Widget Integration for Smart Upload */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-all">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">Recommended</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smart Upload Widget</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">AI-powered document upload</p>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Intelligent document classification and validation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Real-time document quality checks</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Link Integration for Smart Upload */}
          <Card className="border-2 hover:border-purple-500 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Link className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Integration Link</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct upload integration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Upload Portal Link</Label>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      https://verification.example.com/upload/123456
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else if (verificationMethod === "screenshot") {
      return (
        <>
          {/* Widget Integration for Screenshot */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-all">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">Recommended</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Screenshot Widget</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Capture and verify screenshots</p>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Built-in screenshot capture tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Automatic screenshot validation</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview Widget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Link Integration for Screenshot */}
          <Card className="border-2 hover:border-purple-500 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <Link className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Integration Link</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct screenshot capture</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Screenshot Portal Link</Label>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      https://verification.example.com/screenshot/123456
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50/30 via-gray-100/30 to-gray-50/30 dark:from-gray-900/30 dark:via-gray-800/30 dark:to-gray-900/30">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <div className="min-h-screen">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-6">
              <div className="h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                      Button Configuration
                    </h1>
                    <p className="text-sm text-muted-foreground">Configure verification settings and permissions</p>
                  </div>
                </div>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all">
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-6 py-8">
            <Tabs value={activeTab.toString()} onValueChange={(value) => setActiveTab(parseInt(value))} className="space-y-8">
              <div className="relative">
                <TabsList className="relative z-10 bg-white dark:bg-gray-900 p-1 rounded-xl shadow-lg">
                  {TABS.map((tab, index) => (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className="relative data-[state=active]:text-primary data-[state=active]:bg-primary/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 px-1">
                        {renderTabIcon(tab)}
                        <span>{tab.name}</span>
                      </div>
                      {activeTab === index && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="relative" style={{ minHeight: "400px" }}>
                <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  >
                    {/* Existing tab content */}
                    {activeTab === 0 && (
                      <>
                        {/* Basic tab content */}
                        <div className="lg:col-span-2 space-y-6">
                          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                              <div className="space-y-8">
                                <div>
                                  <div className="flex items-center gap-2 mb-6">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">Basic Settings</h2>
                                  </div>
                                  <div className="grid gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">Button Name</Label>
                                        <Input
                                          className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                                          placeholder="Enter button name"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">Verification method</Label>
                                        <Select value={verificationMethod} onValueChange={handleVerificationMethodChange}>
                                          <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select verification method" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="download">
                                              <div className="flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Download
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="screenshot">
                                              <div className="flex items-center gap-2">
                                                <Camera className="h-4 w-4" />
                                                Capture screenshot
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="smart-upload">
                                              <div className="flex items-center gap-2">
                                                <Upload className="h-4 w-4" />
                                                Smart upload
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">Verification Category</Label>
                                        <Select>
                                          <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="address">
                                              <div className="flex items-center gap-2">
                                                <Globe className="h-4 w-4" />
                                                <span>Address</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="bank">
                                              <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>Bank</span>
                                              </div>
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">Sub Category</Label>
                                        <Select>
                                          <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Select sub-category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="download">Download</SelectItem>
                                            <SelectItem value="upload">Upload</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Separator className="my-8" />

                                <div>
                                  <div className="flex items-center gap-2 mb-6">
                                    <Link className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">URL Configuration</h2>
                                  </div>
                                  <div className="space-y-4">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <Switch checked={directUrlEnabled} onCheckedChange={handleDirectUrlChange} />
                                        <Label>Directly open a fixed URL</Label>
                                      </div>

                                      {directUrlEnabled && (
                                        <div className="space-y-2">
                                          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                                            <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-primary/20">
                                              <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="af">
                                                <div className="flex items-center gap-2">
                                                  <span>🇦🇫</span>
                                                  <span>Afghanistan</span>
                                                </div>
                                              </SelectItem>
                                              {/* Add other countries similarly */}
                                            </SelectContent>
                                          </Select>

                                          {selectedCountry && (
                                            <Select>
                                              <SelectTrigger className="w-full transition-all focus:ring-2 focus:ring-primary/20">
                                                <SelectValue placeholder="Select Link" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="link1">Link 1</SelectItem>
                                                <SelectItem value="link2">Link 2</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Switch />
                                      <Label>Show Google search</Label>
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={limitCountryEnabled}
                                          onCheckedChange={(checked) => {
                                            setLimitCountryEnabled(checked);
                                            if (!checked) {
                                              setSelectedCountries([]); // Reset selected countries when toggle is turned off
                                            }
                                          }}
                                        />
                                        <Label>Limit country</Label>
                                      </div>

                                      {limitCountryEnabled && (
                                        <div className="space-y-2">
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {selectedCountries.map((country) => (
                                              <div
                                                key={country}
                                                className="flex items-center gap-1 bg-[#00A5B8]/10 text-[#00A5B8] px-2 py-0.5 rounded text-sm"
                                              >
                                                {country}
                                                <button
                                                  onClick={() =>
                                                    setSelectedCountries(selectedCountries.filter((c) => c !== country))
                                                  }
                                                  className="hover:text-[#00A5B8]/80"
                                                >
                                                  ×
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                          <MultiSelect
                                            value={selectedCountries}
                                            onValueChange={setSelectedCountries}
                                            placeholder="Select countries"
                                          >
                                            <SelectItem value="albania">
                                              <div className="flex items-center gap-2">
                                                <span>🇦🇱</span>
                                                <span>Albania</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="american-samoa">
                                              <div className="flex items-center gap-2">
                                                <span>🇦🇸</span>
                                                <span>American Samoa</span>
                                              </div>
                                            </SelectItem>
                                            <SelectItem value="afghanistan">
                                              <div className="flex items-center gap-2">
                                                <span>🇦🇫</span>
                                                <span>Afghanistan</span>
                                              </div>
                                            </SelectItem>
                                          </MultiSelect>
                                        </div>
                                      )}
                                    </div>

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Label>Invite link expiry</Label>
                                        <p className="text-sm text-muted-foreground">default is 30 days</p>
                                      </div>
                                      <Input
                                        type="number"
                                        className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                                        placeholder="Enter session expiry in hours"
                                        defaultValue="720"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h2 className="text-xl font-semibold mb-4">Multi-download & Live feedback configuration</h2>
                                  <div className="space-y-4">
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-2">
                                        <Switch checked={allowSubmissionOverride} onCheckedChange={setAllowSubmissionOverride} />
                                        <Label>Allow submission by overriding below conditions</Label>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <Switch checked={allowMissingStatements} onCheckedChange={setAllowMissingStatements} />
                                        <Label>Allow missing statements within the expected period</Label>
                                      </div>

                                      <div className="space-y-2 pl-8">
                                        <Label>Expected number of days within the valid date range</Label>
                                        <Input
                                          type="number"
                                          className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                                          placeholder="Enter number of days"
                                          defaultValue="3434"
                                        />
                                      </div>

                                      <div className="space-y-2 pl-8">
                                        <Label>Valid date range (in days)</Label>
                                        <p className="text-sm text-muted-foreground">
                                          (Requested period: 26 Dec 7380 - 22 Feb 2025 i.e. approx 112604.4 months)
                                        </p>
                                        <Input
                                          type="number"
                                          className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                                          placeholder="Enter date range"
                                          defaultValue="3434434"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-6">
                              <h3 className="font-medium mb-4 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-primary" />
                                Button Details
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Status</span>
                                  <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                                    Active
                                  </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Created</span>
                                  <span className="font-medium">2 days ago</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Last modified</span>
                                  <span className="font-medium">1 hour ago</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-muted-foreground">Button ID</span>
                                  <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                                    {params.id}
                                  </code>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardContent className="pt-6">
                              <h3 className="font-medium mb-4">Verification Settings</h3>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between py-3">
                                  <div className="space-y-0.5">
                                    <Label>Allow Resubmission</Label>
                                    <p className="text-sm text-muted-foreground">Enable resubmission with same track ID</p>
                                  </div>
                                  <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-3">
                                  <div className="space-y-0.5">
                                    <Label>Multi-Download</Label>
                                    <p className="text-sm text-muted-foreground">Allow multiple downloads</p>
                                  </div>
                                  <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-3">
                                  <div className="space-y-0.5">
                                    <Label>Live Feedback</Label>
                                    <p className="text-sm text-muted-foreground">Enable real-time verification feedback</p>
                                  </div>
                                  <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between py-3">
                                  <div className="space-y-0.5">
                                    <Label>Image Upload</Label>
                                    <p className="text-sm text-muted-foreground">Allow image uploads during verification</p>
                                  </div>
                                  <Switch />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}

                    {activeTab === 1 && (
                      <>
                        {/* Integration tab content */}
                        <div className="lg:col-span-3 space-y-6">
                          {/* Quick Actions */}
                          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div>
                              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Quick Integration</h3>
                              <p className="text-sm text-blue-700 dark:text-blue-300">Get started with our pre-built solutions</p>
                            </div>
                            <div className="flex gap-3">
                              <Button
                                variant="outline"
                                className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                                onClick={() => window.open("#", "_blank")}
                              >
                                <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                View Documentation
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => window.open("#", "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Quick Start Guide
                              </Button>
                            </div>
                          </div>

                          {/* Integration Methods */}
                          <div className="grid md:grid-cols-2 gap-6">{renderIntegrationContent()}</div>

                          {/* Integration Resources */}
                          <Card>
                            <CardContent className="p-6">
                              <h3 className="font-semibold text-lg mb-4">Additional Resources</h3>
                              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <Button
                                  variant="outline"
                                  className="justify-start h-auto p-4"
                                  onClick={() => window.open("#", "_blank")}
                                >
                                  <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                                    <div className="text-left">
                                      <div className="font-medium">API Reference</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-300">Complete API documentation</div>
                                    </div>
                                  </div>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start h-auto p-4"
                                  onClick={() => window.open("#", "_blank")}
                                >
                                  <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                                    <div className="text-left">
                                      <div className="font-medium">Code Examples</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-300">Sample implementations</div>
                                    </div>
                                  </div>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="justify-start h-auto p-4"
                                  onClick={() => window.open("#", "_blank")}
                                >
                                  <div className="flex items-start gap-3">
                                    <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                                    <div className="text-left">
                                      <div className="font-medium">Webhooks Guide</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-300">Event notifications setup</div>
                                    </div>
                                  </div>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )}

                    {activeTab === 2 && (
                      <>
                        {/* Privacy tab content */}
                        <div className="lg:col-span-3">
                          {/* Header Banner */}
                          <div className="bg-background/95 border border-border rounded-2xl p-8 mb-8">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="bg-muted p-4 rounded-xl">
                                  <Lock className="h-8 w-8 text-foreground" />
                                </div>
                                <div>
                                  <h2 className="text-2xl font-semibold text-foreground">Privacy & Data Protection</h2>
                                  <p className="text-muted-foreground mt-1">Configure data handling and security settings</p>
                                </div>
                              </div>
                              <div className="flex gap-3">
                                <Button variant="outline">
                                  <Shield className="h-4 w-4 mr-2" />
                                  View Policy
                                </Button>
                                <Button>
                                  <Lock className="h-4 w-4 mr-2" />
                                  Security Settings
                                </Button>
                              </div>
                            </div>
                          </div>

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
                                          <Badge
                                            variant="outline"
                                            className={autoDeletionEnabled ? "border-border bg-muted" : ""}
                                          >
                                            {autoDeletionEnabled ? "Active" : "Inactive"}
                                          </Badge>
                                          <Switch
                                            checked={autoDeletionEnabled}
                                            onCheckedChange={(checked) => dispatch(setAutoDeletion({ enabled: checked }))}
                                          />
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
                                          <Switch
                                            checked={shareOnlyJson}
                                            onCheckedChange={(checked) => dispatch(setShareOnlyJson(checked))}
                                          />
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
                                    <Button
                                      onClick={() =>
                                        dispatch(addVerificationField({ fieldLabel: "", type: "text", sampleText: "", tag: "" }))
                                      }
                                    >
                                      <Plus className="h-4 w-4 mr-2" />
                                      Add Field
                                    </Button>
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
                                          <p className="text-muted-foreground text-sm">
                                            Control how fields appear during verification
                                          </p>
                                        </div>
                                      </div>

                                      <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="bg-background rounded-xl p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <Label className="text-sm font-medium">Show Field Labels</Label>
                                              <p className="text-muted-foreground text-xs mt-1">
                                                Display field names during scanning
                                              </p>
                                            </div>
                                            <Switch
                                              checked={showFieldLabels}
                                              onCheckedChange={(checked) => dispatch(setShowFieldLabels(checked))}
                                            />
                                          </div>
                                        </div>

                                        <div className="bg-background rounded-xl p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <Label className="text-sm font-medium">Smart Prompts</Label>
                                              <p className="text-muted-foreground text-xs mt-1">
                                                Auto-hide prompts when detected
                                              </p>
                                            </div>
                                            <Switch
                                              checked={disableWebpagePrompts}
                                              onCheckedChange={(checked) => dispatch(setDisableWebpagePrompts(checked))}
                                            />
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
                                            <Switch
                                              checked={showDetailedJson}
                                              onCheckedChange={(checked) => dispatch(setShowDetailedJson(checked))}
                                            />
                                          </div>
                                        </div>

                                        <div className="bg-background rounded-xl p-4">
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <Label className="text-sm font-medium">Transaction Analysis</Label>
                                              <p className="text-muted-foreground text-xs mt-1">Process transaction data</p>
                                            </div>
                                            <Switch
                                              checked={transactionsExtraction}
                                              onCheckedChange={(checked) => dispatch(setTransactionsExtraction(checked))}
                                            />
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
                      </>
                    )}

                    {activeTab === 3 && (
                      <>
                        {/* Triggers & Emails tab content */}
                        <div className="lg:col-span-3">
                          <div className="space-y-6">
                            {/* After Verification Card */}
                            <Card className="shadow-sm">
                              <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                  <Bell className="h-5 w-5 text-primary" />
                                  <div>
                                    <h2 className="text-xl font-semibold">After verification</h2>
                                    <p className="text-sm text-muted-foreground">
                                      Configure actions to be taken after verification
                                    </p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  {/* Trigger Section */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setTriggerExpanded(!triggerExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <span className="font-medium">Trigger</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${triggerExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>

                                    {triggerExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <div className="space-y-2">
                                          <Label>Email to the organization</Label>
                                          <div className="flex items-center gap-2">
                                            <Input
                                              value={emailToOrganization}
                                              onChange={(e) => dispatch(setEmailToOrganization(e.target.value))}
                                              placeholder="<trackid>@yourdomain.com"
                                              className="flex-1"
                                            />
                                            <Button variant="outline" className="whitespace-nowrap">
                                              CRM integration <span className="ml-1 text-xs">ℹ️</span>
                                            </Button>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Include pdf in email</Label>
                                          <Switch
                                            checked={includePdfInEmail}
                                            onCheckedChange={(checked) => dispatch(setIncludePdfInEmail(checked))}
                                          />
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Submission notification via email</Label>
                                          <Switch
                                            checked={submissionNotificationViaEmail}
                                            onCheckedChange={(checked) => dispatch(setSubmissionNotificationViaEmail(checked))}
                                          />
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Email to organization</Label>
                                          <Switch
                                            checked={emailToOrganizationEnabled}
                                            onCheckedChange={(checked) => dispatch(setEmailToOrganizationEnabled(checked))}
                                          />
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Enable engagement callback</Label>
                                          <Switch
                                            checked={enableEngagementCallback}
                                            onCheckedChange={(checked) => dispatch(setEnableEngagementCallback(checked))}
                                          />
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Auto JSON</Label>
                                          <Switch
                                            checked={autoJson}
                                            onCheckedChange={(checked) => dispatch(setAutoJson(checked))}
                                          />
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Override default callback url</Label>
                                          <div className="flex gap-2">
                                            <Input
                                              value={callbackUrl}
                                              onChange={(e) => dispatch(setCallbackUrl(e.target.value))}
                                              placeholder="Enter callback url"
                                              className="flex-1"
                                            />
                                            <Button variant="outline">Test custom callback url</Button>
                                          </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Add google sheet URL</Label>
                                          <Switch
                                            checked={addGoogleSheetUrl}
                                            onCheckedChange={(checked) => dispatch(setAddGoogleSheetUrl(checked))}
                                          />
                                        </div>

                                        <div className="flex items-center justify-between">
                                          <Label>Enable Salesforce</Label>
                                          <Switch
                                            checked={enableSalesforce}
                                            onCheckedChange={(checked) => dispatch(setEnableSalesforce(checked))}
                                          />
                                        </div>

                                        <div>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start gap-2 text-orange-500 border-orange-200 hover:bg-orange-50"
                                          >
                                            <div className="p-1 bg-orange-100 rounded">
                                              <FileText className="h-4 w-4" />
                                            </div>
                                            Integrate with Zapier
                                            <span className="ml-1 text-xs">ℹ️</span>
                                          </Button>
                                          <p className="text-xs text-muted-foreground mt-1 ml-1">
                                            Using Zapier you can generate a webhook URL and integrate our callbacks with your
                                            workflow.
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Redirection Section */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setRedirectionExpanded(!redirectionExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="font-medium">Redirection</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${redirectionExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>

                                    {redirectionExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <p className="text-sm text-muted-foreground">after verification is complete / on exit</p>
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Label>Redirect url</Label>
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                          </div>
                                          <Input placeholder="Enter redirect url" className="w-full" />
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Redirect message</Label>
                                          <Input placeholder="You are redirecting to" className="w-full" />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Email Setup Card */}
                            <Card className="shadow-sm">
                              <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-6">
                                  <FileText className="h-5 w-5 text-primary" />
                                  <div>
                                    <h2 className="text-xl font-semibold">Email setup</h2>
                                    <p className="text-sm text-muted-foreground">Configure email settings and reminders</p>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  {/* Email SMTP Setup Section */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setEmailSetupExpanded(!emailSetupExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="font-medium">Email SMTP setup</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${emailSetupExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>

                                    {emailSetupExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label>SMTP username</Label>
                                            <p className="text-xs text-muted-foreground">(to your _email@gmail.com)</p>
                                            <Input placeholder="username" className="w-full" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>SMTP password</Label>
                                            <p className="text-xs text-muted-foreground">(to your password)</p>
                                            <Input type="password" placeholder="password" className="w-full" />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-2">
                                            <Label>SMTP server</Label>
                                            <Input placeholder="smtp.serveraddress.com" className="w-full" />
                                          </div>
                                          <div className="space-y-2">
                                            <Label>SMTP port</Label>
                                            <Input placeholder="8080" className="w-full" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Customer Reminders Section */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setCustomerRemindersExpanded(!customerRemindersExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <span className="font-medium">Email reminder</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                          customerRemindersExpanded ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>

                                    {customerRemindersExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <p className="text-sm text-muted-foreground">configure emails to be sent to customers</p>

                                        <div className="border rounded-lg">
                                          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50">
                                            <div className="text-sm font-medium">Trigger</div>
                                            <div className="text-sm font-medium">Additional filter</div>
                                            <div className="text-sm font-medium">Templates</div>
                                            <div className="text-sm font-medium">Customer</div>
                                            <div className="text-sm font-medium">Organization</div>
                                            <div className="text-sm font-medium">Delay(days)</div>
                                            <div className="text-sm font-medium">Activate</div>
                                          </div>

                                          <div className="border-t">
                                            <div className="grid grid-cols-7 gap-4 p-4">
                                              <div>
                                                <Select>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Submission completed" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="submission_completed">Submission completed</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div>
                                                <Select>
                                                  <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    <SelectItem value="option1">Option 1</SelectItem>
                                                    <SelectItem value="option2">Option 2</SelectItem>
                                                  </SelectContent>
                                                </Select>
                                              </div>
                                              <div>
                                                <Button variant="outline" size="sm" className="text-blue-500">
                                                  Edit
                                                </Button>
                                              </div>
                                              <div>
                                                <Switch />
                                              </div>
                                              <div>
                                                <Switch />
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Input type="number" className="w-20" defaultValue="0" />
                                                <span className="text-sm text-muted-foreground">0 hours</span>
                                              </div>
                                              <div>
                                                <Switch />
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="flex justify-end">
                                          <Button variant="outline" className="gap-2">
                                            <span className="text-lg">+</span> Add reminder
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === 4 && (
                      <>
                        {/* Display tab content */}
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
                                    <button
                                      onClick={() => setBrowserSettingsExpanded(!browserSettingsExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <span className="font-medium">Configure browser settings</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${browserSettingsExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                    {browserSettingsExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <Label>Start with full screen</Label>
                                          <Switch checked={startWithFullScreen} onCheckedChange={setStartWithFullScreen} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <Label>Show preview</Label>
                                          <Switch checked={showPreview} onCheckedChange={setShowPreview} />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Desktop Preference */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setDesktopPreferenceExpanded(!desktopPreferenceExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Settings className="h-4 w-4" />
                                        <span className="font-medium">Show preference for desktop on mobile devices</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                          desktopPreferenceExpanded ? "rotate-180" : ""
                                        }`}
                                      />
                                    </button>
                                    {desktopPreferenceExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <div className="space-y-2">
                                          <Label>Warning</Label>
                                          <Input
                                            value={desktopWarning}
                                            onChange={(e) => setDesktopWarning(e.target.value)}
                                            placeholder="Enter warning message"
                                            className="w-full"
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label>Custom message</Label>
                                          <Input
                                            value={desktopCustomMessage}
                                            onChange={(e) => setDesktopCustomMessage(e.target.value)}
                                            placeholder="Enter custom message"
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Color Customization */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setColorExpanded(!colorExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Palette className="h-4 w-4" />
                                        <span className="font-medium">Customize color</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${colorExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                    {colorExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <div className="space-y-2">
                                          <Label>Color</Label>
                                          <Input
                                            value={colorValue}
                                            onChange={(e) => setColorValue(e.target.value)}
                                            placeholder="Write color name/code"
                                            className="w-full"
                                          />
                                          <p className="text-sm text-red-500">*Do not select white color code.</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Certified PDF */}
                                  <div className="border rounded-lg overflow-hidden">
                                    <button
                                      onClick={() => setCertifiedPdfExpanded(!certifiedPdfExpanded)}
                                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        <span className="font-medium">Certified PDF</span>
                                      </div>
                                      <ChevronDown
                                        className={`h-4 w-4 transition-transform ${certifiedPdfExpanded ? "rotate-180" : ""}`}
                                      />
                                    </button>
                                    {certifiedPdfExpanded && (
                                      <div className="border-t p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                          <Label>Include a FAQ page at the end</Label>
                                          <Switch checked={includeFaqPage} onCheckedChange={setIncludeFaqPage} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <Label>Include QR code</Label>
                                          <Switch checked={includeQrCode} onCheckedChange={setIncludeQrCode} />
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Customize messaging for users section */}
                                  <div className="mt-8">
                                    <h3 className="text-lg font-medium mb-4">Customize messaging for users</h3>

                                    {/* Privacy Screen */}
                                    <div className="border rounded-lg overflow-hidden mb-4">
                                      <button
                                        onClick={() => setPrivacyScreenExpanded(!privacyScreenExpanded)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Lock className="h-4 w-4" />
                                          <span className="font-medium">Privacy screen</span>
                                        </div>
                                        <ChevronDown
                                          className={`h-4 w-4 transition-transform ${privacyScreenExpanded ? "rotate-180" : ""}`}
                                        />
                                      </button>
                                      {privacyScreenExpanded && (
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
                                              onChange={(e) => setNoPasswordText(e.target.value)}
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
                                              onChange={(e) => setStrongPrivacyText(e.target.value)}
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
                                              onChange={(e) => setSecureText(e.target.value)}
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
                                                <span className="text-xs text-muted-foreground">
                                                  (Enable auto deletion from Privacy tab)
                                                </span>
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                              </div>
                                              <span className="text-sm text-muted-foreground">0 / 75</span>
                                            </div>
                                            <Input
                                              value={dataPurgeText}
                                              onChange={(e) => setDataPurgeText(e.target.value)}
                                              placeholder="Your data will be purged following completion of the verification activity."
                                              maxLength={75}
                                              className="w-full"
                                            />
                                          </div>

                                          <div className="flex justify-end">
                                            <div className="flex items-center gap-2">
                                              <img
                                                src="/sample-screen.png"
                                                alt="Sample screen"
                                                className="w-40 h-auto rounded border"
                                              />
                                              <Label className="text-sm text-muted-foreground">Sample screen</Label>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Guide Screen */}
                                    <div className="border rounded-lg overflow-hidden mb-4">
                                      <button
                                        onClick={() => setGuideScreenExpanded(!guideScreenExpanded)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                      >
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4" />
                                          <span className="font-medium">Guide screen</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm text-muted-foreground">
                                            shows 3 steps during verification to customers
                                          </p>
                                          <ChevronDown
                                            className={`h-4 w-4 transition-transform ${guideScreenExpanded ? "rotate-180" : ""}`}
                                          />
                                        </div>
                                      </button>
                                      {guideScreenExpanded && (
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
                                              onChange={(e) => setLoginText(e.target.value)}
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
                                              onChange={(e) => setInstructionText(e.target.value)}
                                              placeholder="Find info/Download your latest bank statement"
                                              maxLength={65}
                                              className="w-full"
                                            />
                                          </div>

                                          <div className="flex justify-end">
                                            <div className="flex items-center gap-2">
                                              <img
                                                src="/sample-screen.png"
                                                alt="Sample screen"
                                                className="w-40 h-auto rounded border"
                                              />
                                              <Label className="text-sm text-muted-foreground">Sample screen</Label>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Exit Screen */}
                                    <div className="border rounded-lg overflow-hidden mb-4">
                                      <button
                                        onClick={() => setExitScreenExpanded(!exitScreenExpanded)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                      >
                                        <div className="flex items-center gap-2">
                                          <X className="h-4 w-4" />
                                          <span className="font-medium">Exit screen</span>
                                        </div>
                                        <ChevronDown
                                          className={`h-4 w-4 transition-transform ${exitScreenExpanded ? "rotate-180" : ""}`}
                                        />
                                      </button>
                                      {exitScreenExpanded && (
                                        <div className="border-t p-4 space-y-6">
                                          {/* On success section */}
                                          <div className="space-y-4">
                                            <h3 className="font-medium">On success</h3>
                                            <div className="space-y-4">
                                              <div className="space-y-2">
                                                <Label>Heading</Label>
                                                <Input
                                                  value={successHeading}
                                                  onChange={(e) => setSuccessHeading(e.target.value)}
                                                  placeholder="Thank You"
                                                  className="w-full"
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label>Message</Label>
                                                <Input
                                                  value={successMessage}
                                                  onChange={(e) => setSuccessMessage(e.target.value)}
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
                                                  onChange={(e) => setFailureHeading(e.target.value)}
                                                  placeholder="Sorry"
                                                  className="w-full"
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label>Message</Label>
                                                <Input
                                                  value={failureMessage}
                                                  onChange={(e) => setFailureMessage(e.target.value)}
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
                                              <img
                                                src="/sample-screen.png"
                                                alt="Success screen"
                                                className="w-40 h-auto rounded border"
                                              />
                                              <img
                                                src="/sample-screen.png"
                                                alt="Failure screen"
                                                className="w-40 h-auto rounded border"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Override Organization Details */}
                                    <div className="border rounded-lg overflow-hidden">
                                      <button
                                        onClick={() => setOrganizationDetailsExpanded(!organizationDetailsExpanded)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Settings className="h-4 w-4" />
                                          <span className="font-medium">Override organization details</span>
                                        </div>
                                        <ChevronDown
                                          className={`h-4 w-4 transition-transform ${
                                            organizationDetailsExpanded ? "rotate-180" : ""
                                          }`}
                                        />
                                      </button>
                                      {organizationDetailsExpanded && (
                                        <div className="border-t p-4 space-y-6">
                                          <div className="space-y-4">
                                            <div className="space-y-2">
                                              <Label>Organization name</Label>
                                              <Input
                                                value={organizationName}
                                                onChange={(e) => setOrganizationName(e.target.value)}
                                                placeholder="Enter org. name"
                                                className="w-full"
                                              />
                                            </div>
                                            <Button
                                              variant="secondary"
                                              className="w-full sm:w-auto bg-gray-500 text-white hover:bg-gray-600"
                                            >
                                              Upload Logo
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </>
                    )}

                    {activeTab === 5 && (
                      <>
                        {/* Rejection tab content */}
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
                                        onValueChange={setDisallowedDocTypes}
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

                                  <Separator />

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
                      </>
                    )}

                    {activeTab === 6 && (
                      <>
                        {/* Advanced tab content */}
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
                                    <Select defaultValue="usa">
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
                                    <Switch />
                                  </div>

                                  <Separator />

                                  {/* Delete Button */}
                                  <div className="flex justify-end">
                                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
