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
import { RootState } from "@/app/store/store";
import { store } from "@/app/store/store";
import { orgService } from "@/app/services/org.service";
import { buttonService } from "@/app/services/button.service";
import { getOrgItem, setLoading, setError } from "@/app/store/features/organizationSlice";
import { getButtons } from "@/app/store/features/buttonSlice";
import Loader from "@/components/ui/loader";
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

  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add this to access Redux auth state for debugging
  const auth = useSelector((state: RootState) => state.auth);
  const buttonsData = useSelector((state: RootState) => state.buttons.buttons);

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
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="mr-2 h-4 w-4" /> Create Button
                </Button>
              </motion.div>

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
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="mb-4">
                      <Loader />
                    </div>
                    <p className="text-muted-foreground">Loading buttons data...</p>
                  </div>
                ) : buttons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No buttons found</p>
                  </div>
                ) : (
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
                        <TableHead>Category</TableHead>
                        <TableHead>Document Type</TableHead>
                        <TableHead>Invites waiting</TableHead>
                        <TableHead>Documents received</TableHead>
                        <TableHead>Last modified</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{button.category}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{button.documentType}</Badge>
                          </TableCell>
                          <TableCell>
                            {button.invites > 0 ? (
                              <Badge variant="secondary">{button.invites}</Badge>
                            ) : (
                              <span className="text-muted-foreground">No invites</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">{button.documents}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{button.lastModified}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                    <Link2 className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy link</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                    <Info className="h-4 w-4 text-blue-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View details</p>
                                </TooltipContent>
                              </Tooltip>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditButton(button.id)}>Edit Button</DropdownMenuItem>
                                  <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">Delete Button</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {buttons.length > itemsPerPage && (
                  <div className="flex items-center justify-center px-4 py-6">
                    <div className="flex items-center border rounded-full overflow-hidden bg-card shadow-md w-64">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 flex items-center text-sm font-medium transition-all ${
                          currentPage === 1
                            ? "text-muted cursor-not-allowed"
                            : "text-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <div className="px-4 border-l border-r border-border font-semibold text-sm text-primary">{currentPage}</div>
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 flex items-center text-sm font-medium transition-all ${
                          currentPage === totalPages
                            ? "text-muted cursor-not-allowed"
                            : "text-foreground hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
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
