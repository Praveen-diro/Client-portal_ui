"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Globe,
  Info,
  LayoutGrid,
  Link2,
  Search,
  Plus,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Check,
  Clipboard,
  Settings,
  ExternalLink,
  Trash2,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";
import { PageContainer } from "@/components/ui/page-container";
import { CopyButton } from "@/components/ui/copy-button";
import { RootState } from "@/app/store/store";
import { store } from "@/app/store/store";
import { orgService } from "@/app/services/org.service";
import { buttonService } from "@/app/services/button.service";
import { getOrgItem, setLoading, setError } from "@/app/store/features/organizationSlice";
import { getButtons, addButton } from "@/app/store/features/buttonSlice";
import Loader from "@/components/ui/loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
// import { getUserFromCookies } from "@/app/store/features/authSlice";

const statsCards = [
  {
    title: "Buttons Overview",
    mainValue: "7",
    subValue: "7 Active",
    description: "Total Buttons",
    icon: LayoutGrid,
    color: "blue",
    subValueColor: "text-green-500",
  },
  {
    title: "Documents Received",
    mainValue: "235",
    subValue: "33.57 Avg. per Button",
    description: "Total Documents",
    icon: FileText,
    color: "teal",
    subValueColor: "text-teal-500",
  },
  {
    title: "Category Breakdown",
    mainValue: "3",
    secondaryValue: "4",
    description: "Address",
    secondaryDescription: "Bank",
    icon: Globe,
    color: "green",
  },
];

// Define the type for formatted buttons
interface FormattedButton {
  id: string;
  name: string;
  category: string;
  documentType: string;
  invites: number;
  documents: number;
  lastModified: string;
  timestamp: number;
}

export default function ValidationButtons() {
  const [buttons, setButtons] = useState<FormattedButton[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedButton, setSelectedButton] = useState<any>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("activeButtons");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const dispatch = useDispatch();

  // Add state for tracking which dropdown is open
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Add state for Create Button modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newButtonName, setNewButtonName] = useState("New Button");
  const [newButtonId, setNewButtonId] = useState<string | null>(null);
  const [adminAccess, setAdminAccess] = useState(true);

  // Add state for copy to production confirmation modal
  const [showCopyConfirmModal, setShowCopyConfirmModal] = useState(false);

  // Add new state for duplicate success modal
  const [showDuplicateSuccessModal, setShowDuplicateSuccessModal] = useState(false);

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add this to access Redux auth state for debugging
  const auth = useSelector((state: RootState) => state.auth);
  const buttonsData = useSelector((state: RootState) => state.buttons.buttons);
  const userRoles = useSelector((state: RootState) => state.auth.roles);
  const authMode = useSelector((state: RootState) => state.auth.authMode);
  console.log("auth state mode", authMode);
  console.log("authMode value", authMode);

  // Add state for button operations
  const [duplicateButtonModalOpen, setDuplicateButtonModalOpen] = useState(false);
  const [googleSheetModalOpen, setGoogleSheetModalOpen] = useState(false);
  const [selectedButtonForAction, setSelectedButtonForAction] = useState<string | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [isCopyingToProduction, setIsCopyingToProduction] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [operationResult, setOperationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showResultMessage, setShowResultMessage] = useState(false);

  // Add state for Custom Success Dialog for Copy to Production
  const [showSuccessCopyDialog, setShowSuccessCopyDialog] = useState(false);

  // Default button template
  const defaultButtonTemplate = {
    user_info: {
      firstname: "",
      lastname: "",
      email: Cookies.get("email"),
      mobile: "",
      mcc: "",
      dob: "",
      zipcode: "",
    },
    org_info: {
      apikey: Cookies.get("apikey"),
    },
    redirecturl: "",
    fullscreenmode: false,
    engagement_callback: true,
    include_pdf: false,
    lockurl: false,
    verification_toggle: true,
    multidownload: false,
    name: "New Button",
    emailnotetemplate: `DIRO support account verification\n\nHello <firstname>,\n\nUser has submitted their document for verification via no-code verification link. Please review the submission to approve/reject the document.\n\n https://client.diro.io/viewdoc/<sessionid>\n\nIn case of any help required, reach out to us at support@diro.io\n\nThanks\n\n<org logo>`,
    coverage: {
      category: "bank",
    },
    capture: {
      warn_case: [
        {
          keyword: "",
          type: "text",
          message: "full name",
          hinttext: "",
        },
      ],
    },
    mode: {
      type: "download",
    },
    mobileview: "Warning",
    alpha2code: null,
    auto_reject_baddoc: true,
    autoclickdata: {},
    country: null,
    customMobileWarningText: "",
    exitpage: {},
    notifySubmission: true,
    reject_reasons: ["Duplicate submission", "Not a bank statement/utility bill", "Does not contain full name"],
    reminders: [
      {
        trigger: "Document not submitted",
        additional_filter: "",
        delay: 0,
        activate: false,
        text: "",
        subject: "",
      },
    ],
    showpreview: true,
    smtp: [
      {
        username: "",
        password: "",
        server: "",
        port: "",
        security: false,
      },
    ],
    welcomePage: {},
  };

  // Add this effect to call getOrgAccount and getButtons when the page loads
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      dispatch(setLoading(true));

      // Fetch organization account data
      try {
        const orgResponse = await orgService.getOrgAccount();
        if (orgResponse.success && orgResponse.data) {
          console.log("Organization account data fetched successfully:", orgResponse.data);
          dispatch(getOrgItem(orgResponse.data));
        } else {
          console.error("Failed to fetch organization account:", orgResponse.error);
          dispatch(setError(orgResponse.error || "Failed to fetch organization account"));
        }
      } catch (error) {
        console.error("Error fetching organization account:", error);
        dispatch(setError(error || "An error occurred while fetching organization account"));
      }

      // Fetch buttons data
      try {
        const buttonsResponse = await buttonService.getButtons();
        if (buttonsResponse.success && buttonsResponse.data) {
          console.log("Buttons data fetched successfully:", buttonsResponse.data);

          // Handle the nested data structure
          const buttonsData = buttonsResponse.data.data || [];

          if (buttonsData.length > 0) {
            // Dispatch buttons data to Redux store
            dispatch(getButtons({ data: buttonsData }));

            // Format the data for local state display
            console.log("buttonsData redux", buttonsData);
            const formattedButtons = buttonsData.map((button: any) => {
              // Store original timestamp for sorting
              const timestamp = button.btndata?.eptime ? parseInt(button.btndata.eptime) : 0;

              // Calculate relative time for display
              let lastModified = "Recently";
              if (button.btndata?.eptime) {
                const buttonDate = new Date(timestamp);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - buttonDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 1) {
                  lastModified = "Today";
                } else if (diffDays === 1) {
                  lastModified = "Yesterday";
                } else if (diffDays < 7) {
                  lastModified = `${diffDays} Days ago`;
                } else {
                  const diffWeeks = Math.floor(diffDays / 7);
                  lastModified = `${diffWeeks} Week${diffWeeks > 1 ? "s" : ""} ago`;
                }
              }

              return {
                id: button.buttonid,
                name: button.btndata?.name || "Unnamed Button",
                category: button.btndata?.coverage?.category || "Other",
                documentType: button.btndata?.type || "Other",
                invites: button.invited || 0,
                documents: button.docreceived || 0,
                lastModified: lastModified,
                timestamp: timestamp, // Add timestamp for sorting
              };
            });

            // Sort buttons by timestamp (newest first)
            formattedButtons.sort((a: FormattedButton, b: FormattedButton) => b.timestamp - a.timestamp);

            setButtons(formattedButtons);
          } else {
            console.error("No buttons data found");
          }
        } else {
          console.error("Failed to fetch buttons:", buttonsResponse.error);
          // Keep the default buttons if there's an error
        }
      } catch (error) {
        console.error("Error fetching buttons:", error);
        // Keep the default buttons if there's an error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setShouldAnimate(true);
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const initialAnimation = shouldAnimate ? { opacity: 0, x: 200 } : { opacity: 1, x: 0 };

  // Separate transition config for header elements
  const headerTransitionConfig = {
    type: "spring",
    stiffness: 50, // Reduced stiffness for smoother motion
    damping: 30, // Increased damping to prevent bouncing
    restDelta: 0.001,
    mass: 1, // Increased mass for more stability
  };

  // Main content transition config
  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  const handleSidebarExpand = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  const handleEditButton = (buttonId: string) => {
    router.push(`/client/validation-buttons/button-settings/${buttonId}`);
  };

  // Add pagination handler functions
  const handleNextPage = () => {
    if (currentPage < Math.ceil(buttons.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Calculate current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentButtons = buttons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(buttons.length / itemsPerPage);

  // Handler for creating a new button
  const handleCreateButton = async () => {
    // Don't allow creation in live mode (authMode === 1)
    if (authMode === 1) {
      return;
    }

    // Check if user has permission
    if (userRoles !== "Admin" && userRoles !== "SuperAdmin") {
      setAdminAccess(false);
      setTimeout(() => setAdminAccess(true), 3000);
      return;
    }

    // Open the create modal
    setShowCreateModal(true);
  };

  // Handler for confirming button creation
  const handleConfirmCreate = async () => {
    setShowCreateModal(false);
    setIsLoading(true);

    try {
      // Generate a unique ID for the button (similar to guid() in the reference)
      const generateGuid = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      };

      // Create the button payload with the proper structure
      const buttonId = generateGuid();
      const payload = {
        apikey: Cookies.get("apikey"),
        buttonid: buttonId,
        data: defaultButtonTemplate,
      };

      // Create the button using the buttonService
      const response = await buttonService.addButton(payload);

      if (response.success && response.data) {
        console.log("Button created successfully:", response.data);

        // Store the new button ID
        const newId = response.data.buttonid || buttonId;
        setNewButtonId(newId);

        // Dispatch to Redux store
        dispatch(addButton(newId));

        // Show success modal for renaming
        setShowSuccessModal(true);

        // Refresh the buttons list in the background
        try {
          const buttonsResponse = await buttonService.getButtons();
          if (buttonsResponse.success && buttonsResponse.data) {
            // Update Redux store
            dispatch(getButtons({ data: buttonsResponse.data.data || [] }));

            // Format buttons for UI display
            const buttonsData = buttonsResponse.data.data || [];
            const formattedButtons = buttonsData.map((button: any) => {
              const timestamp = button.btndata?.eptime ? parseInt(button.btndata.eptime) : 0;
              let lastModified = "Recently";
              if (button.btndata?.eptime) {
                const buttonDate = new Date(timestamp);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - buttonDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 1) {
                  lastModified = "Today";
                } else if (diffDays === 1) {
                  lastModified = "Yesterday";
                } else if (diffDays < 7) {
                  lastModified = `${diffDays} Days ago`;
                } else {
                  const diffWeeks = Math.floor(diffDays / 7);
                  lastModified = `${diffWeeks} Week${diffWeeks > 1 ? "s" : ""} ago`;
                }
              }

              return {
                id: button.buttonid,
                name: button.btndata?.name || "Unnamed Button",
                category: button.btndata?.coverage?.category || "Other",
                documentType: button.btndata?.type || "Other",
                invites: button.invited || 0,
                documents: button.docreceived || 0,
                lastModified: lastModified,
                timestamp: timestamp,
              };
            });

            formattedButtons.sort((a: FormattedButton, b: FormattedButton) => b.timestamp - a.timestamp);
            setButtons(formattedButtons);
          }
        } catch (error) {
          console.error("Error refreshing buttons list:", error);
        }
      } else {
        console.error("Failed to create button:", response.error);
      }
    } catch (error: any) {
      // Handle specific error types
      if (error?.message === "Request failed with status code 401" || error?.message === "Network Error") {
        // In the reference, they would try to refresh auth token
        console.error("Authentication error creating button:", error);
        // Consider implementing refreshAuth functionality if needed
      } else {
        console.error("Error creating button:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for renaming the newly created button
  const handleRenameButton = async () => {
    if (!newButtonName.trim()) {
      return; // Don't allow empty names
    }

    setIsLoading(true);

    try {
      if (newButtonId) {
        // Create payload for button update
        const updatePayload = {
          apikey: Cookies.get("apikey"),
          buttonid: newButtonId,
          data: {
            ...defaultButtonTemplate,
            name: newButtonName,
          },
        };

        // Update the button with the new name
        const response = await buttonService.updateButton(updatePayload);

        if (response.success) {
          console.log("Button renamed successfully");

          // Close the modal
          setShowSuccessModal(false);

          // Reset values
          setNewButtonName("New Button");
          setNewButtonId(null);

          // Refresh the button list
          const buttonsResponse = await buttonService.getButtons();
          if (buttonsResponse.success && buttonsResponse.data) {
            dispatch(getButtons({ data: buttonsResponse.data.data || [] }));

            // Update local state with formatted buttons
            const buttonsData = buttonsResponse.data.data || [];
            const formattedButtons = buttonsData.map((button: any) => {
              const timestamp = button.btndata?.eptime ? parseInt(button.btndata.eptime) : 0;
              let lastModified = "Recently";
              if (button.btndata?.eptime) {
                const buttonDate = new Date(timestamp);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - buttonDate.getTime());
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 1) {
                  lastModified = "Today";
                } else if (diffDays === 1) {
                  lastModified = "Yesterday";
                } else if (diffDays < 7) {
                  lastModified = `${diffDays} Days ago`;
                } else {
                  const diffWeeks = Math.floor(diffDays / 7);
                  lastModified = `${diffWeeks} Week${diffWeeks > 1 ? "s" : ""} ago`;
                }
              }

              return {
                id: button.buttonid,
                name: button.btndata?.name || "Unnamed Button",
                category: button.btndata?.coverage?.category || "Other",
                documentType: button.btndata?.type || "Other",
                invites: button.invited || 0,
                documents: button.docreceived || 0,
                lastModified: lastModified,
                timestamp: timestamp,
              };
            });

            formattedButtons.sort((a: FormattedButton, b: FormattedButton) => b.timestamp - a.timestamp);
            setButtons(formattedButtons);
          }
        } else {
          console.error("Failed to rename button:", response.error);
        }
      }
    } catch (error: any) {
      // Handle specific error types
      if (error?.message === "Request failed with status code 401" || error?.message === "Network Error") {
        console.error("Authentication error renaming button:", error);
      } else {
        console.error("Error renaming button:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel button rename
  const handleCancelRename = () => {
    setShowSuccessModal(false);
    setNewButtonName("New Button");
  };

  // Handler for duplicating a button
  const handleDuplicateButton = (buttonId: string) => {
    // Set button ID and open duplicate modal
    setSelectedButtonForAction(buttonId);
    setDuplicateButtonModalOpen(true);
    setNewButtonName(""); // Reset name field
    setIsDuplicating(true);
    setIsCopyingToProduction(false); // Make sure this is false for duplicating
  };

  // Handler for confirming button duplication
  const confirmDuplicateButton = async () => {
    if (!selectedButtonForAction || !newButtonName.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // Use buttonService to duplicate the button
      const response = await buttonService.duplicateButton(selectedButtonForAction, newButtonName);

      if (response.success && response.data) {
        // Check if the original button had a Google Sheet URL
        const originalButton = await buttonService.getButtonData(selectedButtonForAction);
        if (originalButton.success && originalButton.data?.btndata?.googlesheeturl) {
          // If it had a Google Sheet URL, show the Google Sheet modal for user to confirm
          setGoogleSheetUrl(originalButton.data.btndata.googlesheeturl);
          setSelectedButtonForAction(response.data.buttonid); // Update to new button ID
          setDuplicateButtonModalOpen(false);
          setGoogleSheetModalOpen(true);
        } else {
          // If no Google Sheet URL, show the new styled success modal instead
          setDuplicateButtonModalOpen(false);
          setShowDuplicateSuccessModal(true);

          // Refresh button list
          refreshButtonsList();
        }
      } else {
        setOperationResult({
          success: false,
          message: `Failed to duplicate button: ${response.error || "Unknown error"}`,
        });
        setShowResultMessage(true);
      }
    } catch (error: any) {
      setOperationResult({
        success: false,
        message: `Error duplicating button: ${error.message || "Unknown error"}`,
      });
      setShowResultMessage(true);
    } finally {
      setIsLoading(false);
      setIsDuplicating(false);
    }
  };

  // Handler for copying a button to production
  const handleCopyToProduction = (buttonId: string) => {
    // Set button ID and prepare for copying to production
    setSelectedButtonForAction(buttonId);
    setIsCopyingToProduction(true);

    // Show confirmation modal first
    setShowCopyConfirmModal(true);
  };

  // Function to handle confirmed copy to production
  const handleConfirmCopyToProduction = () => {
    setShowCopyConfirmModal(false);
    // Remove the loader completely and just show the processing state in the modal
    // setIsLoading(true); - removing this line

    // Show success dialog immediately with processing state
    setShowSuccessCopyDialog(true);

    // The copy process will run in the background
    if (selectedButtonForAction) {
      // Wait a small amount of time to ensure the success dialog shows first
      setTimeout(() => {
        checkButtonGoogleSheet(selectedButtonForAction);
      }, 50);
    }
  };

  // Function to cancel copy to production
  const handleCancelCopyToProduction = () => {
    setShowCopyConfirmModal(false);
    setIsCopyingToProduction(false);
    setSelectedButtonForAction(null);
  };

  // Helper to check if button has Google Sheet URL
  const checkButtonGoogleSheet = async (buttonId: string) => {
    try {
      const buttonData = await buttonService.getButtonData(buttonId);

      if (buttonData.success && buttonData.data?.btndata) {
        const btnData = buttonData.data.btndata;

        // If button has Google Sheet URL, use it directly without showing another modal
        const googleSheetUrl = btnData.googlesheeturl || "";

        // Copy directly without showing any more dialogs
        await copyButtonToProductionSilently(buttonId, googleSheetUrl);
      } else {
        console.error("Failed to get button data:", buttonData.error);
        // Clear selectedButtonForAction to show completed state even on error
        setSelectedButtonForAction(null);
      }
    } catch (error: any) {
      console.error("Error in background processing:", error.message);
      // Clear selectedButtonForAction to show completed state even on error
      setSelectedButtonForAction(null);
    }
  };

  // Silent version that doesn't show any UI feedback
  const copyButtonToProductionSilently = async (buttonId: string, sheetUrl?: string) => {
    try {
      const response = await buttonService.copyToProduction(buttonId, sheetUrl, auth.user.apikey);

      if (response.success) {
        // Just refresh button list silently
        refreshButtonsList();
        // Clear selectedButtonForAction to show success state in modal
        setSelectedButtonForAction(null);
      } else {
        console.error("Failed to copy to production:", response.error);
        // Also clear selectedButtonForAction on error to show completed state
        setSelectedButtonForAction(null);
      }
    } catch (error: any) {
      console.error("Error copying to production:", error.message);
      // Also clear selectedButtonForAction on error to show completed state
      setSelectedButtonForAction(null);
    }
  };

  // Fix the missing copyButtonToProduction function
  const copyButtonToProduction = async (buttonId: string, sheetUrl?: string) => {
    try {
      const response = await buttonService.copyToProduction(buttonId, sheetUrl, auth.user.apikey);
      if (response.success) {
        refreshButtonsList();
      } else {
        console.error("Failed to copy to production:", response.error);
      }
      // Close the Google Sheet modal
      setGoogleSheetModalOpen(false);
    } catch (error: any) {
      console.error("Error copying to production:", error.message);
    }
  };

  // Custom Success Dialog for Copy to Production - show it immediately after confirmation
  // Only this dialog should be shown to the user
  const handleCloseSuccessCopyDialog = () => {
    setShowSuccessCopyDialog(false);
    setIsCopyingToProduction(false);
    setSelectedButtonForAction(null);
  };

  // Handler for updating Google Sheet URL
  const handleUpdateGoogleSheet = async () => {
    if (!selectedButtonForAction) return;

    setIsLoading(true);
    try {
      if (isCopyingToProduction) {
        // If copying to production, use the Google Sheet URL in that process
        await copyButtonToProduction(selectedButtonForAction, googleSheetUrl);
      } else {
        // If just updating Google Sheet URL for duplicated button
        const response = await buttonService.updateGoogleSheetUrl(selectedButtonForAction, googleSheetUrl);

        // Close the Google Sheet modal regardless of success
        setGoogleSheetModalOpen(false);

        if (response.success) {
          // Show the styled success modal instead of the simple message
          setShowDuplicateSuccessModal(true);

          // Refresh button list
          refreshButtonsList();
        } else {
          setOperationResult({
            success: false,
            message: `Failed to update Google Sheet URL: ${response.error || "Unknown error"}`,
          });
          setShowResultMessage(true);
        }
      }
    } catch (error: any) {
      // Close the Google Sheet modal on error
      setGoogleSheetModalOpen(false);

      setOperationResult({
        success: false,
        message: `Error updating Google Sheet URL: ${error.message || "Unknown error"}`,
      });
      setShowResultMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to refresh buttons list
  const refreshButtonsList = async () => {
    try {
      const buttonsResponse = await buttonService.getButtons();
      if (buttonsResponse.success && buttonsResponse.data) {
        // Update Redux store
        dispatch(getButtons({ data: buttonsResponse.data.data || [] }));

        // Format buttons for UI display
        const buttonsData = buttonsResponse.data.data || [];
        const formattedButtons = buttonsData.map((button: any) => {
          const timestamp = button.btndata?.eptime ? parseInt(button.btndata.eptime) : 0;
          let lastModified = "Recently";
          if (button.btndata?.eptime) {
            const buttonDate = new Date(timestamp);
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - buttonDate.getTime());
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 1) {
              lastModified = "Today";
            } else if (diffDays === 1) {
              lastModified = "Yesterday";
            } else if (diffDays < 7) {
              lastModified = `${diffDays} Days ago`;
            } else {
              const diffWeeks = Math.floor(diffDays / 7);
              lastModified = `${diffWeeks} Week${diffWeeks > 1 ? "s" : ""} ago`;
            }
          }

          return {
            id: button.buttonid,
            name: button.btndata?.name || "Unnamed Button",
            category: button.btndata?.coverage?.category || "Other",
            documentType: button.btndata?.type || "Other",
            invites: button.invited || 0,
            documents: button.docreceived || 0,
            lastModified: lastModified,
            timestamp: timestamp,
          };
        });

        formattedButtons.sort((a: FormattedButton, b: FormattedButton) => b.timestamp - a.timestamp);
        setButtons(formattedButtons);
      }
    } catch (error) {
      console.error("Error refreshing buttons list:", error);
    }
  };

  // Handler for deleting a button
  const handleDeleteButton = async (buttonId: string) => {
    if (!buttonId) return;

    setIsLoading(true);
    try {
      const response = await buttonService.deleteButton(buttonId);

      if (response.success) {
        setOperationResult({
          success: true,
          message: "Button deleted successfully",
        });

        // Refresh button list
        refreshButtonsList();
      } else {
        setOperationResult({
          success: false,
          message: `Failed to delete button: ${response.error || "Unknown error"}`,
        });
      }

      setShowResultMessage(true);
    } catch (error: any) {
      setOperationResult({
        success: false,
        message: `Error deleting button: ${error.message || "Unknown error"}`,
      });
      setShowResultMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for closing the duplicate success modal
  const handleCloseDuplicateSuccessModal = () => {
    setShowDuplicateSuccessModal(false);
    setSelectedButtonForAction(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={handleSidebarExpand} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <TooltipProvider>
          <div className="flex-1 relative">
            <PageHeader title="Verification Buttons" description="Manage and monitor your verification button performance" />
            <div className="container mx-auto px-6 py-8">
              <motion.div
                className="flex justify-end mb-6"
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={headerTransitionConfig}
              >
                <div className="flex items-center">
                  {!adminAccess && (
                    <span className="text-red-500 mr-4 text-sm">Access denied. You don't have permission to create buttons.</span>
                  )}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div style={{ cursor: "pointer" }}>
                        <Button
                          className={`bg-foreground text-background hover:bg-foreground/90 ${
                            authMode === 1
                              ? "opacity-50 cursor-not-allowed pointer-events-none bg-gray-400 dark:bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700"
                              : ""
                          }`}
                          onClick={handleCreateButton}
                          disabled={authMode === 1}
                          suppressHydrationWarning
                        >
                          <Plus className="mr-2 h-4 w-4" /> Create Button
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {authMode === 1 && (
                      <TooltipContent>
                        <p>To create a button, please switch to test mode</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </div>
              </motion.div>

              {/* Create Button Confirmation Modal - Horizontal Layout */}
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogContent className="sm:max-w-2xl p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
                    className="relative mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background/0 blur-3xl rounded-[40px] opacity-30 transform -rotate-3 scale-105"></div>

                    <motion.div
                      className="relative bg-background/95 backdrop-blur-sm dark:bg-[#0e1320] rounded-2xl shadow-xl overflow-hidden border border-border/70 dark:border-border dark:ring-1 dark:ring-slate-600/25"
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      {/* Animated Particles Background */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full bg-primary/10"
                            style={{
                              width: Math.random() * 60 + 20,
                              height: Math.random() * 60 + 20,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -40],
                              x: [0, Math.random() * 20 - 10],
                              opacity: [0, 0.3, 0],
                              scale: [1, 1.2, 0.8],
                            }}
                            transition={{
                              duration: 8 + Math.random() * 6,
                              repeat: Infinity,
                              delay: Math.random() * 5,
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex flex-row">
                        {/* Left side - Visual */}
                        <motion.div
                          className="relative py-8 px-5 text-center w-2/5 flex flex-col justify-center items-center bg-[#0a101b] dark:bg-[#080d18]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <div className="flex justify-center mb-5">
                            <div className="relative">
                              <motion.div
                                className="h-16 w-16 rounded-full bg-[#1a2c52] flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  damping: 10,
                                  stiffness: 200,
                                  delay: 0.2,
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, rotate: -30 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  transition={{ delay: 0.4, duration: 0.4 }}
                                >
                                  <Plus className="h-9 w-9 text-[#4d7cfe]" strokeWidth={1.5} />
                                </motion.div>
                              </motion.div>
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-primary/40"
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1.4, opacity: 0 }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  ease: "easeOut",
                                  delay: 1,
                                }}
                              />
                            </div>
                          </div>

                          <motion.h3
                            className="text-xl font-medium text-white mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                          >
                            Create
                          </motion.h3>
                          <motion.h3
                            className="text-xl font-medium text-white mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.3 }}
                          >
                            Verification Button
                          </motion.h3>
                        </motion.div>

                        {/* Right side - Settings and Actions */}
                        <div className="px-6 py-8 w-3/5 bg-[#131e35] dark:bg-[#111827]">
                          {/* Settings */}
                          <motion.p
                            className="text-sm text-gray-400 mb-6 mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                          >
                            Button will be created with these default settings
                          </motion.p>
                          <motion.div
                            className="rounded-xl overflow-hidden bg-[#1a2746]/80 dark:bg-slate-800/60 mb-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                          >
                            <div className="space-y-0">
                              {[
                                { icon: FileText, name: "Name", value: "New Button" },
                                { icon: Globe, name: "Category", value: "Bank" },
                                { icon: Download, name: "Method", value: "Download" },
                              ].map((setting, i) => (
                                <motion.div
                                  key={setting.name}
                                  className="flex items-center justify-between text-sm py-3 px-4 border-b border-slate-600/30 last:border-0"
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                                >
                                  <div className="flex items-center gap-3">
                                    <motion.div
                                      className="w-8 h-8 rounded-full bg-[#1e3a8a] dark:bg-[#1e40af] flex items-center justify-center"
                                      whileHover={{
                                        scale: 1.05,
                                        backgroundColor: "var(--primary)",
                                      }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      <setting.icon className="h-4 w-4 text-blue-400" />
                                    </motion.div>
                                    <span className="font-medium text-base text-white">{setting.name}</span>
                                  </div>
                                  <span className="text-base text-gray-300 font-medium">{setting.value}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Info text */}
                          <motion.div
                            className="text-center mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.3 }}
                          >
                            <p className="text-sm text-gray-400">All settings can be customized after creation</p>
                          </motion.div>

                          {/* Action buttons */}
                          <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.3 }}
                          >
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="outline"
                                onClick={() => setShowCreateModal(false)}
                                className="w-full dark:border-slate-600 dark:hover:bg-slate-800/70 h-10 text-white bg-slate-800/60 hover:bg-slate-700/60"
                              >
                                Cancel
                              </Button>
                            </motion.div>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={handleConfirmCreate}
                                disabled={isLoading}
                                className="w-full relative overflow-hidden h-10 font-medium bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                {isLoading ? (
                                  <span className="flex items-center justify-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Creating...
                                  </span>
                                ) : (
                                  <>
                                    <span className="relative z-10">Create Button</span>
                                    <motion.div
                                      className="absolute inset-0 bg-primary-foreground/10"
                                      initial={{ x: "-100%" }}
                                      whileHover={{ x: "0%" }}
                                      transition={{ duration: 0.4, ease: "easeOut" }}
                                    />
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Success Modal with Rename Option - Horizontal Layout */}
              <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <DialogContent className="sm:max-w-2xl p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
                    className="relative mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-background/0 blur-3xl rounded-[40px] opacity-30 transform rotate-3 scale-105"></div>

                    <motion.div
                      className="relative bg-background/95 backdrop-blur-sm dark:bg-[#0e1320] rounded-2xl shadow-xl overflow-hidden border border-border/70 dark:border-border dark:ring-1 dark:ring-green-600/30"
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      {/* Animated Success Effects */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(15)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full bg-green-500/10"
                            style={{
                              width: Math.random() * 50 + 10,
                              height: Math.random() * 50 + 10,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -60],
                              x: [0, Math.random() * 30 - 15],
                              opacity: [0, 0.4, 0],
                              scale: [0.8, 1.2, 0.5],
                            }}
                            transition={{
                              duration: 6 + Math.random() * 4,
                              repeat: Infinity,
                              delay: Math.random() * 3,
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex flex-row">
                        {/* Left side - Success Visual */}
                        <motion.div
                          className="relative py-8 px-5 text-center w-2/5 flex flex-col justify-center items-center bg-[#0a101b] dark:bg-[#080d18]"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <div className="flex justify-center mb-5">
                            <div className="relative">
                              <motion.div
                                className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  damping: 10,
                                  stiffness: 200,
                                  delay: 0.2,
                                }}
                              >
                                <motion.div
                                  initial={{ pathLength: 0, opacity: 0 }}
                                  animate={{ pathLength: 1, opacity: 1 }}
                                  transition={{ delay: 0.4, duration: 0.8 }}
                                  className="relative h-9 w-9"
                                >
                                  <svg
                                    width="36"
                                    height="36"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-blue-600 dark:text-blue-400"
                                  >
                                    <motion.path
                                      d="M22 9L12 19L6 13"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                    />
                                  </svg>
                                </motion.div>
                              </motion.div>
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-green-500/40 dark:border-green-500/60"
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1.6, opacity: [0, 0.5, 0] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  ease: "easeOut",
                                  delay: 1,
                                }}
                              />
                            </div>
                          </div>

                          <motion.h3
                            className="text-xl font-medium text-white mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                          >
                            Button Created
                          </motion.h3>
                          <motion.h3
                            className="text-xl font-medium text-white mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55, duration: 0.3 }}
                          >
                            Successfully!
                          </motion.h3>
                          <motion.div
                            className="h-1 w-16 mx-auto bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 rounded-full my-3"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 64, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                          />
                        </motion.div>

                        {/* Right side - Input and Actions */}
                        <div className="px-6 py-8 w-3/5 bg-[#131e35] dark:bg-[#111827] flex flex-col justify-center">
                          {/* Input Section */}
                          <motion.div
                            className="mb-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                          >
                            <motion.div
                              className="mb-3"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7, duration: 0.3 }}
                            >
                              <label htmlFor="buttonName" className="block text-base font-medium text-white">
                                Customize Your Button Name
                              </label>
                            </motion.div>

                            <motion.div
                              className="relative"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8, duration: 0.3 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <Input
                                id="buttonName"
                                value={newButtonName}
                                onChange={(e) => setNewButtonName(e.target.value)}
                                className="w-full pr-8 transition-all border-slate-700 bg-slate-800/50 text-white focus-visible:ring-green-400/30 focus-visible:border-green-400/60 h-10 text-base"
                                autoFocus
                              />
                              <motion.div
                                className="absolute right-3 top-2.5"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1, duration: 0.3 }}
                              >
                                <FileText className="h-4 w-4 text-gray-400" />
                              </motion.div>
                            </motion.div>

                            <AnimatePresence>
                              {!newButtonName.trim() && (
                                <motion.p
                                  className="mt-2 text-sm text-red-500 dark:text-red-400"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                >
                                  Please provide a name for your button
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          {/* Info text */}
                          <motion.div
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.3 }}
                          >
                            <p className="text-sm text-gray-400">A descriptive name helps identify your button later</p>
                          </motion.div>

                          {/* Action buttons */}
                          <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.3 }}
                          >
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="outline"
                                onClick={handleCancelRename}
                                className="w-full dark:border-slate-600 dark:hover:bg-slate-800/70 h-10 text-white bg-slate-800/60 hover:bg-slate-700/60"
                              >
                                Skip
                              </Button>
                            </motion.div>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={handleRenameButton}
                                disabled={isLoading || !newButtonName.trim()}
                                className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:border-green-700/50 h-10 font-medium text-white"
                              >
                                {isLoading ? (
                                  <span className="flex items-center justify-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Saving...
                                  </span>
                                ) : (
                                  <>
                                    <span className="relative z-10">Save & Continue</span>
                                    <motion.div
                                      className="absolute inset-0 bg-white/10"
                                      initial={{ x: "-100%" }}
                                      whileHover={{ x: "0%" }}
                                      transition={{ duration: 0.4, ease: "easeOut" }}
                                    />
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Duplicate Button Modal */}
              <Dialog
                open={duplicateButtonModalOpen}
                onOpenChange={(open) => {
                  setDuplicateButtonModalOpen(open);
                  if (!open) {
                    // Clean up state when modal is closed
                    setNewButtonName("");
                    setSelectedButtonForAction(null);
                    setIsDuplicating(false);
                  }
                }}
              >
                <DialogContent className="sm:max-w-2xl p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
                    className="relative mx-auto w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-background/0 blur-3xl rounded-[40px] opacity-30 transform -rotate-3 scale-105"></div>

                    <motion.div
                      className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700/70 dark:ring-1 dark:ring-slate-600/25"
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      {/* Animated Particles Background */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute rounded-full bg-blue-500/20"
                            style={{
                              width: Math.random() * 40 + 10,
                              height: Math.random() * 40 + 10,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                              y: [0, -60],
                              x: [0, Math.random() * 30 - 15],
                              opacity: [0, 0.3, 0],
                              scale: [0.8, 1.2, 0.5],
                            }}
                            transition={{
                              duration: 8 + Math.random() * 4,
                              repeat: Infinity,
                              delay: Math.random() * 5,
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex flex-row">
                        {/* Left side - Visual */}
                        <motion.div
                          className="relative py-8 px-5 text-center w-2/5 flex flex-col justify-center items-center bg-blue-50 dark:bg-blue-900/20"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <div className="flex justify-center mb-5">
                            <div className="relative">
                              <motion.div
                                className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  damping: 10,
                                  stiffness: 200,
                                  delay: 0.2,
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, rotate: -30 }}
                                  animate={{ opacity: 1, rotate: 0 }}
                                  transition={{ delay: 0.4, duration: 0.4 }}
                                >
                                  <Clipboard className="h-9 w-9 text-blue-500 dark:text-blue-400" strokeWidth={1.5} />
                                </motion.div>
                              </motion.div>
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-blue-500/40"
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1.4, opacity: 0 }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  ease: "easeOut",
                                  delay: 1,
                                }}
                              />
                            </div>
                          </div>

                          <motion.h3
                            className="text-xl font-medium text-slate-900 dark:text-white mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                          >
                            Duplicate Button
                          </motion.h3>
                        </motion.div>

                        {/* Right side - Settings and Actions */}
                        <div className="px-6 py-8 w-3/5 bg-white dark:bg-slate-900">
                          {/* Title and Description */}
                          <DialogHeader className="p-0 text-left">
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4, duration: 0.3 }}
                            >
                              <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                Duplicate Button
                              </DialogTitle>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.45, duration: 0.3 }}
                            >
                              <DialogDescription className="text-slate-500 dark:text-slate-400">
                                Enter a name for the duplicated button
                              </DialogDescription>
                            </motion.div>
                          </DialogHeader>

                          <motion.div
                            className="h-1 w-24 bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 rounded-full my-4"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 96, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                          />

                          {/* Input Field */}
                          <motion.div
                            className="my-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                          >
                            <motion.div
                              className="relative"
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7, duration: 0.3 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <label
                                htmlFor="buttonName"
                                className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                              >
                                Button Name
                              </label>
                              <Input
                                id="buttonName"
                                value={newButtonName}
                                onChange={(e) => setNewButtonName(e.target.value)}
                                placeholder="Enter button name"
                                className="w-full pr-8 transition-all border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:ring-blue-400/30 focus-visible:border-blue-400/60 h-10 text-base"
                                autoFocus
                              />
                              <motion.div
                                className="absolute right-3 top-[34px]"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.3 }}
                              >
                                <FileText className="h-4 w-4 text-slate-400" />
                              </motion.div>
                            </motion.div>

                            <AnimatePresence>
                              {!newButtonName.trim() && (
                                <motion.p
                                  className="mt-2 text-sm text-red-500 dark:text-red-400"
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                >
                                  Please provide a name for your button
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          {/* Info text */}
                          <motion.div
                            className="mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.3 }}
                          >
                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                              <Info className="h-4 w-4 mr-2 text-blue-500" />
                              The unique button name helps identify your button
                            </p>
                          </motion.div>

                          {/* Action buttons */}
                          <motion.div
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.3 }}
                          >
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                variant="outline"
                                onClick={() => setDuplicateButtonModalOpen(false)}
                                className="w-full border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 h-10 text-slate-700 dark:text-slate-300"
                              >
                                Cancel
                              </Button>
                            </motion.div>
                            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={confirmDuplicateButton}
                                disabled={isLoading || !newButtonName.trim()}
                                className="w-full relative overflow-hidden h-10 font-medium bg-blue-500 hover:bg-blue-600 text-white"
                              >
                                {isLoading ? (
                                  <span className="flex items-center justify-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Processing...
                                  </span>
                                ) : (
                                  <>
                                    <span className="relative z-10">Duplicate</span>
                                    <motion.div
                                      className="absolute inset-0 bg-primary-foreground/10"
                                      initial={{ x: "-100%" }}
                                      whileHover={{ x: "0%" }}
                                      transition={{ duration: 0.4, ease: "easeOut" }}
                                    />
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Google Sheet URL Modal */}
              <Dialog
                open={googleSheetModalOpen}
                onOpenChange={(open) => {
                  setGoogleSheetModalOpen(open);
                  if (!open) {
                    // Clean up state when modal is closed
                    if (!isCopyingToProduction && !isDuplicating) {
                      setGoogleSheetUrl("");
                      setSelectedButtonForAction(null);
                    }
                  }
                }}
              >
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{isCopyingToProduction ? "Copy to Production" : "Update Google Sheet URL"}</DialogTitle>
                    <DialogDescription>
                      {isCopyingToProduction
                        ? "Modify or confirm the Google Sheet URL for the production button"
                        : "Enter the Google Sheet URL for this button"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4 py-4">
                    <Input
                      value={googleSheetUrl}
                      onChange={(e) => setGoogleSheetUrl(e.target.value)}
                      placeholder="Google Sheet URL"
                      className="col-span-3"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setGoogleSheetModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateGoogleSheet} disabled={isLoading}>
                      {isLoading ? "Processing..." : isCopyingToProduction ? "Copy to Production" : "Update"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Result Message Dialog */}
              <Dialog
                open={showResultMessage}
                onOpenChange={(open) => {
                  setShowResultMessage(open);
                  if (!open) {
                    // Clean up operation state when modal is closed
                    setOperationResult(null);
                    setIsCopyingToProduction(false);
                    setIsDuplicating(false);
                  }
                }}
              >
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{operationResult?.success ? "Success" : "Error"}</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className={operationResult?.success ? "text-blue-600" : "text-red-600"}>{operationResult?.message}</p>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setShowResultMessage(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Copy to Production Confirmation Dialog */}
              <Dialog
                open={showCopyConfirmModal}
                onOpenChange={(open) => {
                  setShowCopyConfirmModal(open);
                  if (!open) {
                    setIsCopyingToProduction(false);
                    setSelectedButtonForAction(null);
                  }
                }}
              >
                <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
                    className="relative mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-background/0 blur-3xl rounded-[40px] opacity-30 transform -rotate-3 scale-105"></div>

                    <motion.div
                      className="relative bg-background/95 backdrop-blur-sm dark:bg-[#0e1320] rounded-2xl shadow-xl overflow-hidden border border-border/70 dark:border-border dark:ring-1 dark:ring-slate-600/25"
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      {/* Content */}
                      <div className="p-6">
                        <DialogHeader className="p-0 mb-4 flex flex-col items-center space-y-1">
                          <motion.div
                            className="flex justify-center mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                              <ExternalLink className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                          </motion.div>

                          <DialogTitle asChild>
                            <motion.h2
                              className="text-xl font-semibold text-center mb-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              Copy to Production
                            </motion.h2>
                          </DialogTitle>
                        </DialogHeader>

                        <motion.div
                          className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 rounded-full my-3"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 96, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        />

                        <motion.p
                          className="text-center mb-6 text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          Are you sure you want to copy this button to production?
                        </motion.p>

                        <motion.div
                          className="flex gap-4 justify-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                        >
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button variant="outline" onClick={handleCancelCopyToProduction} className="font-medium px-6">
                              Cancel
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={handleConfirmCopyToProduction}
                              disabled={isLoading}
                              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 ml-4"
                            >
                              {isLoading ? (
                                <span className="flex items-center justify-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Processing...
                                </span>
                              ) : (
                                "Yes"
                              )}
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Custom Success Dialog for Copy to Production */}
              <Dialog
                open={showSuccessCopyDialog}
                onOpenChange={(open) => {
                  if (!open) {
                    handleCloseSuccessCopyDialog();
                  }
                }}
              >
                <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none overflow-visible [&>button]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
                    className="relative mx-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-background/0 blur-3xl rounded-[40px] opacity-30 transform -rotate-3 scale-105"></div>

                    <motion.div
                      className="relative bg-background/95 backdrop-blur-sm dark:bg-[#0e1320] rounded-2xl shadow-xl overflow-hidden border border-border/70 dark:border-border dark:ring-1 dark:ring-slate-600/25"
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      {/* Content */}
                      <div className="p-6">
                        <DialogHeader className="p-0 mb-4 flex flex-col items-center space-y-1">
                          <motion.div
                            className="flex justify-center mb-6"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                          >
                            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3, type: "spring" }}
                              >
                                {/* Show different icons based on processing state */}
                                {selectedButtonForAction ? (
                                  <svg
                                    className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <svg
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-600 dark:text-blue-400"
                                  >
                                    <motion.path
                                      d="M20 6L9 17L4 12"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                                    />
                                  </svg>
                                )}
                              </motion.div>
                            </div>
                          </motion.div>

                          <DialogTitle asChild>
                            <motion.h2
                              className="text-xl font-semibold text-center"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.3 }}
                            >
                              {selectedButtonForAction ? "Processing" : "Success"}
                            </motion.h2>
                          </DialogTitle>
                        </DialogHeader>

                        <motion.div
                          className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500/0 via-blue-500 to-blue-500/0 rounded-full my-3"
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 96, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.4 }}
                        />

                        <motion.p
                          className="text-center mb-6 text-black-500 dark:text-blue-400 font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          {selectedButtonForAction ? (
                            <span className="flex flex-col items-center">
                              <span className="mb-2">Please wait while we copy your button to production...</span>
                              <span className="text-sm text-muted-foreground">This may take a few moments</span>
                            </span>
                          ) : (
                            "Button copied to production successfully!"
                          )}
                        </motion.p>

                        <motion.div
                          className="flex justify-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                        >
                          {!selectedButtonForAction && (
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Button
                                onClick={handleCloseSuccessCopyDialog}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-2"
                              >
                                Close
                              </Button>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>

                      {/* Decorative success particles */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {Array.from({ length: 10 }).map((_, i) => {
                          // Generate random properties for each particle
                          const size = Math.floor(Math.random() * 8 + 4);
                          const left = `${Math.floor(Math.random() * 100)}%`;
                          const top = `${Math.floor(Math.random() * 100)}%`;
                          const delay = Math.random() * 2;
                          const duration = 4 + Math.random() * 3;

                          return (
                            <motion.div
                              key={i}
                              className="absolute rounded-full bg-blue-500/30"
                              style={{
                                width: size,
                                height: size,
                                left: left,
                                top: top,
                              }}
                              initial={{ opacity: 0, y: 0, scale: 0.5 }}
                              animate={{
                                opacity: [0, 0.7, 0],
                                y: -60,
                                x: Math.random() * 40 - 20,
                                scale: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: duration,
                                repeat: Infinity,
                                delay: delay,
                              }}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              {/* Add the Duplicate Success Dialog */}
              <Dialog
                open={showDuplicateSuccessModal}
                onOpenChange={(open) => {
                  if (!open) {
                    handleCloseDuplicateSuccessModal();
                  }
                }}
              >
                <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="relative mx-auto"
                  >
                    <motion.div
                      className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Top accent bar */}
                      <div className="absolute top-0 inset-x-0 h-0.5 bg-blue-500 dark:bg-blue-600"></div>

                      {/* Content */}
                      <div className="p-6 relative">
                        <div className="flex justify-center mb-5">
                          <motion.div
                            className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-500 dark:text-blue-400"
                              >
                                <motion.path
                                  d="M20 6L9 17L4 12"
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                              </svg>
                            </motion.div>
                          </motion.div>
                        </div>

                        <div className="text-center space-y-2 mb-5">
                          <motion.h3
                            className="text-lg font-semibold text-slate-900 dark:text-slate-100"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.25 }}
                          >
                            Button Duplicated
                          </motion.h3>

                          <motion.p
                            className="text-sm text-slate-600 dark:text-slate-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25, duration: 0.25 }}
                          >
                            Your button "{newButtonName}" has been successfully duplicated
                          </motion.p>
                        </div>

                        <motion.div
                          className="flex justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3, duration: 0.25 }}
                        >
                          <Button
                            onClick={handleCloseDuplicateSuccessModal}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2"
                          >
                            Close
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </DialogContent>
              </Dialog>

              <div className="grid grid-cols-3 gap-6">
                {statsCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={initialAnimation}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      ...transitionConfig,
                      delay: index * 0.1,
                    }}
                  >
                    <Card className="relative overflow-hidden h-[160px]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <motion.div
                          initial={initialAnimation}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...transitionConfig,
                            delay: index * 0.1 + 0.1,
                          }}
                        >
                          <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                        </motion.div>
                        <card.icon className={`h-4 w-4 text-${card.color}-500`} />
                      </CardHeader>
                      <CardContent className="pt-2">
                        <motion.div
                          initial={initialAnimation}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...transitionConfig,
                            delay: index * 0.1 + 0.2,
                          }}
                        >
                          {card.secondaryValue ? (
                            <div className="flex justify-between items-start pt-2">
                              <div className="text-center flex-1">
                                <div className="text-3xl font-bold">{card.mainValue}</div>
                                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                              </div>
                              <div className="text-center flex-1">
                                <div className="text-3xl font-bold">{card.secondaryValue}</div>
                                <p className="text-xs text-muted-foreground mt-1">{card.secondaryDescription}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-3xl font-bold">{card.mainValue}</div>
                              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                              {card.subValue && (
                                <p className={`text-sm mt-2 ${card.subValueColor} font-medium`}>{card.subValue}</p>
                              )}
                            </>
                          )}
                        </motion.div>
                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-${card.color}-500/20`} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...transitionConfig,
                  delay: 0.3,
                }}
                className="rounded-lg border bg-card shadow-sm mt-6"
              >
                {(() => {
                  // Extract the conditional rendering logic into an IIFE
                  if (isLoading) {
                    return (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="mb-4">
                          <Loader />
                        </div>
                        <p className="text-muted-foreground">Loading buttons data...</p>
                      </div>
                    );
                  }

                  if (buttons.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center py-20">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground">No buttons found</p>
                      </div>
                    );
                  }

                  return (
                    <Table>
                      <TableHeader>
                        <motion.tr
                          className="hover:bg-transparent"
                          initial={initialAnimation}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...transitionConfig,
                            delay: 0.4,
                          }}
                        >
                          <TableHead>Name</TableHead>
                          <TableHead className="text-center">Category</TableHead>
                          <TableHead className="text-center">Document Type</TableHead>
                          <TableHead className="text-center">Invites waiting</TableHead>
                          <TableHead className="text-center">Documents received</TableHead>
                          <TableHead className="text-center">Last modified</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </motion.tr>
                      </TableHeader>
                      <TableBody>
                        {currentButtons.map((button, index) => (
                          <motion.tr
                            key={`button-${button.id}`}
                            className="group hover:bg-muted/50 border-b"
                            initial={initialAnimation}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              ...transitionConfig,
                              delay: 0.5 + index * 0.05,
                            }}
                          >
                            <TableCell className="font-medium">{button.name}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Badge variant="secondary">{button.category}</Badge>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary">{button.documentType}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {button.invites > 0 ? (
                                <Badge variant="secondary">{button.invites}</Badge>
                              ) : (
                                <span className="text-muted-foreground">No invites</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{button.documents}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">{button.lastModified}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-5">
                                <CopyButton textToCopy={`https://verification.diro.io/button/${button.id}`} />
                                <DropdownMenu
                                  onOpenChange={(open) => {
                                    if (open) {
                                      setOpenDropdownId(button.id);
                                    } else if (openDropdownId === button.id) {
                                      setOpenDropdownId(null);
                                    }
                                  }}
                                >
                                  <DropdownMenuTrigger asChild>
                                    {(() => {
                                      const buttonStyles =
                                        openDropdownId === button.id ? "bg-blue-100 dark:bg-slate-700 scale-110" : "";

                                      const iconStyles =
                                        openDropdownId === button.id ? "rotate-180 text-blue-700 dark:text-sky-300" : "";

                                      return (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className={`h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 shadow-sm mr-8 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${buttonStyles}`}
                                          style={{ marginRight: "2rem" }}
                                        >
                                          <Settings
                                            className={`h-4 w-4 text-blue-600 dark:text-sky-400 transition-all duration-500 ease-in-out ${iconStyles}`}
                                          />
                                        </Button>
                                      );
                                    })()}
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => handleEditButton(button.id)} className="cursor-pointer">
                                      <Settings className="h-4 w-4 mr-2 text-blue-600 dark:text-sky-400" />
                                      <span>Edit</span>
                                    </DropdownMenuItem>
                                    {authMode === 2 && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() => handleDuplicateButton(button.id)}
                                          className="cursor-pointer"
                                        >
                                          <Clipboard className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                          <span>Duplicate</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => handleCopyToProduction(button.id)}
                                          className="cursor-pointer"
                                        >
                                          <ExternalLink className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                                          <span>Copy to production</span>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteButton(button.id)}
                                      className="text-red-600 dark:text-rose-400 cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2 text-red-600 dark:text-rose-400" />
                                      <span>Delete</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
                  );
                })()}

                {buttons.length > itemsPerPage && (
                  <div className="flex items-center justify-center px-4 py-6">
                    <div className="flex items-center border rounded-full overflow-hidden bg-card shadow-md w-64">
                      {(() => {
                        const prevButtonClasses =
                          currentPage === 1
                            ? "text-muted cursor-not-allowed"
                            : "text-foreground hover:bg-primary/10 hover:text-primary";

                        const nextButtonClasses =
                          currentPage === totalPages
                            ? "text-muted cursor-not-allowed"
                            : "text-foreground hover:bg-primary/10 hover:text-primary";

                        return (
                          <>
                            <button
                              onClick={handlePrevPage}
                              disabled={currentPage === 1}
                              className={`px-4 py-2 flex items-center text-sm font-medium transition-all ${prevButtonClasses}`}
                            >
                              <ChevronLeft className="h-4 w-4 mr-1" />
                              Previous
                            </button>
                            <div className="px-4 border-l border-r border-border font-semibold text-sm text-primary">
                              {currentPage}
                            </div>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages}
                              className={`px-4 py-2 flex items-center text-sm font-medium transition-all ${nextButtonClasses}`}
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </TooltipProvider>
      </PageContainer>
    </div>
  );
}
