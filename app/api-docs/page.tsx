"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerPage = () => {
  const [url, setUrl] = useState<string>("/api/api-docs.json");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">API Documentation</h1>
        <p className="text-gray-600 mb-4">
          Explore and test the Client Portal API endpoints using the interactive documentation below.
        </p>
        <div className="flex space-x-2 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              url === "/api/api-docs.json" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setUrl("/api/api-docs.json")}
          >
            Static API Doc
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              url === "/api/api-docs" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
            }`}
            onClick={() => setUrl("/api/api-docs")}
          >
            Dynamic API Doc
          </button>
        </div>
      </div>
      
      <div className="swagger-container border rounded-lg overflow-hidden">
        <SwaggerUI
          url={url}
          docExpansion="list"
          defaultModelsExpandDepth={-1}
          deepLinking={true}
          displayRequestDuration={true}
          requestInterceptor={(req) => {
            // You can add authentication headers here if needed
            // Example: req.headers.Authorization = `Bearer ${token}`;
            return req;
          }}
          supportedSubmitMethods={["get", "post", "put", "delete", "patch"]}
        />
      </div>

      {/* Custom styling for Swagger UI */}
      <style jsx global>{`
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .information-container {
          padding: 20px;
          background-color: #f8f9fa;
        }
        .swagger-ui .scheme-container {
          background-color: #f8f9fa;
          box-shadow: none;
        }
        .swagger-ui .opblock {
          margin-bottom: 15px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .swagger-ui .opblock .opblock-summary {
          padding: 12px;
        }
        .swagger-ui .opblock-tag {
          padding: 10px 15px;
          margin: 15px 0 5px;
          border-radius: 6px;
          background-color: #f8f9fa;
        }
        .swagger-ui .btn {
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};

export default SwaggerPage; 