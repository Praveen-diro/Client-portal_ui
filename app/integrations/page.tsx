"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";

export default function IntegrationsPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const transitionConfig = {
    type: "tween",
    duration: 0.3,
    ease: "easeOut",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        when: "beforeChildren",
      },
    },
  };

  const tableVariants = {
    hidden: {
      opacity: 0,
      x: 60,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 20,
        mass: 0.4,
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const boxVariants = {
    hidden: {
      opacity: 0,
      x: 15,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        mass: 0.3,
        duration: 0.3,
      },
    },
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <PageContainer sidebarExpanded={sidebarExpanded}>
        <div className="flex-1 relative">
          <PageHeader title="Integrations" description="Manage your integration settings and connections" />

          <motion.div initial="hidden" animate="show" variants={containerVariants} className="container mx-auto px-6 py-8">
            <motion.div variants={tableVariants}>
              <motion.div
                variants={tableVariants}
                className="bg-card rounded-lg border shadow-lg dark:shadow-gray-900/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="grid grid-cols-12 border-b border-border">
                  <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                      Categories
                    </h2>
                  </div>
                  <div className="col-span-4 p-6 bg-white/50 dark:bg-gray-800/50 border-l border-border">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                      Quick start (no code)
                    </h2>
                  </div>
                  <div className="col-span-5 p-6 bg-white/50 dark:bg-gray-800/50 border-l border-border">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 text-center">
                      Advanced (high volume)
                    </h2>
                  </div>
                </div>

                <motion.div variants={containerVariants} initial="hidden" animate="show">
                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">1</span>
                        </span>
                        Get started
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3">
                          <motion.li
                            variants={boxVariants}
                            className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Setup organization
                          </motion.li>
                          <motion.li
                            variants={boxVariants}
                            className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Setup verification button
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Configure verification fields
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Enable privacy
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">2</span>
                        </span>
                        Trigger verification
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3">
                          <motion.li variants={boxVariants} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Copy link (use as Iframe or new window)
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Add customer reference number
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Compare and verify user data
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">3</span>
                        </span>
                        During verification
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Set your logo
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Advanced configurations
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Verification progress status Window.postMessage()
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">4</span>
                        </span>
                        After verification
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Get document via email
                          </motion.li>
                          <motion.li
                            variants={boxVariants}
                            className="ml-6 mt-3 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-gray-900/20 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
                          >
                            <p className="font-medium text-gray-900 dark:text-white mb-2">Enable automatic extraction of data:</p>
                            <ul className="space-y-2 ml-4">
                              <motion.li variants={boxVariants} className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                Output to Google Sheet
                              </motion.li>
                              <motion.li variants={boxVariants} className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                Output to Zapier
                              </motion.li>
                              <motion.li variants={boxVariants} className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                Enable auto-extraction
                              </motion.li>
                              <motion.li variants={boxVariants} className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                If using high privacy mode
                              </motion.li>
                            </ul>
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-6 text-gray-600 dark:text-gray-300">
                          <motion.li
                            variants={boxVariants}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                          >
                            <div className="flex items-center gap-3 hover:text-blue-600 dark:hover:text-blue-400">
                              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                              Setup webhook (callback URL)
                            </div>
                            <div className="ml-6 mt-3 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-800/50 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-gray-900/20 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                              <p className="font-medium text-gray-900 dark:text-white mb-2">Receive webhooks (View logs):</p>
                              <ul className="space-y-2 ml-4">
                                <motion.li variants={boxVariants} className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                  Engagement status (final)
                                </motion.li>
                                <motion.li variants={boxVariants} className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                  Document submitted
                                </motion.li>
                                <motion.li variants={boxVariants} className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                  Extracted JSON (Interim /Final)
                                </motion.li>
                                <motion.li variants={boxVariants} className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                  JSON failure
                                </motion.li>
                              </ul>
                            </div>
                          </motion.li>

                          <motion.li
                            variants={boxVariants}
                            className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300"
                          >
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white mb-2">APIs to retrieve data</p>
                              <ul className="space-y-3">
                                <motion.li variants={boxVariants} className="flex items-center gap-3">
                                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                  View API keys and secret token
                                </motion.li>
                                <motion.li variants={boxVariants} className="mt-3">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                                    <p className="font-medium">Get native original (MHTML / PDF / other types)</p>
                                  </div>
                                  <ul className="space-y-2 ml-7">
                                    <motion.li variants={boxVariants} className="flex items-center gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                      Get certified PDF
                                    </motion.li>
                                    <motion.li variants={boxVariants} className="flex items-center gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                      Get session data
                                    </motion.li>
                                    <motion.li variants={boxVariants} className="flex items-center gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                      Get extracted JSON
                                    </motion.li>
                                    <motion.li variants={boxVariants} className="flex items-center gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                      Download postman templates ⤓
                                    </motion.li>
                                  </ul>
                                </motion.li>
                              </ul>
                            </div>
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">5</span>
                        </span>
                        Deletion
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Auto delete data
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Delete data API
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">6</span>
                        </span>
                        Before you go live
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Testing
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Activating production
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Setup user and permissions
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Creating a Landing page
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={tableVariants}
                    className="grid grid-cols-12 border-b border-border group hover:bg-accent/5"
                  >
                    <div className="col-span-3 p-6 bg-gray-50/50 dark:bg-gray-900/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400">7</span>
                        </span>
                        Documents
                      </h3>
                    </div>
                    <div className="col-span-4 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Interaction flow overview
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Sample certified pdf
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Sample uncertified original
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Data dictionary
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            Iframe Integration guide
                          </motion.li>
                        </ul>
                      </motion.div>
                    </div>
                    <div className="col-span-5 p-4">
                      <motion.div
                        variants={boxVariants}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 transition-all duration-500 ease-in-out border border-gray-100 dark:border-gray-700 h-full shadow-sm hover:shadow-md dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 group"
                      >
                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                          <motion.li variants={boxVariants} className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">HMAC for Secure Communication</p>
                              <p>Authenticate and secure data using HMAC</p>
                            </div>
                          </motion.li>
                          <motion.li variants={boxVariants} className="flex items-center gap-3"></motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
}
