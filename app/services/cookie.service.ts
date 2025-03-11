import Cookies from "js-cookie";

class CookieService {
  get(key: string): string | null {
    return Cookies.get(key) || null;
  }

  set(key: string, value: string, options: Cookies.CookieAttributes = {}): void {
    Cookies.set(key, value, {
      ...options,
    //   secure: true, // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF
    });
  }

  remove(key: string): void {
    Cookies.remove(key);
  }

  // Get all cookies as an object
  getAll(): { [key: string]: string } {
    return Cookies.get();
  }

  // Clear all cookies
  clearAll(): void {
    const cookies = Cookies.get();
    Object.keys(cookies).forEach((key) => {
      Cookies.remove(key);
    });
  }
}

export const cookies = new CookieService();
