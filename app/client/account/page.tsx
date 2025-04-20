"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersSection } from "./users-section";
import { BillingSection } from "./billing-section";
import { OrganizationSection } from "./organization-section";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";
import { orgService } from "@/app/services/org.service";
import { useAppDispatch } from "@/app/store/hooks";
import { getOrgItem, setLoading, setError } from "@/app/store/features/organizationSlice";

const tabContent = {
  users: UsersSection,
  billing: BillingSection,
  organization: OrganizationSection,
};

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    position: "absolute" as const,
  }),
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [direction, setDirection] = useState(0);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const dispatch = useAppDispatch();
  const [orgDataFetched, setOrgDataFetched] = useState(false);

  // Fetch organization data only once when switching to the organization tab
  const fetchOrgData = React.useCallback(async () => {
    if (orgDataFetched) return;

    console.log("Fetching organization data from page.tsx...");
    dispatch(setLoading(true));
    try {
      const response = await orgService.getOrg();
      if (response.success && response.data) {
        dispatch(getOrgItem(response.data));
      } else {
        dispatch(setError(response.error || "Failed to fetch organization data"));
      }
      setOrgDataFetched(true);
    } catch (error) {
      console.error("Error fetching organization data:", error);
      dispatch(setError(error));
    }
  }, [dispatch, orgDataFetched]);

  // Call fetchOrgData when the component mounts if the active tab is "organization"
  useEffect(() => {
    if (activeTab === "organization") {
      fetchOrgData();
    }
  }, [activeTab, fetchOrgData]);

  const handleTabChange = (newTab: string) => {
    const tabOrder = Object.keys(tabContent);
    const oldIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > oldIndex ? 1 : -1);

    // Reset orgDataFetched when navigating away from the Organization tab
    if (activeTab === "organization" && newTab !== "organization") {
      setOrgDataFetched(false);
    }

    setActiveTab(newTab);

    // Call fetchOrgData only when switching to the organization tab
    if (newTab === "organization") {
      fetchOrgData();
    }
  };

  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  const initialAnimation = { opacity: 0, x: 200 };
  const animateIn = { opacity: 1, x: 0 };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <div className="flex flex-col h-full mb-4">
          <motion.div initial={initialAnimation} animate={animateIn} transition={{ ...transitionConfig, delay: 0.2 }}>
            <PageHeader title="Manage account" description="Manage your account settings and preferences" />
          </motion.div>

          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-8 py-8">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <motion.div
                  initial={initialAnimation}
                  animate={animateIn}
                  transition={{ ...transitionConfig, delay: 0.3 }}
                  className="relative"
                >
                  <TabsList className="relative z-10">
                    {Object.keys(tabContent).map((tab) => (
                      <TabsTrigger key={tab} value={tab} className="relative data-[state=active]:text-primary">
                        <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                        {activeTab === tab && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                            layoutId="activeTab"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </motion.div>

                <motion.div
                  initial={initialAnimation}
                  animate={animateIn}
                  transition={{ ...transitionConfig, delay: 0.4 }}
                  className="relative"
                  style={{ minHeight: "400px" }}
                >
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={activeTab}
                      custom={direction}
                      variants={contentVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                      }}
                    >
                      {React.createElement(tabContent[activeTab as keyof typeof tabContent])}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
