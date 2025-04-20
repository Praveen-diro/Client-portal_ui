"use client";

import React, { useState, useEffect } from "react";
import { Copy, X, Search, CheckCircle, Database, Code, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import Loader from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";
import ReactJsonView from "@uiw/react-json-view";
import { lightTheme } from "@uiw/react-json-view/light";
import { darkTheme } from "@uiw/react-json-view/dark";

export interface JsonViewerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly jsonData: any;
  readonly status?: "final" | "interim" | "processing";
  readonly title?: string;
  readonly transactionData?: any;
  readonly onSendForReview?: () => void;
  readonly showSendForReviewButton?: boolean;
  readonly isLoading?: boolean;
}

export function JsonViewer({
  isOpen,
  onClose,
  jsonData,
  status = "final",
  title = "Extracted fields",
  transactionData,
  onSendForReview,
  showSendForReviewButton = false,
  isLoading = false,
}: JsonViewerProps) {
  const [activeTab, setActiveTab] = useState("data");
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if we're in dark mode
  const isDarkMode = mounted && (theme === "dark" || resolvedTheme === "dark");

  const handleCopyJson = () => {
    try {
      const textToCopy = JSON.stringify(jsonData);
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      console.error("Failed to copy JSON:", error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Function to check if a key/value pair matches the search term
  const matchesSearch = (key: string, value: any): boolean => {
    if (!searchTerm) return true;

    // Normalize and trim the search term
    const lowerSearch = searchTerm.toLowerCase().trim();

    if (lowerSearch === "") return true;

    // Check if the key matches
    const normalizedKey = String(key).toLowerCase().trim();
    if (normalizedKey.includes(lowerSearch)) return true;

    // Check if the value matches (if it's a string)
    if (typeof value === "string") {
      const normalizedValue = value.toLowerCase().trim();
      if (normalizedValue.includes(lowerSearch)) return true;
    }

    // Handle numbers
    if (typeof value === "number") {
      const normalizedValue = String(value).toLowerCase().trim();
      if (normalizedValue.includes(lowerSearch)) return true;
    }

    // Check if the value is an object or array and contains matching data
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        return value.some((item) => {
          if (typeof item === "string") {
            return item.toLowerCase().trim().includes(lowerSearch);
          }

          if (typeof item === "number") {
            return String(item).toLowerCase().includes(lowerSearch);
          }

          if (typeof item === "object" && item !== null) {
            return Object.entries(item).some(([k, v]) => matchesSearch(k, v));
          }

          return false;
        });
      } else {
        return Object.entries(value).some(([k, v]) => matchesSearch(k, v));
      }
    }

    return false;
  };

  // Filter JSON data based on search term
  const filterJsonData = (data: any): any => {
    if (!searchTerm) return data;

    // Handle null or undefined
    if (!data) return data;

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => filterJsonData(item)).filter((item) => item !== null);
    }

    // Handle objects
    if (typeof data === "object") {
      const filteredEntries = Object.entries(data)
        .filter(([key, value]) => matchesSearch(key, value))
        .map(([key, value]) => {
          if (typeof value === "object" && value !== null) {
            const filteredValue = filterJsonData(value);
            return filteredValue ? [key, filteredValue] : null;
          }
          return [key, value];
        })
        .filter((entry) => entry !== null) as [string, any][];

      if (filteredEntries.length === 0) return null;
      return Object.fromEntries(filteredEntries);
    }

    return data;
  };

  // Function to highlight matching text in a string
  const highlightMatch = (text: string): React.ReactNode => {
    if (!searchTerm || typeof text !== "string") return text;

    // Normalize the strings for comparison but keep original for display
    const normalizedText = text.toLowerCase().trim();
    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (!normalizedText.includes(normalizedSearch)) return text;

    const parts = [];
    let lastIndex = 0;

    // Find all occurrences of the search term in the text
    let index = normalizedText.indexOf(normalizedSearch);

    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        parts.push(text.substring(lastIndex, index));
      }

      // Add highlighted match (use the original case from the text)
      parts.push(
        <span
          key={`highlight-${index}`}
          className={
            isDarkMode ? "bg-yellow-500/30 text-yellow-200 px-0.5 rounded" : "bg-yellow-200 text-yellow-900 px-0.5 rounded"
          }
        >
          {text.substring(index, index + normalizedSearch.length)}
        </span>
      );

      lastIndex = index + normalizedSearch.length;
      index = normalizedText.indexOf(normalizedSearch, lastIndex);
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <>{parts}</>;
  };

  // Function to highlight key if it matches
  const highlightKey = (key: string): React.ReactNode => {
    return highlightMatch(key.replace(/_/g, " "));
  };

  // Function to highlight value based on type
  const highlightValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined || value === "") {
      return <span className={`italic ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{isDarkMode ? "null" : "N/A"}</span>;
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (typeof value[0] === "string") {
          // Check if any array element matches the search term
          if (searchTerm) {
            const highlighted = value.map((item, i) =>
              typeof item === "string" ? (
                <React.Fragment key={i}>
                  {i > 0 && ", "}
                  {highlightMatch(item)}
                </React.Fragment>
              ) : (
                <React.Fragment key={i}>
                  {i > 0 && ", "}
                  {String(item)}
                </React.Fragment>
              )
            );
            return <div>{highlighted}</div>;
          }
          return <div>{value.join(", ")}</div>;
        }
        return <span>{JSON.stringify(value)}</span>;
      }
      return <span>{JSON.stringify(value)}</span>;
    }

    return highlightMatch(String(value));
  };

  // Modified renderDataTable with search and highlighting
  const renderDataTable = () => {
    if (!jsonData || typeof jsonData !== "object") {
      return (
        <div className={`flex items-center justify-center h-64 ${isDarkMode ? "bg-gray-800/20" : "bg-gray-50"}`}>
          <div className="text-center">
            <svg
              className={`h-12 w-12 mx-auto ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>No data available</p>
          </div>
        </div>
      );
    }

    const flattenData = (data: any) => {
      let result: [string, any][] = [];

      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (item.values && Array.isArray(item.values)) {
            item.values.forEach((valueObj: any) => {
              Object.entries(valueObj).forEach(([key, value]) => {
                if (key === "requested" && value === "") return;
                if (matchesSearch(key, value)) {
                  result.push([key, value]);
                }
              });
            });
          }
        });
      } else if (typeof data === "object" && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
          if (matchesSearch(key, value)) {
            result.push([key, value]);
          }
        });
      }

      return result;
    };

    const flatData = flattenData(jsonData);

    if (flatData.length === 0 && searchTerm) {
      return (
        <div className={`flex items-center justify-center h-64 ${isDarkMode ? "bg-gray-800/20" : "bg-gray-50"}`}>
          <div className="text-center">
            <svg
              className={`h-12 w-12 mx-auto ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>No matches found for "{searchTerm}"</p>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <tbody>
            {flatData.map(([key, value], index) => (
              <tr
                key={index}
                className={
                  isDarkMode
                    ? index % 2 === 0
                      ? "bg-gray-800/40"
                      : "bg-gray-800/20"
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white"
                }
              >
                <td className={`py-3 px-6 text-left w-1/5 border-b ${isDarkMode ? "border-gray-700/30" : "border-gray-200"}`}>
                  <span className={`font-normal ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{highlightKey(key)}:</span>
                </td>
                <td className={`py-3 px-6 text-left border-b ${isDarkMode ? "border-gray-700/30" : "border-gray-200"}`}>
                  <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{highlightValue(value)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Modified renderTransactionTable with search and highlighting
  const renderTransactionTable = () => {
    if (!transactionData || typeof transactionData !== "object") {
      return (
        <div className={`flex items-center justify-center h-64 ${isDarkMode ? "bg-gray-800/20" : "bg-gray-50"}`}>
          <div className="text-center">
            <svg
              className={`h-12 w-12 mx-auto ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>No transaction data available</p>
          </div>
        </div>
      );
    }

    // Filter transaction data entries by search term
    const filteredEntries = Object.entries(transactionData).filter(([key, value]) => matchesSearch(key, value));

    if (filteredEntries.length === 0 && searchTerm) {
      return (
        <div className={`flex items-center justify-center h-64 ${isDarkMode ? "bg-gray-800/20" : "bg-gray-50"}`}>
          <div className="text-center">
            <svg
              className={`h-12 w-12 mx-auto ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className={`mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>No matches found for "{searchTerm}"</p>
          </div>
        </div>
      );
    }

    return (
      <div className="overflow-auto">
        <table className="w-full border-collapse">
          <tbody>
            {filteredEntries.map(([key, value], index) => (
              <tr
                key={index}
                className={
                  isDarkMode
                    ? index % 2 === 0
                      ? "bg-gray-800/40"
                      : "bg-gray-800/20"
                    : index % 2 === 0
                    ? "bg-gray-100"
                    : "bg-white"
                }
              >
                <td className={`py-3 px-6 text-left w-1/5 border-b ${isDarkMode ? "border-gray-700/30" : "border-gray-200"}`}>
                  <span className={`font-normal ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{highlightKey(key)}:</span>
                </td>
                <td className={`py-3 px-6 text-left border-b ${isDarkMode ? "border-gray-700/30" : "border-gray-200"}`}>
                  <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                    {typeof value === "object" && value !== null ? (
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-800"}>{JSON.stringify(value)}</span>
                    ) : (
                      highlightValue(value)
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const getStatusBadge = () => {
    switch (status) {
      case "final":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-900 text-green-300">
            Final
          </span>
        );
      case "interim":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-yellow-900 text-yellow-300">
            Interim
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-900 text-blue-300">
            <svg
              className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-800 text-gray-300">
            Unknown
          </span>
        );
    }
  };

  // Function to get theme-based class names
  const getThemeClasses = {
    dialog: isDarkMode
      ? "bg-gradient-to-b from-gray-900 to-gray-950 text-gray-200 border-gray-700 shadow-xl"
      : "bg-gradient-to-b from-white to-gray-50 text-gray-800 border-gray-200 shadow-xl",
    header: isDarkMode
      ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 shadow-md"
      : "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-200 shadow-sm",
    headerText: isDarkMode ? "text-white" : "text-gray-800",
    input: isDarkMode
      ? "bg-gray-800/70 border-gray-600 text-gray-200 placeholder-gray-400 backdrop-blur-sm focus:bg-gray-700 transition-all duration-300"
      : "bg-white/70 border-gray-300 text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:bg-white transition-all duration-300",
    button: isDarkMode
      ? "bg-gray-800 hover:bg-gray-700 text-gray-200 transition-all duration-300 shadow-sm hover:shadow"
      : "bg-white hover:bg-gray-100 text-gray-800 transition-all duration-300 shadow-sm hover:shadow",
    tabs: isDarkMode
      ? "bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50"
      : "bg-gray-100/80 backdrop-blur-sm border-b border-gray-200",
    tabActive: isDarkMode ? "text-white relative z-10" : "text-gray-800 relative z-10",
    tabInactive: isDarkMode
      ? "text-gray-400 hover:text-gray-200 transition-all duration-300"
      : "text-gray-500 hover:text-gray-800 transition-all duration-300",
    content: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    footer: isDarkMode ? "bg-gray-800 border-gray-700 text-gray-500" : "bg-gray-100 border-gray-200 text-gray-600",
    footerBadge: isDarkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600",
  };

  // If we haven't mounted yet, show a simpler UI to avoid hydration mismatch
  if (!mounted) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl p-0 rounded-lg overflow-hidden" style={{ maxWidth: "90%" }}>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div className="p-4 flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-300 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-24 mb-2.5"></div>
              <div className="h-3 bg-gray-300 rounded w-36"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`max-w-6xl p-0 rounded-xl overflow-hidden border ${getThemeClasses.dialog} transition-all duration-300 ease-in-out`}
        style={{ maxWidth: "90%" }}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        {/* Loading overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex flex-col items-center gap-3"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-2 border-primary/30 animate-pulse"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Loader />
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">Loading JSON data...</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main container with fixed height */}
        <div className="relative" style={{ height: "80vh" }}>
          {/* Header - fixed position */}
          <div className={`absolute top-0 left-0 right-0 z-[60] px-6 py-4 border-b ${getThemeClasses.header}`}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex items-center space-x-3">
                <h2 className={`text-xl font-bold ${getThemeClasses.headerText} flex items-center gap-2`}>
                  <Database className="h-5 w-5 text-indigo-500" />
                  <span className="relative">
                    {title}
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500"></span>
                  </span>
                </h2>
                {getStatusBadge()}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-grow max-w-xs group">
                  <input
                    type="text"
                    placeholder="Search fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full rounded-md py-1.5 pl-9 pr-8 text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${getThemeClasses.input}`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  {searchTerm && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-200 transition-colors duration-200" />
                    </motion.button>
                  )}
                </div>

                {showSendForReviewButton && (
                  <Button
                    onClick={onSendForReview}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm px-4 py-2 rounded-md flex items-center gap-2 shadow-lg shadow-indigo-900/20 whitespace-nowrap transition-all duration-300 hover:shadow-xl hover:-translate-y-[1px]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    Send for Review
                  </Button>
                )}

                <Button
                  onClick={handleCopyJson}
                  className={`${
                    copied ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-emerald-100" : `${getThemeClasses.button}`
                  } text-sm px-4 py-2 rounded-md flex items-center gap-2 transition-all duration-300 whitespace-nowrap hover:-translate-y-[1px]`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-emerald-100" />
                      <span className="text-emerald-100">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </Button>

                <motion.button
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  onClick={onClose}
                  className={`bg-transparent ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  } rounded-full p-1 h-8 w-8 flex items-center justify-center transition-colors duration-300`}
                >
                  <X className={`h-5 w-5 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Tabs - positioned below header */}
          <div className={`absolute top-[80px] left-0 right-0 z-[50] ${getThemeClasses.tabs}`}>
            <div className="flex relative px-4 py-1">
              <button
                className={`py-3 px-4 text-sm font-medium focus:outline-none transition-colors duration-300 ease-in-out flex items-center space-x-2 relative group ${
                  activeTab === "data" ? getThemeClasses.tabActive : getThemeClasses.tabInactive
                }`}
                onClick={() => setActiveTab("data")}
              >
                <div className="flex items-center space-x-2 relative">
                  <div
                    className={`absolute inset-0 ${
                      activeTab === "data" ? (isDarkMode ? "bg-gray-700/50" : "bg-white/70") : "bg-transparent"
                    } rounded-full -z-10 blur-sm transition-all duration-300`}
                  ></div>
                  <Database
                    className={`h-4 w-4 ${
                      activeTab === "data" ? "text-indigo-500" : "text-gray-500 group-hover:text-indigo-400"
                    } transition-colors duration-300`}
                  />
                  <span className="relative">
                    Data Table
                    {activeTab === "data" && (
                      <motion.span
                        layoutId="tabGlow"
                        className={`absolute -bottom-1 left-0 right-0 h-[2px] ${
                          isDarkMode ? "bg-indigo-500/50" : "bg-indigo-400/50"
                        } blur-sm`}
                      />
                    )}
                  </span>
                </div>
                {activeTab === "data" && (
                  <motion.div
                    layoutId="activeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              <button
                className={`py-3 px-4 text-sm font-medium focus:outline-none transition-colors duration-300 ease-in-out flex items-center space-x-2 relative group ${
                  activeTab === "raw-json" ? getThemeClasses.tabActive : getThemeClasses.tabInactive
                }`}
                onClick={() => setActiveTab("raw-json")}
              >
                <div className="flex items-center space-x-2 relative">
                  <div
                    className={`absolute inset-0 ${
                      activeTab === "raw-json" ? (isDarkMode ? "bg-gray-700/50" : "bg-white/70") : "bg-transparent"
                    } rounded-full -z-10 blur-sm transition-all duration-300`}
                  ></div>
                  <Code
                    className={`h-4 w-4 ${
                      activeTab === "raw-json" ? "text-indigo-500" : "text-gray-500 group-hover:text-indigo-400"
                    } transition-colors duration-300`}
                  />
                  <span className="relative">
                    Raw JSON
                    {activeTab === "raw-json" && (
                      <motion.span
                        layoutId="tabGlow"
                        className={`absolute -bottom-1 left-0 right-0 h-[2px] ${
                          isDarkMode ? "bg-indigo-500/50" : "bg-indigo-400/50"
                        } blur-sm`}
                      />
                    )}
                  </span>
                </div>
                {activeTab === "raw-json" && (
                  <motion.div
                    layoutId="activeTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {transactionData && (
                <button
                  className={`py-3 px-4 text-sm font-medium focus:outline-none transition-colors duration-300 ease-in-out flex items-center space-x-2 relative group ${
                    activeTab === "transaction-data" ? getThemeClasses.tabActive : getThemeClasses.tabInactive
                  }`}
                  onClick={() => setActiveTab("transaction-data")}
                >
                  <div className="flex items-center space-x-2 relative">
                    <div
                      className={`absolute inset-0 ${
                        activeTab === "transaction-data" ? (isDarkMode ? "bg-gray-700/50" : "bg-white/70") : "bg-transparent"
                      } rounded-full -z-10 blur-sm transition-all duration-300`}
                    ></div>
                    <FileText
                      className={`h-4 w-4 ${
                        activeTab === "transaction-data" ? "text-indigo-500" : "text-gray-500 group-hover:text-indigo-400"
                      } transition-colors duration-300`}
                    />
                    <span className="relative">
                      Transaction
                      {activeTab === "transaction-data" && (
                        <motion.span
                          layoutId="tabGlow"
                          className={`absolute -bottom-1 left-0 right-0 h-[2px] ${
                            isDarkMode ? "bg-indigo-500/50" : "bg-indigo-400/50"
                          } blur-sm`}
                        />
                      )}
                    </span>
                  </div>
                  {activeTab === "transaction-data" && (
                    <motion.div
                      layoutId="activeTabLine"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              )}

              <div className="ml-auto">
                <motion.div
                  className={`px-3 py-1.5 text-xs rounded-full ${
                    isDarkMode
                      ? "bg-gray-700/80 text-gray-300 border border-gray-600/30"
                      : "bg-white/80 text-gray-500 border border-gray-300/30 shadow-sm"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeTab === "data" ? "Tabular view" : activeTab === "raw-json" ? "Developer view" : "Transaction details"}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Content area - positioned below tabs with padding to account for header and tabs */}
          <div className={`absolute top-[130px] left-0 right-0 bottom-0 overflow-auto ${getThemeClasses.content}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {activeTab === "data" && (
                  <div className={isDarkMode ? "bg-gray-900 h-full" : "bg-white h-full"}>
                    {searchTerm && (
                      <div className="sticky top-0 z-10 px-4 py-2 bg-indigo-500/10 backdrop-blur-sm border-b border-indigo-500/20">
                        <div className="flex items-center text-sm">
                          <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className={isDarkMode ? "text-indigo-300" : "text-indigo-700"}>
                            Filtering results for "{searchTerm}"
                          </span>
                        </div>
                      </div>
                    )}
                    {renderDataTable()}
                  </div>
                )}
                {activeTab === "raw-json" && (
                  <div className="p-4">
                    {searchTerm ? (
                      <div>
                        <div className="mb-4 px-3 py-2 border rounded bg-indigo-500/10 border-indigo-500/20">
                          <div className="flex items-center text-sm">
                            <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                            <span className={isDarkMode ? "text-indigo-300" : "text-indigo-700"}>
                              Showing filtered results for "{searchTerm}" in raw JSON view
                            </span>
                          </div>
                        </div>
                        <ReactJsonView
                          value={filterJsonData(jsonData) || {}}
                          collapsed={2}
                          enableClipboard={true}
                          displayObjectSize={true}
                          displayDataTypes={false}
                          style={{
                            ...(isDarkMode ? darkTheme : lightTheme),
                            fontSize: "0.95rem",
                            borderRadius: 8,
                            padding: 12,
                            background: "transparent",
                            border: isDarkMode ? "1px solid rgba(75, 85, 99, 0.2)" : "1px solid rgba(229, 231, 235, 0.8)",
                          }}
                        />
                      </div>
                    ) : (
                      <ReactJsonView
                        value={jsonData || {}}
                        collapsed={2}
                        enableClipboard={true}
                        displayObjectSize={true}
                        displayDataTypes={false}
                        style={{
                          ...(isDarkMode ? darkTheme : lightTheme),
                          fontSize: "0.95rem",
                          borderRadius: 8,
                          padding: 12,
                          background: "transparent",
                          border: isDarkMode ? "1px solid rgba(75, 85, 99, 0.2)" : "1px solid rgba(229, 231, 235, 0.8)",
                        }}
                      />
                    )}
                  </div>
                )}
                {activeTab === "transaction-data" && transactionData && (
                  <div className={isDarkMode ? "bg-gray-900 h-full" : "bg-white h-full"}>
                    {searchTerm && (
                      <div className="sticky top-0 z-10 px-4 py-2 bg-indigo-500/10 backdrop-blur-sm border-b border-indigo-500/20">
                        <div className="flex items-center text-sm">
                          <Filter className="h-4 w-4 mr-2 text-indigo-500" />
                          <span className={isDarkMode ? "text-indigo-300" : "text-indigo-700"}>
                            Filtering results for "{searchTerm}"
                          </span>
                        </div>
                      </div>
                    )}
                    {renderTransactionTable()}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
