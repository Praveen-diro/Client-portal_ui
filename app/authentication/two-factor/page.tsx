"use client";

import { TwoFactorAuth } from "@/app/components/TwoFactorAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import MainLayout from "@/app/components/MainLayout";

export default function TwoFactorPage() {
  return (
    <MainLayout showSidebar={false}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 right-4 z-10"
      >
        <ThemeToggle />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:flex items-center justify-center h-screen bg-slate-100 dark:bg-slate-900"
      >
        <div className="max-w-lg px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-4xl font-bold mb-4"
          >
            Welcome back!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Please verify your identity with the two-factor authentication code sent to your device.
          </motion.p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-center h-screen p-4 lg:p-8"
      >
        <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
          <TwoFactorAuth />
        </div>
      </motion.div>
    </MainLayout>
  );
}
