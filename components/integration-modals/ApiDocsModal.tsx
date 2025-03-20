"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SwaggerUI from "@/components/api-documentation/SwaggerUI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, FileJson, KeyIcon, BookOpenIcon } from "lucide-react";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[85vh] max-h-[900px] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-2">API Documentation</DialogTitle>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Explore and test our API endpoints for seamless integration with your systems.
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-start gap-6 flex-wrap">
              <div className="flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <KeyIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">X-API-KEY Authentication</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <BookOpenIcon className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">OpenAPI 3.0 Spec</span>
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
              <div className="h-[65vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg border">
                <SwaggerUI endpoint="verification" />
              </div>
            </TabsContent>

            <TabsContent value="pdf-to-json" className="p-0 mt-6 focus-visible:outline-none focus:outline-none">
              <div className="h-[65vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg border">
                <SwaggerUI endpoint="pdf-to-json" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 