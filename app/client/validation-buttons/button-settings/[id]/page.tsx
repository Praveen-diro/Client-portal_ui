"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
import { buttonService } from "@/app/services/button.service";
import { getButton } from "@/app/store/features/buttonSlice";
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
import Loader from "@/components/ui/loader";

// Add import for BasicTab component
import { BasicTab } from "../../components/BasicTab";
import { IntegrationTab } from "../../components/IntegrationTab";
import { PrivacyTab } from "../../components/PrivacyTab";
import { TriggersEmailTab } from "../../components/TriggersEmailTab";
import { DisplayTab } from "../../components/DisplayTab";
import { RejectionTab } from "../../components/RejectionTab";
import { AdvancedTab } from "../../components/AdvancedTab";
import {
  setVerificationMethod,
  setDirectUrlEnabled,
  setSelectedCountry,
  setLimitCountryEnabled,
  setSelectedCountries,
  setAllowSubmissionOverride,
  setAllowMissingStatements,
  setDisplaySettings,
  setDisallowedDocTypes,
  setProxyLocation,
  setAllowMethodSwitching,
} from "@/app/store/features/buttonSettingsSlice";

interface Tab {
  name: string;
  icon: LucideIcon;
}

interface PageParams extends Record<string, string | string[]> {
  id: string;
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
  const params = useParams() as PageParams;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch button data when component mounts or buttonId changes
  useEffect(() => {
    const buttonId = params.id;
    if (!buttonId) return;

    setIsLoading(true);
    setError(null);

    buttonService
      .getButtonData(buttonId.toString())
      .then((response) => {
        if (response.success && response.data) {
          console.log("Button settings: data retrieved successfully", response.data);
          dispatch(getButton(response.data));
        } else {
          console.error("Failed to get button data:", response.error || "Unknown error");
          setError("Failed to load button data. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving button data:", error);
        setError("An error occurred while loading button data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, dispatch]);

  // Get all state from buttonSettings
  const { basic, privacy, trigger, display, rejection, advanced } = useAppSelector((state) => state.buttonSettings);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Remove individual states that are now in Redux
  const [triggerExpanded, setTriggerExpanded] = useState<boolean>(false);
  const [redirectionExpanded, setRedirectionExpanded] = useState<boolean>(false);
  const [emailSetupExpanded, setEmailSetupExpanded] = useState<boolean>(false);
  const [customerRemindersExpanded, setCustomerRemindersExpanded] = useState<boolean>(false);
  const [browserSettingsExpanded, setBrowserSettingsExpanded] = useState<boolean>(false);
  const [desktopPreferenceExpanded, setDesktopPreferenceExpanded] = useState<boolean>(false);
  const [colorExpanded, setColorExpanded] = useState<boolean>(false);
  const [certifiedPdfExpanded, setCertifiedPdfExpanded] = useState<boolean>(false);
  const [privacyScreenExpanded, setPrivacyScreenExpanded] = useState<boolean>(false);
  const [guideScreenExpanded, setGuideScreenExpanded] = useState<boolean>(false);
  const [exitScreenExpanded, setExitScreenExpanded] = useState<boolean>(false);
  const [organizationDetailsExpanded, setOrganizationDetailsExpanded] = useState<boolean>(false);

  const handleVerificationMethodChange = (value: string) => {
    dispatch(setVerificationMethod(value));
    // Reset related states when verification method changes
    dispatch(setDirectUrlEnabled(false));
    dispatch(setSelectedCountry(""));
  };

  const handleDirectUrlChange = (checked: boolean) => {
    dispatch(setDirectUrlEnabled(checked));
    if (!checked) {
      dispatch(setSelectedCountry(""));
    }
  };

  const renderTabIcon = (tab: Tab) => {
    const TabIcon = tab.icon;
    return <TabIcon className="h-4 w-4" />;
  };

  const renderIntegrationContent = () => {
    if (basic.verificationMethod === "download") {
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
    } else if (basic.verificationMethod === "smart-upload") {
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
    } else if (basic.verificationMethod === "screenshot") {
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
          <div className="container mx-auto px-8 py-8">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-screen">
                <Loader />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-screen p-4">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                  <Button className="mt-4" variant="outline" onClick={() => router.push("/client/validation-buttons")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Buttons
                  </Button>
                </Alert>
              </div>
            ) : (
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
                        <BasicTab
                          verificationMethod={basic.verificationMethod}
                          directUrlEnabled={basic.directUrlEnabled}
                          selectedCountry={basic.selectedCountry}
                          limitCountryEnabled={basic.limitCountryEnabled}
                          selectedCountries={basic.selectedCountries}
                          allowSubmissionOverride={basic.allowSubmissionOverride}
                          allowMissingStatements={basic.allowMissingStatements}
                          onVerificationMethodChange={handleVerificationMethodChange}
                          onDirectUrlChange={handleDirectUrlChange}
                          onSelectedCountryChange={(value) => dispatch(setSelectedCountry(value))}
                          onLimitCountryEnabledChange={(checked) => {
                            dispatch(setLimitCountryEnabled(checked));
                            if (!checked) {
                              dispatch(setSelectedCountries([]));
                            }
                          }}
                          onSelectedCountriesChange={(value) => dispatch(setSelectedCountries(value))}
                          onAllowSubmissionOverrideChange={(checked) => dispatch(setAllowSubmissionOverride(checked))}
                          onAllowMissingStatementsChange={(checked) => dispatch(setAllowMissingStatements(checked))}
                          params={params}
                        />
                      )}

                      {activeTab === 1 && <IntegrationTab verificationMethod={basic.verificationMethod} />}

                      {activeTab === 2 && (
                        <PrivacyTab
                          {...privacy}
                          onAutoDeletionChange={(checked) => dispatch(setAutoDeletion({ enabled: checked }))}
                          onShareOnlyJsonChange={(checked) => dispatch(setShareOnlyJson(checked))}
                          onShowFieldLabelsChange={(checked) => dispatch(setShowFieldLabels(checked))}
                          onDisableWebpagePromptsChange={(checked) => dispatch(setDisableWebpagePrompts(checked))}
                          onShowDetailedJsonChange={(checked) => dispatch(setShowDetailedJson(checked))}
                          onTransactionsExtractionChange={(checked) => dispatch(setTransactionsExtraction(checked))}
                        />
                      )}

                      {activeTab === 3 && (
                        <TriggersEmailTab
                          {...trigger}
                          onEmailToOrganizationChange={(value) => dispatch(setEmailToOrganization(value))}
                          onIncludePdfInEmailChange={(checked) => dispatch(setIncludePdfInEmail(checked))}
                          onSubmissionNotificationViaEmailChange={(checked) =>
                            dispatch(setSubmissionNotificationViaEmail(checked))
                          }
                          onEmailToOrganizationEnabledChange={(checked) => dispatch(setEmailToOrganizationEnabled(checked))}
                          onEnableEngagementCallbackChange={(checked) => dispatch(setEnableEngagementCallback(checked))}
                          onAutoJsonChange={(checked) => dispatch(setAutoJson(checked))}
                          onCallbackUrlChange={(value) => dispatch(setCallbackUrl(value))}
                          onAddGoogleSheetUrlChange={(checked) => dispatch(setAddGoogleSheetUrl(checked))}
                          onEnableSalesforceChange={(checked) => dispatch(setEnableSalesforce(checked))}
                        />
                      )}

                      {activeTab === 4 && (
                        <DisplayTab
                          {...display}
                          onStartWithFullScreenChange={(checked) =>
                            dispatch(setDisplaySettings({ startWithFullScreen: checked }))
                          }
                          onShowPreviewChange={(checked) => dispatch(setDisplaySettings({ showPreview: checked }))}
                          onDesktopWarningChange={(value) => dispatch(setDisplaySettings({ desktopWarning: value }))}
                          onDesktopCustomMessageChange={(value) => dispatch(setDisplaySettings({ desktopCustomMessage: value }))}
                          onColorValueChange={(value) => dispatch(setDisplaySettings({ colorValue: value }))}
                          onIncludeFaqPageChange={(checked) => dispatch(setDisplaySettings({ includeFaqPage: checked }))}
                          onIncludeQrCodeChange={(checked) => dispatch(setDisplaySettings({ includeQrCode: checked }))}
                          onNoPasswordTextChange={(value) => dispatch(setDisplaySettings({ noPasswordText: value }))}
                          onStrongPrivacyTextChange={(value) => dispatch(setDisplaySettings({ strongPrivacyText: value }))}
                          onSecureTextChange={(value) => dispatch(setDisplaySettings({ secureText: value }))}
                          onDataPurgeTextChange={(value) => dispatch(setDisplaySettings({ dataPurgeText: value }))}
                          onLoginTextChange={(value) => dispatch(setDisplaySettings({ loginText: value }))}
                          onInstructionTextChange={(value) => dispatch(setDisplaySettings({ instructionText: value }))}
                          onSuccessHeadingChange={(value) => dispatch(setDisplaySettings({ successHeading: value }))}
                          onSuccessMessageChange={(value) => dispatch(setDisplaySettings({ successMessage: value }))}
                          onFailureHeadingChange={(value) => dispatch(setDisplaySettings({ failureHeading: value }))}
                          onFailureMessageChange={(value) => dispatch(setDisplaySettings({ failureMessage: value }))}
                          onOrganizationNameChange={(value) => dispatch(setDisplaySettings({ organizationName: value }))}
                        />
                      )}

                      {activeTab === 5 && (
                        <RejectionTab
                          disallowedDocTypes={rejection.disallowedDocTypes}
                          onDisallowedDocTypesChange={(value) => dispatch(setDisallowedDocTypes(value))}
                        />
                      )}

                      {activeTab === 6 && (
                        <AdvancedTab
                          proxyLocation={advanced.proxyLocation}
                          allowMethodSwitching={advanced.allowMethodSwitching}
                          onProxyLocationChange={(value) => dispatch(setProxyLocation(value))}
                          onAllowMethodSwitchingChange={(checked) => dispatch(setAllowMethodSwitching(checked))}
                          onDelete={() => {
                            // Handle delete action
                            console.log("Delete button clicked");
                          }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </Tabs>
            )}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
