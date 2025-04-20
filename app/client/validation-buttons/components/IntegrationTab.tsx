"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, ExternalLink, Link as LinkIcon, Camera, Upload, Copy, Globe, Bell, Check, Download } from "lucide-react";
import { CaptureWidgetModal } from "./CaptureWidgetModal";
import { env } from "@/app/config/environment";
import { useToast } from "@/components/ui/use-toast";
import HtmlUploadWidgetContent from "../utils/Upload_widget";
import CaptureWidgetContent from "../utils/CaptureWidget";
import SameTabHtmlWidgetContent from "../utils/Capture_widget_sameTab";
import { store } from "@/app/store/store";
import { FancySwitchToggle } from "@/components/ui/fancy-switch-toggle";

interface IntegrationTabProps {
  verificationMethod: string;
}

export const IntegrationTab: React.FC<IntegrationTabProps> = ({ verificationMethod }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyState, setCopyState] = useState<Record<string, boolean>>({});
  const [useSameTab, setUseSameTab] = useState(false);
  const params = useParams();
  const buttonId = (params.id as string) || "default-button-id";
  console.log("buttonId", buttonId);
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const { toast } = useToast();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Function to copy text to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);

      // Clear any existing timeout for this ID
      if (timeoutRefs.current[id]) {
        clearTimeout(timeoutRefs.current[id]);
      }

      // Update copy state to show success icon for this ID only
      setCopyState((prevState) => ({
        ...prevState,
        [id]: true,
      }));

      // Show toast notification
      toast({
        title: "Copied to clipboard",
        description: "The content has been copied to your clipboard.",
        duration: 2000,
      });

      // Reset icon after 2 seconds
      timeoutRefs.current[id] = setTimeout(() => {
        setCopyState((prevState) => ({
          ...prevState,
          [id]: false,
        }));
        delete timeoutRefs.current[id];
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Function to handle widget download
  const handleWidgetDownload = () => {
    if (verificationMethod === "download") {
      // Download Capture Widget
      let verification_link = env.verification_link + buttonId + "&trackid=";
      const htmlContent = useSameTab
        ? SameTabHtmlWidgetContent(buttonId, verification_link)
        : CaptureWidgetContent(buttonId, verification_link);

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
      const htmlContent = HtmlUploadWidgetContent(buttonId);
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "upload-widget.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  console.log("verificationMethod integration tab", verificationMethod);
  const renderIntegrationContent = () => {
    if (verificationMethod === "download" || verificationMethod === "screenshot") {
      return (
        <>
          {/* Widget Integration for Download */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-all">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">Recommended</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Download Integration</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Document download workflow</p>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Secure document download with verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Automated document processing and validation</span>
                  </li>
                </ul>

                {/* Same Tab Toggle Switch - Enhanced Version */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-900/60 dark:to-blue-900/30 rounded-md p-3 border border-blue-100 dark:border-blue-900/50">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-full ${
                        useSameTab ? "bg-blue-100 dark:bg-blue-900/30" : "bg-slate-100 dark:bg-slate-800/50"
                      }`}
                    >
                      {useSameTab ? (
                        <LinkIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {useSameTab ? "Same Tab Mode" : "Default Mode"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {useSameTab ? "Opens in the current tab" : "Standard widget behavior"}
                      </p>
                    </div>
                  </div>
                  <FancySwitchToggle
                    id="card-same-tab-mode"
                    checked={useSameTab}
                    onCheckedChange={setUseSameTab}
                    className="ml-2"
                  />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={openModal}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleWidgetDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Widget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Link Integration for Download */}
          <Card className="border-2 hover:border-purple-500 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Integration Links</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Capture widget integration CDN's</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">JavaScript CDN</Label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2 relative">
                      <code
                        className="text-sm text-gray-800 dark:text-gray-200 pr-20 w-full block overflow-hidden text-ellipsis break-all"
                        style={{ whiteSpace: "nowrap", fontSize: "12px" }}
                      >
                        {env.capture_widget_JS_CDN}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => copyToClipboard(env.verification_link + buttonId + "&trackid=", "verificationLink")}
                      >
                        {copyState.verificationLink ? (
                          <Check className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copyState.verificationLink ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">CSS CDN</Label>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2 relative">
                      <code
                        className="text-sm text-gray-800 dark:text-gray-200 pr-20 w-full block overflow-hidden text-ellipsis break-all"
                        style={{ whiteSpace: "nowrap", fontSize: "12px" }}
                      >
                        {env.capture_widget_CSS_CDN}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => copyToClipboard(env.iframe_link + buttonId + "&trackid=", "iframeLink")}
                      >
                        {copyState.iframeLink ? <Check className="h-4 w-4  text-green-500" /> : <Copy className="h-4 w-4" />}
                        {copyState.iframeLink ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else if (verificationMethod === "upload") {
      return (
        <>
          {/* Widget Integration for Smart Upload */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-all">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">Recommended</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smart Upload Widget</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">AI-powered document upload</p>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Intelligent document classification and validation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Real-time document quality checks</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={openModal}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleWidgetDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Widget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Link Integration for Smart Upload */}
          <Card className="border-2 hover:border-purple-500 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Integration Links</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct upload integration via CDN's</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">JavaScript CDN</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2 relative">
                    <code
                      className="text-sm text-gray-800 dark:text-gray-200 pr-20 w-full block overflow-hidden text-ellipsis break-all"
                      style={{ whiteSpace: "nowrap", fontSize: "12px" }}
                    >
                      {env.upload_widget_JS_CDN}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => copyToClipboard(env.upload_widget_JS_CDN, "jsCdn")}
                    >
                      {copyState.jsCdn ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copyState.jsCdn ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium">CSS CDN</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2 relative">
                    <code
                      className="text-sm text-gray-800 dark:text-gray-200 pr-20 w-full block overflow-hidden text-ellipsis break-all"
                      style={{ whiteSpace: "nowrap", fontSize: "12px" }}
                    >
                      {env.upload_widget_CSS_CDN}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => copyToClipboard(env.upload_widget_CSS_CDN, "cssCdn")}
                    >
                      {copyState.cssCdn ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      {copyState.cssCdn ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    }
  };

  return (
    <div className="lg:col-span-3">
      <div className="space-y-6">
        {/* Quick Actions */}
        {/* <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Quick Integration</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Get started with our pre-built solutions</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              onClick={openModal}
            >
              <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              View Documentation
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Quick Start Guide
            </Button>
          </div>
        </div> */}

        {/* Integration Methods */}
        <div className="grid md:grid-cols-2 gap-6">{renderIntegrationContent()}</div>

        {/* Integration Resources */}
        {/* <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Additional resources</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4" onClick={openModal}>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">API reference</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Complete API documentation</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("#", "_blank")}>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Code examples</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Sample implementations</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("#", "_blank")}>
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Webhooks guide</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Event notifications setup</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("#", "_blank")}>
                <div className="flex items-start gap-3">
                  <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Integration Links</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Direct integration options</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* CaptureWidget Modal */}
      <CaptureWidgetModal isOpen={isModalOpen} onClose={closeModal} verificationMethod={verificationMethod} />
    </div>
  );
};
