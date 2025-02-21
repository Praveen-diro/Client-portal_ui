"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

export default function TwoFactorPage() {
  const [authMethod, setAuthMethod] = useState("authenticator");
  const [email, setEmail] = useState("");

  const pageTransition = {
    initial: { x: 100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const containerVariants = {
    initial: {
      scale: 0.95,
      boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
    },
    animate: {
      scale: 1,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 right-4 z-10"
      >
        <ThemeToggle />
      </motion.div>

      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col items-center justify-center w-1/2 p-8 bg-slate-100 dark:bg-slate-900"
      >
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Two-Factor Authentication</h1>
          <p className="text-slate-600 dark:text-slate-400">
            For added security, please enter the verification code that was sent to your device.
          </p>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={authMethod}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md"
          >
            <div className="relative">
              <motion.div
                className={cn(
                  "relative rounded-xl bg-white dark:bg-slate-800 p-6",
                  "before:absolute before:top-0 before:left-0 before:w-0 before:h-[2px]",
                  "before:bg-gradient-to-r before:from-transparent before:via-blue-500 before:to-blue-600",
                  "before:animate-[border-top_3s_ease-in-out_infinite]",
                  "after:absolute after:top-0 after:right-0 after:w-[2px] after:h-0",
                  "after:bg-gradient-to-b after:from-transparent after:via-purple-500 after:to-purple-600",
                  "after:animate-[border-right_3s_ease-in-out_infinite]",
                  "[&>span:first-of-type]:absolute [&>span:first-of-type]:bottom-0 [&>span:first-of-type]:right-0 [&>span:first-of-type]:h-[2px] [&>span:first-of-type]:w-0",
                  "[&>span:first-of-type]:bg-gradient-to-l [&>span:first-of-type]:from-transparent [&>span:first-of-type]:via-emerald-500 [&>span:first-of-type]:to-emerald-600",
                  "[&>span:first-of-type]:animate-[border-bottom_3s_ease-in-out_infinite]",
                  "[&>span:last-of-type]:absolute [&>span:last-of-type]:bottom-0 [&>span:last-of-type]:left-0 [&>span:last-of-type]:w-[2px] [&>span:last-of-type]:h-0",
                  "[&>span:last-of-type]:bg-gradient-to-t [&>span:last-of-type]:from-transparent [&>span:last-of-type]:via-yellow-500 [&>span:last-of-type]:to-yellow-600",
                  "[&>span:last-of-type]:animate-[border-left_3s_ease-in-out_infinite]"
                )}
              >
                <span></span>
                <span></span>
                <div className="relative bg-white dark:bg-slate-800 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6 lg:hidden">
                    Two-Factor Authentication
                  </h2>

                  <div className="flex mb-6 bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                    <button
                      onClick={() => setAuthMethod("authenticator")}
                      className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                        authMethod === "authenticator"
                          ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      Authenticator app
                    </button>
                    <button
                      onClick={() => setAuthMethod("email")}
                      className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 ${
                        authMethod === "email"
                          ? "bg-white dark:bg-slate-600 text-gray-900 dark:text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      Email address
                    </button>
                  </div>

                  {authMethod === "authenticator" ? (
                    <div className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-400">
                        Scan QR code from authentication app to add account in Authenticator
                      </p>
                      <div className="flex justify-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <div className="w-48 h-48 bg-gray-200 dark:bg-slate-600 rounded-lg" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-600 dark:text-gray-400 mb-2">Enter your email address*</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 transition-all duration-300"
                          placeholder="Enter your email"
                        />
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Send one-time code</button>
                    </div>
                  )}

                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="block text-gray-600 dark:text-gray-400 mb-2">Verification code*</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 transition-all duration-300"
                        placeholder="Enter the one-time code"
                      />
                    </div>
                    <button className="w-full py-3 px-4 bg-white text-gray-900 rounded-lg border-2 border-gray-900 hover:bg-gray-100 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600 transition-all duration-300">
                      Enable
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
