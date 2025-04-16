"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { env } from "@/app/config/environment";
import axios from "axios";
import { forgotPassword } from "@/app/services/auth.service";

// Declare Window interface with grecaptcha property
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Load reCAPTCHA script
    const loadScriptByURL = (id: string, url: string, callback: () => void) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.async = true;
        script.defer = true;
        script.onload = callback;
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script");
          setError("Security verification failed to load. Please refresh the page.");
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    // Add a timeout to verify if grecaptcha is loaded
    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${env.Skey}`, () => {
      console.log("reCAPTCHA script loaded!");

      // Verify after a short delay that grecaptcha is actually available
      setTimeout(() => {
        if (!window.grecaptcha) {
          console.error("reCAPTCHA not initialized properly");
          setError("Security verification not initialized. Please refresh the page.");
        }
      }, 1000);
    });

    // Cleanup function
    return () => {
      const script = document.getElementById("recaptcha-key");
      if (script) {
        script.remove();
      }
    };
  }, []);

  const handleValidation = (captchaScore: number) => {
    let isValid = true;

    if (!email) {
      setError("Email is required");
      isValid = false;
      return isValid;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      isValid = false;
      return isValid;
    }

    if (captchaScore < 0.3 && !email.includes("diro.io")) {
      setError("Security verification failed. Please try again.");
      isValid = false;
      return isValid;
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if reCAPTCHA is loaded with retry mechanism
      let retries = 0;
      const maxRetries = 3;

      const waitForRecaptcha = async (): Promise<string | null> => {
        if (window.grecaptcha) {
          try {
            console.log("Getting reCAPTCHA token...");
            const recaptchaToken = await window.grecaptcha.execute(env.Skey, { action: "submit" });
            console.log("reCAPTCHA token received");
            return recaptchaToken;
          } catch (error) {
            console.error("Error executing reCAPTCHA:", error);
            return null;
          }
        }

        if (retries < maxRetries) {
          retries++;
          console.log(`Waiting for reCAPTCHA to load... Attempt ${retries}`);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return waitForRecaptcha();
        }

        return null;
      };

      const token = await waitForRecaptcha();

      if (!token) {
        console.error("reCAPTCHA not loaded after retries");
        setError("Security verification not loaded. Please refresh the page.");
        setLoading(false);
        return;
      }

      // Validate reCAPTCHA
      try {
        const recaptchaResponse = await axios.post(
          env.recaptcha,
          { token },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        console.log("reCAPTCHA validation response:", recaptchaResponse);

        if (recaptchaResponse.data && handleValidation(recaptchaResponse.data.score)) {
          // Call forgot password service
          const response = await forgotPassword({ email }, router);

          console.log("Forgot password response:", response);
          setIsSubmitted(true);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error during forgot password:", error);

        // If email is from diro.io, proceed even with reCAPTCHA errors
        if (email.includes("diro.io")) {
          try {
            const response = await forgotPassword({ email }, router);
            console.log("Forgot password response for diro.io email:", response);
            setIsSubmitted(true);
          } catch (forgotError: any) {
            setError(forgotError.message || "Failed to process forgot password request");
          }
        } else {
          setError(error.message || "An error occurred. Please try again.");
        }

        setLoading(false);
      }
    } catch (err: any) {
      console.error("General error in forgot password:", err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#182848] dark:to-[#4b6cb7] opacity-90" />

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
                  Enter your email address and we'll send you instructions to reset your password.
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
          <div className="flex-1 flex items-start justify-center p-6 lg:p-12 bg-transparent">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl mt-20">
              {/* Back to login button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Button>
                </Link>
              </motion.div>

              {/* Main container with floating card design */}
              <div className="relative">
                {/* Decorative accent elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-xl"></div>

                {/* Main card container */}
                <div className="relative rounded-3xl bg-white dark:bg-slate-900/70 backdrop-blur-xl p-8 border border-slate-200/50 dark:border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 dark:from-transparent dark:to-blue-900/10 rounded-3xl pointer-events-none"></div>

                  <div className="relative z-10 space-y-6">
                    <AnimatePresence mode="wait">
                      {!isSubmitted ? (
                        <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                          <div className="space-y-2 text-center">
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Forgot password?</h2>
                            <p className="text-slate-600 dark:text-gray-300 text-sm">
                              Don't worry! Just enter your email below and we'll send you instructions to reset your password.
                            </p>
                          </div>

                          {error && (
                            <Alert variant="destructive" className="mb-4 animate-fadeIn transition-all duration-300 ease-in-out">
                              <AlertDescription className="font-medium">{error}</AlertDescription>
                            </Alert>
                          )}

                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">
                                  Email
                                </Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                  <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="h-12 pl-10 
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




                            <Button
                              type="submit"
                              disabled={loading}
                              className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                            >
                              {loading ? (
                                <div className="flex items-center justify-center">
                                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                  Processing...
                                </div>
                              ) : (
                                "Send reset instructions"
                              )}
                            </Button>
                          </form>
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={formVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-center space-y-6"
                        >
                          <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Check your email</h2>
                            <p className="text-slate-600 dark:text-gray-300 text-sm">
                              We have sent password reset instructions to your email address. Please check your inbox.
                            </p>
                          </div>

                          <Button
                            onClick={() => router.push("/")}
                            className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white px-6 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                          >
                            Return to Login
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Decoration for reCAPTCHA visibility */}
              <style jsx global>{`
                .grecaptcha-badge {
                  visibility: visible;
                }
              `}</style>
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
