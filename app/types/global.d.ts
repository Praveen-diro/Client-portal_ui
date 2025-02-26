interface Window {
  grecaptcha: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
  };
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
    isTwoFactor: boolean;
    roles: string;
  };
}
