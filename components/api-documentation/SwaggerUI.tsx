"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-dist/swagger-ui.css";
import SwaggerUIReact from "swagger-ui-react";
import { FileJson } from "lucide-react";
import { env as environment } from "@/app/config/environment";

// Simple spinner component
const Spinner = ({ size = "lg" }: { size?: "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-3",
    xl: "h-16 w-16 border-4",
  };

  return (
    <div
      className={`animate-spin rounded-full border-solid border-t-transparent border-blue-600 ${sizeClasses[size]}`}
    />
  );
};

// Error suppression for Swagger UI components
const SwaggerUIWrapper = (props: any) => {
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' && (
          args[0].includes('componentWillReceiveProps') ||
          args[0].includes('ContentType') ||
          args[0].includes('ParameterRow') ||
          args[0].includes('OperationContainer')
        )
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  
  return <SwaggerUIReact {...props} />;
};

// Swagger UI styling
const SwaggerStyle = () => (
  <style jsx global>{`
    .swagger-ui .wrapper { padding: 0; }
    .swagger-ui .info, 
    .swagger-ui .scheme-container,
    .swagger-ui .servers,
    .swagger-ui .filter-container,
    .swagger-ui .information-container,
    .swagger-ui .topbar,
    .swagger-ui .info .title { display: none; }
    
    .swagger-ui .opblock {
      margin: 0 0 15px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #eaecf0;
    }
    .swagger-ui .opblock .opblock-summary {
      padding: 8px 20px;
    }
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 4px;
      font-weight: 600;
      min-width: 80px;
      text-align: center;
    }
    .swagger-ui .opblock-tag {
      padding: 10px 20px;
      margin: 10px 0 5px;
      border-radius: 6px;
      background: #f7f8fc;
      border-bottom: 1px solid #eaecf0;
    }
    .swagger-ui table tbody tr td {
      padding: 10px 12px;
    }
    .swagger-ui select {
      background: #fff;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 6px 10px;
    }
    .swagger-ui .btn {
      box-shadow: none;
      border-radius: 4px;
      padding: 6px 12px;
    }
    .swagger-ui .execute-wrapper .btn {
      background-color: #4f46e5;
      color: white;
      border-color: #4338ca;
    }
    .swagger-ui .execute-wrapper .btn:hover {
      background-color: #4338ca;
    }
    .swagger-ui .opblock-body pre.microlight {
      font-size: 13px;
      border-radius: 4px;
      font-family: 'Fira Code', monospace;
      background: #f7fafc;
      padding: 12px;
    }
    .swagger-ui .opblock .opblock-section-header {
      background: #fafbfc;
      box-shadow: none;
      border-bottom: 1px solid #eaecf0;
      padding: 12px 20px;
    }
    .swagger-ui table {
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #eaecf0;
      border-radius: 6px;
      overflow: hidden;
    }
    .swagger-ui table thead tr th {
      border-bottom: 1px solid #eaecf0;
      background: #f8fafc;
      color: #4b5563;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 10px 12px;
    }
    
    /* Dark mode */
    .dark .swagger-ui .opblock { 
      border-color: #333;
      background-color: #1f2937;
    }
    .dark .swagger-ui .opblock-tag,
    .dark .swagger-ui .opblock-section-header {
      background: #111827;
      border-color: #374151;
    }
    .dark .swagger-ui .btn {
      background-color: #1f2937;
      color: #e5e7eb;
      border-color: #374151;
    }
    .dark .swagger-ui table,
    .dark .swagger-ui table thead tr th {
      border-color: #374151;
      background: #111827;
      color: #d1d5db;
    }
    .dark .swagger-ui .opblock-body pre.microlight {
      background: #111827;
      color: #e5e7eb;
    }
    .dark .swagger-ui .model-box {
      background: #1f2937;
      border-color: #374151;
    }
  `}</style>
);

// Dynamic import with client-side only rendering
const DynamicSwaggerUI = dynamic(() => Promise.resolve(SwaggerUIWrapper), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <Spinner size="lg" />
    </div>
  ),
});

// API configuration - To add new APIs, just add entries to this array
const API_SPECS = [
  { 
    id: 'capture-process', 
    name: 'Capture Process', 
    url: '/api-docs/Capture process.json',
    icon: <FileJson className="h-4 w-4" />
  },
  { 
    id: 'smart-upload', 
    name: 'Smart Upload', 
    url: '/api-docs/Smart upload.json',
    icon: <FileJson className="h-4 w-4" />
  },
  { 
    id: 'after-download', 
    name: 'After Download', 
    url: '/api-docs/After download.json',
    icon: <FileJson className="h-4 w-4" />
  },
  { 
    id: 'delete-documents', 
    name: 'Delete Documents', 
    url: '/api-docs/Delete documents.json',
    icon: <FileJson className="h-4 w-4" />
  },

  // To add a new API, simply add a new entry here following the structure above
];

// Environment configuration for API paths
const API_PATH_CONFIG = {
  // Add path prefixes here to easily manage them in one place
  defaultPrefix: environment.varificationSwaggerLink || '/v3',
  betaPrefix: environment.varificationSwaggerLinkBeta || '/v2',
};

interface SwaggerUIProps {
  endpoint?: string;
}

export default function SwaggerUI({ endpoint = "verification" }: SwaggerUIProps) {
  const [unifiedSpec, setUnifiedSpec] = useState<any>(null);
  const [failedSpecs, setFailedSpecs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAndCombineSpecs = async () => {
      try {
        // Initialize combined spec with OpenAPI boilerplate
        const combinedSpec: any = {
          openapi: "3.0.0",
          info: {
            title: "API Documentation",
            version: "1.0.0"
          },
          paths: {},
          components: {
            schemas: {},
            securitySchemes: {
              bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
              }
            }
          }
        };
        
        const failed: string[] = [];
        
        // Fetch and process each API spec
        for (const spec of API_SPECS) {
          try {
            const response = await fetch(spec.url);
            
            // Check if the response is ok before parsing
            if (!response.ok) {
              console.error(`Failed to fetch ${spec.name}: ${response.status} ${response.statusText}`);
              failed.push(spec.name);
              continue;
            }
            
            // Check for empty response
            const text = await response.text();
            if (!text || text.trim() === '') {
              console.error(`Empty response received for ${spec.name}`);
              failed.push(spec.name);
              continue;
            }
            
            // Parse the JSON text safely
            let data;
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              console.error(`Invalid JSON in ${spec.name}:`, parseError);
              failed.push(spec.name);
              continue;
            }
            
            // Skip empty specs
            if (!data || Object.keys(data).length === 0) {
              failed.push(spec.name);
              continue;
            }
            
            // Process and merge paths
            if (data.paths) {
              Object.entries(data.paths).forEach(([path, methods]) => {
                // Normalize the path with the appropriate prefix
                const finalPath = normalizePath(path);
                combinedSpec.paths[finalPath] = methods;
              });
            }
            
            // Merge schemas and other components
            if (data.components?.schemas) {
              combinedSpec.components.schemas = {
                ...combinedSpec.components.schemas,
                ...data.components.schemas
              };
            }
          } catch (error) {
            console.error(`Error processing spec for ${spec.name}:`, error);
            failed.push(spec.name);
          }
        }
        
        setFailedSpecs(failed);
        setUnifiedSpec(combinedSpec);
      } catch (error) {
        console.error("Error combining API specs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndCombineSpecs();
  }, []);

  // Helper function to normalize path with appropriate prefix
  const normalizePath = (path: string): string => {
    const { defaultPrefix, betaPrefix } = API_PATH_CONFIG;
    
    // Replace environment variable placeholders in the path
    let normalizedPath = path;
    
    // Replace ${environment.varificationSwaggerLink} with the actual value
    normalizedPath = normalizedPath.replace(/\$\{environment\.varificationSwaggerLink\}/g, defaultPrefix);
    
    // Replace ${environment.varificationSwaggerLinkBeta} with the actual value
    normalizedPath = normalizedPath.replace(/\$\{environment\.varificationSwaggerLinkBeta\}/g, betaPrefix);
    
    // For paths without prefix
    if (!normalizedPath.startsWith('/')) {
      return `${defaultPrefix}/${normalizedPath}`;
    }
    
    // For absolute paths without required prefix
    if (!normalizedPath.startsWith(defaultPrefix) && !normalizedPath.startsWith(betaPrefix)) {
      return `${defaultPrefix}${normalizedPath}`;
    }
    
    // Path already has appropriate prefix after replacements
    return normalizedPath;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full swagger-ui-container pb-10">
      <SwaggerStyle />
      
      {failedSpecs.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Some API specifications could not be loaded:</span>
          </div>
          <ul className="mt-2 ml-6 list-disc">
            {failedSpecs.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm">The documentation will display available APIs only.</p>
        </div>
      )}
      
      <div className="mt-0">
        <DynamicSwaggerUI
          spec={unifiedSpec}
          docExpansion="list"
          deepLinking={true}
          defaultModelsExpandDepth={-1}
          displayRequestDuration={true}
          showExtensions={true}
          showCommonExtensions={true}
          tryItOutEnabled={false}
          defaultModelRendering="model"
          tagsSorter="alpha"
        />
      </div>
    </div>
  );
} 