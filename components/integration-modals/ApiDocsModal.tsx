"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SwaggerUI from "@/components/api-documentation/SwaggerUI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, FileJson, KeyIcon, BookOpenIcon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEndpoint?: string;
}

export default function ApiDocsModal({
  isOpen,
  onClose,
  initialEndpoint = "verification",
}: ApiDocsModalProps) {
  const [activeTab, setActiveTab] = useState(initialEndpoint);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "max-w-[90vw] w-[1200px] h-[85vh] max-h-[900px] overflow-y-auto p-0 border-0 overflow-hidden shadow-2xl",
        isDark ? "bg-[#1A1F2C]" : "bg-white"
      )}>
        <div className={cn(
          "sticky top-0 z-10 border-b p-6",
          isDark ? "bg-[#1A1F2C]" : "bg-white"
        )}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">API documentation</DialogTitle>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Explore and test our API endpoints for seamless integration with your systems.
            </p>
          </DialogHeader>
          <motion.button 
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label="Close modal"
          >
            <X size={18} />
          </motion.button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <KeyIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">X-API-KEY authentication</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <BookOpenIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">OpenAPI 3.0 spec</span>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <TabsTrigger 
                  value="verification" 
                  className="flex items-center gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 py-2 px-3"
                >
                  <KeyIcon className="h-4 w-4" />
                  Verification API
                </TabsTrigger>
                <TabsTrigger 
                  value="pdf-to-json" 
                  className="flex items-center gap-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 py-2 px-3"
                >
                  <FileJson className="h-4 w-4" />
                  PDF to JSON API
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="verification" className="p-0 mt-6 focus-visible:outline-none focus:outline-none">
              <div className={cn(
                "h-[65vh] overflow-y-auto rounded-lg border",
                isDark ? "bg-[#1A1F2C]" : "bg-white"
              )}>
                <SwaggerUI endpoint="verification" />
              </div>
            </TabsContent>

            <TabsContent value="pdf-to-json" className="p-0 mt-6 focus-visible:outline-none focus:outline-none">
              <div className={cn(
                "h-[65vh] overflow-y-auto rounded-lg border",
                isDark ? "bg-[#1A1F2C]" : "bg-white"
              )}>
                <SwaggerUI endpoint="pdf-to-json" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 