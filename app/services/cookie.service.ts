import Cookies from "js-cookie";

export class CookieService {
  // Helper method to parse JSON values
  private parseJsonIfNeeded<T>(value: string): T {
    if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        console.error(`Error parsing value:`, e);
      }
    }
    return value as unknown as T;
  }

  // Helper method to get cookie from document.cookie
  private getFromDocumentCookie<T>(key: string): T | null {
    if (typeof document === "undefined" || !document.cookie) {
      return null;
    }

    const cookieArr = document.cookie.split(";");
    const decodedKey = encodeURIComponent(key);

    for (const cookie of cookieArr) {
      const cookiePair = cookie.trim();
      if (cookiePair.startsWith(decodedKey + "=")) {
        const directValue = decodeURIComponent(cookiePair.substring(decodedKey.length + 1));
        return directValue ? this.parseJsonIfNeeded<T>(directValue) : (directValue as unknown as T);
      }
    }

    return null;
  }

  get<T = string>(key: string): T | null {
    try {
      // First try with js-cookie
      const value = Cookies.get(key);

      // If value is found, process it
      if (value !== undefined) {
        return this.parseJsonIfNeeded<T>(value);
      }

      // If no value found with js-cookie, try direct document.cookie access as fallback
      return this.getFromDocumentCookie<T>(key);
    } catch (error) {
      console.error(`Error getting cookie "${key}":`, error);
      return null;
    }
  }

  // Helper method to build cookie string with options
  private buildCookieString(key: string, value: string, options: Cookies.CookieAttributes): string {
    let cookieStr = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; path=${options.path || "/"}`;

    // Add expiration if provided
    if (options.expires) {
      const expiresDate =
        typeof options.expires === "number" ? new Date(Date.now() + options.expires * 24 * 60 * 60 * 1000) : options.expires;
      cookieStr += `; expires=${expiresDate.toUTCString()}`;
    }

    // Add other options
    if (options.sameSite) {
      cookieStr += `; SameSite=${options.sameSite}`;
    }

    if (options.secure) {
      cookieStr += "; Secure";
    }

    if (options.domain) {
      cookieStr += `; domain=${options.domain}`;
    }

    return cookieStr;
  }

  // Helper method to set cookie using document.cookie directly
  private setWithDocumentCookie(key: string, value: string, options: Cookies.CookieAttributes): boolean {
    if (typeof document === "undefined") {
      return false;
    }

    try {
      document.cookie = this.buildCookieString(key, value, options);
      return this.get(key) !== null;
    } catch (e) {
      console.error(`Error setting cookie "${key}" directly:`, e);
      return false;
    }
  }

  set(key: string, value: string | object, options: Cookies.CookieAttributes = {}): boolean {
    try {
      const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);

      // Default options with better compatibility
      const defaultOptions: Cookies.CookieAttributes = {
        path: "/",
        sameSite: "lax",
        expires: 7, // 7 days default
        // Don't set secure flag unless we're using HTTPS
        secure: typeof window !== "undefined" ? window.location.protocol === "https:" : false,
      };

      // Merge with user options
      const mergedOptions = { ...defaultOptions, ...options };

      // Try primary method
      Cookies.set(key, stringValue, mergedOptions);

      // Immediate verification
      if (this.get(key) === null) {
        // Primary method failed, try fallback
        return this.setWithDocumentCookie(key, stringValue, mergedOptions);
      }

      return true;
    } catch (error) {
      console.error(`Error setting cookie "${key}":`, error);
      return false;
    }
  }

  remove(key: string, options: Cookies.CookieAttributes = {}): void {
    try {
      // Ensure path is consistent with what was used to set the cookie
      const opts = { path: "/", ...options };

      // Primary method
      Cookies.remove(key, opts);

      // Fallback method
      if (typeof document !== "undefined") {
        // We need to use the same domain/path that was used when setting
        const domainStr = opts.domain ? `; domain=${opts.domain}` : "";
        const pathStr = `; path=${opts.path || "/"}`;
        document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC${pathStr}${domainStr}`;
      }

      // Verify removal
      if (this.get(key) !== null) {
        console.warn(`Failed to remove cookie "${key}"`);
      }
    } catch (error) {
      console.error(`Error removing cookie "${key}":`, error);
    }
  }

  // Get all cookies as an object
  getAll(): { [key: string]: string } {
    try {
      const cookies = Cookies.get();

      // If js-cookie fails to get cookies, try manual approach
      if (Object.keys(cookies).length === 0 && typeof document !== "undefined" && document.cookie) {
        const result: { [key: string]: string } = {};
        document.cookie.split(";").forEach((cookie) => {
          const parts = cookie.trim().split("=");
          if (parts.length >= 2) {
            const key = decodeURIComponent(parts[0]);
            const value = decodeURIComponent(parts.slice(1).join("="));
            result[key] = value;
          }
        });
        return result;
      }

      return cookies;
    } catch (error) {
      console.error("Error getting all cookies:", error);
      return {};
    }
  }

  // Clear all cookies
  clearAll(): void {
    try {
      const cookies = this.getAll();
      Object.keys(cookies).forEach((key) => {
        this.remove(key);
      });
    } catch (error) {
      console.error("Error clearing all cookies:", error);
    }
  }

  // Test if cookies are supported in this browser/environment
  isSupported(): boolean {
    try {
      const testKey = "__cookie_test__";
      const testValue = "test";

      // Try to set a test cookie
      this.set(testKey, testValue);

      // Check if we can read it back
      const result = this.get(testKey) === testValue;

      // Clean up
      this.remove(testKey);

      return result;
    } catch (e) {
      return false;
    }
  }
}

export const cookies = new CookieService();
