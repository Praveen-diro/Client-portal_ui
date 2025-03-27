"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Search } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

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
  // Use useRef instead of state for animation flags to prevent unnecessary rerenders
  const shouldAnimateRef = useRef(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Stats state
  const [stats, setStats] = useState(initialStats);

  // Use memoized selectors to prevent unnecessary rerenders
  const pendingDocuments = useSelector((state: any) => state.table.pendings, shallowEqual);
  const approvedDocuments = useSelector((state: any) => state.table.approved, shallowEqual);
  const rejectedDocuments = useSelector((state: any) => state.table.rejects, shallowEqual);
  const totalDocuments = useSelector((state: any) => state.table.totalDocuments, shallowEqual);

  // Optimize the animation effect to reduce rerenders
  useEffect(() => {
    // Clear any existing timeout to prevent memory leaks
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    // Set animation flag
    shouldAnimateRef.current = true;

    // Use ref for timeout to properly clean up
    animationTimeoutRef.current = setTimeout(() => {
      shouldAnimateRef.current = false;
    }, 1000); // Reduced from 2000ms to 1000ms for better performance

    // Clean up on unmount
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [pathname]);

  // Memoize the fetchStats function to prevent unnecessary recreations
  const fetchStats = useCallback(async () => {
    try {
      // In a real implementation, you would make an API call to get accurate stats
      // For now, we'll update based on redux state or use default values
      const pendingCount = totalDocuments?.pendingCount || 0;
      const approvedCount = totalDocuments?.approvedCount || 0;
      const rejectedCount = totalDocuments?.rejectedCount || 0;

      // Use functional update to ensure we're working with the latest state
      setStats((prevStats) => ({
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      }));
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [pendingDocuments, approvedDocuments, rejectedDocuments]);

  // Effect to fetch stats - now using the memoized fetchStats
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Memoize the tab change handler
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Use useMemo for animation values to prevent recalculations
  const { initialAnimation, transitionConfig } = useMemo(
    () => ({
      initialAnimation: shouldAnimateRef.current ? { opacity: 0, x: 200 } : { opacity: 1, x: 0 },
      transitionConfig: {
        type: "spring",
        stiffness: 70,
        damping: 25,
        restDelta: 0.001,
        mass: 0.5,
      },
    }),
    []
  );

  // Optimize animations with memoized values
  const cardAnimations = useMemo(
    () => [
      { delay: 0.1, initialAnimation },
      { delay: 0.2, initialAnimation },
      { delay: 0.3, initialAnimation },
    ],
    [initialAnimation]
  );

  const tabContentAnimations = useMemo(
    () => ({
      initial: { opacity: 0, x: 200 },
      animate: { opacity: 1, x: 0 },
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 25,
        mass: 0.5,
        delay: 0.3,
      },
    }),
    []
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <div className="flex-1">
          <PageHeader title="Documents Received" description="View and manage received documents for verification" />
          <div className="container mx-auto px-8 py-8">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Use memoized animations for cards to reduce JS calculations */}
              {cardAnimations.map((anim, index) => (
                <motion.div
                  key={`card-${index}`}
                  initial={anim.initialAnimation}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    ...transitionConfig,
                    delay: anim.delay,
                  }}
                >
                  <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium">
                        {index === 0 ? "Pending Review" : index === 1 ? "Approved" : "Rejected"}
                      </CardTitle>
                      {index === 0 ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : index === 1 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-3xl font-bold ${
                          index === 0 ? "text-yellow-500" : index === 1 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {index === 0 ? stats.pending : index === 1 ? stats.approved : stats.rejected}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {index === 0 ? "Awaiting verification" : index === 1 ? "Verified documents" : "Failed verification"}
                      </p>
                      <div
                        className={`absolute bottom-0 left-0 h-1 w-full ${
                          index === 0 ? "bg-yellow-500/20" : index === 1 ? "bg-green-500/20" : "bg-red-500/20"
                        }`}
                      />
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

                {/* Use same memoized animation values for all tab contents */}
                <TabsContent value="pending" className="space-y-4">
                  <motion.div
                    className="rounded-md border"
                    initial={tabContentAnimations.initial}
                    animate={tabContentAnimations.animate}
                    transition={tabContentAnimations.transition}
                  >
                    <PendingDocuments isActive={activeTab === "pending"} searchQuery={searchQuery} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="approved" className="space-y-4">
                  <motion.div
                    className="rounded-md border"
                    initial={tabContentAnimations.initial}
                    animate={tabContentAnimations.animate}
                    transition={tabContentAnimations.transition}
                  >
                    <ApprovedDocuments isActive={activeTab === "approved"} searchQuery={searchQuery} />
                  </motion.div>
                </TabsContent>

                <TabsContent value="rejected" className="space-y-4">
                  <motion.div
                    className="rounded-md border"
                    initial={tabContentAnimations.initial}
                    animate={tabContentAnimations.animate}
                    transition={tabContentAnimations.transition}
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
