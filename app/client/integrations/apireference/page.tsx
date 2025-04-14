"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";
import SwaggerUI from "@/components/api-documentation/SwaggerUI";
import { 
  CodeIcon, 
  FileJson, 
  ArrowLeft, 
  KeyIcon, 
  BookIcon, 
  ServerIcon, 
  GlobeIcon, 
  ShieldIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  LinkIcon,
  FileIcon,
  Copy,
  RefreshCw,
  CheckIcon,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";

// Import cookies service
import { cookies } from "../../../services/cookie.service";

// Import API service
import { apiService } from "../../../services/api.service";

// Import Button service
import { buttonService } from "../../../services/button.service";

// Define interfaces for button options
interface ButtonOption {
  id: string;
  name: string;
}

export default function ApiReferencePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentButtonId, setCurrentButtonId] = useState("");
  const [apikey, setApikey] = useState("");
  const [token, setToken] = useState("");
  
  // Define ButtonOption type for buttonList
  interface ButtonOption {
    id: string;
    name: string;
  }
  
  // Remove default values, start with empty array
  const [buttonList, setButtonList] = useState<ButtonOption[]>([]);
  
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [modal, setModal] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("user@company.com");
  const [ownerEmail, setOwnerEmail] = useState("admin@company.com");
  const [isSwaggerLoaded, setIsSwaggerLoaded] = useState(false);
  const [altrmsgtoken, setAletrmsgtoken] = useState(false);
  const [generateErrorMsg, setGenerateErrorMsg] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [isLoadingButtons, setIsLoadingButtons] = useState(false);
  const [buttonLoadError, setButtonLoadError] = useState<string | null>(null);
  const [isLoadingButtonDetails, setIsLoadingButtonDetails] = useState(false);
  const [buttonDetailsError, setButtonDetailsError] = useState<string | null>(null);
  const [tokenAlert, setTokenAlert] = useState<{show: boolean, success: boolean, message: string}>({
    show: false,
    success: false,
    message: ''
  });
  const [hasButtonData, setHasButtonData] = useState(false);

  // Helper function to get the current button name
  const getCurrentButtonName = () => {
    const currentButton = buttonList.find(button => button.id === currentButtonId);
    return currentButton?.name || "Document verification API";
  };

  useEffect(() => {
    // Get apiKey from cookies
    const apiKeyFromCookie = cookies.get("apikey");
    if (apiKeyFromCookie) {
      setApikey(apiKeyFromCookie);
      console.log("API key retrieved from cookie:", apiKeyFromCookie);
    }
    
    // Get token from cookies - change "secrettoken" to "token"
    const tokenFromCookie = cookies.get("token");
    if (tokenFromCookie) {
      setToken(tokenFromCookie);
      console.log("Token retrieved from cookie:", tokenFromCookie);
    } else {
      console.log("No token found in cookies");
    }

    // Fetch button list from API
    const fetchButtonList = async () => {
      try {
        setIsLoadingButtons(true);
        setButtonLoadError(null);
        const response = await buttonService.getButtons();
        console.log("Raw API Response:", response); // Log the raw response
        
        if (response.success) {
          // Handle different possible response structures
          let buttonsData = [];
          
          if (response.data && Array.isArray(response.data)) {
            // If response.data is directly an array
            buttonsData = response.data;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // If response.data.data is an array
            buttonsData = response.data.data;
          } else if (response.data) {
            // If response.data is an object with button data
            console.log("Unexpected data structure, trying to extract buttons:", response.data);
            // Try to extract buttons from the object
            const possibleButtons = Object.values(response.data).filter(val => 
              typeof val === 'object' && val !== null && ('id' in val || 'buttonid' in val || 'name' in val)
            );
            if (possibleButtons.length) {
              buttonsData = possibleButtons;
            }
          }
          
          console.log("Extracted buttons data:", buttonsData);
          
          // Transform the data to match the ButtonOption interface
          const buttons = buttonsData.map((button: any) => {
            console.log("Processing button:", button);
            // Check for btndata nested object which contains the name
            const btnData = button.btndata || {};
            
            return {
              // First check for buttonid at the root level, then in btndata, then fallback to id or _id
              id: button.buttonid || btnData.buttonid || button.id || btnData.id || button._id || "",
              // First check for name in btndata, then at root level
              name: btnData.name || button.name || ""
            };
          }).filter((button: ButtonOption) => button.id && button.name); // Only include buttons with both id and name
          
          console.log("Transformed buttons:", buttons);
            
          if (buttons.length > 0) {
            setButtonList(buttons);
            setHasButtonData(true); // Set flag indicating we have button data
            // Always set the first button as the current button
            setCurrentButtonId(buttons[0].id);
            
            // Also fetch details for this button immediately
            fetchButtonDetails(buttons[0].id);
          } else {
            console.warn("No valid buttons returned from API");
            setHasButtonData(false);
            setButtonList([]);
          }
        } else {
          console.error("Failed to fetch button list:", response.error);
          setButtonLoadError(response.error || "Failed to fetch button list");
          setHasButtonData(false);
        }
      } catch (error: any) {
        console.error("Error fetching button list:", error);
        setButtonLoadError(error.message || "An error occurred while fetching the button list.");
        setHasButtonData(false);
      } finally {
        setIsLoadingButtons(false);
      }
    };

    // Create a function to fetch button details that can be called here
    const fetchButtonDetails = async (buttonId: string) => {
      try {
        setIsLoadingButtonDetails(true);
        console.log("Fetching details for button:", buttonId);
        const response = await buttonService.getButton(buttonId);
        
        if (response.success && response.data) {
          // Check different possible data structures
          const buttonData = response.data.btndata || response.data;
          
          // Set API key from button data
          if (buttonData.apikey) {
            setApikey(buttonData.apikey);
            // Optionally update the cookie
            cookies.set("apikey", buttonData.apikey);
          } else if (response.data.apikey) {
            setApikey(response.data.apikey);
            cookies.set("apikey", response.data.apikey);
          }

          // Set token from button data
          if (buttonData.token) {
            setToken(buttonData.token);
            // Optionally update the cookie
            cookies.set("token", buttonData.token);
          } else if (response.data.token) {
            setToken(response.data.token);
            cookies.set("token", response.data.token);
          }
        }
      } catch (error) {
        console.error("Error fetching initial button details:", error);
      } finally {
        setIsLoadingButtonDetails(false);
      }
    };

    fetchButtonList();

    // for demo purposes, let's make this admin
    setIsAdmin(true);
    setCurrentEmail("admin@company.com");
    
    // In a real app, you'd determine this from user session:
    // setIsAdmin(session?.user?.role === "admin");
    // setCurrentEmail(session?.user?.email);
  }, []);

  const handleButtonChange = (value: string) => {
    setCurrentButtonId(value);
    setButtonDetailsError(null);
    
    // Fetch the API key and token for the selected button environment
    const fetchButtonDetails = async () => {
      try {
        setIsLoadingButtonDetails(true);
        console.log("Fetching details for button:", value);
        const response = await buttonService.getButton(value);
        console.log("Button details raw response:", response);
        
        if (response.success && response.data) {
          // Check different possible data structures
          const buttonData = response.data.btndata || response.data;
          console.log("Extracted button data:", buttonData);
          
          // Set API key from button data
          if (buttonData.apikey) {
            setApikey(buttonData.apikey);
            // Optionally update the cookie
            cookies.set("apikey", buttonData.apikey);
            console.log("API key set from button data:", buttonData.apikey);
          } else if (response.data.apikey) {
            setApikey(response.data.apikey);
            cookies.set("apikey", response.data.apikey);
            console.log("API key set from response.data:", response.data.apikey);
          } else {
            console.warn("No API key found in button data");
          }

          // Set token from button data
          if (buttonData.token) {
            setToken(buttonData.token);
            // Optionally update the cookie
            cookies.set("token", buttonData.token);
            console.log("Token set from button data:", buttonData.token);
          } else if (response.data.token) {
            setToken(response.data.token);
            cookies.set("token", response.data.token);
            console.log("Token set from response.data:", response.data.token);
          } else {
            console.warn("No token found in button data");
          }
        } else {
          console.error("Failed to fetch button details:", response.error);
          setButtonDetailsError(response.error || "Failed to fetch button details");
        }
      } catch (error: any) {
        console.error("Error fetching button details:", error);
        setButtonDetailsError(error.message || "An error occurred while fetching button details");
      } finally {
        setIsLoadingButtonDetails(false);
      }
    };

    fetchButtonDetails();
  };

  const copyToClipboard = (text: string, isToken: boolean = false) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          if (isToken) {
            setCopiedToken(true);
            setTimeout(() => setCopiedToken(false), 3000);
          } else {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          }
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      // Fallback for environments without clipboard API
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (isToken) {
          setCopiedToken(true);
          setTimeout(() => setCopiedToken(false), 3000);
        } else {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        }
      } catch (err) {
        console.error('Fallback: Failed to copy text: ', err);
      }
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const generateNewToken = async () => {
    try {
      setIsGeneratingToken(true);
      
      // Get necessary values from cookies or props
      const token = cookies.get("token") || "";
      const orgId = cookies.get("orgid") || "";
      const apikey = cookies.get("apikey") || "";
      
      // Call the service method
      const response = await apiService.generateSecretToken(token, orgId, apikey);
      
      if (response.success) {
        // Show success message
        setTokenAlert({
          show: true,
          success: true,
          message: "New secret token generated successfully!"
        });
        
        // Update token in your component state if needed
        // setToken(response.data); // Uncomment if you need to update UI
      } else {
        // Show error message
        setTokenAlert({
          show: true,
          success: false,
          message: `Failed to generate token: ${response.error}`
        });
      }
    } catch (error) {
      console.error('Error generating new token:', error);
      setTokenAlert({
        show: true,
        success: false,
        message: "An unexpected error occurred while generating the token"
      });
    } finally {
      setIsGeneratingToken(false);
      
      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setTokenAlert(prev => ({...prev, show: false}));
      }, 3000);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <div className="flex-1 relative overflow-auto">
          <PageHeader
            title="API Reference"
            description="Explore and test our API endpoints for seamless integration"
          />

          <div className="container mx-auto px-6 py-8">
            <Link 
              href="/client/integrations" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-8 
                       bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Integrations
            </Link>

            {/* Base URL Banner */}
            <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 
                        border border-indigo-100 dark:border-indigo-800/30 rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Integration API of document verification button for businesses
                </h2>
                <div className="flex items-center mt-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-md mr-3">
                    <GlobeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">Base URL:</span>
                    <code className="font-mono bg-white dark:bg-gray-800 px-3 py-1 ml-2 rounded-md text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-gray-700">
                      api.dirolabs.com
                    </code>
                  
                  </div>
                </div>
              </div>
            </div>

            {/* API Overview Cards */}
            <div className="grid grid-cols-1 gap-6 mb-10">
              {/* API Key & Token Selection Card - Full Width */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 
                           shadow-sm hover:shadow-md transition-shadow w-full">
                
                {!isAdmin && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 
                              rounded-lg p-2.5 text-sm text-amber-700 dark:text-amber-300 font-medium flex items-center mb-6">
                    <ShieldIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>Login via admin account to access API credentials</span>
                  </div>
                )}
                
                {isAdmin && (
                  <div className="space-y-6">
                    {/* Row with select, public API key and secret token */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mx-auto w-full">
                      {/* Select Button */}
                      <div className="flex items-center gap-3 lg:w-auto flex-shrink-0 mx-auto lg:mx-0">
                        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex-shrink-0">
                          <ServerIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <Label htmlFor="select-button" className="font-medium text-sm whitespace-nowrap">
                          Select API Environment
                        </Label>
                        
                        {isLoadingButtons ? (
                          <div className="w-[230px] h-10 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                            <Loader2 className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400 animate-spin" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Loading environments...</span>
                          </div>
                        ) : hasButtonData ? (
                          <Select value={currentButtonId} onValueChange={handleButtonChange} disabled={isLoadingButtons}>
                            <SelectTrigger className="w-[230px] border-indigo-100 dark:border-indigo-900/40 focus:ring-indigo-500 bg-white dark:bg-gray-800">
                              <div className="flex items-center justify-between w-full overflow-hidden">
                                <div className="truncate font-medium text-indigo-600 dark:text-indigo-400">
                                  {getCurrentButtonName()}
                                </div>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {buttonLoadError ? (
                                <div className="px-2 py-1 text-sm text-red-500">{buttonLoadError}</div>
                              ) : (
                                buttonList.map((button) => (
                                  <SelectItem 
                                    key={button.id} 
                                    value={button.id}
                                    className="cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                                  >
                                    {button.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="w-[230px] h-10 px-3 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-md flex items-center justify-center">
                            {buttonLoadError ? (
                              <span className="text-sm text-red-600 dark:text-red-400">{buttonLoadError}</span>
                            ) : (
                              <span className="text-sm text-red-600 dark:text-red-400">No environments available</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Only show credential sections if we have button data */}
                      {hasButtonData ? (
                        <>
                          {/* Public API Key */}
                          <div className="flex-1 space-y-2 lg:space-y-0 mx-auto text-center">
                            <div className="flex items-center justify-center">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-2 flex-shrink-0">
                                <KeyIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <h4 className="text-base font-semibold text-blue-800 dark:text-blue-300 whitespace-nowrap">Public API Key</h4>
                              
                              {isLoadingButtonDetails ? (
                                <div className="ml-2 p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-md">
                                  <Loader2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                                </div>
                              ) : (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button 
                                        className="ml-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 
                                                  dark:hover:text-blue-300 bg-blue-100 dark:bg-blue-900/40 p-1.5 rounded-md
                                                  hover:bg-blue-200 dark:hover:bg-blue-800/60 transition-colors"
                                        onClick={() => copyToClipboard(apikey)}
                                        disabled={!apikey || isLoadingButtonDetails}
                                      >
                                        {copied ? (
                                          <CheckIcon className="h-3.5 w-3.5" />
                                        ) : (
                                          <Copy className="h-3.5 w-3.5" />
                                        )}
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>

                          {/* Secret Access Token */}
                          <div className="flex-1 space-y-2 lg:space-y-0 mx-auto text-center">
                            <div className="flex items-center justify-center">
                              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-2 flex-shrink-0">
                                <ShieldIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <h4 className="text-base font-semibold text-emerald-800 dark:text-emerald-300 whitespace-nowrap">Secret Access Token</h4>
                              
                              <div className="ml-2 flex items-center gap-2">
                                {isLoadingButtonDetails ? (
                                  <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-md">
                                    <Loader2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" />
                                  </div>
                                ) : (
                                  <>
                                    {currentEmail === ownerEmail && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 
                                                        dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-md
                                                        hover:bg-emerald-200 dark:hover:bg-emerald-800/60 transition-colors"
                                              onClick={generateNewToken}
                                              disabled={isGeneratingToken || isLoadingButtonDetails || !token}
                                            >
                                              {isGeneratingToken ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                              ) : (
                                                <RefreshCw className="h-3.5 w-3.5" />
                                              )}
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent side="top">
                                            <p>Generate new token</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                    
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="text-emerald-500 hover:text-emerald-700 dark:text-emerald-400 
                                                      dark:hover:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 p-1.5 rounded-md
                                                      hover:bg-emerald-200 dark:hover:bg-emerald-800/60 transition-colors"
                                            onClick={() => copyToClipboard(token, true)}
                                            disabled={!token || isLoadingButtonDetails}
                                          >
                                            {copiedToken ? (
                                              <CheckIcon className="h-3.5 w-3.5" />
                                            ) : (
                                              <Copy className="h-3.5 w-3.5" />
                                            )}
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                          <p>{copiedToken ? "Copied!" : "Copy to clipboard"}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full flex-1 mt-4 lg:mt-0">
                          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                            <div className="text-gray-600 dark:text-gray-400">
                              {buttonLoadError ? (
                                <p>Failed to load API environments. Please try again later.</p>
                              ) : (
                                <p>No API environments available. The API returned no data.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Endpoints overview section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/40 dark:to-indigo-900/20 
                          rounded-lg border border-blue-100 dark:border-blue-900/30 p-6 mb-10 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Available API Endpoints</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-md mr-3">
                      <CodeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold">Capture Process API</h3>
                  </div>
                  <ul className="space-y-2 ml-9">
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">GET</code>
                      <span>get-verification-link</span>
                    </li>
                  
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-md mr-3">
                      <FileIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-semibold">Smart Upload API</h3>
                  </div>
                  <ul className="space-y-2 ml-9">
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">POST</code>
                      <span>smartupload </span>
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">GET</code>
                      <span>smartfeedback</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-md mr-3">
                      <DownloadIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-semibold">After Download API</h3>
                  </div>
                  <ul className="space-y-2 ml-9">
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">POST</code>
                      <span>pdf-to-json</span>
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">POST</code>
                      <span>extractTransaction</span>
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">GET</code>
                      <span>download-native-originals</span>
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">GET</code>
                      <span>download-original-pdf-cert</span>
                    </li>
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">GET</code>
                      <span>session-info</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-md mr-3">
                      <FileTextIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="font-semibold">Delete Documents API</h3>
                  </div>
                  <ul className="space-y-2 ml-9">
                    <li className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">DELETE</code>
                      <span>Delete document</span>
                    </li>
                  
                  </ul>
                </div>
              </div>
            </div>


            {/* Main API Documentation Section */}
            <div className="bg-card rounded-lg border shadow-lg dark:shadow-gray-900/30 overflow-hidden mb-10">
              <div className="p-0">
                {hasButtonData ? (
                  <SwaggerUI endpoint="verification" token={token} />
                ) : (
                  <div className="p-8 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-12 max-w-2xl mx-auto">
                      <ServerIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">API documentation unavailable</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Unable to load API documentation because no environment data is available.
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-sm">
                        Please ensure your API is returning valid environment data.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Resources section */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row items-center">
                  {/* <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3 md:mb-0 md:mr-4 flex-shrink-0">
                    <DownloadIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div> */}
                  <div className="text-center md:text-left md:flex-1">
                    <h3 className="text-base font-semibold mb-1">Download postman collection for DIRO APIs</h3>
                  </div>
                  <div className="flex space-x-3 md:flex-shrink-0">
                    <a 
                      href="/downloads/Postman-collection.json" 
                      download="Postman-collection.json"
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm hover:shadow"
                    >
                      <DownloadIcon className="h-4 w-4 mr-1" />
                      
                    </a>
                 
                  </div>
                </div>
              </div>
            </div>
            
            {/* Add new full-width footer */}
            <div className="mt-12 -mx-6 px-6 py-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">API Reference Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <a 
                    href="https://diro.io/term-condition/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center group"
                  >
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/60 transition-colors">
                      <FileTextIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-sm transition-colors">
                      Terms of service
                    </span>
                  </a>
                  
                  <a 
                    href="https://diro.io/contact-form/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center group"
                  >
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-full mr-3 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60 transition-colors">
                      <GlobeIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors">
                      DIRO API Support - Website
                    </span>
                  </a>
                  
                  <a 
                    href="mailto:support@diro.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center group"
                  >
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full mr-3 group-hover:bg-green-200 dark:group-hover:bg-green-800/60 transition-colors">
                      <MailIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 text-sm transition-colors">
                      Send email to DIRO API Support
                    </span>
                  </a>
                  
                  <a 
                    href="https://diro.io/term-condition/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center group"
                  >
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full mr-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/60 transition-colors">
                      <FileIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 text-sm transition-colors">
                      DIRO API license v.2.0
                    </span>
                  </a>
                </div>
                
                <div className="text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} DIRO. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Token Regeneration Confirmation Dialog */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>
              Are you sure you want to generate a new token? Your previous token will be invalidated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-2">
            <Button variant="outline" onClick={toggleModal}>Cancel</Button>
            <Button onClick={generateNewToken}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 