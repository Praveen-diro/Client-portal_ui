"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TwoFactorAuth } from "@/components/ui/two-factor-auth";

export default function TwoFactorPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848]">
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
        className="hidden lg:flex flex-col items-center justify-center w-1/2 p-8"
      >
        <div className="max-w-lg">
          <h1 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">Two-Factor Authentication</h1>
          <p className="text-slate-600 dark:text-gray-100">
            For added security, please enter the verification code that was sent to your device.
          </p>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <TwoFactorAuth />
      </div>
    </div>
  );
}
