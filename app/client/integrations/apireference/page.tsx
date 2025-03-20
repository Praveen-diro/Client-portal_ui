"use client";

import { useState } from "react";
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
  FileIcon
} from "lucide-react";
import Link from "next/link";

export default function ApiReferencePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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

            {/* API Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 
                            shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full mr-4 flex-shrink-0">
                    <KeyIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Authentication</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  All API requests require an API key for authentication. Add the API key in the 
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mx-1 text-sm font-mono">X-API-KEY</code> 
                  header with each request.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 
                            shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-center">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-full mr-4 flex-shrink-0">
                    <BookIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Documentation</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  Our API uses OpenAPI 3.0 specifications. You can test endpoints directly from this page 
                  using the interactive "Try it out" feature in each endpoint section.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 
                            shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-center">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full mr-4 flex-shrink-0">
                    <ServerIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Rate Limits</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  API calls are limited to 100 requests per minute. Contact us if you need higher limits for 
                  your production environment.
                </p>
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
                <SwaggerUI endpoint="verification" />
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
    </div>
  );
} 