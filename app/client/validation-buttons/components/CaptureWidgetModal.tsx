"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Code, Download, FileCode, Settings, Play, Bookmark, ChevronRight, Hash, Menu, X } from "lucide-react";
import { env } from "@/app/config/environment";
import "../utils/widget-documentation.css";
import HtmlWidgetContent from "../utils/CaptureWidget";
import SameTabHtmlWidgetContent from "../utils/Capture_widget_sameTab";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface CaptureWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationMethod: string;
}

// Type definitions for content structure
interface Subsection {
  subtitle: string;
  description: string;
  code?: string;
}

interface ConfigOption {
  name: string;
  isRequired: boolean;
  description: string;
  code: string;
  codeId: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  code?: string;
  codeId?: string;
  subsections?: Subsection[];
  options?: ConfigOption[];
  category?: "steps" | "configuration" | "example";
  htmlContent?: React.ReactNode;
}

interface Content {
  title: string;
  sections?: Section[];
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export const CaptureWidgetModal: React.FC<CaptureWidgetModalProps> = ({ isOpen, onClose, verificationMethod }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSectionType, setActiveSectionType] = useState<string>("steps");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([]);
  const [useSameTab, setUseSameTab] = useState(false);

  const params = useParams();
  const buttonId = (params.id as string) || "default-button-id";

  // Generate table of contents - simplified to only show category headings
  useEffect(() => {
    setTableOfContents([
      {
        id: "implementation-steps",
        title: "Implementation Steps",
        level: 1,
      },
      {
        id: "configuration-options",
        title: "Configuration Options",
        level: 1,
      },
      {
        id: "complete-examples",
        title: "Complete Examples",
        level: 1,
      },
    ]);
  }, []);

  // Function to copy code to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  // Function to handle widget download
  const handleWidgetDownload = () => {
    if (verificationMethod === "download") {
      // Download Capture Widget
      let verification_link = `https://verification.example.com/capture/${buttonId}`;
      const htmlContent = useSameTab
        ? SameTabHtmlWidgetContent(buttonId, verification_link)
        : HtmlWidgetContent(buttonId, verification_link);

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = useSameTab ? "capture-widget-sametab.html" : "capture-widget.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (verificationMethod === "upload") {
      // Download Upload Widget
      // Import the Upload Widget content dynamically
      import("../utils/Upload_widget").then((HtmlUploadWidgetContent) => {
        const htmlContent = HtmlUploadWidgetContent.default(buttonId);
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "upload-widget.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }
  };

  // Content based on verification method
  const getContent = (): Content => {
    switch (verificationMethod) {
      case "download":
        return {
          title: "Capture Widget Integration",
          sections: [
            {
              id: "include-css",
              title: "Include CSS",
              description: "In the <head> section of your HTML file, include the CDN link to the widget's CSS.",
              code: `<link rel="stylesheet" href="${env.capture_widget_CSS_CDN}">`,
              codeId: "css",
              category: "steps",
            },
            {
              id: "include-js",
              title: "Include JavaScript",
              description: "Before the closing </body> tag, include the CDN link to the widget's JavaScript.",
              code: `<script src="${env.capture_widget_JS_CDN}"></script>`,
              codeId: "js",
              category: "steps",
            },
            {
              id: "add-container",
              title: "Add Widget Container",
              description: "Place the following <div> element in your HTML where you want the widget to appear.",
              code: `<div class="diro-widget" id="diro-widget-container"></div>`,
              codeId: "container",
              category: "steps",
            },
            {
              id: "initialize",
              title: "Initialize Widget",
              description: "Call the initializeDiroWidget function to activate the widget.",
              code: `window.initializeDiroWidget(document.getElementById('diro-widget-container'), {
  targetUrl: "verification link should be",
  buttonText: "Start verification"
});`,
              codeId: "init",
              category: "steps",
            },
            {
              id: "track-id",
              title: "Track ID Integration",
              description: "The trackid is a crucial parameter for the DIRO Widget, used to uniquely identify each session.",
              subsections: [
                {
                  subtitle: "Single Track ID",
                  description: "To pass a single track ID, add it as a URL parameter:",
                  code: "https://sample.com?trackid=123",
                },
                {
                  subtitle: "Multiple Track IDs",
                  description: "For multiple track IDs, use URL parameters with an ampersand (&) separator:",
                  code: "https://sample.com?uid=123&mid=345",
                },
              ],
              category: "steps",
            },
            {
              id: "config-options",
              title: "Customization options",
              description: "Customize the widget behavior with these configuration parameters:",
              htmlContent: (
                <div className="text-sm">
                  {/* <div className="mb-6 px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-b-2 border-primary/40 rounded-t-lg">
                    <h3 className="font-medium text-lg text-slate-800 dark:text-slate-200">Widget Configuration Parameters</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Customize the behavior and appearance of your widget
                    </p>
                  </div> */}

                  <div className="space-y-2">
                    {/* targetUrl (Required) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-red-100 dark:bg-red-900/20">
                              <span className="text-red-600 dark:text-red-400 font-semibold text-xs">REQ</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">targetUrl</h4>
                              <p className="text-xs text-muted-foreground">Primary verification endpoint</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              The primary URL for the verification process. It is obtained from the client portal and can be used
                              to verify banks, addresses, or other entities.
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard(
                                      'targetUrl: "https://verification.diro.live/?buttonid=O.IN-a5pllZ-Lu3Z-sandbox&trackid="',
                                      "targetUrl"
                                    );
                                  }}
                                >
                                  {copied === "targetUrl" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400 overflow-x-auto">
                                targetUrl: "https://verification.diro.live/?buttonid=O.IN-a5pllZ-Lu3Z-sandbox&trackid="
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* openWith (Optional) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">OPT</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">openWith</h4>
                              <p className="text-xs text-muted-foreground">Controls how the verification window opens</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              This field determines how the verification window opens when a user interacts with the widget.
                            </p>

                            <div className="mb-4">
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                                Available options:
                              </div>
                              <div className="space-y-1.5 pl-1">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                                  <code className="font-semibold text-xs">sameTab</code>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    (default) - Opens in the current tab
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                                  <code className="font-semibold text-xs">newTab</code>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">Opens in a new browser tab</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                                  <code className="font-semibold text-xs">newWindow</code>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">Opens in a popup window</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard('openWith: "newTab"', "openWith");
                                  }}
                                >
                                  {copied === "openWith" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400">
                                openWith: "newTab"
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* allowRedirection (Optional) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">OPT</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">allowRedirection</h4>
                              <p className="text-xs text-muted-foreground">Enables post-submission redirects</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              Enable automatic redirection after successful submission. The{" "}
                              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">redirecturl</code> can
                              be set from button settings or passed directly in the URL as a parameter.
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard("allowRedirection: true", "allowRedirection");
                                  }}
                                >
                                  {copied === "allowRedirection" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400">
                                allowRedirection: true
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* windowFeatures (Optional) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">OPT</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">windowFeatures</h4>
                              <p className="text-xs text-muted-foreground">Configures popup window appearance</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-1">
                              Only applicable when{" "}
                              <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                                openWith: "newWindow"
                              </code>
                            </p>
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              Customizes the appearance of the popup window, including size and position.
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard('windowFeatures: "width=800,height=600,left=100,top=100"', "windowFeatures");
                                  }}
                                >
                                  {copied === "windowFeatures" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400">
                                windowFeatures: "width=800,height=600,left=100,top=100"
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* buttonText (Optional) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">OPT</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">buttonText</h4>
                              <p className="text-xs text-muted-foreground">Text displayed on the widget button</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              Customizes the label text displayed on the widget button.
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard('buttonText: "Start verification"', "buttonText");
                                  }}
                                >
                                  {copied === "buttonText" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400">
                                buttonText: "Start verification"
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* Styling Options Section */}
                    <div className="mt-6 mb-2">
                      <h4 className="text-base font-medium text-slate-600 dark:text-slate-300">Styling Options</h4>
                      <p className="text-xs text-muted-foreground mt-1">Customize the visual appearance of the widget</p>
                    </div>

                    {/* containerStyles (Optional) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">OPT</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">containerStyles</h4>
                              <p className="text-xs text-muted-foreground">CSS styles for the widget container</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              Customizes the appearance of the widget container. Accepts a JavaScript object with CSS properties.
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard(
                                      'containerStyles: {\n  backgroundColor: "#F8F8F8",\n  padding: "20px",\n  borderRadius: "10px"\n}',
                                      "containerStyles"
                                    );
                                  }}
                                >
                                  {copied === "containerStyles" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400">
                                {`containerStyles: {
  backgroundColor: "#F8F8F8",
  padding: "20px",
  borderRadius: "10px"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* buttonStyles (Optional) */}
                    <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                      <details className="group">
                        <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded flex items-center justify-center bg-slate-100 dark:bg-slate-900/60">
                              <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">OPT</span>
                            </div>
                            <div>
                              <h4 className="font-semibold tracking-tight">buttonStyles</h4>
                              <p className="text-xs text-muted-foreground">CSS styles for the widget button</p>
                            </div>
                          </div>
                          <svg
                            className="h-5 w-5 text-slate-500 group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>

                        <div className="px-4 pb-4 pt-1 border-t">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-slate-700 dark:text-slate-300 mb-3">
                              Customizes the appearance of the widget button. Accepts a JavaScript object with CSS properties.
                            </p>

                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Example</div>
                                <button
                                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    copyToClipboard(
                                      'buttonStyles: {\n  fontSize: "16px",\n  borderRadius: "8px",\n  width: "300px"\n}',
                                      "buttonStyles"
                                    );
                                  }}
                                >
                                  {copied === "buttonStyles" ? (
                                    <>
                                      <CheckCircle className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Copy
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="text-xs font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-blue-600 dark:text-blue-400">
                                {`buttonStyles: {
  fontSize: "16px",
  borderRadius: "8px",
  width: "300px"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              ),
              category: "configuration",
            },
            {
              id: "complete-example",
              title: "Complete Example",
              description: "Here's a full implementation with all the steps:",
              code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIRO Widget</title>
  <!-- CSS CDN -->
  <link rel="stylesheet" href="https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/stylesSelectLink.css">
</head>
<body>
  <!-- Place this div where you want the widget to be rendered -->
  <div id="diro-widget-container"></div>
  <!-- JS CDN -->
  <script src="https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/diroWidgetSelectLink.js"></script>
  <script>
    // Initialize the widget after the JS is loaded
    window.initializeDiroWidget(document.getElementById('diro-widget-container'), 
    {targetUrl: "https://verification.diro.live/?buttonid=O.IN-GqXHkI-Skrj&trackid=", 
    allowRedirection: true,
    buttonText: "Start verification",
    openWith:"",
    containerStyles: {
      backgroundColor: "#F8F8F8",
      padding: "20px",
      borderRadius: "10px"
    },
    buttonStyles: {
      fontSize: "16px",
      borderRadius: "8px",
      width: "300px",
    }
  });
  </script>
</body>
</html>`,
              codeId: "fullExample",
              category: "example",
            },
          ],
        };
      case "upload":
        return {
          title: "Smart Upload Widget Integration",
          sections: [
            {
              id: "upload-widget-intro",
              title: "Smart Upload Widget",
              description: "Facilitates the initiation and status tracking of file uploads with AI-powered document validation.",
              subsections: [
                {
                  subtitle: "Key Features",
                  description: "Our Smart Upload Widget offers multiple benefits:",
                  code: "• Includes instant smart-feedback on smart-upload\n• Simple CDN link integration with flexibility\n• Tailor the widget to match your website's design and branding",
                },
              ],
              category: "steps",
            },
            {
              id: "include-css-upload",
              title: "Include CSS",
              description: "In the <head> section of your HTML file, include the CDN link to the widget's CSS.",
              code: `<link rel="stylesheet" href="${env.upload_widget_CSS_CDN}">`,
              codeId: "css-upload",
              category: "steps",
            },
            {
              id: "include-js-upload",
              title: "Include JavaScript",
              description: "Before the closing </body> tag, include the CDN link to the widget's JavaScript.",
              code: `<script src="${env.upload_widget_JS_CDN}"></script>`,
              codeId: "js-upload",
              category: "steps",
            },
            {
              id: "add-container-upload",
              title: "Add Widget Container",
              description: "Place the following <div> element in your HTML where you want the widget to appear.",
              code: `<div 
  class="diro-widget"
  id="reactWidget"
  data-buttonid="YOUR_BUTTON_ID"
  data-trackid="abc"
  wrapper="{"height": "380px", "width": "500px", "themeColor":"black", "fontFamily":"Montserrat", "fontSize":"12px"}"
></div>`,
              codeId: "container-upload",
              category: "steps",
            },
            {
              id: "track-id-upload",
              title: "Track ID Integration",
              description: "The trackid is a crucial parameter for the Upload Widget, used to uniquely identify each session.",
              subsections: [
                {
                  subtitle: "How it works",
                  description:
                    "The widget is designed to automatically fetch this trackid from the attribute passed in html of the page where it is integrated.",
                },
              ],
              category: "configuration",
            },
            {
              id: "customization-upload",
              title: "Customization Options",
              description: "Customize the widget behavior with these configuration parameters:",
              options: [
                {
                  name: "wrapper",
                  isRequired: true,
                  description:
                    "It will accept parameters for height, width, theme color, font family, and font size, providing flexible UI customization with precise control over the component's appearance.",
                  code: `wrapper="{"height": "380px", "width": "500px", "themeColor":"black", "fontFamily":"Montserrat", "fontSize":"12px"}"`,
                  codeId: "wrapper-upload",
                },
              ],
              category: "configuration",
            },
          ],
        };
      default:
        return {
          title: "Widget Documentation",
          sections: [
            {
              id: "generic-docs",
              title: "Documentation",
              description: "Please select a verification method to view specific documentation.",
              category: "steps",
            },
          ],
        };
    }
  };

  const content = getContent();

  // Group sections by category
  const stepsSections = content.sections?.filter((section) => section.category === "steps") || [];
  const configSections = content.sections?.filter((section) => section.category === "configuration") || [];
  const exampleSections = content.sections?.filter((section) => section.category === "example") || [];

  // Get active sections based on current type
  const getActiveSections = () => {
    switch (activeSectionType) {
      case "steps":
        return stepsSections;
      case "configuration":
        return configSections;
      case "example":
        return exampleSections;
      default:
        return stepsSections;
    }
  };

  // Function to handle main category navigation
  const navigateToCategory = (category: string) => {
    setActiveSectionType(category);
    const sections = category === "steps" ? stepsSections : category === "configuration" ? configSections : exampleSections;

    if (sections && sections.length > 0) {
      scrollToSection(sections[0].id);
    }
  };

  // Section component
  const Section = ({ section, index }: { section: Section; index: number }) => (
    <div id={section.id} className={cn("mb-8", activeSection === section.id && "scroll-mt-6")}>
      <div className="flex items-center gap-2 mb-2 group">
        {section.category === "steps" && (
          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
            {index + 1}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
        <a
          href={`#${section.id}`}
          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity ml-2"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(section.id);
          }}
        >
          <Hash className="h-3.5 w-3.5" />
        </a>
      </div>

      <p className="text-muted-foreground mb-3 text-sm">{section.description}</p>

      {section.htmlContent && <div className="my-3">{section.htmlContent}</div>}

      {section.code && !section.htmlContent && <CodeBlock code={section.code} codeId={section.codeId || `${section.id}-code`} />}

      {/* Subsections */}
      {section.subsections && (
        <div className="space-y-6 mt-6">
          {section.subsections.map((subsection, subIndex) => (
            <div key={subIndex} id={`${section.id}-sub-${subIndex}`} className="scroll-mt-6">
              <div className="flex items-center gap-2 mb-2 group">
                <h3 className="text-base font-semibold tracking-tight">{subsection.subtitle}</h3>
                <a
                  href={`#${section.id}-sub-${subIndex}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(`${section.id}-sub-${subIndex}`);
                  }}
                >
                  <Hash className="h-3 w-3" />
                </a>
              </div>
              <p className="text-muted-foreground mb-3 text-sm">{subsection.description}</p>
              {subsection.code && <CodeBlock code={subsection.code} codeId={`${section.id}-sub-${subIndex}`} />}
            </div>
          ))}
        </div>
      )}

      {/* Configuration options */}
      {section.options && (
        <div className="space-y-6 mt-6">
          {section.options.map((option, optIndex) => (
            <div key={optIndex} id={option.codeId} className="scroll-mt-6 border-l-2 border-primary/30 pl-3">
              <div className="flex items-center gap-2 mb-2 group">
                <h3 className="text-base font-semibold tracking-tight flex items-center">
                  {option.name}
                  {option.isRequired && <span className="text-destructive ml-1 text-xs">*</span>}
                </h3>
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-muted-foreground/20 text-muted-foreground">
                  {option.isRequired ? "Required" : "Optional"}
                </span>
                <a
                  href={`#${option.codeId}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity ml-2"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(option.codeId);
                  }}
                >
                  <Hash className="h-3 w-3" />
                </a>
              </div>
              <p className="text-muted-foreground mb-3 text-sm">{option.description}</p>
              <CodeBlock code={option.code} codeId={option.codeId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Code block component
  const CodeBlock = ({ code, codeId }: { code: string; codeId: string }) => (
    <div className="relative my-3">
      <div className="rounded-md overflow-hidden bg-black/90 border border-muted-foreground/20">
        <div className="flex items-center justify-between px-3 py-1.5 bg-muted-foreground/30 text-white">
          <div className="text-xs font-mono opacity-70">code</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(code, codeId)}
            className="h-6 px-2 text-xs opacity-80 hover:opacity-100 text-white flex items-center gap-1.5"
          >
            {copied === codeId ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span>{copied === codeId ? "Copied!" : "Copy"}</span>
          </Button>
        </div>
        <pre className="p-3 text-xs overflow-x-auto font-mono text-green-400">{code}</pre>
      </div>
    </div>
  );

  // Sidebar category component
  const SidebarCategory = ({
    title,
    isActive,
    icon,
    onClick,
  }: {
    title: string;
    isActive: boolean;
    icon: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors mb-1",
        isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted",
        "text-sm"
      )}
    >
      {icon}
      <span>{title}</span>
    </button>
  );

  // Navigation item component
  const NavItem = ({
    id,
    title,
    isActive,
    category,
    icon,
  }: {
    id: string;
    title: string;
    isActive: boolean;
    category: string;
    icon?: React.ReactNode;
  }) => (
    <button
      onClick={() => {
        setActiveSectionType(category);
        scrollToSection(id);
      }}
      className={cn(
        "flex items-center gap-2 w-full text-left px-3 py-2 rounded-md transition-colors text-sm",
        isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
      )}
    >
      {icon}
      <span>{title}</span>
    </button>
  );

  // TOC Item component - simplified
  const TocItem = ({ title, category, isActive }: { title: string; category: string; isActive: boolean }) => (
    <button
      onClick={() => navigateToCategory(category)}
      className={cn(
        "text-sm flex items-center hover:text-primary transition-colors py-1.5 px-2 rounded w-full",
        isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
      )}
    >
      {category === "steps" ? (
        <FileCode className="h-4 w-4 mr-2 flex-shrink-0" />
      ) : category === "configuration" ? (
        <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
      ) : (
        <Play className="h-4 w-4 mr-2 flex-shrink-0" />
      )}
      <span>{title}</span>
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[85%] min-w-[50%] max-w-[80%] max-h-[95vh] p-0 overflow-hidden text-sm">
        <DialogTitle className="sr-only">{content.title}</DialogTitle>
        <div className="flex flex-col h-[90vh]">
          {/* Header */}
          <div className="px-4 py-2 border-b bg-background z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
                <div className="p-1 rounded-lg bg-primary/10">
                  <Code className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-base font-semibold">{content.title}</h2>
              </div>
              <div className="flex gap-2">
                {(verificationMethod === "download" || verificationMethod === "upload") && (
                  <div className="flex items-center gap-2">
                    {verificationMethod === "download" && (
                      <div className="flex items-center bg-muted/30 rounded-md px-2 py-1 mr-1">
                        <Switch id="same-tab-mode" checked={useSameTab} onCheckedChange={setUseSameTab} className="mr-2" />
                        <label htmlFor="same-tab-mode" className="text-xs cursor-pointer">
                          {useSameTab ? "Same Tab" : "Default Mode"}
                        </label>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleWidgetDownload}>
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download Widget
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>

          {/* Main documentation layout */}
          <div className="flex-1 flex overflow-hidden">
            {/* Mobile menu overlay */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 bg-background/80 z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Left sidebar - Navigation */}
            <div
              className={cn(
                "w-64 border-r bg-muted/5 flex-shrink-0 overflow-y-auto",
                "fixed inset-y-0 top-[41px] z-50 md:static", // Adjusted top value based on new header height
                mobileMenuOpen ? "left-0" : "-left-full",
                "transition-all duration-200 md:transition-none md:left-0"
              )}
            >
              <div className="py-4 px-2 flex flex-col h-full">
                <div className="mb-4">
                  <SidebarCategory
                    title="Implementation steps"
                    isActive={activeSectionType === "steps"}
                    icon={<FileCode className="h-6 w-4" />}
                    onClick={() => {
                      setActiveSectionType("steps");
                      if (stepsSections.length > 0) {
                        scrollToSection(stepsSections[0].id);
                      }
                    }}
                  />
                </div>

                <div className="mb-4">
                  <SidebarCategory
                    title="Customization options"
                    isActive={activeSectionType === "configuration"}
                    icon={<Settings className="h-6 w-4" />}
                    onClick={() => {
                      setActiveSectionType("configuration");
                      if (configSections.length > 0) {
                        scrollToSection(configSections[0].id);
                      }
                    }}
                  />
                </div>

                {exampleSections.length > 0 && (
                  <div className="mb-4">
                    <SidebarCategory
                      title="Example"
                      isActive={activeSectionType === "example"}
                      icon={<Play className="h-6 w-4" />}
                      onClick={() => {
                        setActiveSectionType("example");
                        if (exampleSections.length > 0) {
                          scrollToSection(exampleSections[0].id);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-hidden flex">
              <div className="flex-1 min-w-0">
                <ScrollArea className="h-full" id="main-content-area">
                  <div className="px-6 py-4 max-w-4xl mx-auto">
                    <div>
                      {/* Sections */}
                      {getActiveSections().map((section, index) => (
                        <Section key={section.id} section={section} index={index} />
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
