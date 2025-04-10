import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FancySwitchToggle } from "@/components/ui/fancy-switch-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Link,
  FileText,
  Camera,
  Upload,
  Globe,
  AlertCircle,
  ChevronDown,
  RefreshCw,
  Check,
  ExternalLink,
} from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { setName } from "@/app/store/features/buttonSlice";
import { useState, useEffect, useCallback } from "react";
import { MultiSelectDropdown, OptionType } from "@/components/ui/multi-select-dropdown";
import { useSelector } from "react-redux";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Data models
interface BasicTabState {
  // Button data
  name: string;

  // Verification settings
  verificationMethod: string;
  verificationCategory?: string;
  verificationSubCategory?: (string | OptionType)[];

  // URL settings
  directUrlEnabled: boolean;
  selectedCountry: string;
  limitCountryEnabled: boolean;
  selectedCountries: (string | OptionType)[];

  // Invite Link Settings
  expiryHours?: string;

  // Submission settings
  allowSubmissionOverride: boolean;
  allowMissingStatements: boolean;
  showGoogleSearch: boolean;
  resubmission: boolean;

  // Feature toggles
  livefeedback: boolean;
  multidownload: boolean;
  imageUpload: boolean;
  extractAllTransaction: boolean;
  calculateBalanceAsOnDate: boolean;

  // Search results
  searchResults?: any[];
  searchLoading?: boolean;

  // Others
  params: { id: string };

  // URL
  direct_link?: string;
}

// All handler types defined together
interface BasicTabHandlers {
  onNameChange: (value: string) => void;
  onVerificationMethodChange: (value: string) => void;
  onVerificationCategoryChange: (value: string) => void;
  onVerificationSubCategoryChange: (values: (string | OptionType)[]) => void;
  onDirectUrlChange: (checked: boolean) => void;
  onSelectedCountryChange: (value: string) => void;
  onLimitCountryEnabledChange: (checked: boolean) => void;
  onSelectedCountriesChange: (countries: (string | OptionType)[]) => void;
  onAllowSubmissionOverrideChange: (checked: boolean) => void;
  onAllowMissingStatementsChange: (checked: boolean) => void;
  onShowGoogleSearchChange: (checked: boolean) => void;
  onResubmissionChange: (checked: boolean) => void;
  onExpiryHoursChange?: (value: string) => void;
  onUrlChange?: (url: string) => void;
  onFetchCountryLinks?: (countryUniqueKey: string, category: string) => Promise<any>;
  onLiveFeedbackChange: (checked: boolean) => void;
  onMultiDownloadChange: (checked: boolean) => void;
  // New handlers for the three additional toggles
  onImageUploadChange: (checked: boolean) => void;
  onExtractAllTransactionChange: (checked: boolean) => void;
  onCalculateBalanceAsOnDateChange: (checked: boolean) => void;
}

// Combined props
interface BasicTabProps extends BasicTabState, BasicTabHandlers {}

// MultiSelect component definition
const MultiSelect = ({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value: (string | { label: string; value: string })[];
  onValueChange: (value: (string | { label: string; value: string })[]) => void;
  placeholder: string;
  children: React.ReactNode;
}) => {
  const formatSelectedValue = (values: (string | { label: string; value: string })[]) => {
    if (values.length === 0) return placeholder;

    return values
      .map((v) => {
        // Handle both string and object formats
        const valueStr = typeof v === "string" ? v : v.value;
        const label = typeof v === "string" ? v : v.label;

        // Apply specific formatting for known values or use the label directly
        switch (valueStr) {
          case "loan-statements":
            return "Loan statements";
          case "bank-statement":
            return "Bank Statement";
          case "utility-bill":
            return "Utility Bill";
          case "tax-document":
            return "Tax Document";
          default:
            return label;
        }
      })
      .join(", ");
  };

  return (
    <Select
      value={value.length > 0 ? "_multiple_values_" : "_empty_selection_"}
      onValueChange={(newValue) => {
        // Check if the new value already exists in the array
        const valueExists = value.some((v) => (typeof v === "string" ? v === newValue : v.value === newValue));

        if (!valueExists) {
          onValueChange([...value, newValue]);
        } else {
          // Remove the value if it exists
          onValueChange(value.filter((v) => (typeof v === "string" ? v !== newValue : v.value !== newValue)));
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
              ×
            </button>
          )}
        </div>
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
};

export const BasicTab: React.FC<BasicTabProps> = (props) => {
  // Extract all state props
  const {
    name,
    verificationMethod,
    verificationCategory,
    verificationSubCategory = [],
    directUrlEnabled,
    selectedCountry,
    limitCountryEnabled,
    selectedCountries = [],
    allowSubmissionOverride,
    allowMissingStatements,
    showGoogleSearch = false,
    resubmission = false,
    expiryHours = "", // Default to 30 days (720 hours)
    params,
    searchResults = [],
    searchLoading = false,
    direct_link = "",
    livefeedback = false,
    multidownload = false,
    imageUpload = false,
    extractAllTransaction = false,
    calculateBalanceAsOnDate = false,
  } = props;

  // Extract all handler props
  const {
    onNameChange,
    onVerificationMethodChange,
    onVerificationCategoryChange,
    onVerificationSubCategoryChange,
    onDirectUrlChange,
    onSelectedCountryChange,
    onLimitCountryEnabledChange,
    onSelectedCountriesChange,
    onAllowSubmissionOverrideChange,
    onAllowMissingStatementsChange,
    onShowGoogleSearchChange,
    onResubmissionChange,
    onExpiryHoursChange,
    onUrlChange,
    onFetchCountryLinks,
    onLiveFeedbackChange,
    onMultiDownloadChange,
    onImageUploadChange,
    onExtractAllTransactionChange,
    onCalculateBalanceAsOnDateChange,
  } = props;

  // Debug the Google search props
  console.log("BasicTab - showGoogleSearch prop:", showGoogleSearch);
  console.log("BasicTab - onShowGoogleSearchChange handler exists:", !!onShowGoogleSearchChange);

  // Local state for all UI controls
  const [inputValue, setInputValue] = useState(name || "");
  const [localShowGoogleSearch, setLocalShowGoogleSearch] = useState(showGoogleSearch);
  const [localLimitCountryEnabled, setLocalLimitCountryEnabled] = useState(limitCountryEnabled);
  const [localExpiryHours, setLocalExpiryHours] = useState(expiryHours);
  const [localResubmission, setLocalResubmission] = useState(resubmission);
  const [localLiveFeedback, setLocalLiveFeedback] = useState(livefeedback);
  const [localMultiDownload, setLocalMultiDownload] = useState(multidownload);
  // New local state for additional toggles
  const [localImageUpload, setLocalImageUpload] = useState(imageUpload);
  const [localExtractAllTransaction, setLocalExtractAllTransaction] = useState(extractAllTransaction);
  const [localCalculateBalanceAsOnDate, setLocalCalculateBalanceAsOnDate] = useState(calculateBalanceAsOnDate);

  console.log("verificaton sub category", verificationCategory);

  // Sync local state with prop changes
  useEffect(() => {
    setInputValue(name || "");
  }, [name]);

  useEffect(() => {
    setLocalShowGoogleSearch(showGoogleSearch);
  }, [showGoogleSearch]);

  useEffect(() => {
    setLocalLimitCountryEnabled(limitCountryEnabled);
  }, [limitCountryEnabled]);

  useEffect(() => {
    setLocalExpiryHours(expiryHours);
  }, [expiryHours]);

  useEffect(() => {
    setLocalResubmission(resubmission);
  }, [resubmission]);

  // New effects to sync local state with props
  useEffect(() => {
    setLocalLiveFeedback(livefeedback);
  }, [livefeedback]);

  useEffect(() => {
    setLocalMultiDownload(multidownload);
  }, [multidownload]);

  // New effects to sync local state with props for additional toggles
  useEffect(() => {
    setLocalImageUpload(imageUpload);
  }, [imageUpload]);

  useEffect(() => {
    setLocalExtractAllTransaction(extractAllTransaction);
  }, [extractAllTransaction]);

  useEffect(() => {
    setLocalCalculateBalanceAsOnDate(calculateBalanceAsOnDate);
  }, [calculateBalanceAsOnDate]);

  // Effect to force livefeedback ON when multidownload is ON
  useEffect(() => {
    if (multidownload && !livefeedback) {
      // If multidownload is turned ON but livefeedback is OFF, turn livefeedback ON
      console.log("Forcing livefeedback ON because multidownload is ON");
      onLiveFeedbackChange?.(true);
      setLocalLiveFeedback(true);
    }
  }, [multidownload, livefeedback, onLiveFeedbackChange]);

  const dispatch = useAppDispatch();

  // Get countries from Redux store
  const countries = useSelector((state: any) => state.buttons.countryList.data || []);

  // Get country links data from Redux store
  const countryLinksData = useSelector((state: any) => state.buttons.countryLinks || {});
  const isLoadingCountryLinks = countryLinksData.loader;
  const countryLinksError = countryLinksData.err;

  // Format countries for dropdown
  const [countryOptions, setCountryOptions] = useState<OptionType[]>([]);

  // Process country data when it changes
  useEffect(() => {
    console.log("Countries from Redux:", countries);

    // Process the deeply nested data structure which seems to be working
    if (countries?.data?.data && Array.isArray(countries.data.data) && countries.data.data.length > 0) {
      const formattedCountries = countries.data.data.map((country: any) => ({
        value: country.uniquekey,
        label: country.country,
        flag: country.flag || `https://flagcdn.com/w40/${country.alpha2code.toLowerCase()}.png`,
        alpha2code: country.alpha2code,
        uniquekey: country.uniquekey,
      }));
      setCountryOptions(formattedCountries);
      console.log("Formatted country options:", formattedCountries);
    } else {
      console.log("No valid country data found in:", countries);
    }
  }, [countries]);

  console.log("Country options:1", countryOptions);
  // Debounced function to update the Redux store
  const debouncedNameChange = useCallback(
    (value: string) => {
      // Only dispatch once to prevent duplicate calls to the reducer
      dispatch(setName(value));
      onNameChange(value);
    },
    [dispatch, onNameChange]
  );

  // Effect to handle the debouncing
  useEffect(() => {
    // Skip initial render
    if (inputValue === name) return;

    // Set up the timer
    const timer = setTimeout(() => {
      debouncedNameChange(inputValue);
    }, 1000); // 1 second delay

    // Cleanup the timer if the component unmounts or the value changes again
    return () => clearTimeout(timer);
  }, [inputValue, debouncedNameChange, name]);

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Add state for subcategory options
  const [subCategoryOptions, setSubCategoryOptions] = useState<OptionType[]>([]);
  const [documentCheckOptions, setDocumentCheckOptions] = useState<OptionType[]>([]);

  // Update subcategory options when verification category changes
  useEffect(() => {
    if (verificationCategory) {
      updateSubCategoryOptions(verificationCategory);

      // Log that we're responding to a category change
      console.log(`Category changed to ${verificationCategory}, updating available subcategories`);
    } else {
      // Clear options if no category is selected
      setSubCategoryOptions([]);
      setDocumentCheckOptions([]);
    }
  }, [verificationCategory]);

  // Reset the selected subcategories when category changes
  // This is in addition to the action dispatch in the parent component
  useEffect(() => {
    // Only track changes after initial render
    if (verificationCategory) {
      console.log(`BasicTab: Category changed to ${verificationCategory}, notifying parent to reset subcategories`);

      // Ensure any local state is also reset
      if (verificationSubCategory && verificationSubCategory.length > 0) {
        onVerificationSubCategoryChange([]);
      }
    }
  }, [verificationCategory]); // eslint-disable-line react-hooks/exhaustive-deps
  // We intentionally exclude onVerificationSubCategoryChange and verificationSubCategory
  // from the dependencies to prevent circular updates

  // Function to update subcategory options based on selected category
  const updateSubCategoryOptions = (category: string) => {
    switch (category) {
      case "address":
        setSubCategoryOptions([
          { value: "electricity", label: "Electricity" },
          { value: "gas", label: "Gas" },
          { value: "water", label: "Water" },
          { value: "sewage", label: "Sewage" },
          { value: "landline", label: "Landline" },
          { value: "mobile_phone", label: "Mobile phone" },
          { value: "internet_service", label: "Internet service" },
          { value: "cable_tv", label: "Cable or satellite TV" },
          { value: "municipal_tax", label: "Municipal tax" },
          { value: "waste_management", label: "Waste management" },
        ]);
        setDocumentCheckOptions([
          { value: "invoice", label: "Invoice" },
          { value: "payment_receipts", label: "Payment receipts" },
          { value: "pastehub", label: "Pastehub" },
          { value: "connection_letter", label: "Connection letter" },
          { value: "disconnection_notice", label: "Disconnection notice" },
        ]);
        break;
      case "bank":
        setSubCategoryOptions([
          { value: "banks", label: "Banks" },
          { value: "neo_banks", label: "Neo banks" },
          { value: "credit_union", label: "Credit union" },
        ]);
        setDocumentCheckOptions([
          { value: "bank_statements", label: "Bank statements" },
          { value: "credit_card_statements", label: "Credit card statements" },
          { value: "loan_statements", label: "Loan statements" },
          { value: "mortgage_statements", label: "Mortgage statements" },
          { value: "investment_statements", label: "Investment statements" },
          { value: "cd_statements", label: "Certificate of deposit (CD) statements" },
        ]);
        break;
      case "identity":
        setSubCategoryOptions([
          { value: "government_id", label: "Government ID" },
          { value: "passport", label: "Passport" },
          { value: "drivers_license", label: "Driver's License" },
          { value: "social_security_card", label: "Social Security Card" },
          { value: "birth_certificate", label: "Birth Certificate" },
          { value: "visa_immigration", label: "Visa/Immigration Documents" },
        ]);
        setDocumentCheckOptions([]);
        break;
      case "professional":
        setSubCategoryOptions([
          { value: "employment_verification", label: "Employment Verification" },
          { value: "professional_license", label: "Professional License" },
          { value: "certifications", label: "Certifications" },
          { value: "educational_credentials", label: "Educational Credentials" },
          { value: "income_verification", label: "Income Verification" },
        ]);
        setDocumentCheckOptions([]);
        break;
      case "organization":
        setSubCategoryOptions([
          { value: "business_registration", label: "Business Registration" },
          { value: "tax_id_documents", label: "Tax ID Documents" },
          { value: "business_license", label: "Business License" },
          { value: "articles_of_incorporation", label: "Articles of Incorporation" },
          { value: "nonprofit_status", label: "Non-profit Status" },
          { value: "financial_statements", label: "Financial Statements" },
        ]);
        setDocumentCheckOptions([]);
        break;
      case "crypto":
        setSubCategoryOptions([
          { value: "wallet_verification", label: "Wallet Verification" },
          { value: "transaction_history", label: "Transaction History" },
          { value: "exchange_account", label: "Exchange Account" },
          { value: "nft_ownership", label: "NFT Ownership" },
          { value: "mining_operations", label: "Mining Operations" },
        ]);
        setDocumentCheckOptions([]);
        break;
      case "other":
        setSubCategoryOptions([
          { value: "insurance_documents", label: "Insurance Documents" },
          { value: "legal_documents", label: "Legal Documents" },
          { value: "medical_records", label: "Medical Records" },
          { value: "property_documents", label: "Property Documents" },
          { value: "custom_verification", label: "Custom Verification" },
        ]);
        setDocumentCheckOptions([]);
        break;
      default:
        setSubCategoryOptions([]);
        setDocumentCheckOptions([]);
    }
  };

  // Add state for selected link
  const [selectedLink, setSelectedLink] = useState<string>(direct_link || "");
  const [customUrl, setCustomUrl] = useState<string>(direct_link || "");
  const [showCustomUrlModal, setShowCustomUrlModal] = useState<boolean>(false);
  const [isCustomUrlSelected, setIsCustomUrlSelected] = useState<boolean>(
    direct_link ? !searchResults.some((result) => result.url === direct_link) : false
  );
  const [urlError, setUrlError] = useState<string | null>(null);

  // Handle URL changes
  useEffect(() => {
    if (selectedLink && onUrlChange && selectedLink !== "add_custom_url") {
      onUrlChange(selectedLink);
    }
  }, [selectedLink, onUrlChange]);

  // Log the countryLinks data when it changes
  useEffect(() => {
    if (countryLinksData?.data) {
      console.log("CountryLinks data updated:", countryLinksData.data);
    }
  }, [countryLinksData]);

  // Update customUrl if it's a custom URL
  useEffect(() => {
    if (direct_link && !searchResults.some((result) => result.url === direct_link)) {
      setCustomUrl(direct_link);
      setIsCustomUrlSelected(true);
      // Don't set selectedLink to "add_custom_url" to avoid showing the modal automatically
    } else if (direct_link) {
      setSelectedLink(direct_link);
      setIsCustomUrlSelected(false);
    }
  }, [direct_link, searchResults]);

  // Validate URL
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle saving custom URL from the modal
  const handleSaveCustomUrl = () => {
    if (customUrl) {
      if (validateUrl(customUrl)) {
        setUrlError(null);
        if (onUrlChange) {
          onUrlChange(customUrl);
          setIsCustomUrlSelected(true);
          // We don't need to clear selectedLink anymore as the custom URL
          // will be shown based on isCustomUrlSelected being true
        }
        setShowCustomUrlModal(false);
      } else {
        setUrlError("Please enter a valid URL including http:// or https://");
      }
    }
  };

  // Update useEffect for country selection to fetch links if verification category exists
  useEffect(() => {
    if (selectedCountry && verificationCategory && onFetchCountryLinks) {
      // Only fetch if we have both a selected country and category
      console.log(`Fetching links for country ${selectedCountry} and category ${verificationCategory}`);
      onFetchCountryLinks(selectedCountry, verificationCategory)
        .then((response) => {
          console.log("Country links loaded:", response);
        })
        .catch((error) => {
          console.error("Error fetching country links:", error);
        });
    }
  }, [selectedCountry, verificationCategory, onFetchCountryLinks]);

  // Add a render function for the select trigger content
  const renderSelectTriggerContent = () => {
    if (isCustomUrlSelected) {
      return (
        <div className="flex flex-col truncate">
          <span className="text-sm truncate">{customUrl}</span>
        </div>
      );
    }
    if (selectedLink && countryLinksData?.data && Array.isArray(countryLinksData.data)) {
      const selectedLinkData = countryLinksData.data.find((link: any) => link.link === selectedLink);

      if (selectedLinkData) {
        return (
          <div className="flex items-center space-x-2">
            {selectedLinkData.logo && (
              <img src={selectedLinkData.logo} alt={selectedLinkData.nickname || "Provider"} className="h-5 w-5 object-contain" />
            )}
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium truncate">{selectedLinkData.nickname || "Provider"}</span>
              <span className="text-xs text-muted-foreground truncate">{selectedLinkData.link}</span>
            </div>
          </div>
        );
      }

      return (
        <div className="flex flex-col truncate">
          <span className="text-sm truncate">{selectedLink}</span>
        </div>
      );
    }

    return <SelectValue placeholder="Select Link" />;
  };

  // Add a state for link reset notification
  const [linkResetNotice, setLinkResetNotice] = useState<boolean>(false);

  // Show a temporary notification when link is reset due to country change
  useEffect(() => {
    if (linkResetNotice) {
      const timer = setTimeout(() => {
        setLinkResetNotice(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [linkResetNotice]);

  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Button Name</Label>
                      <Input
                        className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                        placeholder="Enter button name"
                        value={inputValue}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Verification method</Label>
                      <Select value={verificationMethod} onValueChange={onVerificationMethodChange}>
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
                          <SelectItem value="upload">
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
                      <Select
                        value={verificationCategory}
                        onValueChange={(value) => {
                          // Immediately reset subcategories when category changes
                          if (value !== verificationCategory) {
                            console.log(
                              `BasicTab UI: Category changing from ${verificationCategory} to ${value}, resetting subcategories`
                            );
                            // First reset subcategories to provide immediate UI feedback
                            onVerificationSubCategoryChange([]);
                            // Then update the category
                            onVerificationCategoryChange(value);
                          } else {
                            onVerificationCategoryChange(value);
                          }
                        }}
                      >
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
                          <SelectItem value="identity">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span>Identity</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="professional">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              <span>Professional</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="organization">
                            <div className="flex items-center gap-2">
                              <Link className="h-4 w-4" />
                              <span>Organization</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="crypto">
                            <div className="flex items-center gap-2">
                              <Camera className="h-4 w-4" />
                              <span>Crypto</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center gap-2">
                              <Upload className="h-4 w-4" />
                              <span>Other</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sub Category</Label>
                      <MultiSelectDropdown
                        options={subCategoryOptions}
                        selected={verificationSubCategory || []}
                        onChange={(values) => {
                          console.log("Selected subcategories:", values);
                          onVerificationSubCategoryChange(values);
                        }}
                        placeholder="Select sub-categories"
                        className="w-full"
                        emptyMessage={
                          verificationCategory
                            ? "No subcategories available for this category"
                            : "Please select a verification category first"
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL Configuration with improved UI */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full" defaultValue="url-config">
              <AccordionItem value="url-config" className="border-none">
                <AccordionTrigger className="py-2 px-0 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Link className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">URL Configuration</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="grid grid-cols-1 gap-6">
                    {/* Search Integration and Invite Link Expiry in one row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Google Search Toggle */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex flex-col">
                        <div className="space-y-2 ">
                          <div className="font-medium">Search Integration</div>
                          <p className="text-sm text-muted-foreground">Enable Google search for user assistance</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="space-y-0.5">
                            <Label>Show Google search</Label>
                            <p className="text-xs text-muted-foreground">Allows users to search for help during verification</p>
                          </div>
                          <FancySwitchToggle
                            checked={localShowGoogleSearch}
                            onCheckedChange={(isChecked) => {
                              console.log("GoogleSearch toggle clicked:", isChecked);
                              onShowGoogleSearchChange?.(isChecked);
                              setLocalShowGoogleSearch(isChecked);
                            }}
                          />
                        </div>
                      </div>

                      {/* Expiry Setting */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                        <div className="space-y-1.5 mb-3">
                          <div className="font-medium">Invite Link Expiry</div>
                          <p className="text-sm text-muted-foreground">Default is 90 days (2160 hours)</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Input
                            type="number"
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter hours"
                            value={localExpiryHours}
                            onChange={(e) => {
                              const value = e.target.value;
                              console.log("Expiry hours changed to:", value);
                              setLocalExpiryHours(value);
                              if (onExpiryHoursChange) {
                                onExpiryHoursChange(value);
                              }
                            }}
                          />
                          <Badge className="whitespace-nowrap">hours</Badge>
                        </div>
                      </div>

                      {/* Direct URL Section */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">Directly open a fixed URL</span>
                            <span className="text-sm text-muted-foreground">
                              Opens a specific URL instead of showing the interface
                            </span>
                          </div>
                          <FancySwitchToggle checked={directUrlEnabled} onCheckedChange={onDirectUrlChange} />
                        </div>

                        {directUrlEnabled && (
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label htmlFor="country">Country</Label>
                              <div className="relative mt-1.5">
                                <Select
                                  value={selectedCountry}
                                  onValueChange={(value) => {
                                    if (selectedLink || isCustomUrlSelected) {
                                      // Show reset notification only if there was a selected link
                                      setLinkResetNotice(true);
                                    }
                                    // Clear the selected link when country changes
                                    setSelectedLink("");
                                    setIsCustomUrlSelected(false);
                                    if (customUrl) {
                                      // Also clear any custom URL if it was set
                                      setCustomUrl("");
                                    }
                                    // Notify parent of cleared URL
                                    if (onUrlChange) {
                                      onUrlChange("");
                                    }
                                    // Then call the parent handler
                                    onSelectedCountryChange(value);
                                  }}
                                >
                                  <SelectTrigger id="country" className="w-full flex items-center">
                                    {selectedCountry && countryOptions.length > 0 ? (
                                      <div className="flex items-center space-x-2">
                                        <img
                                          src={countryOptions.find((c) => c.value === selectedCountry)?.flag || ""}
                                          alt="Country flag"
                                          className="h-4 w-6"
                                        />
                                        <span>{countryOptions.find((c) => c.value === selectedCountry)?.label || ""}</span>
                                      </div>
                                    ) : (
                                      <SelectValue placeholder="Select a country" />
                                    )}
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[400px]">
                                    {countryOptions
                                      .filter((country) => country.value && country.value.trim() !== "") // Filter out empty values
                                      .map((country) => (
                                        <SelectItem key={country.value} value={country.value} className="py-2">
                                          <div className="flex items-center space-x-2">
                                            <img src={country.flag} alt={country.label} className="h-4 w-6" />
                                            <span>{country.label}</span>
                                          </div>
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Links Dropdown */}
                              {directUrlEnabled && selectedCountry && (
                                <div className="mt-4">
                                  <div className="flex justify-between items-center">
                                    <Label htmlFor="link-selection">Select Link</Label>
                                    {linkResetNotice && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
                                      >
                                        Link reset due to country change
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="relative mt-1.5">
                                    <Select
                                      value={isCustomUrlSelected ? "custom_url_selected" : selectedLink || ""}
                                      onValueChange={(value) => {
                                        if (value === "add_custom_url") {
                                          // When "Add custom URL" is clicked, show the modal
                                          setShowCustomUrlModal(true);
                                          // Don't change the current selection value
                                          return;
                                        } else {
                                          setSelectedLink(value);
                                          setIsCustomUrlSelected(false);
                                        }
                                      }}
                                    >
                                      <SelectTrigger id="link-selection" className="w-full">
                                        {renderSelectTriggerContent()}
                                      </SelectTrigger>
                                      <SelectContent
                                        className="max-h-[300px] overflow-y-auto"
                                        side="bottom"
                                        position="popper"
                                        sideOffset={4}
                                      >
                                        <div className="py-1 px-1">
                                          <SelectItem
                                            value="add_custom_url"
                                            className="py-2 cursor-pointer rounded hover:bg-slate-100 dark:hover:bg-slate-800 mb-1"
                                          >
                                            <div className="flex items-center text-primary font-medium">
                                              <ExternalLink className="h-4 w-4 mr-2" />
                                              Add custom URL
                                            </div>
                                          </SelectItem>
                                        </div>

                                        {isCustomUrlSelected && (
                                          <div className="py-1 px-1">
                                            <SelectItem
                                              value="custom_url_selected"
                                              className="py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                            >
                                              <div className="flex items-start w-full">
                                                <span className="text-sm truncate">{customUrl}</span>
                                              </div>
                                            </SelectItem>
                                          </div>
                                        )}

                                        {isLoadingCountryLinks ? (
                                          <div className="flex items-center justify-center py-3">
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin text-primary" />
                                            <span>Loading links...</span>
                                          </div>
                                        ) : countryLinksError ? (
                                          <div className="flex items-center justify-center py-3 text-destructive">
                                            <AlertCircle className="h-4 w-4 mr-2" />
                                            <span>Error loading links</span>
                                          </div>
                                        ) : countryLinksData?.data &&
                                          Array.isArray(countryLinksData.data) &&
                                          countryLinksData.data.length > 0 ? (
                                          <div className="py-1 px-1">
                                            <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                                              Available links
                                            </div>
                                            {countryLinksData.data.map((link: any, index: number) => (
                                              <SelectItem
                                                key={`link-${index}`}
                                                value={link.link || `link-${index}`}
                                                className="py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                              >
                                                <div className="flex items-start space-x-2 w-full">
                                                  {link.logo && (
                                                    <img
                                                      src={link.logo}
                                                      alt={link.nickname || "Provider logo"}
                                                      className="h-5 w-5 object-contain flex-shrink-0 mt-0.5"
                                                    />
                                                  )}
                                                  <div className="flex flex-col items-start">
                                                    <span className="text-sm font-medium">{link.nickname || "Provider"}</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[250px] text-left">
                                                      {link.link}
                                                    </span>
                                                  </div>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </div>
                                        ) : searchResults && searchResults.length > 0 ? (
                                          <div className="py-1 px-1">
                                            <div className="text-xs font-medium text-muted-foreground px-2 py-1">
                                              Search results
                                            </div>
                                            {searchResults.map((result, index) => (
                                              <SelectItem
                                                key={index}
                                                value={result.url || `link-${index}`}
                                                className="py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                                              >
                                                <div className="flex flex-col items-start w-full">
                                                  <span className="text-sm truncate">{result.url}</span>
                                                </div>
                                              </SelectItem>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-center py-3 text-muted-foreground">
                                            No links found
                                          </div>
                                        )}
                                      </SelectContent>
                                    </Select>

                                    {/* Custom URL Modal */}
                                    <Dialog open={showCustomUrlModal} onOpenChange={setShowCustomUrlModal}>
                                      <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                          <DialogTitle className="flex items-center gap-2">
                                            <ExternalLink className="h-5 w-5 text-primary" />
                                            Add custom URL
                                          </DialogTitle>
                                          <DialogDescription>
                                            Enter a custom URL to use for this verification button.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <form
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSaveCustomUrl();
                                          }}
                                        >
                                          <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                              <Label htmlFor="custom-url-input">URL</Label>
                                              <Input
                                                id="custom-url-input"
                                                placeholder="Enter custom URL"
                                                value={customUrl}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  setCustomUrl(value);
                                                  // Clear error when typing
                                                  if (urlError) setUrlError(null);
                                                }}
                                                className={`w-full ${urlError ? "border-red-500 focus:ring-red-500/20" : ""}`}
                                                autoFocus
                                              />
                                              <p className={`text-xs ${urlError ? "text-red-500" : "text-muted-foreground"}`}>
                                                {urlError || "Please enter a valid URL including http:// or https://"}
                                              </p>
                                            </div>
                                          </div>
                                          <DialogFooter className="flex space-x-2 justify-end">
                                            <Button type="button" variant="outline" onClick={() => setShowCustomUrlModal(false)}>
                                              Cancel
                                            </Button>
                                            <Button
                                              type="submit"
                                              disabled={!customUrl}
                                              className="bg-primary text-white hover:bg-primary/90"
                                            >
                                              Add
                                            </Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Country Limitation */}
                      <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">Region Limitation</span>
                            <span className="text-sm text-muted-foreground">Restrict access to specific countries</span>
                          </div>
                          <FancySwitchToggle
                            checked={localLimitCountryEnabled}
                            onCheckedChange={(isChecked) => {
                              console.log("LimitCountry toggle clicked:", isChecked);
                              onLimitCountryEnabledChange?.(isChecked);
                              setLocalLimitCountryEnabled(isChecked);
                            }}
                          />
                        </div>

                        {localLimitCountryEnabled && (
                          <div className="space-y-3 mt-2 pl-1">
                            <Label className="text-sm">Selected Countries</Label>
                            <div className="flex flex-wrap gap-1.5 mb-3 min-h-8">
                              {selectedCountries.length > 0 ? (
                                selectedCountries.map((countryItem, index) => {
                                  // Use the country object directly instead of finding it by key
                                  const countryKey = typeof countryItem === "string" ? countryItem : countryItem.value;
                                  const country =
                                    typeof countryItem === "string"
                                      ? countryOptions.find((c) => c.value === countryItem)
                                      : countryItem;

                                  return (
                                    <Badge
                                      key={countryKey || index}
                                      variant="outline"
                                      className="flex items-center gap-1 py-1 px-2 bg-primary/5 hover:bg-primary/10"
                                    >
                                      {country?.flag && (
                                        <img src={country.flag} alt={country.label} className="h-4 w-auto object-contain" />
                                      )}
                                      <span>{country?.label || countryKey}</span>
                                      <button
                                        onClick={() =>
                                          onSelectedCountriesChange(
                                            selectedCountries.filter((c) =>
                                              typeof c === "string" ? c !== countryKey : c.value !== countryKey
                                            )
                                          )
                                        }
                                        className="ml-1 hover:text-destructive"
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  );
                                })
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No countries selected</p>
                              )}
                            </div>

                            <MultiSelectDropdown
                              options={countryOptions}
                              selected={selectedCountries}
                              onChange={(values) => {
                                // Convert selected values to full country objects
                                const fullCountries = values.map((value) => {
                                  const countryObj = countryOptions.find((c) => c.value === value);
                                  return countryObj || value;
                                });
                                onSelectedCountriesChange(fullCountries);
                              }}
                              placeholder="Select countries"
                              className="w-full"
                              emptyMessage="No countries available"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Multi-download & Live feedback configuration - Now as a separate card */}
        {(multidownload || livefeedback) && (
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 mt-6">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="multi-download-config" className="border-none">
                  <AccordionTrigger className="py-2 px-0 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">Multi-download & Live feedback configuration</h2>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-6">
                      {/* Submission override settings - Only show when livefeedback is ON */}
                      {livefeedback && (
                        <>
                          <div className="space-y-4">
                            <h3 className="text-base font-medium text-muted-foreground">Submission Settings</h3>

                            <div className="flex items-center gap-2 p-2 rounded-md">
                              <FancySwitchToggle
                                checked={allowSubmissionOverride}
                                onCheckedChange={onAllowSubmissionOverrideChange}
                              />
                              <div className="space-y-0.5">
                                <Label>Allow submission override period</Label>
                                <p className="text-xs text-muted-foreground">
                                  Allows users to submit documents outside the defined verification period
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 p-2 rounded-md">
                              <FancySwitchToggle
                                checked={allowMissingStatements}
                                onCheckedChange={onAllowMissingStatementsChange}
                              />
                              <div className="space-y-0.5">
                                <Label>Allow missing statements within the expected period</Label>
                                <p className="text-xs text-muted-foreground">
                                  Accepts incomplete document sets with gaps in the date range
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Date range settings - Only show when livefeedback is ON and multidownload is OFF */}
                          {!multidownload && (
                            <div className="space-y-4">
                              <h3 className="text-base font-medium text-muted-foreground">Period Configuration</h3>

                              <div>
                                <div className="flex flex-col md:flex-row gap-4 mb-2">
                                  <div className="flex-1">
                                    <Label className="block mb-2">Expected number of days within the valid date range</Label>
                                    <Input
                                      type="number"
                                      className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                                      placeholder="Enter number of days"
                                      defaultValue="30"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Label className="block mb-1">Valid date range (in days)</Label>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      (Requested period: 8 Mar 2025 - 7 Apr 2025 i.e. approx 1.0 months )
                                    </p>
                                    <Input
                                      type="number"
                                      className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                                      placeholder="Enter date range"
                                      defaultValue="30"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Verification Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Allow Resubmission</Label>
                  <p className="text-sm text-muted-foreground">Enable resubmission with same track ID</p>
                </div>
                <FancySwitchToggle
                  checked={localResubmission}
                  onCheckedChange={(isChecked) => {
                    console.log("Resubmission toggle clicked:", isChecked);
                    onResubmissionChange?.(isChecked);
                    setLocalResubmission(isChecked);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Extract all transactions</Label>
                  <p className="text-sm text-muted-foreground">Include all transaction data from documents</p>
                </div>
                <FancySwitchToggle
                  checked={localExtractAllTransaction}
                  onCheckedChange={(isChecked) => {
                    console.log("ExtractAllTransaction toggle clicked:", isChecked);
                    onExtractAllTransactionChange?.(isChecked);
                    setLocalExtractAllTransaction(isChecked);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Label>Calculate balance as on date</Label>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Calculate account balance based on submission date</p>
                </div>
                <FancySwitchToggle
                  checked={localCalculateBalanceAsOnDate}
                  onCheckedChange={(isChecked) => {
                    console.log("CalculateBalanceAsOnDate toggle clicked:", isChecked);
                    onCalculateBalanceAsOnDateChange?.(isChecked);
                    setLocalCalculateBalanceAsOnDate(isChecked);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Image Upload</Label>
                  <p className="text-sm text-muted-foreground">Allow image uploads during verification</p>
                </div>
                <FancySwitchToggle
                  checked={localImageUpload}
                  onCheckedChange={(isChecked) => {
                    console.log("ImageUpload toggle clicked:", isChecked);
                    onImageUploadChange?.(isChecked);
                    setLocalImageUpload(isChecked);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Multi-download</Label>
                  <p className="text-sm text-muted-foreground">Allow multiple documents download</p>
                </div>
                <FancySwitchToggle
                  checked={localMultiDownload}
                  onCheckedChange={(isChecked) => {
                    console.log("MultiDownload toggle clicked:", isChecked);
                    onMultiDownloadChange?.(isChecked);
                    setLocalMultiDownload(isChecked);
                  }}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3 relative">
                <div className="space-y-0.5">
                  <Label>Live Feedback</Label>
                  <p className="text-sm text-muted-foreground">Enable real-time verification feedback</p>
                </div>
                <div className="flex items-center gap-2">
                  {multidownload && (
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-800">
                      Required with multi-download
                    </span>
                  )}
                  <FancySwitchToggle
                    checked={localLiveFeedback}
                    onCheckedChange={(isChecked) => {
                      console.log("LiveFeedback toggle clicked:", isChecked);
                      onLiveFeedbackChange?.(isChecked);
                      setLocalLiveFeedback(isChecked);
                    }}
                    disabled={multidownload} // Disable toggle when multidownload is ON
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
