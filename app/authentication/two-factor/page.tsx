"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InputOTP, InputOTPGroup } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@/components/ui/alert";
import { env } from "@/app/config/environment";
import Cookies from "js-cookie";
import { FancyButton } from "@/components/ui/fancy-button";
import { sendLoginOtpFailure, sendLoginOtpSuccess } from "@/app/store/features/authSlice";
import type { RootState } from "@/app/store/store";
import { authService } from "@/app/services/auth.service";
import { cookies } from "@/app/services/cookie.service";

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

const buttonVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

export default function TwoFactorPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaLoaded = useRef(false);
  const initialOtpSentRef = useRef(false);
  const [recaptchaInitializing, setRecaptchaInitializing] = useState(true);
  const [methodDescription, setMethodDescription] = useState<string>("Enter your authentication code");
  const [isMounted, setIsMounted] = useState(false);

  const { isAuthenticated, email, twoFactorId, methodId, method, roles, loginError } = useSelector(
    (state: RootState) => state.auth
  );

  console.log("twoFactorId praveen", twoFactorId, methodId);

  // Default to Email method if method is not specified but we have email
  const effectiveMethod = method || (email ? "Email" : "");

  // Mark component as mounted to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    // Update method description after component mounts
    if (effectiveMethod === "Email" && email) {
      setMethodDescription(`Enter the verification code sent to ${email}`);
    } else if (effectiveMethod === "Authenticator") {
      setMethodDescription("Enter the code from your authenticator app");
    }
  }, [effectiveMethod, email]);

  // Send OTP automatically when component mounts if method is Email
  useEffect(() => {
    // Only run this effect once using the ref
    if (initialOtpSentRef.current) return;

    // Only send OTP if method is Email and we have the required IDs
    if (effectiveMethod === "Email" && twoFactorId && methodId) {
      console.log("Auto-sending OTP on component mount");
      initialOtpSentRef.current = true; // Mark as sent immediately to prevent duplicate calls

      // Get values from cookies if Redux state is missing them
      const cookieTwoFactorId = twoFactorId || cookies.get("twoFactorId");
      const cookieMethodId = methodId || cookies.get("methodId");

      if (cookieTwoFactorId && cookieMethodId) {
        // Call the service directly to avoid circular dependencies
        authService
          .sendLoginOtp(cookieTwoFactorId, cookieMethodId)
          .then((success) => {
            if (success) {
              setCodeSent(true);
              dispatch(sendLoginOtpSuccess());
              console.log("Initial OTP sent successfully");
            }
          })
          .catch((err) => {
            console.error("Failed to send initial OTP:", err);
            dispatch(sendLoginOtpFailure(err instanceof Error ? err.message : "Failed to send verification code"));
          });
      }
    }
  }, [effectiveMethod, twoFactorId, methodId, dispatch]);

  // Pre-fetch reCAPTCHA token as soon as component loads
  useEffect(() => {
    let scriptLoaded = false;
    let timeoutId: NodeJS.Timeout;

    const loadRecaptcha = async () => {
      try {
        console.time("recaptcha-load");
        await new Promise((resolve, reject) => {
          const existingScript = document.querySelector('script[src*="recaptcha"]');
          if (existingScript) {
            scriptLoaded = true;
            recaptchaLoaded.current = true;
            resolve(true);
            return;
          }

          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `https://www.google.com/recaptcha/api.js?render=${env.Skey}`;
          script.id = "recaptcha-key";
          script.async = true;

          const scriptTimeout = setTimeout(() => {
            reject(new Error("reCAPTCHA script loading timed out"));
          }, 8000);

          script.onload = () => {
            clearTimeout(scriptTimeout);
            scriptLoaded = true;
            recaptchaLoaded.current = true;
            console.timeEnd("recaptcha-load");
            resolve(true);
          };

          script.onerror = (error) => {
            clearTimeout(scriptTimeout);
            console.error("Error loading reCAPTCHA script:", error);
            reject(error);
          };

          document.head.appendChild(script);
        });

        await new Promise((resolve) => setTimeout(resolve, 500));

        const token = await fetchRecaptchaToken();
        if (token) {
          console.log("Initial reCAPTCHA token successfully fetched");
        }

        setRecaptchaInitializing(false);
      } catch (error) {
        console.error("Failed to load reCAPTCHA:", error);
        setRecaptchaInitializing(false);
        recaptchaLoaded.current = true;
      }
    };

    loadRecaptcha();

    const refreshToken = async () => {
      if (recaptchaLoaded.current) {
        await fetchRecaptchaToken();
      }
    };

    timeoutId = setInterval(refreshToken, 60000);

    return () => {
      clearInterval(timeoutId);
    };
  }, []);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      console.log("Roles:", roles);

      if (roles === "Account") {
        console.log("Account role detected, redirecting to /client/account");
        router.push("/client/account");
      } else {
        console.log("Non-Account role, redirecting to /client/validation-buttons");
        router.push("/client/validation-buttons");
      }
    }
  }, [isAuthenticated, roles, router]);

  const handleResendOtp = async () => {
    console.log("handleResendOtp called", { methodId, twoFactorId });

    // Get values from cookies if Redux state is missing them
    const cookieTwoFactorId = twoFactorId || cookies.get("twoFactorId");
    const cookieMethodId = methodId || cookies.get("methodId");

    console.log("Using values:", { cookieTwoFactorId, cookieMethodId });

    if (!cookieTwoFactorId) {
      console.error("Missing twoFactorId", { twoFactorId, cookieTwoFactorId });
      setError("Unable to resend code. Please return to sign in and try again.");
      return;
    }

    if (!cookieMethodId) {
      console.error("Missing methodId", { methodId, cookieMethodId });
      setError("Unable to resend code. Please return to sign in and try again.");
      return;
    }

    try {
      setResendLoading(true);
      console.log("Sending OTP with:", { twoFactorId: cookieTwoFactorId, methodId: cookieMethodId });

      // Use the authService directly to send the OTP
      const success = await authService.sendLoginOtp(cookieTwoFactorId, cookieMethodId);
      console.log("OTP send result:", success);

      if (success) {
        setError(""); // Clear any previous errors
        setCodeSent(true);
        setShowSuccessAnimation(true);
        dispatch(sendLoginOtpSuccess());
        console.log("OTP sent successfully, showing animation");

        // Reset success animation after a delay
        setTimeout(() => {
          setShowSuccessAnimation(false);
          console.log("Animation reset");
        }, 2000);
      }
    } catch (err) {
      dispatch(sendLoginOtpFailure(err instanceof Error ? err.message : "Failed to send verification code"));
      console.error("Failed to send verification code:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const fetchRecaptchaToken = async (): Promise<string | null> => {
    try {
      console.time("recaptcha-token-fetch");
      if (!recaptchaLoaded.current) {
        console.log("reCAPTCHA not loaded yet, waiting...");
        return null;
      }

      const token = await new Promise<string>((resolve, reject) => {
        const tokenTimeout = setTimeout(() => {
          reject(new Error("reCAPTCHA token generation timed out"));
        }, 5000);

        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(env.Skey, { action: "twoFactorAuth" });
            clearTimeout(tokenTimeout);
            resolve(token);
          } catch (error) {
            clearTimeout(tokenTimeout);
            reject(error);
          }
        });
      });

      console.timeEnd("recaptcha-token-fetch");
      setRecaptchaToken(token);
      return token;
    } catch (error) {
      console.error("Error fetching reCAPTCHA token:", error);
      return null;
    }
  };

  const submitData = async (token: string, otp: string) => {
    try {
      const recaptchaPromise = authService.validateRecaptcha(token);

      if (!email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      const authMode = Cookies.get("authMode") === "2" ? true : false;

      const recaptchaResponse = await recaptchaPromise;
      console.log("reCAPTCHA validation response:", recaptchaResponse);

      if (email?.includes("diro.io") || recaptchaResponse.score >= 0.3) {
        try {
          const verificationResponse = await authService.twoFactorLogin(email, otp, twoFactorId, authMode);

          console.log("two factor response", verificationResponse);

          if (!verificationResponse.success) {
            if (verificationResponse.data && verificationResponse.data.message) {
              setError(verificationResponse.data.message);
            } else {
              setError("Verification failed. Please try again.");
            }
            setLoading(false);
          } else {
            setError("");
            console.log("Two-factor authentication successful, redirecting...");
          }
        } catch (verificationError: any) {
          console.error("OTP verification error:", verificationError);
          if (verificationError.response?.data?.message) {
            setError(verificationError.response.data.message);
          } else {
            setError("Failed to verify OTP. Please try again.");
          }
          setLoading(false);
        }
      } else {
        console.log("Low reCAPTCHA score:", recaptchaResponse.score);
        setError("Security verification failed. Please try again.");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error during verification:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Verification failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Validate code format - ensure it's exactly 6 digits
    if (!code || code.length !== 6 || !/^\d{6}$/.test(code)) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // If reCAPTCHA is still initializing, wait for it briefly
      if (recaptchaInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Use existing token or get a new one
      let token = recaptchaToken;
      if (!token && recaptchaLoaded.current) {
        console.log("No pre-fetched token available, getting a new one");
        token = await fetchRecaptchaToken();
      }

      // If we still can't get a token but reCAPTCHA is loaded, try one more time
      if (!token && recaptchaLoaded.current) {
        console.log("Second attempt to fetch reCAPTCHA token");
        token = await fetchRecaptchaToken();
      }

      // Proceed even without token as a fallback (server should handle this case)
      await submitData(token || "", code);

      // Pre-fetch a new token for next time
      fetchRecaptchaToken();
    } catch (error: any) {
      console.error("Error during 2FA verification:", error);
      setError(error?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update code input handler to pre-fetch a new token when user is typing
  const handleCodeChange = (value: string) => {
    // Ensure we only accept digits
    const digitsOnly = value.replace(/[^0-9]/g, "");
    setCode(digitsOnly);

    // Once the code is complete (usually 6 digits), pre-fetch a fresh token
    if (digitsOnly.length === 6 && recaptchaLoaded.current) {
      fetchRecaptchaToken();
    }
  };

  // Handle return to login
  const handleReturnToLogin = (e: React.MouseEvent) => {
    e.preventDefault();

    // Clear cookies
    cookies.remove("twoFactorId");
    cookies.remove("methodId");
    cookies.remove("email");
    cookies.remove("authMode");

    // Redirect to login page
    router.push("/");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
        <style>{`
          .grecaptcha-badge { 
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 999 !important;
            bottom: 16px !important;
            right: 16px !important;
            width: 70px !important;
            overflow: hidden !important;
            transition: none !important;
            transform: scale(0.9) !important;
          }
          
          .grecaptcha-badge .grecaptcha-logo {
            display: block !important;
          }
          
          .grecaptcha-badge:hover {
            width: 256px !important;
          }
        `}</style>

        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#182848] dark:to-[#4b6cb7] opacity-90" />

        {/* Theme toggle */}
        <div className="absolute right-4 top-4 z-20">
          <ThemeToggle />
        </div>

        {/* Content container */}
        <div className="relative flex min-h-screen z-10">
          {/* Left Section */}
          <div className="relative hidden w-1/2 lg:block pl-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-full flex flex-col"
            >
              {/* Logo section */}
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

              {/* Text content section */}
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
                  Secure your account with two-factor authentication for enhanced protection.
                </p>
              </motion.div>

              {/* Certificate container */}
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

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-transparent">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
              {/* Main container with nested glass effect */}
              <div className="relative rounded-3xl overflow-hidden bg-white/90 dark:bg-white/5 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="space-y-6">
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Two-Factor Authentication</h2>
                    <p className="text-slate-600 dark:text-gray-300">{methodDescription}</p>
                  </div>

                  {/* Only render alerts and form after component is mounted */}
                  {isMounted && (
                    <>
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          {error}
                        </Alert>
                      )}

                      {loginError && typeof loginError === "string" && (
                        <Alert variant="destructive" className="mb-4">
                          {loginError}
                        </Alert>
                      )}

                      {loginError && typeof loginError === "object" && loginError.message && (
                        <Alert variant="destructive" className="mb-4">
                          {loginError.message}
                        </Alert>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="otp" className="text-slate-700 dark:text-gray-300">
                            Authentication Code
                          </Label>
                          <div className="flex justify-center">
                            <InputOTP
                              maxLength={6}
                              value={code}
                              onChange={handleCodeChange}
                              containerClassName="group flex items-center has-[:disabled]:opacity-50"
                              render={({ slots }) => (
                                <InputOTPGroup className="flex gap-2">
                                  {slots.map((slot, idx) => (
                                    <div
                                      key={idx}
                                      className={cn(
                                        "relative flex h-14 w-14 items-center justify-center",
                                        "rounded-xl border-2 border-slate-200 dark:border-slate-800",
                                        "bg-white dark:bg-slate-950",
                                        "transition-all duration-200",
                                        "group-hover:border-slate-300 dark:group-hover:border-slate-700",
                                        "focus-within:border-slate-400 dark:focus-within:border-slate-600",
                                        "focus-within:ring-2 focus-within:ring-slate-400/20 dark:focus-within:ring-slate-600/20",
                                        { "z-10 ring-2 ring-slate-400/20 dark:ring-slate-600/20": slot.isActive }
                                      )}
                                    >
                                      {slot.char !== null && (
                                        <div className="text-xl font-medium text-slate-800 dark:text-slate-200">{slot.char}</div>
                                      )}
                                      {slot.hasFakeCaret && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                          <div className="h-6 w-px animate-caret-blink bg-slate-800 dark:bg-slate-200 duration-1000" />
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </InputOTPGroup>
                              )}
                            />
                          </div>
                        </div>

                        {effectiveMethod === "Email" && (
                          <div className="flex justify-end mb-4">
                            <motion.div initial="initial" animate="animate" whileHover="hover" variants={buttonVariants}>
                              <FancyButton
                                type="button"
                                onClick={() => {
                                  console.log("Button clicked");
                                  handleResendOtp();
                                }}
                                loading={resendLoading}
                                size="small"
                                variant="blue"
                                className="group"
                                successAnimation={!codeSent && showSuccessAnimation}
                              >
                                {resendLoading ? "Sending..." : codeSent ? "Resend Code" : "Send Code"}
                              </FancyButton>
                            </motion.div>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={loading || !code}
                          className={cn(
                            "w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848]",
                            "text-white rounded-lg transition-all duration-300",
                            "shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]",
                            "hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)]",
                            "dark:hover:opacity-90",
                            { "opacity-50 cursor-not-allowed": loading }
                          )}
                        >
                          {loading ? "Verifying..." : "Verify"}
                        </Button>

                        <div className="text-center">
                          <Link
                            href="/"
                            onClick={handleReturnToLogin}
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                            Return to Sign In
                          </Link>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
