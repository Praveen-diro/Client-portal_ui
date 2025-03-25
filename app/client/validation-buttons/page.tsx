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
            dispatch(getButtons({ data: buttonsResponse.data.data || [] }));
          }
        } catch (refreshError) {
          console.error("Error refreshing buttons list:", refreshError);
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
                                className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center"
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
                                    className="text-green-600 dark:text-green-400"
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
                                          style={{ marginRight: "1rem" }}
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
                                        <DropdownMenuItem className="cursor-pointer">
                                          <Clipboard className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                                          <span>Duplicate</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                          <ExternalLink className="h-4 w-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                                          <span>Copy to production</span>
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                    <DropdownMenuItem className="text-red-600 dark:text-rose-400 cursor-pointer">
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
