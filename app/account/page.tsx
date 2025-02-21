"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersSection } from "./users-section";
import { BillingSection } from "./billing-section";
import { OrganizationSection } from "./organization-section";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";

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

  const handleTabChange = (newTab: string) => {
    const tabOrder = Object.keys(tabContent);
    const oldIndex = tabOrder.indexOf(activeTab);
    const newIndex = tabOrder.indexOf(newTab);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setActiveTab(newTab);
  };

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
        <Sidebar expanded={sidebarExpanded} onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <div className="flex flex-col h-full mb-4">
          <PageHeader title="Manage Account" description="Manage your account settings and preferences" />
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-6 py-8">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...transitionConfig, delay: 0.4 }}
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

                <div className="relative" style={{ minHeight: "400px" }}>
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
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
