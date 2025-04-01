"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
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
  Check,
  RefreshCw,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { buttonService } from "@/app/services/button.service";
import {
  getButton,
  getMasterFieldData,
  getEmailReminderData,
  getCountryListData,
  setFullTextSearchData,
  setBtn,
  setName,
  setType,
  setFixedUrl,
  setCountry,
  setLimitCountry,
  setSelectedCountries,
  setAllowOverridePeriod,
  setAllowMissingStatement,
  setAutoDeletion,
  setShareOnlyJson,
  setShowFieldLabels,
  setDisableWebpagePrompts,
  setShowDetailedJson,
  setTransactionsExtraction,
  setEmailToOrganization,
  setIncludePdfInEmail,
  setSubmissionNotificationViaEmail,
  setEmailToOrganizationEnabled,
  setEnableEngagementCallback,
  setAutoJson,
  setCallbackUrl,
  setAddGoogleSheetUrl,
  setEnableSalesforce,
  setDisplaySettings,
  setRejectReasons,
  setProxy,
  setHybridMode,
  setVerificationCategory,
  setVerificationSubCategory,
  getCountryLinks,
  errCountryLinks,
  loadCountryLinks,
} from "@/app/store/features/buttonSlice";
import { getCountries } from "@/app/store/features/authSlice";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence } from "framer-motion";
import React from "react";
import Loader from "@/components/ui/loader";
import { ErrorModal } from "@/components/ui/error-modal";

// Add import for BasicTab component
import { BasicTab } from "../../components/BasicTab";
import { IntegrationTab } from "../../components/IntegrationTab";
import { PrivacyTab } from "../../components/PrivacyTab";
import { TriggersEmailTab } from "../../components/TriggersEmailTab";
import { DisplayTab } from "../../components/DisplayTab";
import { RejectionTab } from "../../components/RejectionTab";
import { AdvancedTab } from "../../components/AdvancedTab";

import { authService } from "@/app/services/auth.service";
import { store } from "@/app/store/store";

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
  const [errorCode, setErrorCode] = useState<string>("data");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  // Fetch button data when component mounts or buttonId changes
  useEffect(() => {
    const buttonId = params.id;
    if (!buttonId) return;

    setIsLoading(true);
    setError(null);
    setIsErrorModalOpen(false);

    buttonService
      .getButtonData(buttonId.toString())
      .then((response) => {
        if (response.success && response.data) {
          console.log("Button settings: data retrieved successfully", response.data);

          // Store the complete button data including any nested structure
          dispatch(getButton(response.data));

          console.log("Button settings: data retrieved successfully", response.data);
          // Set the button settings data for the UI fields
          dispatch(setBtn(response.data));
        } else {
          console.error("Failed to get button data:", response.error || "Unknown error");

          // Use a simpler approach to determine error type
          let errorType = "data"; // Default to data error

          // Try to detect network errors from error message
          if (
            response.error &&
            typeof response.error === "string" &&
            (response.error.includes("network") || response.error.includes("connection"))
          ) {
            errorType = "network";
          }

          setErrorCode(errorType);
          setError(typeof response.error === "string" ? response.error : "Failed to load button data. Please try again.");
          setIsErrorModalOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error retrieving button data:", error);

        // Try to determine error type
        let errorType = "data";
        if (error.response && error.response.status) {
          errorType = error.response.status.toString();
        } else if (
          error.message &&
          (error.message.includes("network") || error.message.includes("connection") || error.message.includes("offline"))
        ) {
          errorType = "network";
        }

        setErrorCode(errorType);
        setError(error.message || "An error occurred while loading button data.");
        setIsErrorModalOpen(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, dispatch]);

  // Get all state from buttonSettings
  const buttonSettings = useAppSelector((state) => state.buttons?.btn?.btndata);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(0);

  // Fetch countries data
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    setCountriesLoading(true);
    setCountriesError(null);

    // Using authService.getCountries() which now uses makeRefreshAuthGetRequest for HTTP GET
    buttonService
      .getCountryList()
      .then((response) => {
        // Get countries from Redux store after calling the API
        dispatch(getCountryListData(response));
        const countriesData = store.getState().buttons.countryList.data;
        setCountries(countriesData || []);
        // The service already dispatches getCountries action, no need to dispatch again here
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setCountriesError("Failed to load countries data");
      })
      .finally(() => {
        setCountriesLoading(false);
      });
  }, [dispatch]);

  // Fetch email reminder data
  const [emailReminderLoading, setEmailReminderLoading] = useState(true);
  const [emailReminderError, setEmailReminderError] = useState<string | undefined>(undefined);
  const [emailReminder, setEmailReminder] = useState<any>(null);
  const [emailReminderRetryCount, setEmailReminderRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchEmailReminder = async () => {
      setEmailReminderLoading(true);
      setEmailReminderError(undefined);

      try {
        const response = await buttonService.getEmailReminder();

        if (!isMounted) return;

        if (response.success && response.data) {
          console.log("Email reminder retrieved successfully", response.data);
          setEmailReminder(response.data);
          // Dispatch getEmailReminderData action for Redux
          dispatch(getEmailReminderData(response.data));
        } else {
          console.error("Failed to get email reminder:", response.error || "Unknown error");
          setEmailReminderError("Failed to load email reminder data");
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Error retrieving email reminder:", error);
        setEmailReminderError("Unable to load email reminder data. This won't affect saving button settings.");
      } finally {
        if (isMounted) {
          setEmailReminderLoading(false);
        }
      }
    };

    fetchEmailReminder();

    return () => {
      isMounted = false;
    };
  }, [dispatch, emailReminderRetryCount]);

  // Add a retry function for email reminder loading
  const handleRetryEmailReminder = useCallback(() => {
    setEmailReminderRetryCount((prev) => prev + 1);
  }, []);

  // Fetch master fields data
  const [masterFieldsLoading, setMasterFieldsLoading] = useState(true);
  const [masterFieldsError, setMasterFieldsError] = useState<string | undefined>(undefined);
  const [masterFields, setMasterFields] = useState<any[]>([]);

  useEffect(() => {
    setMasterFieldsLoading(true);
    setMasterFieldsError(undefined);

    // Using buttonService.getMasterFields() which now uses makeGetRequest for HTTP GET
    buttonService
      .getMasterFields()
      .then((response) => {
        if (response.success && response.data) {
          console.log("Master fields retrieved successfully", response.data);
          setMasterFields(response.data.data || []);
          // Dispatch getMasterFieldData action for Redux
          dispatch(getMasterFieldData(response.data));
        } else {
          console.error("Failed to get master fields:", response.error || "Unknown error");
          setMasterFieldsError("Failed to load master fields data");
        }
      })
      .catch((error) => {
        console.error("Error retrieving master fields:", error);
        setMasterFieldsError("An error occurred while loading master fields data");
      })
      .finally(() => {
        setMasterFieldsLoading(false);
      });
  }, [dispatch]);

  // Fetch full text search results
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchFullTextSearch = async () => {
      setSearchLoading(true);
      setSearchError(undefined);

      try {
        // Execute search with default query - can be customized as needed
        const searchQuery = "verification";
        const response = await buttonService.fullTextSearch(searchQuery);

        if (!isMounted) return;

        if (response.success && response.data) {
          console.log("Full text search completed successfully", response.data);
          setSearchResults(response.data.data || []);
          // Dispatch setFullTextSearchData action for Redux
          dispatch(setFullTextSearchData(response.data.data || []));
        } else {
          console.error("Failed to perform full text search:", response.error || "Unknown error");
          setSearchError("Failed to load search results");
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Error performing full text search:", error);
        setSearchError("An error occurred while searching");
      } finally {
        if (isMounted) {
          setSearchLoading(false);
        }
      }
    };

    // Perform search after master fields are loaded
    if (!masterFieldsLoading) {
      fetchFullTextSearch();
    }

    return () => {
      isMounted = false;
    };
  }, [masterFieldsLoading, dispatch]);

  console.log("buttonSettings data", buttonSettings);

  // Render content based on loading and error state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      );
    }

    return (
      <Tabs value={activeTab.toString()} onValueChange={handleTabChange} className="space-y-8">
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
                  // State props (data)
                  name={buttonSettings?.name}
                  verificationMethod={buttonSettings?.mode?.type}
                  verificationCategory={buttonSettings?.coverage?.category}
                  verificationSubCategory={buttonSettings?.subcategory}
                  directUrlEnabled={buttonSettings?.coverage?.fixedurl}
                  selectedCountry={buttonSettings?.countryUniqueKey || buttonSettings?.country}
                  limitCountryEnabled={buttonSettings?.limitcountry}
                  selectedCountries={buttonSettings?.selectedCountries}
                  allowSubmissionOverride={buttonSettings?.allowOverridePeriod}
                  allowMissingStatements={buttonSettings?.allowMissingStatement}
                  params={params}
                  // Handler props (callbacks)
                  onNameChange={(value) => dispatch(setName(value))}
                  onVerificationMethodChange={(value) => {
                    dispatch(setType(value));
                    // Reset related states when verification method changes
                    if (value !== buttonSettings?.mode?.type) {
                      dispatch(setFixedUrl(false));
                      dispatch(setCountry(""));
                    }
                  }}
                  onVerificationCategoryChange={handleVerificationCategoryChange}
                  onVerificationSubCategoryChange={(values) => dispatch(setVerificationSubCategory(values))}
                  onDirectUrlChange={(checked) => {
                    dispatch(setFixedUrl(checked));
                    if (!checked) {
                      dispatch(setCountry(""));
                    }
                  }}
                  onSelectedCountryChange={(value) => handleCountryChange(value)}
                  onLimitCountryEnabledChange={(checked) => {
                    dispatch(setLimitCountry(checked));
                    if (!checked) {
                      dispatch(setSelectedCountries([]));
                      if (buttonSettings.btn?.btndata) {
                        const updatedBtnData = {
                          ...buttonSettings.btn,
                          btndata: {
                            ...buttonSettings.btn.btndata,
                            selectedCountries: [],
                          },
                        };
                        dispatch(setBtn(updatedBtnData));
                      }
                    }
                  }}
                  onSelectedCountriesChange={(values) => dispatch(setSelectedCountries(values))}
                  onAllowSubmissionOverrideChange={(checked) => dispatch(setAllowOverridePeriod(checked))}
                  onAllowMissingStatementsChange={(checked) => dispatch(setAllowMissingStatement(checked))}
                />
              )}
              {activeTab === 1 && <IntegrationTab verificationMethod={buttonSettings.type} />}
              {activeTab === 2 && (
                <PrivacyTab
                  autoDeletionEnabled={buttonSettings.autodeleteenable}
                  shareOnlyJson={buttonSettings.shareonlyjson}
                  showFieldLabels={buttonSettings.field_label}
                  disableWebpagePrompts={buttonSettings.hidediscover_popup}
                  showDetailedJson={buttonSettings.showDetailedJson}
                  transactionsExtraction={buttonSettings.transactionsExtraction}
                  onAutoDeletionChange={(checked: boolean) => dispatch(setAutoDeletion(checked))}
                  onShareOnlyJsonChange={(checked: boolean) => dispatch(setShareOnlyJson(checked))}
                  onShowFieldLabelsChange={(checked: boolean) => dispatch(setShowFieldLabels(checked))}
                  onDisableWebpagePromptsChange={(checked: boolean) => dispatch(setDisableWebpagePrompts(checked))}
                  onShowDetailedJsonChange={(checked: boolean) => dispatch(setShowDetailedJson(checked))}
                  onTransactionsExtractionChange={(checked: boolean) => dispatch(setTransactionsExtraction(checked))}
                />
              )}
              {activeTab === 3 && (
                <TabsContent value="email-reminder">
                  {emailReminderLoading ? (
                    <div className="flex justify-center items-center p-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      <span className="ml-3">Loading email reminder settings...</span>
                    </div>
                  ) : emailReminderError ? (
                    <div className="p-6 border rounded-md bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 text-red-500">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-400">
                            Email Reminder Settings Unavailable
                          </h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <p>{emailReminderError}</p>
                            <p className="mt-1">This won't affect your ability to save button settings.</p>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" onClick={handleRetryEmailReminder} className="text-sm">
                              Retry Loading
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <TriggersEmailTab
                      emailToOrganization={buttonSettings.notifysubmissionto}
                      includePdfInEmail={buttonSettings.include_pdf}
                      submissionNotificationViaEmail={buttonSettings.notifySubmission}
                      emailToOrganizationEnabled={buttonSettings.emailToOrganizationEnabled}
                      enableEngagementCallback={buttonSettings.engagement_callback}
                      autoJson={buttonSettings.autojson}
                      callbackUrl={buttonSettings.callbackurl}
                      addGoogleSheetUrl={buttonSettings.googleSheet}
                      enableSalesforce={buttonSettings.enableSalesforce}
                      onEmailToOrganizationChange={(value: string) => dispatch(setEmailToOrganization(value))}
                      onIncludePdfInEmailChange={(checked: boolean) => dispatch(setIncludePdfInEmail(checked))}
                      onSubmissionNotificationViaEmailChange={(checked: boolean) =>
                        dispatch(setSubmissionNotificationViaEmail(checked))
                      }
                      onEmailToOrganizationEnabledChange={(checked: boolean) => dispatch(setEmailToOrganizationEnabled(checked))}
                      onEnableEngagementCallbackChange={(checked: boolean) => dispatch(setEnableEngagementCallback(checked))}
                      onAutoJsonChange={(checked: boolean) => dispatch(setAutoJson(checked))}
                      onCallbackUrlChange={(value: string) => dispatch(setCallbackUrl(value))}
                      onAddGoogleSheetUrlChange={(checked: boolean) => dispatch(setAddGoogleSheetUrl(checked))}
                      onEnableSalesforceChange={(checked: boolean) => dispatch(setEnableSalesforce(checked))}
                      // @ts-ignore: Type error with null vs undefined
                      emailReminder={emailReminder}
                      emailReminderLoading={emailReminderLoading}
                      // @ts-ignore: Type error with null vs undefined
                      emailReminderError={emailReminderError}
                    />
                  )}
                </TabsContent>
              )}
              {activeTab === 4 && (
                <DisplayTab
                  startWithFullScreen={buttonSettings.fullscreenmode}
                  showPreview={buttonSettings.showpreview}
                  desktopWarning={buttonSettings.desktopWarning}
                  desktopCustomMessage={buttonSettings.customMobileWarningText}
                  colorValue={buttonSettings.setcolor}
                  includeFaqPage={buttonSettings.includeFaqInPdf}
                  includeQrCode={buttonSettings.includeQRCode}
                  noPasswordText={buttonSettings.nopassword}
                  strongPrivacyText={buttonSettings.strongtext}
                  secureText={buttonSettings.securetext}
                  dataPurgeText={buttonSettings.datapurge}
                  loginText={buttonSettings.logintext}
                  instructionText={buttonSettings.instructionText}
                  successHeading={buttonSettings.successheading}
                  successMessage={buttonSettings.successmessage}
                  failureHeading={buttonSettings.failureheading}
                  failureMessage={buttonSettings.failuremessage}
                  organizationName={buttonSettings.overrideorgname}
                  onStartWithFullScreenChange={(checked) => dispatch(setDisplaySettings({ fullscreenmode: checked }))}
                  onShowPreviewChange={(checked) => dispatch(setDisplaySettings({ showpreview: checked }))}
                  onDesktopWarningChange={(value) => dispatch(setDisplaySettings({ desktopWarning: value }))}
                  onDesktopCustomMessageChange={(value) => dispatch(setDisplaySettings({ customMobileWarningText: value }))}
                  onColorValueChange={(value) => dispatch(setDisplaySettings({ setcolor: value }))}
                  onIncludeFaqPageChange={(checked) => dispatch(setDisplaySettings({ includeFaqInPdf: checked }))}
                  onIncludeQrCodeChange={(checked) => dispatch(setDisplaySettings({ includeQRCode: checked }))}
                  onNoPasswordTextChange={(value) => dispatch(setDisplaySettings({ nopassword: value }))}
                  onStrongPrivacyTextChange={(value) => dispatch(setDisplaySettings({ strongtext: value }))}
                  onSecureTextChange={(value) => dispatch(setDisplaySettings({ securetext: value }))}
                  onDataPurgeTextChange={(value) => dispatch(setDisplaySettings({ datapurge: value }))}
                  onLoginTextChange={(value) => dispatch(setDisplaySettings({ logintext: value }))}
                  onInstructionTextChange={(value) => dispatch(setDisplaySettings({ instructionText: value }))}
                  onSuccessHeadingChange={(value) => dispatch(setDisplaySettings({ successheading: value }))}
                  onSuccessMessageChange={(value) => dispatch(setDisplaySettings({ successmessage: value }))}
                  onFailureHeadingChange={(value) => dispatch(setDisplaySettings({ failureheading: value }))}
                  onFailureMessageChange={(value) => dispatch(setDisplaySettings({ failuremessage: value }))}
                  onOrganizationNameChange={(value) => dispatch(setDisplaySettings({ overrideorgname: value }))}
                />
              )}
              {activeTab === 5 && (
                <RejectionTab
                  disallowedDocTypes={buttonSettings.reject_reasons}
                  onDisallowedDocTypesChange={(value) => dispatch(setRejectReasons(value))}
                  // @ts-ignore: Type error with null vs undefined
                  masterFields={masterFields}
                  masterFieldsLoading={masterFieldsLoading}
                  // @ts-ignore: Type error with null vs undefined
                  masterFieldsError={masterFieldsError}
                />
              )}
              {activeTab === 6 && (
                <AdvancedTab
                  proxyLocation={buttonSettings.proxy}
                  allowMethodSwitching={buttonSettings.hybridMode}
                  onProxyLocationChange={(value) => dispatch(setProxy(value))}
                  onAllowMethodSwitchingChange={(checked) => dispatch(setHybridMode(checked))}
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
    );
  };

  // Handle save changes handler
  const handleSaveChanges = async () => {
    try {
      const buttonId = params.id;
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Log button settings state for debugging
      console.log("Button settings to save:", buttonSettings);

      // Construct button data for API
      const buttonData = {
        buttonid: buttonId.toString(),
        data: buttonSettings || {},
      };

      // Regardless of whether email reminder data loaded successfully or not,
      // we can still save the button settings
      if (emailReminderError) {
        console.log("Proceeding with save despite email reminder loading error:", emailReminderError);
      }

      const response = await buttonService.updateButton(buttonData);

      if (response.success) {
        console.log("Button settings saved successfully");
        setSaveSuccess(true);
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("Failed to save button settings:", response.error);
        setError("Failed to save button settings: " + (response.error?.message || "Unknown error"));
        // Clear error message after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    } catch (err) {
      console.error("Error saving button settings:", err);
      setError("An unexpected error occurred while saving button settings");
      // Clear error message after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle tab change with state preservation
  const handleTabChange = (tabIndex: string) => {
    setPreviousTab(activeTab);
    setActiveTab(parseInt(tabIndex));
  };

  const handleVerificationMethodChange = (value: string) => {
    // Update the type directly
    dispatch(setType(value));

    // Reset related states when verification method changes
    dispatch(setFixedUrl(false));
    dispatch(setCountry(""));
  };

  const handleVerificationCategoryChange = (value: string) => {
    dispatch(setVerificationCategory(value));
  };

  const handleVerificationSubCategoryChange = (values: string[]) => {
    // Use a proper action to update the verification subcategory
    dispatch(setVerificationSubCategory(values));
  };

  const handleDirectUrlChange = (checked: boolean) => {
    // Update fixedurl directly
    dispatch(setFixedUrl(checked));

    if (!checked) {
      dispatch(setCountry(""));
    }
  };

  const handleCountryChange = (uniqueKey: string) => {
    // Find the selected country from the countryList data
    const countriesData = store.getState().buttons.countryList.data;
    if (countriesData?.data?.data && Array.isArray(countriesData.data.data)) {
      const selectedCountry = countriesData.data.data.find((country: any) => country.uniquekey === uniqueKey);

      if (selectedCountry) {
        // Update country in state
        dispatch(
          setCountry({
            uniquekey: selectedCountry.uniquekey,
            alpha2code: selectedCountry.alpha2code,
            countryName: selectedCountry.country,
          })
        );

        // Also fetch country links if a category is selected
        const verificationCategory = buttonSettings?.coverage?.category;
        if (verificationCategory) {
          // Set loading state
          dispatch(loadCountryLinks());

          // Prepare payload with uniquekey
          const payload = {
            cat: verificationCategory,
            key: selectedCountry.uniquekey, // Use uniquekey instead of alpha2code
            searching: false,
          };

          console.log("Fetching country links with payload:", payload);

          // Call the API
          buttonService
            .getCountryLinks(payload)
            .then((response) => {
              console.log("Country links response:", response);
              // Dispatch the response to Redux
              dispatch(
                getCountryLinks({
                  res: response,
                  searching: false,
                  cat: verificationCategory,
                })
              );
            })
            .catch((error) => {
              console.error("Error fetching country links:", error);
              // Handle error by dispatching to Redux
              dispatch(errCountryLinks(error.message || "Failed to fetch country links"));
            });
        }
      } else {
        // Fallback to just the uniqueKey if country object not found
        dispatch(setCountry(uniqueKey));
      }
    } else {
      dispatch(setCountry(uniqueKey));
    }
  };

  const renderTabIcon = (tab: Tab) => {
    const TabIcon = tab.icon;
    return <TabIcon className="h-4 w-4" />;
  };

  return (
    <>
      {isErrorModalOpen ? (
        // When error modal is visible, only show the modal with a clean background
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
          <ErrorModal
            isOpen={isErrorModalOpen}
            onClose={() => router.push("/client/validation-buttons")}
            onRetry={() => window.location.reload()}
            errorMessage={error || undefined}
            errorCode={errorCode}
            errorDetails={`Button ID: ${params.id}`}
            hideDetails={true}
            showIcon={false}
            cancelText="Back"
            retryText="Try Again"
            isRetrying={false}
            disableAnimation={true}
          />
        </div>
      ) : (
        // Only render the main content with sidebar when no error modal is displayed
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
                    <div className="flex items-center gap-3">
                      {saveSuccess && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          <Check className="h-3 w-3 mr-1" /> Changes saved
                        </Badge>
                      )}
                      <Button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="container mx-auto px-8 py-8">{renderContent()}</div>
            </div>
          </PageContainer>
        </div>
      )}
    </>
  );
}
