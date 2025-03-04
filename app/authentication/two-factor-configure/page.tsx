"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { env as Environment } from "../../config/environment";
import { enableTwoFactor } from "@/app/services/auth.service";
import Cookies from "js-cookie";

export default function TwoFactorAuth() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"authenticator" | "email">("authenticator");
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
  const [secretBase32Encoded, setSecretBase32Encoded] = useState("EXAMPLESECRETKEY234567");
  const [otpSent, setOtpSent] = useState(false);
  const [secret, setSecret] = useState("");
  const [twoFactorId, setTwoFactorId] = useState("");
  const [formErrors, setFormErrors] = useState({ otp: "" });
  const [formData, setFormData] = useState({
    otp: "",
    email: "",
  });

  // Mock function to simulate loading QR code data
  const handleAuthenticatorClick = () => {
    setQrCodeLoading(true);
    // Simulate API call to get QR code data
    setTimeout(() => {
      setQrCodeLoading(false);
    }, 1500);
  };

  // Function to handle sending OTP
  const handleSendOTP = () => {
    if (email) {
      setOtpSent(true);
    }
  };

  // Check if URL is valid (used for QR code)
  function isValidUrl(string: string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Validate form input
  const handleValidation = () => {
    let isValid = true;
    const errors = { otp: "" };

    if (!formData.otp) {
      isValid = false;
      errors.otp = "Verification code cannot be empty";
    }

    setFormErrors(errors);
    return isValid;
  };

  // Handle OTP input change
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, otp: e.target.value });
    setCode(e.target.value); // Keep both states in sync
  };

  // Handle authenticator form submission
  const onSubmitAuthenticator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (handleValidation()) {
      enableTwoFactor(email, formData.otp, "Authenticator app", secret, twoFactorId);
      setFormData({ ...formData, otp: "" });
      setCode(""); // Keep both states in sync
    }
  };

  // Handle email form submission
  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (handleValidation()) {
      try {
        // In a real implementation, you would call your API here
        console.log("Submitting email verification with:", {
          email,
          otp: formData.otp,
          selectedOption: "Email address",
          twoFactorId,
        });

        // Mock successful verification
        alert("Verification successful!");

        // Reset the form
        setFormData({ ...formData, otp: "" });
        setCode(""); // Keep both states in sync
      } catch (error) {
        console.error("Error verifying code:", error);
      }
    }
  };

  // Load QR code data when authenticator tab is selected
  useEffect(() => {
    if (activeTab === "authenticator") {
      handleAuthenticatorClick();
    }
  }, [activeTab]);

  return (
    <TooltipProvider>
      <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#182848]">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-[#182848] dark:to-[#4b6cb7] opacity-90" />

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
                  Two-Factor Authentication
                </h1>
                <p className="text-slate-600 dark:text-white/80 text-xl leading-relaxed">
                  For enhanced security, please verify your identity with the code sent to your email.
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
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              {/* Main container with nested glass effect */}
              <div className="relative rounded-3xl overflow-hidden bg-white/90 dark:bg-white/5 backdrop-blur-xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="space-y-6">
                  <div className="space-y-4 text-center">
                    <h2 className="text-2xl font-semibold text-slate-800 dark:text-white">Two-Factor Authentication</h2>
                    <p className="text-slate-600 dark:text-gray-300 text-base">Choose your preferred authentication method</p>
                  </div>

                  {/* Custom Tab Implementation */}
                  <div className="flex gap-4 p-1 rounded-lg bg-slate-100 dark:bg-white/5 shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <button
                      onClick={() => setActiveTab("authenticator")}
                      className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 
                        ${
                          activeTab === "authenticator"
                            ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            : "text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                    >
                      Authenticator app
                    </button>
                    <button
                      onClick={() => setActiveTab("email")}
                      className={`flex-1 py-3 px-4 rounded-lg transition-all duration-200 
                        ${
                          activeTab === "email"
                            ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            : "text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5"
                        }`}
                    >
                      Email address
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "authenticator" ? (
                      <motion.div
                        key="authenticator"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <p className="text-slate-600 dark:text-gray-300 text-sm">
                          Scan QR code from authentication app to add account in Authenticator
                        </p>

                        <div className="bg-slate-100 dark:bg-white/5 rounded-lg p-8 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                          <div
                            className="w-48 h-48 bg-slate-200 dark:bg-white/10 rounded-lg flex items-center justify-center overflow-hidden"
                            style={{
                              position: "relative",
                            }}
                          >
                            <div
                              style={{
                                filter: qrCodeLoading ? "blur(8px)" : "none",
                                transition: "filter 0.3s",
                                backgroundColor: "white",
                                padding: "10px",
                                borderRadius: "8px",
                              }}
                            >
                              <QRCodeSVG
                                value={`otpauth://totp/${encodeURIComponent(
                                  Cookies.get("email") || "user@example.com"
                                )}?secret=${secretBase32Encoded}&issuer=${encodeURIComponent(
                                  `${
                                    isValidUrl(Environment.clientPortalUrl)
                                      ? Environment.clientPortalUrl
                                      : "https://client.diro.io"
                                  }`
                                )}`}
                                size={128}
                              />
                            </div>
                            {qrCodeLoading && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  backgroundColor: "rgba(255, 255, 255, 0)",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        <Input
                          type="text"
                          placeholder="Enter verification code"
                          value={formData.otp}
                          onChange={handleOtpChange}
                          className={`h-12 px-4 
                            bg-slate-100 dark:bg-white/5
                            border-0
                            text-slate-800 dark:text-white
                            placeholder:text-slate-500 dark:placeholder:text-gray-400
                            rounded-lg
                            focus:ring-0
                            focus:border-0
                            shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                            focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                            transition-shadow
                            ${formErrors.otp ? "border border-red-500 dark:border-red-400" : ""}`}
                        />

                        <Button
                          type="submit"
                          onClick={onSubmitAuthenticator}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                        >
                          Verify
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 px-4 
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

                        <div className="flex justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-2 transition-colors hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            onClick={handleSendOTP}
                          >
                            {otpSent ? (
                              <>Code sent</>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Send one-time code
                              </>
                            )}
                          </button>
                        </div>

                        <Input
                          type="text"
                          placeholder="Enter verification code"
                          value={formData.otp}
                          onChange={handleOtpChange}
                          className={`h-12 px-4 
                            bg-slate-100 dark:bg-white/5
                            border-0
                            text-slate-800 dark:text-white
                            placeholder:text-slate-500 dark:placeholder:text-gray-400
                            rounded-lg
                            focus:ring-0
                            focus:border-0
                            shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
                            focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] dark:focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                            transition-shadow
                            ${formErrors.otp ? "border border-red-500 dark:border-red-400" : ""}`}
                        />

                        <Button
                          type="submit"
                          onClick={onSubmitEmail}
                          className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-[#4b6cb7] dark:to-[#182848] text-white rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:hover:opacity-90"
                        >
                          Verify
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
