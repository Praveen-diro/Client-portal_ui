"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { default as DOMPurify } from "dompurify";

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
import { useDispatch, useSelector } from "react-redux";
import {
  loginSuccess,
  loginFail,
  loginAuthenticated,
  loginSandbox,
  registerSuccess,
  registerFail,
} from "./store/features/authSlice";
import { authService } from "./services/auth.service";
import { env } from "./config/environment";
import { Alert } from "@/components/ui/alert";
import type { RootState } from "./store/store";

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

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
  companyname: string;
  building: string;
  roleincompany: string;
}

interface RecaptchaResponse {
  score: number;
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

// Add success message component
const SuccessMessage = ({ message, onRedirect }: { message: string; onRedirect: () => void }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      onRedirect();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onRedirect]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 dark:from-[#182848]/90 dark:via-[#2a3f65]/80 dark:to-[#4b6cb7]/70 p-0 shadow-xl border border-gray-100/80 dark:border-[#4b6cb7]/30 backdrop-blur-sm"
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-500 dark:to-[#4b6cb7]"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-500/10 dark:bg-green-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 dark:bg-[#4b6cb7]/20 rounded-full blur-xl"></div>

        <div className="p-8 relative">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="rounded-full bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-500 dark:to-[#4b6cb7] p-5 shadow-lg shadow-green-500/20 dark:shadow-[#4b6cb7]/30"
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="space-y-4 max-w-md">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-[#4b6cb7] bg-clip-text text-transparent"
              >
                Registration Successful!
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed"
              >
                <p className="mb-2">{message}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                  Please check your inbox and spam folder if you don't see our email.
                </p>
              </motion.div>
            </div>

            {/* Animated line separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-[#4b6cb7]/50 to-transparent"
            />

            {/* Footer with countdown and button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="w-full flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
            >
              <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-300">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <p className="text-sm">
                  Redirecting to login in{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{countdown}</span> seconds
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRedirect}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-[#4b6cb7] dark:to-[#182848] dark:hover:from-[#3b5a9e] dark:hover:to-[#182848] text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Go to Login Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    password: "",
    confirmPassword: "",
    companyname: "",
    building: "",
    roleincompany: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    isAuthenticated,
    loading: authLoading,
    loginError,
    isTwoFactor,
    roles,
    registermsg,
    registersucc,
  } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Redirect already authenticated users to dashboard
    if (isAuthenticated) {
      console.log("User already authenticated, redirecting to dashboard");
      router.push("/client/validation-buttons");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Load reCAPTCHA script
    const loadScriptByURL = (id: string, url: string, callback: () => void) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = callback;
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${env.Skey}`, () =>
      console.log("Script loaded!")
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated in main page, redirecting to dashboard");
      console.log("Roles:", roles);

      if (roles === "Account") {
        console.log("Account role detected, redirecting to /client/account");
        router.push("/client/account");
      } else {
        console.log("Non-Account role, redirecting to /client/validation-buttons");
        router.push("/client/validation-buttons");
      }
    } else if (isTwoFactor) {
      console.log("User needs two-factor authentication, redirecting to two-factor page");
      router.push("authentication/two-factor");
    }
  }, [isAuthenticated, isTwoFactor, roles, router]);

  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input).replace(/[<>]/g, "");
  };

  const handleValidation = (captchaScore: number) => {
    let errors: Record<string, string> = {};
    let formIsValid = true;

    if (!formData.firstname) {
      formIsValid = false;
      errors.firstname = "First name is required";
    }

    if (!formData.password) {
      formIsValid = false;
      errors.password = "Password is required";
    }

    if (!formData.confirmPassword) {
      formIsValid = false;
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      formIsValid = false;
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.email) {
      formIsValid = false;
      errors.email = "Email is required";
    } else {
      const lastAtPos = formData.email.lastIndexOf("@");
      const lastDotPos = formData.email.lastIndexOf(".");
      const corporateEmail =
        formData.email.includes("@hotmail.co") ||
        formData.email.includes("@outlook.co") ||
        formData.email.includes("@live.co") ||
        formData.email.includes("@gmail.com") ||
        formData.email.includes("@yahoo.co");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          formData.email.indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          formData.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors.email = "Email is not valid";
      } else if (corporateEmail) {
        formIsValid = false;
        errors.email = "Please provide your corporate email";
      }
    }

    if (captchaScore < 0.6) {
      formIsValid = false;
      errors.recaptcha = "Only humans allowed";
    }

    setError(Object.values(errors)[0] || "");
    return formIsValid;
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Execute reCAPTCHA
      const token = await window.grecaptcha.execute(env.Skey, { action: "submit" });

      // Validate reCAPTCHA
      const recaptchaResponse = await authService.validateRecaptcha(token);

      if (handleValidation(recaptchaResponse.score)) {
        const response = await authService.register(formData);

        if (response.data?.error) {
          setError(response.data.message || "Registration failed");
        } else if (response.data?.message === "plz check you email") {
          setSuccessMessage("Please check your email for verification instructions. We've sent you an email with next steps.");
          // Clear form data
          setFormData({
            firstname: "",
            lastname: "",
            email: "",
            country: "",
            password: "",
            confirmPassword: "",
            companyname: "",
            building: "",
            roleincompany: "",
          });
          // Redirect to login tab after 6 seconds
          setTimeout(() => {
            setActiveTab("login");
            setSuccessMessage("");
          }, 10000);
        } else {
          // Handle other successful responses
          setActiveTab("login");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Execute reCAPTCHA
      const token = await window.grecaptcha.execute(env.Skey, { action: "submit" });

      // Validate reCAPTCHA
      const recaptchaResponse = await authService.validateRecaptcha(token);

      if (recaptchaResponse.score >= 0.3 || email.includes("diro.io")) {
        // Attempt login
        const response = await authService.login({ email, password });
        // const response = { data: { statusCode: 242, sandbox: false, error: false } };

        if (response.data?.error === true) {
          dispatch(loginFail({ payload: response.data }));
          setError(response.data?.message || "Login failed");
        } else if (response.data.statusCode === 242) {
          // Set cookie to allow access to 2FA page
          document.cookie = "requiresTwoFactor=true; path=/";

          if (response.data.sandbox === false || response.data.sandbox === "1") {
            dispatch(
              loginAuthenticated({
                headers: response.headers,
                payload: response.data,
                email,
              })
            );
          } else {
            dispatch(
              loginSandbox({
                headers: response.headers,
                payload: response.data,
                email,
              })
            );
          }
        } else {
          dispatch(loginFail({ payload: response.data }));
          setError(response.data.message || "Login failed");
        }
      } else {
        setError("reCAPTCHA verification failed");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred during login");
      dispatch(loginFail({ payload: err.response?.data?.message }));
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "password" ? value : sanitizeInput(value),
    });
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

          {/* Right Section - Modified for vertical alignment based on active tab */}
          <div className="flex-1 flex justify-center p-6 lg:p-12 bg-transparent">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`w-full max-w-2xl ${activeTab === "login" ? "self-center" : "self-start mt-4"}`}
            >
              {/* Main container with floating card design */}
              <div className="relative w-full">
                {/* Decorative accent elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-xl"></div>

                {/* Main card container */}
                <div
                  className="relative rounded-3xl bg-white dark:bg-slate-900/70 backdrop-blur-xl p-6 
                    border border-slate-200/50 dark:border-white/10
                    shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
                >
                  {/* Subtle pattern overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/30 dark:from-transparent dark:to-blue-900/10 rounded-3xl pointer-events-none"></div>

                  <div className="relative z-10">
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-white text-center mb-6">
                      {activeTab === "login" ? "Welcome Back" : "Create Account"}
                    </h1>
                    <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="w-full mb-4 bg-slate-100 dark:bg-white/5 rounded-xl p-1.5 backdrop-blur-sm">
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
                          className="w-full py-3 text-slate-600 dark:text-white/80 data-[state=active]:text-slate-800 dark:data-[state=active]:text-white data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 rounded-lg transition-all duration-300"
                        >
                          SIGN UP
                        </TabsTrigger>
                      </TabsList>

                      <AnimatePresence>
                        <TabsContent key="login" value="login" asChild>
                          <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            {error && (
                              <Alert variant="destructive" className="mb-4">
                                <p>{error}</p>
                              </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <Label htmlFor="email" className="text-slate-700 dark:text-gray-300">
                                    Email
                                  </Label>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="email"
                                      name="email"
                                      type="email"
                                      placeholder="Enter your email"
                                      required
                                      className="h-11 pl-10 
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
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <Label htmlFor="password" className="text-slate-700 dark:text-gray-300">
                                    Password
                                  </Label>
                                  <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Enter your password"
                                      required
                                      className="h-11 pl-10 
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
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {/* <Checkbox
                                    id="remember"
                                    className="border-0 bg-slate-100 dark:bg-white/5 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                  />
                                  <label htmlFor="remember" className="text-sm text-slate-600 dark:text-gray-300">
                                    Remember me
                                  </label> */}
                                </div>
                                <Link href="/authentication/forgotpassword">
                                  <Button
                                    variant="link"
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0"
                                  >
                                    Forgot Password
                                  </Button>
                                </Link>
                              </div>

                              <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                              >
                                {loading ? (
                                  <div className="flex items-center justify-center">
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Signing in...
                                  </div>
                                ) : (
                                  "Sign In"
                                )}
                              </Button>
                            </form>
                          </motion.div>
                        </TabsContent>

                        <TabsContent key="register" value="register" asChild>
                          <motion.div
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-4"
                          >
                            {successMessage ? (
                              <SuccessMessage
                                message={successMessage}
                                onRedirect={() => {
                                  setActiveTab("login");
                                  setSuccessMessage("");
                                }}
                              />
                            ) : (
                              <form onSubmit={handleRegister} className="space-y-4">
                                {error && (
                                  <Alert variant="destructive" className="mb-4">
                                    <p>{error}</p>
                                  </Alert>
                                )}

                                {/* First and Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <div className="relative">
                                      <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                      <Input
                                        id="first-name"
                                        name="firstname"
                                        type="text"
                                        placeholder="First name*"
                                        required
                                        value={formData.firstname}
                                        onChange={onChange}
                                        className="h-11 pl-10 
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
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="relative">
                                      <Input
                                        id="last-name"
                                        name="lastname"
                                        type="text"
                                        placeholder="Last name"
                                        value={formData.lastname}
                                        onChange={onChange}
                                        className="h-11 pl-10 
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
                                    </div>
                                  </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="register-email"
                                      name="email"
                                      type="email"
                                      placeholder="Email Address*"
                                      required
                                      value={formData.email}
                                      onChange={onChange}
                                      className="h-11 pl-10 
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
                                  </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="register-password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Password*"
                                      required
                                      value={formData.password}
                                      onChange={onChange}
                                      className="h-11 pl-10 
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
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="register-confirm-password"
                                      name="confirmPassword"
                                      type="text"
                                      placeholder="Confirm Password*"
                                      required
                                      value={formData.confirmPassword}
                                      onChange={onChange}
                                      className="h-11 pl-10 
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
                                  </div>
                                </div>

                                {/* Company Name */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <Box className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400" />
                                    <Input
                                      id="company"
                                      name="companyname"
                                      type="text"
                                      placeholder="Company name"
                                      value={formData.companyname}
                                      onChange={onChange}
                                      className="h-11 pl-10 
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
                                  </div>
                                </div>

                                {/* What are you building? */}
                                <div className="space-y-1">
                                  <div className="relative">
                                    <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 z-10" />
                                    <Select
                                      name="building"
                                      onValueChange={(value) => setFormData({ ...formData, building: value })}
                                    >
                                      <SelectTrigger
                                        className="h-11 pl-10 
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
                                <div className="space-y-1">
                                  <div className="relative">
                                    <PenBox className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 z-10" />
                                    <Select
                                      name="roleincompany"
                                      onValueChange={(value) => setFormData({ ...formData, roleincompany: value })}
                                    >
                                      <SelectTrigger
                                        className="h-11 pl-10 
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
                                <div className="space-y-1">
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-gray-400 z-10" />
                                    <Select
                                      name="country"
                                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                                    >
                                      <SelectTrigger
                                        className="h-11 pl-10 
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
                                    className="border-0 bg-slate-100 dark:bg-white/5 data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                                  />
                                  <label htmlFor="privacy" className="text-sm text-slate-600 dark:text-gray-300">
                                    I confirm that I have read and accepted the DIRO{" "}
                                    <Link
                                      href="#"
                                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                    >
                                      Privacy Policy
                                    </Link>
                                  </label>
                                </div>

                                {/* Register Button */}
                                <Button
                                  type="submit"
                                  disabled={loading}
                                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                                >
                                  {loading ? (
                                    <div className="flex items-center justify-center">
                                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                      Registering...
                                    </div>
                                  ) : (
                                    "Register"
                                  )}
                                </Button>
                              </form>
                            )}
                          </motion.div>
                        </TabsContent>
                      </AnimatePresence>
                    </Tabs>
                  </div>
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
