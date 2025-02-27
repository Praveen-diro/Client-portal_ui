"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "@/components/ui/alert";
import { env } from "@/app/config/environment";
import axios from "axios";
import { twoFactorLogin, sendLoginOtp } from "@/app/store/features/authSlice";
import type { RootState } from "@/app/store/store";
import { authService } from "@/app/services/auth.service";

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

export default function TwoFactorPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, email, twoFactorId, methodId, method, roles, sandboxStatus, loginError } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    let scriptLoaded = false;

    const loadRecaptcha = async () => {
      try {
        await new Promise((resolve, reject) => {
          const existingScript = document.querySelector('script[src*="recaptcha"]');
          if (existingScript) {
            scriptLoaded = true;
            resolve(true);
            return;
          }

          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = `https://www.google.com/recaptcha/api.js?render=${env.Skey}`;
          script.id = "recaptcha-key";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            scriptLoaded = true;
            resolve(true);
          };
          script.onerror = (error) => reject(error);
          document.head.appendChild(script);
        });

        window.grecaptcha?.ready(() => {
          console.log("reCAPTCHA ready");
        });
      } catch (error) {
        console.error("Error loading reCAPTCHA:", error);
        setError("Failed to load reCAPTCHA. Please refresh the page.");
      }
    };

    loadRecaptcha();

    return () => {
      if (scriptLoaded) {
        const script = document.getElementById("recaptcha-key");
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // Clean up reCAPTCHA badge
        const badge = document.querySelector(".grecaptcha-badge");
        if (badge && badge.parentNode) {
          badge.parentNode.removeChild(badge);
        }
      }
    };
  }, []);

  useEffect(() => {
    // Send OTP if method is Email and not sent yet
    if (method === "Email" && !otpSent) {
      handleResendOtp();
    }
  }, [method, methodId]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      if (roles === "Account") {
        router.push("/client/manage-account/billing");
      } else {
        router.push("/client/validation-buttons");
      }
    }
  }, [isAuthenticated, roles, router]);

  const handleResendOtp = async () => {
    try {
      await dispatch(sendLoginOtp({ twoFactorId, methodId }));
      setOtpSent(true);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    }
  };

  const submitData = async (token: string, otp: string) => {
    try {
      // First validate reCAPTCHA using authService
      const recaptchaResponse = await authService.validateRecaptcha(token);
      console.log("reCAPTCHA validation response:", recaptchaResponse);

      // Check if email is diro.io domain or reCAPTCHA score is valid
      if (email?.includes("diro.io") || recaptchaResponse.score >= 0.3) {
        if (!email) {
          setError("Email is required");
          return;
        }

        try {
          // Verify OTP using authService
          const verificationResponse = await authService.verifyTwoFactor(twoFactorId, otp);
          console.log("OTP verification response:", verificationResponse);

          if (verificationResponse.data.success) {
            // If verification is successful, dispatch the login action
            await dispatch(
              twoFactorLogin({
                email,
                otp,
                twoFactorId,
                sandboxStatus,
              })
            );
          } else {
            setError(verificationResponse.data.message || "Verification failed");
          }
        } catch (verificationError: any) {
          console.error("OTP verification error:", verificationError);
          setError(verificationError.response?.data?.message || "Failed to verify OTP");
        }
      } else {
        console.log("Low reCAPTCHA score:", recaptchaResponse.score);
        setError("Security verification failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error during verification:", error);
      setError(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (typeof window.grecaptcha === "undefined") {
        throw new Error("reCAPTCHA not loaded. Please refresh the page.");
      }

      await new Promise((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(env.Skey, { action: "submit" })
            .then((token: string) => {
              submitData(token, code);
              resolve(token);
            })
            .catch((error: any) => {
              console.error("reCAPTCHA execution error:", error);
              setError("reCAPTCHA verification failed. Please try again.");
              setLoading(false);
            });
        });
      });
    } catch (error: any) {
      console.error("Submit error:", error);
      setError(error.message || "An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
        <style>{`
          .grecaptcha-badge { 
            visibility: visible;
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
                    <p className="text-slate-600 dark:text-gray-300">
                      {method === "Email"
                        ? `Enter the verification code sent to ${email}`
                        : "Enter the code from your authenticator app"}
                    </p>
                  </div>

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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-slate-700 dark:text-gray-300">
                          Authentication Code
                        </Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={code}
                            onChange={(value) => setCode(value)}
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
                    </div>

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

                    {method === "Email" && (
                      <div className="text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleResendOtp}
                          disabled={loading}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          Resend Code
                        </Button>
                      </div>
                    )}

                    <div className="text-center">
                      <Link
                        href="/sign-in"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        Return to Sign In
                      </Link>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
