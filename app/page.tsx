"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TooltipProvider } from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User2, Mail, Key, Info, Box, RefreshCw, PenBox, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

const formVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
    },
  },
}

const inputVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    router.push("/validation-buttons")
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        {/* Left Section */}
        <div className="relative hidden w-1/2 lg:block bg-gray-50 dark:bg-gray-800">
          <div className="relative h-full flex flex-col p-12">
            <div className="flex items-center gap-2 mb-8">
              <a href="https://diro.io/">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
                  alt="logo"
                  className="h-8"
                />
              </a>
              <span className="text-[#00BCD4] text-lg font-medium">Beta</span>
            </div>

            <div className="max-w-lg mb-8">
              <h1 className="text-[#1B365D] dark:text-white text-5xl font-bold leading-tight mb-6">
                Get instant original documents online
              </h1>
              <p className="text-[#6B7280] dark:text-gray-300 text-xl leading-relaxed">
                Fast track your business with 100% original documents. Eliminate the need for attestations, notary,
                apostle or even physical document verification.
              </p>
            </div>

            <div className="relative flex-grow mt-2 overflow-hidden">
              <motion.div className="absolute bottom-0 left-0 w-full h-full">
                <motion.img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-login-HdowIu9Kyhep2y9j1G27A0Ueq0Z6Qk.png"
                  alt="Certificate preview 1"
                  className="absolute bottom-0 left-[5%] w-[75%] h-auto"
                  style={{
                    filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                    transformOrigin: "bottom left",
                  }}
                  initial={{ rotate: -6, zIndex: 2 }}
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
                  className="absolute bottom-0 left-[25%] w-[75%] h-auto"
                  style={{
                    filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                    transformOrigin: "bottom right",
                  }}
                  initial={{ rotate: 6, scale: 1, zIndex: 1 }}
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
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          <motion.div
            className="flex-1 flex items-center justify-center p-6 lg:p-12 pt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-full max-w-md space-y-8">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="login" className="w-full">
                    LOGIN
                  </TabsTrigger>
                  <TabsTrigger value="register" className="w-full">
                    SIGN UP
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <TabsContent value="login" asChild>
                    <motion.div
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6"
                    >
                      <motion.div variants={inputVariants} className="space-y-2">
                        <p className="text-muted-foreground">Enter your email and password to access your account</p>
                      </motion.div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              required
                              className="h-10 input-shadow"
                            />
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                required
                                className="h-10 input-shadow"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </motion.div>
                        </div>

                        <motion.div variants={inputVariants} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                              htmlFor="remember"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Remember me
                            </label>
                          </div>
                          <Button variant="link" className="text-sm">
                            Forgot Password
                          </Button>
                        </motion.div>

                        <motion.div variants={inputVariants} className="pt-2">
                          <Button
                            type="submit"
                            className="w-full h-10 text-sm bg-[rgb(91,200,219)] hover:bg-[rgb(82,180,197)] text-white"
                          >
                            Sign In
                          </Button>
                        </motion.div>
                      </form>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="register" asChild>
                    <motion.div
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6 pt-8"
                    >
                      <motion.div variants={inputVariants} className="space-y-2">
                        <p className="text-muted-foreground">Enter your details to create your account</p>
                      </motion.div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <motion.div variants={inputVariants} className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="first-name">First name*</Label>
                              <div className="relative">
                                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                                <Input id="first-name" type="text" required className="h-10 pl-10 input-shadow" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="last-name">Last name</Label>
                              <Input id="last-name" type="text" className="h-10 input-shadow" />
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="register-email">Email Address*</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                              <Input id="register-email" type="email" required className="h-10 pl-10 input-shadow" />
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="register-password">Password*</Label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                              <Input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="h-10 pl-10 input-shadow"
                              />
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                  >
                                    <Info className="h-4 w-4 text-gray-500" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Password must be at least 8 characters long</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="company">Company name</Label>
                            <div className="relative">
                              <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                              <Input id="company" type="text" className="h-10 pl-10 input-shadow" />
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="building">What are you building?</Label>
                            <div className="relative">
                              <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                              <Select>
                                <SelectTrigger className="h-10 pl-10 input-shadow">
                                  <SelectValue placeholder="Select what you're building" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="web">Web Application</SelectItem>
                                  <SelectItem value="mobile">Mobile Application</SelectItem>
                                  <SelectItem value="desktop">Desktop Application</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="role">What role are you in?</Label>
                            <div className="relative">
                              <PenBox className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                              <Select>
                                <SelectTrigger className="h-10 pl-10 input-shadow">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="developer">Developer</SelectItem>
                                  <SelectItem value="designer">Designer</SelectItem>
                                  <SelectItem value="manager">Project Manager</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                              <Select defaultValue="india">
                                <SelectTrigger className="h-10 pl-10 input-shadow">
                                  <SelectValue placeholder="Select your country" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="india">India</SelectItem>
                                  <SelectItem value="us">United States</SelectItem>
                                  <SelectItem value="uk">United Kingdom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </motion.div>

                          <motion.div variants={inputVariants} className="flex items-start space-x-2">
                            <Checkbox id="privacy" required className="mt-1" />
                            <label htmlFor="privacy" className="text-sm text-muted-foreground">
                              I confirm that I have read and accepted the DIRO{" "}
                              <Link href="#" className="text-blue-500 hover:underline">
                                Privacy Policy
                              </Link>
                            </label>
                          </motion.div>
                        </div>

                        <motion.div variants={inputVariants} className="pt-2">
                          <Button
                            type="submit"
                            className="w-full h-10 text-sm bg-[rgb(91,200,219)] hover:bg-[rgb(82,180,197)] text-white"
                          >
                            Register
                          </Button>
                        </motion.div>
                      </form>
                    </motion.div>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </div>
          </motion.div>
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

