"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-dist/swagger-ui.css";
import SwaggerUIReact from "swagger-ui-react";
import { FileJson } from "lucide-react";
import { env as environment } from "@/app/config/environment";
import axios from "axios";
import { cookies } from "@/app/services/cookie.service";

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
  token?: string;
}

// Add this new function to get cookie value
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

// Add this function to modify the swagger spec with the API key
const injectApiKey = (spec: any, apiKeyValue: string, email: string, token: string): any => {
  // Make a deep copy to avoid mutating the original spec
  const newSpec = JSON.parse(JSON.stringify(spec));
  
  try {
    // Process all paths in the spec, not just verification-related ones
    Object.entries(newSpec.paths || {}).forEach(([path, pathObj]: [string, any]) => {
      // Process all POST endpoints
      if (pathObj.post) {
        // For the request body examples
        if (pathObj.post.requestBody?.content?.["application/json"]) {
          const requestContent = pathObj.post.requestBody.content["application/json"];
          
          // If there are examples, update the apikey field in all of them
          if (requestContent.examples) {
            Object.keys(requestContent.examples).forEach(exampleKey => {
              if (requestContent.examples[exampleKey].value) {
                // Only update the apikey field if it exists
                if (requestContent.examples[exampleKey].value.apikey !== undefined) {
                  requestContent.examples[exampleKey].value.apikey = apiKeyValue;
                }
                
                // Update email if user_info exists
                if (requestContent.examples[exampleKey].value.user_info) {
                  requestContent.examples[exampleKey].value.user_info.email = email;
                }
              }
            });
          }
          
          // Also update the schema example if it exists
          if (requestContent.schema?.properties?.apikey) {
            requestContent.schema.properties.apikey.example = apiKeyValue;
          }
        }
      }
    });
    
    // Update all schema components that have apikey or email fields
    if (newSpec.components?.schemas) {
      Object.entries(newSpec.components.schemas).forEach(([schemaName, schema]: [string, any]) => {
        // Update apikey in any schema that has it
        if (schema.properties?.apikey) {
          schema.properties.apikey.example = apiKeyValue;
        }
        
        // Update email in any schema that has it
        if (schema.properties?.email) {
          schema.properties.email.example = email;
        }
        
        // Check for nested user_info with email
        if (schema.properties?.user_info?.properties?.email) {
          schema.properties.user_info.properties.email.example = email;
        }
      });
    }
  } catch (error) {
    console.error("Error injecting API key and email:", error);
  }
  
  return newSpec;
};

// To update a user's email using the API key
const updateUserEmail = async (newEmail: string) => {
  try {
    // Get the API key from cookies
    const apiKey = cookies.get("apikey");
    
    // Create the update payload
    const updateData = {
      apiKey: apiKey,
      emailId: cookies.get("email"), // Current email as identifier
      email: newEmail // New email to update to
    };
    
    // Make the update request
    const response = await axios.post(environment.updateWorker, updateData);
    
    if (response.data && response.data.success) {
      // Update the email in cookies
      cookies.set("email", newEmail);
      console.log("Email updated successfully to:", newEmail);
      return true;
    } else {
      console.error("Failed to update email:", response.data);
      return false;
    }
  } catch (error) {
    console.error("Error updating user email:", error);
    return false;
  }
};

export default function SwaggerUI({ endpoint = "verification", token = "" }: SwaggerUIProps) {
  const [unifiedSpec, setUnifiedSpec] = useState<any>(null);
  const [failedSpecs, setFailedSpecs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string>("");
  
  useEffect(() => {
    // Alert to confirm token is received
    if (token) {
      alert(`Token received in SwaggerUIsss: ${token}`);
    } else {
      alert("No token received in SwaggerUI componentss");
    }
    
    // Get API key from cookies
    const apiKeyFromCookie = getCookie("apikey");
    console.log("API key from cookie:", apiKeyFromCookie);
    
    if (apiKeyFromCookie) {
      setApiKey(apiKeyFromCookie);
    } else {
      console.error("No API key found in cookies");
    }
    
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
            } catch (e) {
              console.error(`Failed to parse JSON for ${spec.name}:`, e);
              failed.push(spec.name);
              continue;
            }
            
            // Convert Swagger 2.0 to OpenAPI 3.0 if needed
            if (data.swagger === "2.0") {
              data = convertSwagger2ToOpenAPI3(data);
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
        
        // Get updated cookie value (in case it was set during processing)
        const currentApiKey = apiKeyFromCookie || getCookie("apikey") || "";
        const email = getCookie("email") || "";
        const currentToken = token || "";
        alert("Using token from props:", email);
     
        // Only inject API key if it exists
        let finalSpec = combinedSpec;
        if (currentApiKey) {
          finalSpec = injectApiKey(combinedSpec, currentApiKey, email, currentToken);
          setApiKey(currentApiKey);
        } else {
          console.warn("No API key available to inject into Swagger UI");
        }
        
        setFailedSpecs(failed);
        setUnifiedSpec(finalSpec);
      } catch (error) {
        console.error("Error combining API specs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAndCombineSpecs();
  }, [token]);

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

  // Add this new function after fetchAndCombineSpecs or elsewhere in the file
  const convertSwagger2ToOpenAPI3 = (swagger2Spec: any): any => {
    console.log("Converting Swagger 2.0 to OpenAPI 3.0:", swagger2Spec.info?.title);
    
    const openapi3Spec: any = {
      openapi: "3.0.1", // Using 3.0.1 for better compatibility
      info: swagger2Spec.info,
      servers: [
        {
          url: "https://api.dirolabs.com",
          description: "Generated server url"
        }
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {}
      }
    };
    
    // Convert securityDefinitions to components/securitySchemes
    if (swagger2Spec.securityDefinitions) {
      for (const [key, value] of Object.entries(swagger2Spec.securityDefinitions)) {
        const securityScheme = value as Record<string, any>;
        
        // Convert apiKey type
        if (securityScheme.type === "apiKey") {
          openapi3Spec.components.securitySchemes[key] = {
            type: "apiKey",
            name: securityScheme.name,
            in: securityScheme.in
          };
        }
        // Convert basic auth
        else if (securityScheme.type === "basic") {
          openapi3Spec.components.securitySchemes[key] = {
            type: "http",
            scheme: "basic"
          };
        }
        // Convert OAuth2
        else if (securityScheme.type === "oauth2") {
          openapi3Spec.components.securitySchemes[key] = {
            type: "oauth2",
            flows: {} // Would need more conversion logic for different flow types
          };
        }
      }
    }
    
    // Helper function to fix references - more thorough version
    const fixReference = (obj: any, path = ""): any => {
      if (!obj) return obj;
      
      // Handle arrays
      if (Array.isArray(obj)) {
        return obj.map((item, index) => fixReference(item, `${path}[${index}]`));
      }
      
      // Handle objects
      if (typeof obj === 'object') {
        // Create a new object to avoid reference issues
        const newObj: any = {};
        
        // Fix direct $ref
        if (obj.$ref && typeof obj.$ref === 'string') {
          if (obj.$ref.startsWith('#/definitions/')) {
            newObj.$ref = obj.$ref.replace('#/definitions/', '#/components/schemas/');
            console.log(`Fixed reference from ${obj.$ref} to ${newObj.$ref} at ${path}`);
          } else {
            newObj.$ref = obj.$ref;
          }
          return newObj;
        }
        
        // Process each property in the object
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = fixReference(obj[key], `${path}.${key}`);
          }
        }
        
        return newObj;
      }
      
      // Return primitive values as is
      return obj;
    };
    
    // Convert definitions to components/schemas
    if (swagger2Spec.definitions) {
      // First, deep copy and fix references in all schemas
      const fixedSchemas: any = {};
      
      for (const [key, schema] of Object.entries(swagger2Spec.definitions)) {
        console.log(`Processing schema: ${key}`);
        fixedSchemas[key] = fixReference(schema, `schemas.${key}`);
      }
      
      // Then assign to components.schemas
      openapi3Spec.components.schemas = fixedSchemas;
    }
    
    // Convert paths
    if (swagger2Spec.paths) {
      for (const [pathKey, pathValue] of Object.entries(swagger2Spec.paths)) {
        openapi3Spec.paths[pathKey] = {};
        console.log(`Processing path: ${pathKey}`);
        
        // Copy each HTTP method
        for (const [methodKey, methodValue] of Object.entries(pathValue as any)) {
          console.log(`Processing method: ${methodKey} for path ${pathKey}`);
          
          // Deep copy method to avoid reference issues
          const method = JSON.parse(JSON.stringify(methodValue));
          
          // Convert parameters to requestBody for POST/PUT/PATCH
          if (["post", "put", "patch"].includes(methodKey.toLowerCase()) && method.parameters) {
            const bodyParam = method.parameters.find((p: any) => p.in === "body");
            if (bodyParam) {
              console.log(`Creating requestBody for ${pathKey}.${methodKey}`);
              method.requestBody = {
                description: bodyParam.description,
                required: bodyParam.required,
                content: {
                  "application/json": {
                    schema: bodyParam.schema ? fixReference(bodyParam.schema, `${pathKey}.${methodKey}.requestBody`) : {}
                  }
                }
              };
              
              // If there are other content types specified in consumes
              if (method.consumes && Array.isArray(method.consumes)) {
                method.consumes.forEach((contentType: string) => {
                  if (contentType !== "application/json") {
                    method.requestBody.content[contentType] = {
                      schema: bodyParam.schema ? fixReference(bodyParam.schema, `${pathKey}.${methodKey}.requestBody.${contentType}`) : {}
                    };
                  }
                });
              }
              
              // Remove body parameter
              method.parameters = method.parameters.filter((p: any) => p.in !== "body");
            }
          }
          
          // Fix references in all parameters
          if (method.parameters && Array.isArray(method.parameters)) {
            method.parameters = method.parameters.map((param: any, index: number) => 
              fixReference(param, `${pathKey}.${methodKey}.parameters[${index}]`)
            );
          }
          
          // Convert references in responses
          if (method.responses) {
            const newResponses: any = {};
            
            for (const [statusCode, response] of Object.entries(method.responses)) {
              console.log(`Processing response ${statusCode} for ${pathKey}.${methodKey}`);
              const resp = JSON.parse(JSON.stringify(response));
              
              // Convert schema to content
              if (resp.schema) {
                resp.content = {
                  "application/json": {
                    schema: fixReference(resp.schema, `${pathKey}.${methodKey}.responses.${statusCode}.content.application/json.schema`)
                  }
                };
                
                // If there are other content types specified in produces
                if (method.produces && Array.isArray(method.produces)) {
                  method.produces.forEach((contentType: string) => {
                    if (contentType !== "application/json") {
                      resp.content[contentType] = {
                        schema: fixReference(resp.schema, `${pathKey}.${methodKey}.responses.${statusCode}.content.${contentType}.schema`)
                      };
                    }
                  });
                }
                
                delete resp.schema;
              }
              
              newResponses[statusCode] = resp;
            }
            
            method.responses = newResponses;
          }
          
          // Remove consumes and produces arrays (not used in OpenAPI 3)
          delete method.consumes;
          delete method.produces;
          
          openapi3Spec.paths[pathKey][methodKey] = method;
        }
      }
    }
    
    console.log("Conversion complete. OpenAPI 3.0 spec created.");
    return openapi3Spec;
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
      
      {apiKey ? (
        <div className="mb-4">
          <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-200 rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Using API Key: {apiKey}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-200 rounded">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">No API key found in cookies. API functionality may be limited.</span>
            </div>
          </div>
        </div>
      )}
      
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
          tryItOutEnabled={true}
          defaultModelRendering="model"
          tagsSorter="alpha"
          persistAuthorization={true}
          requestInterceptor={(req) => {
         
            // Add the token from props to the Authorization header
            if (token) {
              req.headers["Authorization"] = ` ${token}`;
              console.log("Added token to request headers:", token.substring(0, 4) + "..." + token.substring(token.length - 4));
            } else {
              console.log("No token available to add to request headers");
            }
            return req;
          }}
        />
      </div>
    </div>
  );
} 