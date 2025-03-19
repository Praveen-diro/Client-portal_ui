"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";
import { tableService } from "@/app/services/table.service";

// Import our new tab components
import PendingDocuments from "./components/PendingDocuments";
import ApprovedDocuments from "./components/ApprovedDocuments";
import RejectedDocuments from "./components/RejectedDocuments";

// Initial stats
const initialStats = {
  pending: 0,
  approved: 0,
  rejected: 0,
};

export default function DocumentsReceived() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Stats state
  const [stats, setStats] = useState(initialStats);

  // Get count data from Redux store for the stats
  const pendingDocuments = useSelector((state: any) => state.table.pendings);
  const approvedDocuments = useSelector((state: any) => state.table.approved);
  const rejectedDocuments = useSelector((state: any) => state.table.rejects);

  useEffect(() => {
    setShouldAnimate(true);
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Effect to fetch stats
  useEffect(() => {
    fetchStats();
  }, [pendingDocuments, approvedDocuments, rejectedDocuments]);

  // Fetch stats for all tabs
  const fetchStats = async () => {
    try {
      // In a real implementation, you would make an API call to get accurate stats
      // For now, we'll update based on redux state or use default values

      const pendingCount = pendingDocuments?.data?.length || 10;
      const approvedCount = approvedDocuments?.data?.length || 25;
      const rejectedCount = rejectedDocuments?.data?.length || 5;

      setStats({
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const initialAnimation = shouldAnimate ? { opacity: 0, x: 200 } : { opacity: 1, x: 0 };

  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <div className="flex-1">
          <PageHeader title="Documents Received" description="View and manage received documents for verification" />
          <div className="container mx-auto px-6 py-8">
            <div className="grid gap-4 md:grid-cols-3">
              <motion.div
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...transitionConfig,
                  delay: 0.1,
                }}
              >
                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-500">{stats.pending}</div>
                    <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-yellow-500/20" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...transitionConfig,
                  delay: 0.2,
                }}
              >
                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">{stats.approved}</div>
                    <p className="text-xs text-muted-foreground mt-1">Verified documents</p>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-green-500/20" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...transitionConfig,
                  delay: 0.3,
                }}
              >
                <Card className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">{stats.rejected}</div>
                    <p className="text-xs text-muted-foreground mt-1">Failed verification</p>
                    <div className="absolute bottom-0 left-0 h-1 w-full bg-red-500/20" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={initialAnimation}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                ...transitionConfig,
                delay: 0.4,
              }}
              className="bg-card rounded-lg border shadow-sm mt-6"
            >
              <Tabs defaultValue="pending" className="p-4" onValueChange={handleTabChange}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>

                  <div className="relative max-w-xs ml-4 mr-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Search documents... (min 3 chars)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-[300px] pr-8 py-2 h-10 bg-background border border-input rounded-md focus-visible:ring-1 focus-visible:ring-primary"
                      />
                      {searchQuery && (
                        <div className="absolute inset-y-0 right-0 flex items-center mr-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 hover:bg-transparent"
                            onClick={() => {
                              setSearchQuery("");
                            }}
                          >
                            <XCircle className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <TabsContent value="pending" className="space-y-4">
                  <motion.div
                    className="rounded-md border"
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 25,
                      mass: 0.5,
                      delay: 0.3,
                    }}
                  >
                    <PendingDocuments isActive={activeTab === "pending"} searchQuery={searchQuery} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  <motion.div
                    className="rounded-md border"
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 25,
                      mass: 0.5,
                      delay: 0.3,
                    }}
                  >
                    <ApprovedDocuments isActive={activeTab === "approved"} searchQuery={searchQuery} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                  <motion.div
                    className="rounded-md border"
                    initial={{ opacity: 0, x: 200 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 25,
                      mass: 0.5,
                      delay: 0.3,
                    }}
                  >
                    <RejectedDocuments isActive={activeTab === "rejected"} searchQuery={searchQuery} />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
