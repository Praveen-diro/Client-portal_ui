"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Eye, EyeOff, ArrowLeft, CheckCircle2, Info, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { resetPassword } from "@/app/services/auth.service";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();

  const token = params.id as string;
  const userEmail = decodeURIComponent(params.userEmail as string);

  useEffect(() => {
    // Log the token and email for debugging
    console.log("Reset token:", token);
    console.log("User email:", userEmail);
  }, [token, userEmail]);

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters long
    return password.length >= 8;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    // Validate password
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Call the reset password API
      const response = await resetPassword(
        {
          emailId: token,
          userEmail,
          password: password,
        },
        router
      );

      console.log("Password reset response:", response);
      if (response.status === 200) {
        if (response.data.error) {
          setError(response.data.message);
        } else {
          setIsSubmitted(true);
        }
      }
      setLoading(false);
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "An error occurred. Please try again or request a new reset link.");
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
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
                <h1 className="text-slate-900 dark:text-white text-5xl font-bold leading-tight mb-6">Reset your password</h1>
                <p className="text-slate-600 dark:text-white/80 text-xl leading-relaxed">
                  Create a new password for your account.
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
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Reset Your Password</h2>
                            <p className="text-slate-600 dark:text-gray-300 text-sm">
                              Create a new password for your account. Password must be at least 8 characters long.
                            </p>
                          </div>

                          {error && (
                            <Alert variant="destructive" className="mb-4">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}

                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                              {/* Password */}
                              <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700 dark:text-gray-300">
                                  New Password
                                </Label>
                                <div className="relative">
                                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                  <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password"
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
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 cursor-pointer hover:text-slate-700 dark:hover:text-white" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Password must be at least 8 characters long</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>

                              {/* Confirm Password */}
                              <div className="space-y-2">
                                <Label htmlFor="confirm-password" className="text-slate-700 dark:text-gray-300">
                                  Confirm Password
                                </Label>
                                <div className="relative">
                                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                  <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
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
                                  <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
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
                                "Reset Password"
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
                              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Password Reset Successful</h2>
                            <p className="text-slate-600 dark:text-gray-300 text-sm">
                              Your password has been successfully updated. You can now use your new password to log in.
                            </p>
                          </div>

                          <Button
                            onClick={() => router.push("/")}
                            className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white px-6 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                          >
                            Go to Login
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
