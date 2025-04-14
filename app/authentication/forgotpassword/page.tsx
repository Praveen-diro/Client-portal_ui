"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, RefreshCw, Clock } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
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

  // Timer effect for resend functionality
  useEffect(() => {
    if (timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timerInterval);
    } else if (timeLeft === 0 && isSubmitted) {
      setCanResend(true);
    }
  }, [timeLeft, isSubmitted]);

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
          // Call forgot password service with resend parameter set to false for first attempt
          const response = await forgotPassword({ email, resend: false }, router);

          console.log("Forgot password response:", response);
          setIsSubmitted(true);
          setTimeLeft(30); // Start the 30-second timer
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Error during forgot password:", error);

        // If email is from diro.io, proceed even with reCAPTCHA errors
        if (email.includes("diro.io")) {
          try {
            const response = await forgotPassword({ email, resend: false }, router);
            console.log("Forgot password response for diro.io email:", response);
            setIsSubmitted(true);
            setTimeLeft(30); // Start the 30-second timer
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

  const handleResend = async () => {
    setResending(true);
    setError("");
    
    try {
      // Call forgot password service with resend parameter set to true
      const response = await forgotPassword({ email, resend: true }, router);
      console.log("Resend forgot password response:", response);
      
      // Reset the timer and resend state
      setTimeLeft(30);
      setCanResend(false);
    } catch (err: any) {
      console.error("Error resending forgot password email:", err);
      setError(err.message || "Failed to resend reset email. Please try again.");
    } finally {
      setResending(false);
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
                <div className="relative rounded-3xl bg-white/95 dark:bg-slate-900/80 backdrop-blur-xl p-8 border border-slate-200/50 dark:border-white/10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 dark:from-transparent dark:to-blue-900/10 rounded-3xl pointer-events-none"></div>
                  
                  {/* Card accents */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-t-3xl opacity-80"></div>
                  <div className="absolute -bottom-1 -left-1 w-10 h-10 bg-blue-500/20 dark:bg-blue-500/20 rounded-full blur-xl"></div>
                  <div className="absolute -top-1 -right-1 w-10 h-10 bg-purple-500/20 dark:bg-purple-500/20 rounded-full blur-xl"></div>

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
                            <Alert variant="destructive" className="mb-4 animate-fadeIn transition-all duration-300 ease-in-out bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-300 shadow-sm">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <line x1="12" y1="8" x2="12" y2="12"></line>
                                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <AlertDescription className="font-medium">{error}</AlertDescription>
                              </div>
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
                                      focus:ring-2 focus:ring-blue-500/20
                                      focus:border-0
                                      shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                                      focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                                      transition-all duration-200"
                                  />
                                </div>
                              </div>
                            </div>

                            <Button
                              type="submit"
                              disabled={loading}
                              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] font-medium"
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
                            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center shadow-inner">
                              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Check your email</h2>
                            <p className="text-slate-600 dark:text-gray-300 text-sm max-w-md mx-auto">
                              We have sent password reset instructions to <span className="font-medium text-slate-900 dark:text-white">{email}</span>. Please check your inbox.
                            </p>
                            
                            {/* Timer and Resend Section */}
                            <div className="mt-4">
                              {timeLeft > 0 ? (
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 relative mb-2">
                                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                                      <circle 
                                        className="text-gray-200 dark:text-gray-700" 
                                        strokeWidth="8" 
                                        stroke="currentColor" 
                                        fill="transparent" 
                                        r="40" 
                                        cx="50" 
                                        cy="50" 
                                      />
                                      <circle 
                                        className="text-blue-600 dark:text-blue-400" 
                                        strokeWidth="8" 
                                        strokeDasharray={30 * 8.4} 
                                        strokeDashoffset={((30 - timeLeft) / 30) * 30 * 8.4} 
                                        strokeLinecap="round" 
                                        stroke="currentColor" 
                                        fill="transparent" 
                                        r="40" 
                                        cx="50" 
                                        cy="50"
                                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                                      />
                                    </svg>
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                      <span className="text-xl font-semibold text-slate-700 dark:text-white">{timeLeft}</span>
                                    </div>
                                  </div>
                                  <p className="text-slate-500 dark:text-gray-400 text-sm">
                                    Resend available soon
                                  </p>
                                </div>
                              ) : canResend ? (
                                <div className="flex flex-col items-center space-y-3">
                                  <p className="text-slate-600 dark:text-gray-300 text-sm">
                                    Didn't receive the email? Check your spam folder or try again.
                                  </p>
                                  <Button
                                    variant="outline"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="px-6 py-2 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 rounded-full"
                                  >
                                    {resending ? (
                                      <div className="flex items-center">
                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                        Resending...
                                      </div>
                                    ) : (
                                      <div className="flex items-center">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Resend reset email
                                      </div>
                                    )}
                                  </Button>
                                </div>
                              ) : null}
                            </div>
                            
                            <div className={`mt-3 text-xs text-slate-500 dark:text-gray-400 ${canResend ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
                              <p>If you're still having trouble, please contact <a href="mailto:support@diro.io" className="text-blue-600 dark:text-blue-400 hover:underline">support@diro.io</a></p>
                            </div>
                          </div>

                          <Button
                            onClick={() => router.push("/")}
                            className="h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-[#4b6cb7] dark:to-[#182848] text-white px-8 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] font-medium"
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
