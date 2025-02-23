import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Settings, Link, FileText, Camera, Upload, Globe, AlertCircle, ExternalLink, ArrowLeft, ChevronDown } from "lucide-react";

interface BasicTabProps {
  verificationMethod: string;
  directUrlEnabled: boolean;
  selectedCountry: string;
  limitCountryEnabled: boolean;
  selectedCountries: string[];
  allowSubmissionOverride: boolean;
  allowMissingStatements: boolean;
  onVerificationMethodChange: (value: string) => void;
  onDirectUrlChange: (checked: boolean) => void;
  onSelectedCountryChange: (value: string) => void;
  onLimitCountryEnabledChange: (checked: boolean) => void;
  onSelectedCountriesChange: (countries: string[]) => void;
  onAllowSubmissionOverrideChange: (checked: boolean) => void;
  onAllowMissingStatementsChange: (checked: boolean) => void;
  params: { id: string };
}

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

export const BasicTab: React.FC<BasicTabProps> = ({
  verificationMethod,
  directUrlEnabled,
  selectedCountry,
  limitCountryEnabled,
  selectedCountries,
  allowSubmissionOverride,
  allowMissingStatements,
  onVerificationMethodChange,
  onDirectUrlChange,
  onSelectedCountryChange,
  onLimitCountryEnabledChange,
  onSelectedCountriesChange,
  onAllowSubmissionOverrideChange,
  onAllowMissingStatementsChange,
  params,
}) => {
  return (
    <>
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

              {/* URL Configuration */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Link className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">URL Configuration</h2>
                </div>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={directUrlEnabled} onCheckedChange={onDirectUrlChange} />
                      <Label>Directly open a fixed URL</Label>
                    </div>

                    {directUrlEnabled && (
                      <div className="space-y-2">
                        <Select value={selectedCountry} onValueChange={onSelectedCountryChange}>
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
                      <Switch checked={limitCountryEnabled} onCheckedChange={onLimitCountryEnabledChange} />
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
                                onClick={() => onSelectedCountriesChange(selectedCountries.filter((c) => c !== country))}
                                className="hover:text-[#00A5B8]/80"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <MultiSelect
                          value={selectedCountries}
                          onValueChange={onSelectedCountriesChange}
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

              {/* Multi-download & Live feedback configuration */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Multi-download & Live feedback configuration</h2>
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch checked={allowSubmissionOverride} onCheckedChange={onAllowSubmissionOverrideChange} />
                      <Label>Allow submission by overriding below conditions</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch checked={allowMissingStatements} onCheckedChange={onAllowMissingStatementsChange} />
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
                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">{params.id}</code>
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
  );
};
