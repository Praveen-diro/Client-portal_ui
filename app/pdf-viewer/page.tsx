"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, AlertTriangle, Info, Bug } from "lucide-react";
import { RootState } from "@/app/store/store";
import dynamic from "next/dynamic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import LoaderComponent from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamically import the PDF viewer component to avoid SSR issues
const PDFViewer = dynamic(() => import("@/components/ui/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[750px]">
      <LoaderComponent />
      <p className="text-muted-foreground ml-2">Loading PDF viewer...</p>
    </div>
  ),
});

export default function ViewPdfPage() {
  const { viewpdfdata, view_loading } = useSelector((state: RootState) => state.viewDoc);
  const [fileName, setFileName] = useState<string>("document");
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState<boolean>(true); // Set to true by default for troubleshooting
  const [debugTab, setDebugTab] = useState<string>("info");
  const [isValidatingBase64, setIsValidatingBase64] = useState<boolean>(false);

  // For debugging purposes
  useEffect(() => {
    if (viewpdfdata) {
      console.log("ViewDoc Redux State:", viewpdfdata);

      // Prepare debug info
      const debug = {
        type: typeof viewpdfdata,
        keys: Object.keys(viewpdfdata),
        hasBase64: !!(viewpdfdata.base64 || (viewpdfdata.data && viewpdfdata.data.base64)),
        dataType: viewpdfdata.data ? typeof viewpdfdata.data : "undefined",
        dataKeys: viewpdfdata.data ? Object.keys(viewpdfdata.data) : [],
        viewpdfdata: viewpdfdata, // Store the actual data for debugging
      };

      setDebugInfo(debug);
    } else {
      console.log("No viewpdfdata in Redux state");
    }
  }, [viewpdfdata]);

  // Function to validate if a string is likely base64
  function validateBase64(str: string): boolean {
    if (!str) return false;

    // Remove common prefixes if present
    let testStr = str;
    if (testStr.startsWith("data:application/pdf;base64,")) {
      testStr = testStr.substring("data:application/pdf;base64,".length);
    }

    // Base64 regex validation (allowing for some padding characters)
    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
    return base64Regex.test(testStr) && testStr.length % 4 === 0;
  }

  // Function to check if a string can be decoded as base64
  async function isDecodableBase64(str: string): Promise<boolean> {
    setIsValidatingBase64(true);
    try {
      // Try to decode a small sample to see if it's valid base64
      const testStr = str.startsWith("data:application/pdf;base64,") ? str.substring("data:application/pdf;base64,".length) : str;

      const sample = testStr.substring(0, Math.min(1000, testStr.length));
      atob(sample);

      // If we get here, it's valid base64
      setIsValidatingBase64(false);
      return true;
    } catch (err) {
      console.error("Base64 validation failed:", err);
      setIsValidatingBase64(false);
      return false;
    }
  }

  useEffect(() => {
    // Extract data from the viewpdfdata, which may have different structures
    try {
      if (viewpdfdata) {
        // Set filename if available
        if (viewpdfdata.filename) {
          setFileName(viewpdfdata.filename);
        } else if (viewpdfdata.name) {
          setFileName(viewpdfdata.name);
        }

        // Extract base64 data which may be in different locations depending on the API response
        if (viewpdfdata.base64) {
          console.log("Found base64 data directly in viewpdfdata");
          setBase64Data(viewpdfdata.base64);
        } else if (viewpdfdata.data && viewpdfdata.data.base64) {
          console.log("Found base64 data in viewpdfdata.data");
          setBase64Data(viewpdfdata.data.base64);
        } else if (viewpdfdata.data && typeof viewpdfdata.data === "string" && viewpdfdata.data.length > 100) {
          // Sometimes the base64 might be directly in the data field as a string
          console.log("Found potential base64 data as string in viewpdfdata.data");
          // Verify if it's actually base64
          isDecodableBase64(viewpdfdata.data).then((isValid) => {
            if (isValid) {
              setBase64Data(viewpdfdata.data);
            } else {
              console.log("Data in viewpdfdata.data is not valid base64");
              setError("Invalid base64 data format found in the document");
            }
          });
        } else {
          // Additional checks for other potential locations of base64 data
          console.log("Looking for base64 data in nested objects...");
          const foundKeyPath = findBase64InObject(viewpdfdata);
          if (foundKeyPath) {
            console.log(`Found base64 data in custom location: ${foundKeyPath}`);
            // Extract the value using the path
            const value = getValueByPath(viewpdfdata, foundKeyPath);
            if (value) {
              // Verify if it's actually base64
              isDecodableBase64(value).then((isValid) => {
                if (isValid) {
                  setBase64Data(value);
                } else {
                  console.log(`Data at ${foundKeyPath} is not valid base64`);
                  setError(`Found potential PDF data at ${foundKeyPath} but it's not valid base64`);
                }
              });
            } else {
              setError("Found potential PDF data but couldn't access it");
            }
          } else {
            setError("No PDF data found in the current state. The document may not have been properly loaded.");
            console.log("No base64 data found in viewpdfdata:", viewpdfdata);
          }
        }
      } else {
        setError("No document data available in Redux store.");
      }
    } catch (err) {
      console.error("Error processing PDF data:", err);
      setError(`An error occurred while processing the document data: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }, [viewpdfdata]);

  // Helper function to find base64 data in a nested object
  function findBase64InObject(obj: any, path = "", depth = 0): string | null {
    if (depth > 3) return null; // Limit recursion depth

    if (typeof obj !== "object" || obj === null) return null;

    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      // Check if the value might be base64 data
      if (typeof value === "string" && value.length > 100) {
        // More strict check for base64 pattern
        if (validateBase64(value)) {
          console.log(`Found potential base64 at ${currentPath} (passes regex check)`);
          return currentPath;
        }
      }

      // Recursively check nested objects
      if (typeof value === "object" && value !== null) {
        const foundPath = findBase64InObject(value, currentPath, depth + 1);
        if (foundPath) {
          return foundPath;
        }
      }
    }

    return null;
  }

  // Helper function to get a value from an object using a dot-notation path
  function getValueByPath(obj: any, path: string): any {
    return path.split(".").reduce((o, p) => (o && o[p] !== undefined ? o[p] : null), obj);
  }

  // Navigate back function
  const handleBack = () => {
    window.history.back();
  };

  // Toggle debug info visibility
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2" />
              {fileName || "Document Viewer"}
            </CardTitle>
          </div>

          <Button variant="ghost" size="icon" onClick={toggleDebug} title="Toggle debugging info">
            <Bug className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          {showDebug && (
            <Tabs value={debugTab} onValueChange={setDebugTab} className="mb-4">
              <TabsList>
                <TabsTrigger value="info">Debug Info</TabsTrigger>
                <TabsTrigger value="data">Raw Data</TabsTrigger>
                <TabsTrigger value="base64">Base64 Sample</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="mt-2">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Debug Information</AlertTitle>
                  <AlertDescription>
                    <div className="text-xs mt-2">
                      <p>
                        <strong>Data type:</strong> {debugInfo.type}
                      </p>
                      <p>
                        <strong>Keys:</strong> {debugInfo.keys?.join(", ")}
                      </p>
                      <p>
                        <strong>Has direct base64:</strong> {debugInfo.hasBase64 ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Data field type:</strong> {debugInfo.dataType}
                      </p>
                      <p>
                        <strong>Data keys:</strong> {debugInfo.dataKeys?.join(", ")}
                      </p>
                      <p>
                        <strong>Found base64 data:</strong> {base64Data ? "Yes" : "No"}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="data" className="mt-2">
                <Alert>
                  <AlertTitle>Raw State Data</AlertTitle>
                  <AlertDescription>
                    <pre className="text-xs overflow-auto max-h-[200px] mt-2">
                      {viewpdfdata
                        ? JSON.stringify(
                            viewpdfdata,
                            (key, value) => {
                              // Truncate long string values to avoid overwhelming the display
                              if (typeof value === "string" && value.length > 100) {
                                return value.substring(0, 100) + "... [truncated]";
                              }
                              return value;
                            },
                            2
                          )
                        : "No data"}
                    </pre>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="base64" className="mt-2">
                <Alert>
                  <AlertTitle>Base64 Sample</AlertTitle>
                  <AlertDescription>
                    <div className="text-xs mt-2">
                      <p>
                        <strong>Base64 data:</strong> {base64Data ? base64Data.substring(0, 100) + "..." : "None found"}
                      </p>
                      <p className="mt-2">
                        <strong>Is valid:</strong>{" "}
                        {base64Data
                          ? validateBase64(base64Data)
                            ? "Yes (based on pattern)"
                            : "No (fails pattern check)"
                          : "N/A"}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              </TabsContent>
            </Tabs>
          )}

          {view_loading || isValidatingBase64 ? (
            <div className="flex items-center justify-center h-[750px]">
              <LoaderComponent />
              <p className="text-muted-foreground ml-2">
                {isValidatingBase64 ? "Validating PDF data..." : "Loading document..."}
              </p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
                <p className="text-sm mt-2">
                  Make sure the PDF data is correctly loaded in the Redux store. You may need to navigate to a document first
                  before accessing this page.
                </p>
              </AlertDescription>
            </Alert>
          ) : base64Data ? (
            <PDFViewer base64Data={base64Data} fileName={fileName} height="750px" showDownload={true} />
          ) : (
            <div className="flex items-center justify-center h-[750px] bg-muted/20 rounded-md">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No PDF document available in the state.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please navigate to a document first or use the documents section.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
