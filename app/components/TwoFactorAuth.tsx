"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TwoFactorAuth() {
  const [code, setCode] = useState("");

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-2xl"
    >
      {/* Main container with nested glass effect */}
      <div className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl p-10">
        {/* Inner container with deeper glass effect */}
        <div
          className="relative rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md p-8 
          shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_16px_rgba(255,255,255,0.1)]"
        >
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Two-Factor Authentication</h1>
              <p className="text-gray-300 text-sm">Please enter the verification code sent to your email</p>
            </div>

            <form className="space-y-6">
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-12 pl-4 
                    bg-white/60 dark:bg-white/5 
                    border-0 dark:border dark:border-white/10 
                    text-slate-800 dark:text-white 
                    placeholder:text-slate-500 dark:placeholder:text-gray-400 
                    rounded-xl 
                    focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/20 
                    focus:border-transparent 
                    transition-all duration-300
                    shadow-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[#4b6cb7] to-[#182848] hover:opacity-90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Verify
              </Button>

              <div className="text-center">
                <Button variant="link" className="text-sm text-gray-300 hover:text-white">
                  Resend Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
