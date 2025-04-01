"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { default as DOMPurify } from "dompurify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User2, Mail, Key, Info, Box, RefreshCw, PenBox, MapPin, CheckCircle2, Circle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  loginFail,
  loginAuthenticated,
  loginSandbox,
  registerSuccess,
  registerFail,
} from "./store/features/authSlice";
import { authService } from "./services/auth.service";
import { env } from "./config/environment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { RootState } from "./store/store";
import { CookieService, cookies } from "./services/cookie.service";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const containerVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  password: string;
  companyname: string;
  building: string;
  roleincompany: string;
}

interface RecaptchaResponse {
  score: number;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Add success message component
const SuccessMessage = ({ message, onRedirect }: { message: string; onRedirect: () => void }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onRedirect();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onRedirect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-[#182848]/90 dark:via-[#2a3f65]/80 dark:to-[#4b6cb7]/70 p-0 shadow-xl border border-gray-100/80 dark:border-[#4b6cb7]/30 backdrop-blur-sm"
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-500 dark:to-[#4b6cb7]"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 dark:bg-green-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 dark:bg-[#4b6cb7]/20 rounded-full blur-xl"></div>

        <div className="p-8 relative">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="rounded-full bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-500 dark:to-[#4b6cb7] p-5 shadow-lg shadow-green-500/20 dark:shadow-[#4b6cb7]/30"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="space-y-4 max-w-md">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-[#4b6cb7] bg-clip-text text-transparent"
              >
                Registration Successful!
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed"
              >
                <p className="mb-2">{message}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                  Please check your inbox and spam folder if you don't see our email.
                </p>
              </motion.div>
            </div>

            {/* Animated line separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-[#4b6cb7]/50 to-transparent"
            />

            {/* Footer with countdown and button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
            >
              <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-300">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <p className="text-sm">
                  Redirecting to login in{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{countdown}</span> seconds
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRedirect}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-[#4b6cb7] dark:to-[#182848] dark:hover:from-[#3b5a9e] dark:hover:to-[#182848] text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Go to Login Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Define and export setAuthRouter type for TypeScript
export interface AuthServiceType {
  setAuthRouter?: (router: any) => void;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0); // 0-4 scale
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    password: "",
    companyname: "",
    building: "",
    roleincompany: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    loading: authLoading,
    loginError: authLoginError,
    isTwoFactor,
    roles,
    registermsg,
    registersucc,
    multiFactorEnabled,
    countries,
  } = useSelector((state: RootState) => state.auth);

  const [showdefault, setShowdefault] = useState(true);
  const [defaultCountry, setDefaultCountry] = useState("");

  useEffect(() => {
    // Load countries and set default country
    const loadDefaultCountry = async () => {
      if (countries && countries.length > 0) {
        try {
          // Get ISO code from cookies instead of localStorage
          const code = cookies.get("iso_code");
          console.log("ISO Code from cookies:", code);

          if (code) {
            // Find default country based on ISO code
            const defaultCountryData = countries.find((item) => item.alpha2code === code);
            console.log("Default country data:", defaultCountryData);

            if (defaultCountryData) {
              const countryValue = defaultCountryData.country;
              setDefaultCountry(countryValue);
              // Set both the default country and form data
              setFormData((prev) => ({
                ...prev,
                country: countryValue,
              }));
            }
          }
        } catch (error) {
          console.error("Error setting default country:", error);
        }
      }
    };

    loadDefaultCountry();

    // Add a slight delay to ensure the cookie is loaded after geolocation completes
    const timer = setTimeout(() => {
      loadDefaultCountry();
    }, 1500);

    return () => clearTimeout(timer);
  }, [countries]);

  // Add another effect to specifically listen for cookie changes
  useEffect(() => {
    const checkCookieInterval = setInterval(() => {
      const isoCode = cookies.get("iso_code");
      if (isoCode && countries && countries.length > 0) {
        const countryData = countries.find((item) => item.alpha2code === isoCode);
        if (countryData && formData.country !== countryData.country) {
          setDefaultCountry(countryData.country);
          setFormData((prev) => ({
            ...prev,
            country: countryData.country,
          }));
        }
      }
    }, 1000);

    return () => clearInterval(checkCookieInterval);
  }, [countries, formData.country]);

  useEffect(() => {
    // Redirect already authenticated users to dashboard
    if (isAuthenticated) {
      console.log("User already authenticated, preparing to redirect to dashboard");
      // Add a small delay to ensure network requests complete before navigation
      const redirectTimer = setTimeout(() => {
        console.log("Redirecting to dashboard");
        router.push("/client/validation-buttons");
      }, 300);

      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Load reCAPTCHA script
    const loadScriptByURL = (id: string, url: string, callback: () => void) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = callback;
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${env.Skey}`, () =>
      console.log("Script loaded!")
    );

    // Fetch countries only once on mount
    authService.getCountries();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated in main page, redirecting to dashboard");
      console.log("Roles:", roles);

      if (roles === "Account") {
        console.log("Account role detected, redirecting to /client/account");
        router.push("/client/account");
      } else {
        console.log("Non-Account role, redirecting to /client/validation-buttons");
        router.push("/client/validation-buttons");
      }
    } else if (isTwoFactor) {
      console.log("User needs two-factor authentication");

      // Check if user needs to configure 2FA or use existing 2FA
      if (multiFactorEnabled) {
        console.log("User has 2FA configured, redirecting to two-factor authentication page");
        router.push("authentication/two-factor");
      } else {
        console.log("User needs to configure 2FA, redirecting to two-factor configuration page");
        router.push("authentication/two-factor-configure");
      }
    }
  }, [isAuthenticated, isTwoFactor, multiFactorEnabled, roles, router]);

  // Set the router in auth service if available
  useEffect(() => {
    // Import dynamically to avoid SSR issues
    import("./services/auth.service")
      .then((authService) => {
        if (authService.setAuthRouter) {
          authService.setAuthRouter(router);
          console.log("Router passed to auth service");
        }
      })
      .catch((err) => {
        console.error("Failed to load auth service:", err);
      });
  }, [router]);

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input).replace(/[<>]/g, "");
  };

  const handleValidation = (captchaScore: number) => {
    let errors: Record<string, string> = {};
    let formIsValid = true;

    if (!formData.firstname) {
      formIsValid = false;
      errors.firstname = "First name is required";
    }

    if (!formData.password) {
      formIsValid = false;
      errors.password = "Password is required";
    }

    if (!formData.email) {
      formIsValid = false;
      errors.email = "Email is required";
    } else {
      const lastAtPos = formData.email.lastIndexOf("@");
      const lastDotPos = formData.email.lastIndexOf(".");
      const corporateEmail =
        formData.email.includes("@hotmail.co") ||
        formData.email.includes("@outlook.co") ||
        formData.email.includes("@live.co") ||
        formData.email.includes("@gmail.com") ||
        formData.email.includes("@yahoo.co");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          formData.email.indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          formData.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors.email = "Email is not valid";
      } else if (corporateEmail) {
        formIsValid = false;
        errors.email = "Please provide your corporate email";
      }
    }

    if (captchaScore < 0.6) {
      formIsValid = false;
      errors.recaptcha = "Only humans allowed";
    }

    setLoginError(Object.values(errors)[0] || "");
    return formIsValid;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setRegisterError("");
    setSuccessMessage("");

    // Validate password meets all criteria
    const allCriteriaMet = Object.values(passwordCriteria).every((criterion) => criterion === true);
    if (!allCriteriaMet) {
      setRegisterError("Password does not meet all requirements");
      setLoading(false);

      // Auto-hide error message after 10 seconds
      setTimeout(() => {
        setRegisterError("");
      }, 10000);

      return;
    }

    try {
      // Skip reCAPTCHA for diro.io emails
      if (formData.email.includes("diro.io")) {
        console.log("Bypassing reCAPTCHA for diro.io email during registration");
        const response = await authService.register(formData);
        handleRegisterResponse(response);
        return;
      }

      // For non-diro.io emails, proceed with reCAPTCHA
      if (typeof window.grecaptcha === "undefined") {
        throw new Error("Security verification not loaded. Please refresh the page.");
      }

      // Get the token with retry mechanism
      const token = await new Promise<string>((resolve, reject) => {
        const maxAttempts = 5;
        let attempts = 0;

        const tryGetToken = async () => {
          try {
            const recaptchaToken = await window.grecaptcha.execute(env.Skey, {
              action: "submit",
            });
            console.log("reCAPTCHA token received");
            if (!recaptchaToken) {
              throw new Error("Empty token received");
            }
            resolve(recaptchaToken);
          } catch (error) {
            console.error(`reCAPTCHA execution attempt ${attempts + 1} failed:`, error);
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(tryGetToken, 1000); // Retry after 1 second
            } else {
              reject(new Error("Security verification failed. Please try again."));
            }
          }
        };

        window.grecaptcha.ready(() => {
          console.log("reCAPTCHA ready, attempting to get token");
          tryGetToken();
        });
      });

      // Validate reCAPTCHA
      const recaptchaResponse = await authService.validateRecaptcha(token);
      console.log("reCAPTCHA validation response:", recaptchaResponse);

      if (recaptchaResponse?.score >= 0.3) {
        console.log("reCAPTCHA validation passed, proceeding with registration");
        const response = await authService.register(formData);
        handleRegisterResponse(response);
      } else {
        console.log("Low reCAPTCHA score:", recaptchaResponse?.score);
        setRegisterError("Security verification failed. Please try again.");

        // Auto-hide error message after 10 seconds
        setTimeout(() => {
          setRegisterError("");
        }, 10000);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.message.includes("security verification")) {
        setRegisterError("Security verification failed. Please refresh the page and try again.");
      } else {
        setRegisterError(err.response?.data?.message || "An error occurred during registration");
      }

      // Auto-hide error message after 10 seconds
      setTimeout(() => {
        setRegisterError("");
      }, 10000);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle registration response
  const handleRegisterResponse = (response: any) => {
    if (response.data?.error) {
      setRegisterError(response.data.message || "Registration failed");

      // Auto-hide error message after 10 seconds
      setTimeout(() => {
        setRegisterError("");
      }, 10000);
    } else if (response.data?.message === "plz check you email") {
      setSuccessMessage("Please check your email for verification instructions. We've sent you an email with next steps.");
      // Clear form data
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        country: "",
        password: "",
        companyname: "",
        building: "",
        roleincompany: "",
      });
      // Redirect to login tab after 10 seconds
      setTimeout(() => {
        setActiveTab("login");
        setSuccessMessage("");
      }, 10000);
    } else {
      // Handle other successful responses
      setActiveTab("login");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setLoginError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      let shouldProceedWithLogin = true;
      let recaptchaValidated = false;

      // Only attempt reCAPTCHA if it's loaded
      if (typeof window.grecaptcha !== "undefined") {
        try {
          // Get reCAPTCHA token
          const token = await new Promise<string>((resolve, reject) => {
            window.grecaptcha.ready(async () => {
              try {
                const recaptchaToken = await window.grecaptcha.execute(env.Skey, {
                  action: "submit",
                });
                resolve(recaptchaToken);
              } catch (error) {
                reject(error);
              }
            });
          });

          // Validate reCAPTCHA if we got a token
          if (token) {
            try {
              const recaptchaResponse = await authService.validateRecaptcha(token);
              console.log("reCAPTCHA validation response:", recaptchaResponse);

              // Consider validation successful if:
              // 1. Response indicates success OR
              // 2. Score is above very low threshold OR
              // 3. Response has no score but no explicit failure
              if (
                recaptchaResponse.success ||
                (recaptchaResponse.score && recaptchaResponse.score >= 0.1) ||
                (recaptchaResponse.score === undefined && !recaptchaResponse.hasOwnProperty("success"))
              ) {
                recaptchaValidated = true;
              }
            } catch (error) {
              console.warn("reCAPTCHA validation error:", error);
              // Don't block login on validation error
            }
          }
        } catch (error) {
          console.warn("reCAPTCHA execution error:", error);
          // Don't block login on reCAPTCHA error
        }
      } else {
        console.warn("reCAPTCHA not loaded - proceeding with login anyway");
      }

      // Proceed with login regardless of reCAPTCHA result
      try {
        const response = await authService.login({ email, password });
        handleLoginResponse(response, email);
      } catch (loginError: any) {
        console.error("Login error:", loginError);
        const errorMessage = loginError.response?.data?.message || loginError.message || "An error occurred during login";
        setLoginError(errorMessage);
        dispatch(loginFail({ payload: errorMessage }));
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Overall error:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred during login";
      setLoginError(errorMessage);
      dispatch(loginFail({ payload: errorMessage }));
      setLoading(false);
    }
  };

  // Update the handleLoginResponse function to ensure client-side navigation
  const handleLoginResponse = (response: any, email: string) => {
    try {
      console.log("Handling login response:", response);

      if (response.data?.error === true) {
        console.log("Login failed:", response.data.message);
        dispatch(loginFail({ payload: response.data }));
        setLoginError(response.data.message || "Login failed");
        setLoading(false);
      } else if (response.data.statusCode === 242) {
        console.log("Two-factor authentication required");

        // Set cookies and dispatch actions before navigation
        if (response.headers.authorization) {
          cookies.set("token", response.headers.authorization);
        }
        if (email) {
          cookies.set("email", email);
        }
        cookies.set("requiresTwoFactor", "true");
        cookies.set("isAuthenticated", "false"); // Add this to ensure consistent state

        if (response.data.twoFactorId) {
          cookies.set("isTwoFactor", "true");
          cookies.set("twoFactorId", response.data.twoFactorId);
          cookies.set("authMode", response.data.sandbox === false ? "1" : "2");

          if (response.data.multiFactorEnabled) {
            cookies.set("multiFactorEnabled", "true");
          } else {
            cookies.set("multiFactorEnabled", "false");
          }
        }

        console.log("response.data.sandbox", response.data.sandbox);

        // Dispatch actions based on sandbox status
        if (response.data.sandbox === false || response.data.sandbox === "false") {
          console.log("loginAuthenticated");
          dispatch(
            loginAuthenticated({
              headers: response.headers,
              payload: response.data,
              email,
            })
          );
        } else {
          dispatch(
            loginSandbox({
              headers: response.headers,
              payload: response.data,
              email,
            })
          );
        }

        // Use setTimeout to ensure Redux state is updated before navigation
        console.log("Navigating to two-factor page...");
        // Use router.push for client-side navigation
        router.push("/authentication/two-factor");
      } else if (response.data?.statusCode === 200) {
        console.log("Login successful, redirecting to dashboard");

        // Direct login success
        if (response.headers.authorization) {
          cookies.set("token", response.headers.authorization);
          cookies.set("isAuthenticated", "true");
        }
        if (email) {
          cookies.set("email", email);
        }

        // Dispatch success action
        dispatch(loginSuccess({ headers: response.headers, payload: response.data }));

        // Use router.push for client-side navigation
        console.log("Navigating to dashboard...");
        router.push("/client/validation-buttons");
      } else {
        // Fallback for other cases
        console.log("Login response not handled:", response.data);
        dispatch(loginFail({ payload: response.data }));
        setLoginError("Login failed with an unexpected response");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in handleLoginResponse:", error);
      setLoading(false);
      setLoginError("An error occurred while processing the login response");
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: name === "password" ? value : sanitizeInput(value),
    });

    // Check password criteria if the password field is being updated
    if (name === "password") {
      const criteria = {
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /[0-9]/.test(value),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
      };

      setPasswordCriteria(criteria);

      // Reset fading state and ensure component is shown
      setIsFadingOut(false);
      setShowPasswordStrength(true);

      // Calculate password strength (0-4)
      const metCriteriaCount = Object.values(criteria).filter(Boolean).length;
      setPasswordStrength(metCriteriaCount);

      // If all criteria are met, set a timer to hide the component with fade-out animation
      if (Object.values(criteria).every(Boolean)) {
        setTimeout(() => {
          setIsFadingOut(true); // Start fade-out animation

          // Wait for animation to complete before hiding the component
          setTimeout(() => {
            setShowPasswordStrength(false);
            setIsFadingOut(false);
          }, 300); // Match the animation duration
        }, 2000);
      }
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#182848] dark:to-[#4b6cb7] opacity-90" />

        {/* Content container */}
        <div className="relative flex min-h-screen z-10">
          {/* Left Section - Updated padding and positioning */}
          <div className="relative hidden w-1/2 lg:block pl-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-full flex flex-col"
            >
              {/* Logo section - Add specific padding */}
              <div className="flex items-center gap-2 mb-8 px-12 pt-12">
                <motion.a href="https://diro.io/" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
                    alt="logo"
                    className="h-8"
                  />
                </motion.a>
                <span className="text-slate-800 dark:text-white/90 text-lg font-medium">Beta</span>
              </div>

              {/* Text content section - Add specific padding */}
              <motion.div
                className="mb-16 px-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h1 className="text-slate-900 dark:text-white text-5xl font-bold leading-tight mb-6">
                  Get instant original documents online
                </h1>
                <p className="text-slate-600 dark:text-white/80 text-xl leading-relaxed">
                  Fast track your business with 100% original documents. Eliminate the need for attestations, notary, apostle or
                  even physical document verification.
                </p>
              </motion.div>

              {/* Certificate container - Adjusted spacing */}
              <div className="relative flex-grow mt-24 pt-12">
                <motion.div className="absolute left-0 w-full h-full">
                  <motion.img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-login-HdowIu9Kyhep2y9j1G27A0Ueq0Z6Qk.png"
                    alt="Certificate preview 1"
                    className="absolute bottom-0 left-0 w-[85%] h-auto"
                    style={{
                      filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                      top: "-11rem",
                      width: "600px",
                      left: "-4rem",
                      // transformOrigin: "bottom left",
                    }}
                    initial={{ rotate: -5, zIndex: 2 }}
                    animate={{ rotate: -6, zIndex: 2 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                  <motion.img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-login-HdowIu9Kyhep2y9j1G27A0Ueq0Z6Qk.png"
                    alt="Certificate preview 2"
                    className="absolute bottom-0 left-[15%] w-[85%] h-auto"
                    style={{
                      filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                      width: "600px",
                      left: "4rem",
                      top: "-13rem",
                      // transformOrigin: "bottom right",
                    }}
                    initial={{ rotate: -5, scale: 1, zIndex: 1 }}
                    whileHover={{
                      rotate: 0,
                      scale: 1.05,
                      zIndex: 3,
                      y: -10,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Section - Modified for vertical alignment based on active tab */}
          <div className="flex-1 flex justify-center p-6 lg:p-12 bg-transparent">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`w-full max-w-[calc(32rem-1rem)] ${activeTab === "login" ? "self-center" : "self-start mt-4"}`}
            >
              {/* Main container with floating card design */}
              <div className="relative w-full">
                {/* Decorative accent elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-xl"></div>

                {/* Main card container */}
                <div className="relative rounded-3xl bg-white dark:bg-slate-900/70 backdrop-blur-xl p-6 border border-slate-200/50 dark:border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 dark:from-transparent dark:to-blue-900/10 rounded-3xl pointer-events-none"></div>

                  <div className="relative z-10">
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-6">
                      {activeTab === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <Tabs
                      value={activeTab}
                      className="w-full"
                      onValueChange={(value) => {
                        setActiveTab(value);
                        // Clear errors when switching tabs
                        if (value === "login") {
                          setLoginError("");
                        } else {
                          setRegisterError("");
                        }
                      }}
                    >
                      <TabsList className="w-full mb-4 bg-slate-100 dark:bg-white/5 rounded-xl p-1.5 backdrop-blur-sm">
                        <TabsTrigger
                          value="login"
                          className="w-full py-3 text-slate-800 dark:text-white 
                            data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 
                            rounded-lg transition-all duration-300"
                        >
                          LOGIN
                        </TabsTrigger>
                        <TabsTrigger
                          value="register"
                          className="w-full py-3 text-slate-600 dark:text-white/80 data-[state=active]:text-slate-800 dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 rounded-lg transition-all duration-300"
                        >
                          SIGN UP
                        </TabsTrigger>
                      </TabsList>

                      <AnimatePresence>
                        <TabsContent key="login" value="login" asChild>
                          <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            {loginError && (
                              <Alert
                                variant="destructive"
                                className="mb-4 animate-fadeIn transition-all duration-300 ease-in-out"
                              >
                                <AlertDescription className="font-medium">{loginError}</AlertDescription>
                              </Alert>
                            )}

                            <form
                              onSubmit={handleSubmit}
                              className="space-y-4"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                                }
                              }}
                            >
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">
                                    Email
                                  </Label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="email"
                                      name="email"
                                      type="email"
                                      placeholder="Enter your email"
                                      required
                                      className="h-11 pl-10 
                                        bg-slate-100 dark:bg-white/5 
                                        border-0 
                                        text-slate-800 dark:text-white 
                                        placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                        rounded-lg 
                                        focus:ring-0
                                        focus:border-0
                                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                        focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                        transition-shadow"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <Label htmlFor="password" className="text-slate-700 dark:text-gray-300">
                                    Password
                                  </Label>
                                  <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter your password"
                                      required
                                      className="h-11 pl-10 
                                        bg-slate-100 dark:bg-white/5 
                                        border-0 
                                        text-slate-800 dark:text-white 
                                        placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                        rounded-lg 
                                        focus:ring-0
                                        focus:border-0
                                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                        focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                        transition-shadow"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {/* <Checkbox
                                    id="remember"
                                    className="border-0 bg-slate-100 dark:bg-white/5 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                  />
                                  <label htmlFor="remember" className="text-sm text-slate-600 dark:text-gray-300">
                                    Remember me
                                  </label> */}
                                </div>
                                <Link href="/forgotpassword">
                                  <Button
                                    variant="link"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0"
                                  >
                                    Forgot Password
                                  </Button>
                                </Link>
                              </div>

                              <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                              >
                                {loading ? (
                                  <div className="flex items-center justify-center">
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Signing in...
                                  </div>
                                ) : (
                                  "Sign In"
                                )}
                              </Button>
                            </form>
                          </motion.div>
                        </TabsContent>

                        <TabsContent key="register" value="register" asChild>
                          <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            {successMessage ? (
                              <SuccessMessage
                                message={successMessage}
                                onRedirect={() => {
                                  setActiveTab("login");
                                  setSuccessMessage("");
                                }}
                              />
                            ) : (
                              <form onSubmit={handleRegister} className="space-y-4">
                                {registerError && (
                                  <Alert
                                    variant="destructive"
                                    className="mb-4 animate-fadeIn transition-all duration-300 ease-in-out"
                                  >
                                    <AlertDescription className="font-medium">{registerError}</AlertDescription>
                                  </Alert>
                                )}

                                {/* First and Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <div className="relative">
                                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                      <Input
                                        id="first-name"
                                        name="firstname"
                                        type="text"
                                        placeholder="First name*"
                                        required
                                        value={formData.firstname}
                                        onChange={onChange}
                                        className="h-11 pl-10 
                                          bg-slate-100 dark:bg-white/5 
                                          border-0 
                                          text-slate-800 dark:text-white 
                                          placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                          rounded-lg 
                                          focus:ring-0
                                          focus:border-0
                                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                          focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                          transition-shadow"
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="relative">
                                      <Input
                                        id="last-name"
                                        name="lastname"
                                        type="text"
                                        placeholder="Last name"
                                        value={formData.lastname}
                                        onChange={onChange}
                                        className="h-11 pl-10 
                                          bg-slate-100 dark:bg-white/5 
                                          border-0 
                                          text-slate-800 dark:text-white 
                                          placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                          rounded-lg 
                                          focus:ring-0
                                          focus:border-0
                                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                          focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                          transition-shadow"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="register-email"
                                      name="email"
                                      type="email"
                                      placeholder="Email Address*"
                                      required
                                      value={formData.email}
                                      onChange={onChange}
                                      className="h-11 pl-10 
                                        bg-slate-100 dark:bg-white/5 
                                        border-0 
                                        text-slate-800 dark:text-white 
                                        placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                        rounded-lg 
                                        focus:ring-0
                                        focus:border-0
                                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                        focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                        transition-shadow"
                                    />
                                  </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="register-password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Password*"
                                      required
                                      value={formData.password}
                                      onChange={onChange}
                                      className="h-11 pl-10 
                                        bg-slate-100 dark:bg-white/5 
                                        border-0 
                                        text-slate-800 dark:text-white 
                                        placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                        rounded-lg 
                                        focus:ring-0
                                        focus:border-0
                                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                        focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                        transition-shadow"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                    >
                                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                  </div>

                                  {/* Password Policy Indicators */}
                                  {formData.password.length > 0 && showPasswordStrength && (
                                    <div
                                      className={`mt-2 p-3 bg-slate-50 dark:bg-white/5 rounded-lg shadow-sm border border-slate-100 dark:border-white/10 transition-all duration-300 ease-in-out ${
                                        isFadingOut ? "opacity-0 transform translate-y-4" : "animate-fadeIn opacity-100"
                                      }`}
                                    >
                                      {/* Password Strength Meter */}
                                      <div className="mb-3">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                            Password Strength:
                                          </span>
                                          <span className="text-xs font-medium">
                                            {passwordStrength === 0 && <span className="text-red-500">Very Weak</span>}
                                            {passwordStrength === 1 && <span className="text-red-500">Weak</span>}
                                            {passwordStrength === 2 && <span className="text-red-500">Fair</span>}
                                            {passwordStrength === 3 && <span className="text-yellow-500">Good</span>}
                                            {passwordStrength === 4 && <span className="text-yellow-500">Strong</span>}
                                            {passwordStrength === 5 && <span className="text-green-500">Very Strong</span>}
                                          </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                          <div
                                            className={`h-full rounded-full transition-all duration-300 animate-pulse-once ${
                                              passwordStrength === 0
                                                ? "w-0"
                                                : passwordStrength === 1
                                                ? "w-1/5 bg-red-500"
                                                : passwordStrength === 2
                                                ? "w-2/5 bg-red-500"
                                                : passwordStrength === 3
                                                ? "w-3/5 bg-yellow-500"
                                                : passwordStrength === 4
                                                ? "w-4/5 bg-yellow-500"
                                                : "w-full bg-green-500"
                                            }`}
                                          ></div>
                                        </div>
                                      </div>

                                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
                                        Password must contain:
                                      </p>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="flex items-center space-x-2">
                                          {passwordCriteria.minLength ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-fadeIn transition-transform duration-300 ease-in-out" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-slate-400 transition-all duration-300" />
                                          )}
                                          <span
                                            className={`text-xs ${
                                              passwordCriteria.minLength
                                                ? "text-green-600 dark:text-green-400 font-medium transition-all duration-300"
                                                : "text-slate-500 dark:text-slate-400 transition-all duration-300"
                                            }`}
                                          >
                                            At least 8 characters
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {passwordCriteria.hasUppercase ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-fadeIn transition-transform duration-300 ease-in-out" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-slate-400 transition-all duration-300" />
                                          )}
                                          <span
                                            className={`text-xs ${
                                              passwordCriteria.hasUppercase
                                                ? "text-green-600 dark:text-green-400 font-medium transition-all duration-300"
                                                : "text-slate-500 dark:text-slate-400 transition-all duration-300"
                                            }`}
                                          >
                                            Uppercase letter
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {passwordCriteria.hasLowercase ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-fadeIn transition-transform duration-300 ease-in-out" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-slate-400 transition-all duration-300" />
                                          )}
                                          <span
                                            className={`text-xs ${
                                              passwordCriteria.hasLowercase
                                                ? "text-green-600 dark:text-green-400 font-medium transition-all duration-300"
                                                : "text-slate-500 dark:text-slate-400 transition-all duration-300"
                                            }`}
                                          >
                                            Lowercase letter
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {passwordCriteria.hasNumber ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-fadeIn transition-transform duration-300 ease-in-out" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-slate-400 transition-all duration-300" />
                                          )}
                                          <span
                                            className={`text-xs ${
                                              passwordCriteria.hasNumber
                                                ? "text-green-600 dark:text-green-400 font-medium transition-all duration-300"
                                                : "text-slate-500 dark:text-slate-400 transition-all duration-300"
                                            }`}
                                          >
                                            Number
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          {passwordCriteria.hasSpecial ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 animate-fadeIn transition-transform duration-300 ease-in-out" />
                                          ) : (
                                            <Circle className="h-4 w-4 text-slate-400 transition-all duration-300" />
                                          )}
                                          <span
                                            className={`text-xs ${
                                              passwordCriteria.hasSpecial
                                                ? "text-green-600 dark:text-green-400 font-medium transition-all duration-300"
                                                : "text-slate-500 dark:text-slate-400 transition-all duration-300"
                                            }`}
                                          >
                                            Special character
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Company Name */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="company"
                                      name="companyname"
                                      type="text"
                                      placeholder="Company name"
                                      value={formData.companyname}
                                      onChange={onChange}
                                      className="h-11 pl-10 
                                        bg-slate-100 dark:bg-white/5 
                                        border-0 
                                        text-slate-800 dark:text-white 
                                        placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                        rounded-lg 
                                        focus:ring-0
                                        focus:border-0
                                        shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                        focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                        transition-shadow"
                                    />
                                  </div>
                                </div>

                                {/* What are you building? */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 z-10" />
                                    <Select
                                      name="building"
                                      onValueChange={(value) => setFormData({ ...formData, building: value })}
                                    >
                                      <SelectTrigger
                                        className="h-11 pl-10 
                                          bg-slate-100 dark:bg-white/5 
                                          border-0 
                                          text-slate-800 dark:text-white 
                                          placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                          rounded-lg
                                          focus:ring-0
                                          focus:border-0
                                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                          focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                          transition-shadow"
                                      >
                                        <SelectValue placeholder="What are you building?" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="personal">Personal</SelectItem>
                                        <SelectItem value="consumer payment">Consumer payment</SelectItem>
                                        <SelectItem value="lending">Lending</SelectItem>
                                        <SelectItem value="banking">Banking</SelectItem>
                                        <SelectItem value="Identity verification services">
                                          Identity verification services
                                        </SelectItem>
                                        <SelectItem value="crypto">Blockchain / crypto currencies</SelectItem>
                                        <SelectItem value="others">Others</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* What role are you in? */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <PenBox className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 z-10" />
                                    <Select
                                      name="roleincompany"
                                      onValueChange={(value) => setFormData({ ...formData, roleincompany: value })}
                                    >
                                      <SelectTrigger
                                        className="h-11 pl-10 
                                          bg-slate-100 dark:bg-white/5 
                                          border-0 
                                          text-slate-800 dark:text-white 
                                          placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                          rounded-lg
                                          focus:ring-0
                                          focus:border-0
                                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                          focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                          transition-shadow"
                                      >
                                        <SelectValue placeholder="What role are you in?" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="compliance"> Compliance</SelectItem>
                                        <SelectItem value="executive"> Executive</SelectItem>
                                        <SelectItem value="product">Product</SelectItem>
                                        <SelectItem value="others"> Others</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Country Selection */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 z-10" />
                                    <Select
                                      name="country"
                                      value={formData.country}
                                      defaultValue={defaultCountry}
                                      onValueChange={(value) => {
                                        setFormData({ ...formData, country: value });
                                        setShowdefault(false);
                                      }}
                                    >
                                      <SelectTrigger
                                        className="h-11 pl-10 
                                          bg-slate-100 dark:bg-white/5 
                                          border-0 
                                          text-slate-800 dark:text-white 
                                          placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                          rounded-lg
                                          focus:ring-0
                                          focus:border-0
                                          shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                          focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                          transition-shadow"
                                      >
                                        <SelectValue placeholder={defaultCountry || "Select your country"} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {countries && countries.length > 0 ? (
                                          countries.map((value, key) => (
                                            <SelectItem key={key} value={value.country}>
                                              {value.country}
                                            </SelectItem>
                                          ))
                                        ) : (
                                          <SelectItem value="loading">Loading countries...</SelectItem>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Privacy Policy Checkbox */}
                                <div className="flex items-start space-x-2">
                                  <Checkbox
                                    id="privacy"
                                    required
                                    className="border-0 bg-slate-100 dark:bg-white/5 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                  />
                                  <label htmlFor="privacy" className="text-sm text-slate-600 dark:text-gray-300">
                                    I confirm that I have read and accepted the DIRO{" "}
                                    <Link
                                      href="https://diro.live/privacy-policy/"
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                      target="_blank"
                                    >
                                      Privacy Policy
                                    </Link>
                                  </label>
                                </div>

                                {/* Register Button */}
                                <Button
                                  type="submit"
                                  disabled={loading}
                                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                                >
                                  {loading ? (
                                    <div className="flex items-center justify-center">
                                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                      Registering...
                                    </div>
                                  ) : (
                                    "Register"
                                  )}
                                </Button>
                              </form>
                            )}
                          </motion.div>
                        </TabsContent>
                      </AnimatePresence>
                    </Tabs>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Theme toggle with tooltip */}
        <motion.div
          className="absolute top-4 right-4 lg:top-6 lg:right-8 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="cursor-pointer hover:scale-105 transition-all duration-200">
                <ThemeToggle showText={false} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
              <p>Change theme</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
