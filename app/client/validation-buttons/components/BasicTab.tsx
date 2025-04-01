import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FancySwitchToggle } from "@/components/ui/fancy-switch-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Link, FileText, Camera, Upload, Globe, AlertCircle, ChevronDown, RefreshCw, Check } from "lucide-react";
import { useAppDispatch } from "@/app/store/hooks";
import { setName } from "@/app/store/features/buttonSlice";
import { useState, useEffect, useCallback } from "react";
import { MultiSelectDropdown, OptionType } from "@/components/ui/multi-select-dropdown";
import { useSelector } from "react-redux";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// Data models
interface BasicTabState {
  // Button data
  name: string;

  // Verification settings
  verificationMethod: string;
  verificationCategory?: string;
  verificationSubCategory?: string[];

  // URL settings
  directUrlEnabled: boolean;
  selectedCountry: string;
  limitCountryEnabled: boolean;
  selectedCountries: string[];

  // Submission settings
  allowSubmissionOverride: boolean;
  allowMissingStatements: boolean;

  // Others
  params: { id: string };
}

// All handler types defined together
interface BasicTabHandlers {
  onNameChange: (value: string) => void;
  onVerificationMethodChange: (value: string) => void;
  onVerificationCategoryChange: (value: string) => void;
  onVerificationSubCategoryChange: (values: string[]) => void;
  onDirectUrlChange: (checked: boolean) => void;
  onSelectedCountryChange: (value: string) => void;
  onLimitCountryEnabledChange: (checked: boolean) => void;
  onSelectedCountriesChange: (countries: string[]) => void;
  onAllowSubmissionOverrideChange: (checked: boolean) => void;
  onAllowMissingStatementsChange: (checked: boolean) => void;
  onFetchCountryLinks?: (countryUniqueKey: string, category: string) => Promise<any>;
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
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  children: React.ReactNode;
}) => {
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
      value=""
      onValueChange={(newValue) => {
        if (!value.includes(newValue)) {
          onValueChange([...value, newValue]);
        } else {
          onValueChange(value.filter((v) => v !== newValue));
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
    selectedCountries,
    allowSubmissionOverride,
    allowMissingStatements,
    params,
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
    onFetchCountryLinks,
  } = props;

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
  // State to store the input value while typing
  const [inputValue, setInputValue] = useState(name);
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
                                <Select value={selectedCountry} onValueChange={onSelectedCountryChange}>
                                  <SelectTrigger id="country" className="w-full flex items-center">
                                    <div className="flex items-center space-x-2">
                                      {selectedCountry && countryOptions.length > 0 && (
                                        <img
                                          src={countryOptions.find((c) => c.value === selectedCountry)?.flag || ""}
                                          alt="Country flag"
                                          className="h-4 w-6"
                                        />
                                      )}
                                      <SelectValue placeholder="Select a country" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[400px]">
                                    {countryOptions.map((country) => (
                                      <SelectItem key={country.value} value={country.value} className="py-2">
                                        <div className="flex items-center space-x-2">
                                          <img src={country.flag} alt={country.label} className="h-4 w-6" />
                                          <span>{country.label}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                {isLoadingCountryLinks && (
                                  <div className="mt-2 text-sm text-primary flex items-center">
                                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                    <span>Loading country links...</span>
                                  </div>
                                )}

                                {countryLinksError && (
                                  <div className="mt-2 text-sm text-destructive flex items-center">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    <span>
                                      {typeof countryLinksError === "string" ? countryLinksError : "Failed to load country links"}
                                    </span>
                                  </div>
                                )}

                                {countryLinksData.data && !isLoadingCountryLinks && (
                                  <div className="mt-2 text-sm text-green-600 flex items-center">
                                    <Check className="h-3 w-3 mr-1" />
                                    <span>Country links loaded successfully</span>
                                  </div>
                                )}
                              </div>
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
                          <FancySwitchToggle checked={limitCountryEnabled} onCheckedChange={onLimitCountryEnabledChange} />
                        </div>

                        {limitCountryEnabled && (
                          <div className="space-y-3 mt-2 pl-1">
                            <Label className="text-sm">Selected Countries</Label>
                            <div className="flex flex-wrap gap-1.5 mb-3 min-h-8">
                              {selectedCountries.length > 0 ? (
                                selectedCountries.map((countryKey) => {
                                  const country = countryOptions.find((c) => c.value === countryKey);
                                  return (
                                    <Badge
                                      key={countryKey}
                                      variant="outline"
                                      className="flex items-center gap-1 py-1 px-2 bg-primary/5 hover:bg-primary/10"
                                    >
                                      {country?.flag && (
                                        <img src={country.flag} alt={country.label} className="h-4 w-auto object-contain" />
                                      )}
                                      <span>{country?.label || countryKey}</span>
                                      <button
                                        onClick={() =>
                                          onSelectedCountriesChange(selectedCountries.filter((c) => c !== countryKey))
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
                              onChange={onSelectedCountriesChange}
                              placeholder="Select countries"
                              className="w-full"
                              emptyMessage="No countries available"
                            />
                          </div>
                        )}
                      </div>
                      {/* Google Search Toggle */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg flex flex-col">
                        <div className="space-y-2 ">
                          <div className="font-medium">Search Integration</div>
                          <p className="text-sm text-muted-foreground">Enable Google search for user assistance</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>Show Google search</Label>
                          <FancySwitchToggle />
                        </div>
                      </div>

                      {/* Expiry Setting */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg">
                        <div className="space-y-1.5 mb-3">
                          <div className="font-medium">Invite Link Expiry</div>
                          <p className="text-sm text-muted-foreground">Default is 30 days (720 hours)</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                          <Input
                            type="number"
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            placeholder="Enter hours"
                            defaultValue="720"
                          />
                          <Badge className="whitespace-nowrap">hours</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Multi-download & Live feedback configuration - Now as a separate card */}
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
                    {/* Group the main toggles together in a visually distinct card */}

                    {/* Submission override settings */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-muted-foreground">Submission Settings</h3>

                      <div className="flex items-center gap-2 p-2 rounded-md ">
                        <FancySwitchToggle checked={allowSubmissionOverride} onCheckedChange={onAllowSubmissionOverrideChange} />
                        <Label>Allow submission by overriding conditions</Label>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-md">
                        <FancySwitchToggle checked={allowMissingStatements} onCheckedChange={onAllowMissingStatementsChange} />
                        <Label>Allow missing statements within the expected period</Label>
                      </div>
                    </div>

                    {/* Date range settings */}
                    <div className="space-y-4">
                      <h3 className="text-base font-medium text-muted-foreground">Period Configuration</h3>

                      <div>
                        <div className="flex flex-col md:flex-row gap-4 mb-2">
                          <div className="flex-1">
                            <Label className="block mb-2">Expected number of days within valid range</Label>
                            <p className="text-xs text-muted-foreground mb-1">(Default: 30 days)</p>
                          </div>
                          <div className="flex-1">
                            <Label className="block mb-1">Valid date range (in days)</Label>
                            <p className="text-xs text-muted-foreground mb-1">(Requested period: 26 Dec 7380 - 22 Feb 2025)</p>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <Input
                              type="number"
                              className="w-full transition-all focus:ring-2 focus:ring-primary/20"
                              placeholder="Enter number of days"
                              defaultValue="3434"
                            />
                          </div>
                          <div className="flex-1">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
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
                <FancySwitchToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Extract all transactions</Label>
                  <p className="text-sm text-muted-foreground">Include all transaction data from documents</p>
                </div>
                <FancySwitchToggle />
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
                <FancySwitchToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Image Upload</Label>
                  <p className="text-sm text-muted-foreground">Allow image uploads during verification</p>
                </div>
                <FancySwitchToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Multi-download</Label>
                  <p className="text-sm text-muted-foreground">Allow multiple documents download</p>
                </div>
                <FancySwitchToggle />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div className="space-y-0.5">
                  <Label>Live Feedback</Label>
                  <p className="text-sm text-muted-foreground">Enable real-time verification feedback</p>
                </div>
                <FancySwitchToggle />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
