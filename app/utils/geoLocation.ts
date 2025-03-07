import { setCookie } from "cookies-next";

// Define interfaces for the GeoIP response
interface GeoIPCountry {
  iso_code: string;
  names?: {
    [key: string]: string;
  };
}

interface GeoIPResponse {
  country: GeoIPCountry;
  continent?: {
    code: string;
    names: {
      [key: string]: string;
    };
  };
  city?: {
    names: {
      [key: string]: string;
    };
  };
}

interface ErrorDetails {
  message: string;
  code: string;
  timestamp: string;
  userAgent: string;
}

// Cookie options for security
const cookieOptions = {
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === "production", // Only use secure in production
  sameSite: "lax" as const, // Changed from strict to lax for better compatibility
  path: "/",
  domain: typeof window !== "undefined" ? window.location.hostname : undefined, // Explicitly set domain
};

// Immediately Invoked Function Expression
const fillInPage = (function () {
  // Remove any existing country code cookie when initializing
  if (typeof document !== "undefined") {
    // Only run in browser environment
    document.cookie = "iso_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  const updateCountryInfo = function (geoipResponse: GeoIPResponse): void {
    console.log("GeoIP Response:", geoipResponse);

    const iso_code = geoipResponse.country.iso_code || "unknown";
    console.log("ISO Code:", iso_code);

    // Set the country code in a cookie
    try {
      // Ensure we're in browser environment
      if (typeof window !== "undefined") {
        setCookie("iso_code", iso_code, cookieOptions);

        // Verify the cookie was set
        setTimeout(() => {
          const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("iso_code="))
            ?.split("=")[1];

          console.log("Cookie verification:", cookieValue ? "ISO code cookie set successfully" : "Failed to set ISO code cookie");
        }, 100);
      }
    } catch (error) {
      console.error("Error setting iso_code cookie:", error);
    }
  };

  const onSuccess = function (geoipResponse: GeoIPResponse): void {
    updateCountryInfo(geoipResponse);
  };

  const onError = function (error: any): void {
    console.error("GeoIP Error:", error);

    // Add more detailed error information
    const errorDetails: ErrorDetails = {
      message: error.message || "Unknown error",
      code: error.code || "UNKNOWN",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: "1.0",
        host: "client-portal",
        short_message: "Maxmind, geoip error",
        full_message: JSON.stringify(errorDetails),
        timestamp: new Date().toISOString(),
        facility: "geoLocation.ts",
        app_name: "client-portal",
        stage: "stage2",
      }),
    };

    // Add timeout to fetch request
    const timeoutDuration = 5000; // 5 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    fetch("https://utils.diro.live/sentryLogs", {
      ...requestOptions,
      signal: controller.signal,
    })
      .then((response) => {
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => console.log("Sentry log response:", data))
      .catch((fetchError) => {
        console.error("Error sending logs:", fetchError);
        // Store failed log locally if possible
        try {
          // Use cookies instead of localStorage
          const failedLogsStr = document.cookie
            .split("; ")
            .find((row) => row.startsWith("failedLogs="))
            ?.split("=")[1];

          const failedLogs = failedLogsStr ? JSON.parse(decodeURIComponent(failedLogsStr)) : [];

          failedLogs.push({
            timestamp: new Date().toISOString(),
            error: errorDetails,
          });

          // Keep only the last 10 errors
          const updatedLogs = failedLogs.slice(-10);

          // Set the updated logs in a cookie
          setCookie("failedLogs", JSON.stringify(updatedLogs), cookieOptions);
        } catch (e) {
          console.error("Failed to store error locally:", e);
        }
      });
  };

  return function (): void {
    if (typeof window !== "undefined" && typeof (window as any).geoip2 !== "undefined") {
      (window as any).geoip2.city(onSuccess, onError);
    } else if (typeof window !== "undefined") {
      console.error("GeoIP2 is not supported or blocked by your browser.");
    }
  };
})();

export default fillInPage;
