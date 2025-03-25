import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, ExternalLink, Link as LinkIcon, Camera, Upload, Copy, Globe, Bell } from "lucide-react";

interface IntegrationTabProps {
  verificationMethod: string;
}

export const IntegrationTab: React.FC<IntegrationTabProps> = ({ verificationMethod }) => {
  const renderIntegrationContent = () => {
    if (verificationMethod === "download") {
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
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Sample Flow
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
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct download integration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Verification Link</Label>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                      <code className="text-sm text-gray-800 dark:text-gray-200">
                        https://verification.example.com/download/123456
                      </code>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Iframe Link</Label>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                      <code className="text-sm text-gray-800 dark:text-gray-200">
                        https://verification.example.com/iframe/download/123456
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else if (verificationMethod === "smart-upload") {
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
                  <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Try Demo
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
                  <h3 className="font-semibold text-lg">Integration Link</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct upload integration</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Upload Portal Link</Label>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      https://verification.example.com/upload/123456
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      );
    } else if (verificationMethod === "screenshot") {
      return (
        <>
          {/* Widget Integration for Screenshot */}
          <Card className="relative overflow-hidden border-2 hover:border-blue-500 transition-all">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs rounded-bl-lg">Recommended</div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Screenshot Widget</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Capture and verify screenshots</p>
                </div>
              </div>
              <div className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Built-in screenshot capture tool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Automatic screenshot validation</span>
                  </li>
                </ul>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={() => window.open("#", "_blank")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Preview Widget
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Direct Link Integration for Screenshot */}
          <Card className="border-2 hover:border-purple-500 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Integration Link</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Direct screenshot capture</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Screenshot Portal Link</Label>
                    <Button variant="ghost" size="sm" className="h-8">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-2">
                    <code className="text-sm text-gray-800 dark:text-gray-200">
                      https://verification.example.com/screenshot/123456
                    </code>
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
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Quick Integration</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Get started with our pre-built solutions</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50"
              onClick={() => window.open("#", "_blank")}
            >
              <FileText className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
              View Documentation
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open("#", "_blank")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Quick Start Guide
            </Button>
          </div>
        </div>

        {/* Integration Methods */}
        <div className="grid md:grid-cols-2 gap-6">{renderIntegrationContent()}</div>

        {/* Integration Resources */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Additional Resources</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("#", "_blank")}>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">API Reference</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Complete API documentation</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("#", "_blank")}>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Code Examples</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">Sample implementations</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" onClick={() => window.open("#", "_blank")}>
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                  <div className="text-left">
                    <div className="font-medium">Webhooks Guide</div>
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
        </Card>
      </div>
    </div>
  );
};
