"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User2, Mail, Key, Info, Box, RefreshCw, PenBox, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/validation-buttons");
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#182848] dark:to-[#4b6cb7] opacity-90" />

        {/* Content container */}
        <div className="relative flex min-h-screen z-10">
          {/* Left Section - Updated padding and positioning */}
          <div className="relative hidden w-1/2 lg:block pl-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-full flex flex-col"
            >
              {/* Logo section - Add specific padding */}
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

              {/* Text content section - Add specific padding */}
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
                  Fast track your business with 100% original documents. Eliminate the need for attestations, notary, apostle or
                  even physical document verification.
                </p>
              </motion.div>

              {/* Certificate container - Adjusted spacing */}
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
                      // transformOrigin: "bottom left",
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
                      // transformOrigin: "bottom right",
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
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-2xl">
              {/* Main container with nested glass effect */}
              <div className="relative rounded-3xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl p-10">
                {/* Inner container with deeper glass effect */}
                <div
                  className="relative rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-md p-8 
                  shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_16px_rgba(255,255,255,0.1)]"
                >
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="w-full mb-8 bg-gray-100/50 dark:bg-white/5 rounded-xl p-1.5 backdrop-blur-sm">
                      <TabsTrigger
                        value="login"
                        className="w-full py-3 text-slate-800 dark:text-white 
                          data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 
                          rounded-lg transition-all duration-300"
                      >
                        LOGIN
                      </TabsTrigger>
                      <TabsTrigger
                        value="register"
                        className="w-full py-3 text-white data-[state=active]:bg-white/10 rounded-lg transition-all duration-300"
                      >
                        SIGN UP
                      </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                      <TabsContent value="login" asChild>
                        <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                          <p className="text-gray-300 text-sm">Enter your email and password to access your account</p>

                          <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-300">
                                  Email
                                </Label>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="h-12 pl-10 
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
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-300">
                                  Password
                                </Label>
                                <div className="relative">
                                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    required
                                    className="h-12 pl-10 
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
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="remember"
                                  className="border-0 dark:border-white/20 bg-white/60 dark:bg-white/5 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-white/20 shadow-sm"
                                />
                                <label htmlFor="remember" className="text-sm text-gray-300">
                                  Remember me
                                </label>
                              </div>
                              <Button variant="link" className="text-sm text-gray-300 hover:text-white">
                                Forgot Password
                              </Button>
                            </div>

                            <Button
                              type="submit"
                              className="w-full h-14 bg-gradient-to-r from-[#4b6cb7] to-[#182848] hover:opacity-90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                              Sign In
                            </Button>
                          </form>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="register" asChild>
                        <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                          {/* <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">Sign Up to continue</h2> */}

                          <form onSubmit={handleSubmit} className="space-y-6">
                            {/* First and Last Name */}
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <div className="relative">
                                  <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <Input
                                    id="first-name"
                                    type="text"
                                    placeholder="First name*"
                                    required
                                    className="h-12 pl-10 
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
                              </div>
                              <div className="space-y-2">
                                <div className="relative">
                                  <Input
                                    id="last-name"
                                    type="text"
                                    placeholder="Last name"
                                    className="h-12 pl-10 
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
                              </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="register-email"
                                  type="email"
                                  placeholder="Email Address*"
                                  required
                                  className="h-12 pl-10 
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
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                              <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="register-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Password*"
                                  required
                                  className="h-12 pl-10 
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Password must be at least 8 characters long</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>

                            {/* Company Name */}
                            <div className="space-y-2">
                              <div className="relative">
                                <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  id="company"
                                  type="text"
                                  placeholder="Company name"
                                  className="h-12 pl-10 
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
                            </div>

                            {/* What are you building? */}
                            <div className="space-y-2">
                              <div className="relative">
                                <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Select>
                                  <SelectTrigger
                                    className="h-12 pl-10 
                                      bg-white/60 dark:bg-white/5 
                                      border-0 dark:border dark:border-white/10 
                                      text-slate-800 dark:text-white 
                                      placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                      rounded-xl
                                      focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/20 
                                      focus:border-transparent 
                                      transition-all duration-300
                                      shadow-sm"
                                  >
                                    <SelectValue placeholder="What are you building?" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="web">Web Application</SelectItem>
                                    <SelectItem value="mobile">Mobile Application</SelectItem>
                                    <SelectItem value="desktop">Desktop Application</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* What role are you in? */}
                            <div className="space-y-2">
                              <div className="relative">
                                <PenBox className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Select>
                                  <SelectTrigger
                                    className="h-12 pl-10 
                                      bg-white/60 dark:bg-white/5 
                                      border-0 dark:border dark:border-white/10 
                                      text-slate-800 dark:text-white 
                                      placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                      rounded-xl
                                      focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/20 
                                      focus:border-transparent 
                                      transition-all duration-300
                                      shadow-sm"
                                  >
                                    <SelectValue placeholder="What role are you in?" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="developer">Developer</SelectItem>
                                    <SelectItem value="designer">Designer</SelectItem>
                                    <SelectItem value="manager">Project Manager</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Country Selection */}
                            <div className="space-y-2">
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                                <Select>
                                  <SelectTrigger
                                    className="h-12 pl-10 
                                      bg-white/60 dark:bg-white/5 
                                      border-0 dark:border dark:border-white/10 
                                      text-slate-800 dark:text-white 
                                      placeholder:text-slate-500 dark:placeholder:text-gray-400 
                                      rounded-xl
                                      focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/20 
                                      focus:border-transparent 
                                      transition-all duration-300
                                      shadow-sm"
                                  >
                                    <SelectValue placeholder="Select your country" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="afghanistan">Afghanistan</SelectItem>
                                    {/* Add more countries as needed */}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Privacy Policy Checkbox */}
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="privacy"
                                required
                                className="border-0 dark:border-white/20 bg-white/60 dark:bg-white/5 data-[state=checked]:bg-slate-200 dark:data-[state=checked]:bg-white/20 shadow-sm"
                              />
                              <label htmlFor="privacy" className="text-sm text-gray-300">
                                I confirm that I have read and accepted the DIRO{" "}
                                <Link href="#" className="text-blue-400 hover:text-blue-300">
                                  Privacy Policy
                                </Link>
                              </label>
                            </div>

                            {/* Register Button */}
                            <Button
                              type="submit"
                              className="w-full h-14 bg-gradient-to-r from-[#4b6cb7] to-[#182848] hover:opacity-90 text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                              Register
                            </Button>
                          </form>
                        </motion.div>
                      </TabsContent>
                    </AnimatePresence>
                  </Tabs>
                </div>
              </div>
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
