"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "lucide-react";

export function TwoFactorAuth() {
  const [authMethod, setAuthMethod] = useState("authenticator");
  const [code, setCode] = useState("");

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[80%]"
    >
      {/* Main container with nested glass effect */}
      <div className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl p-8">
        {/* Inner container with deeper glass effect */}
        <div
          className="relative rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md p-6 
          shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_16px_rgba(255,255,255,0.1)]"
        >
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">Two-Factor Authentication</h1>
              <p className="text-gray-300 text-sm">Choose your preferred authentication method</p>
            </div>

            <Tabs value={authMethod} onValueChange={setAuthMethod} className="w-full">
              <TabsList className="w-full mb-8 bg-gray-100/50 dark:bg-white/5 rounded-xl p-1.5 backdrop-blur-sm">
                <TabsTrigger
                  value="authenticator"
                  className="w-full py-3 text-slate-800 dark:text-white 
                    data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 
                    rounded-lg transition-all duration-300"
                >
                  Authenticator app
                </TabsTrigger>
                <TabsTrigger
                  value="email"
                  className="w-full py-3 text-slate-800 dark:text-white 
                    data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 
                    rounded-lg transition-all duration-300"
                >
                  Email address
                </TabsTrigger>
              </TabsList>

              <TabsContent value="authenticator" className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Scan QR code from authentication app to add account in Authenticator
                </p>
                <div className="flex justify-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm">
                  <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 rounded-lg shadow-inner" />
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
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
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="link"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                        flex items-center gap-2 px-0 transition-colors duration-200"
                    >
                      <Send className="h-4 w-4" />
                      <span>Send one-time code</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

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

              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-[#4b6cb7] to-[#182848] hover:opacity-90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Verify
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
