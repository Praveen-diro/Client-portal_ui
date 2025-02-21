"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Send } from "lucide-react";

const contentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export function TwoFactorAuth() {
  const [method, setMethod] = useState<string>("email");
  const [direction, setDirection] = useState(0);
  const [email, setEmail] = useState<string>("heseb72403@bitflirt.com");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isSending, setSending] = useState(false);
  const [ripple, setRipple] = useState(false);
  const [sent, setSent] = useState(false);
  const { theme } = useTheme();

  const shadowClass =
    theme === "dark"
      ? "shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
      : "shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]";

  const handleTabChange = (newMethod: string) => {
    const methods = ["email", "authenticator"];
    const oldIndex = methods.indexOf(method);
    const newIndex = methods.indexOf(newMethod);
    setDirection(newIndex > oldIndex ? 1 : -1);
    setMethod(newMethod);
  };

  const renderMethodContent = () => {
    switch (method) {
      case "email":
        return (
          <div className="px-4">
            <motion.div
              className="space-y-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <label className="text-sm font-medium">Enter your email address*</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-muted" disabled />
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSending(true);
                    setRipple(true);
                    setTimeout(() => {
                      setSending(false);
                      setTimeout(() => setRipple(false), 800);
                    }, 2000);
                  }}
                  disabled={isSending}
                  className={`relative overflow-hidden transition-all duration-500 ${
                    isSending ? "bg-primary/5 text-primary/50" : "hover:bg-primary/5 text-primary"
                  }`}
                >
                  <div className="flex items-center">
                    {isSending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        <span>Send code</span>
                      </>
                    )}
                  </div>
                  {ripple && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.35 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute inset-0 bg-primary rounded-full"
                      onAnimationComplete={() => setRipple(false)}
                    />
                  )}
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="space-y-3 mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <label className="text-sm font-medium">Verification code*</label>
              <Input
                type="text"
                placeholder="Enter the one-time code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className={`transition-shadow duration-300 ${shadowClass}`}
              />
            </motion.div>
          </div>
        );

      case "authenticator":
        return (
          <div className="px-4 py-2">
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <div className="relative w-full max-w-[180px] aspect-square border-2 border-dashed rounded-lg p-2 flex items-center justify-center">
                <div className="w-full max-w-[140px] aspect-square bg-black rounded-lg" />
              </div>
              <p className="text-sm text-muted-foreground text-center">Scan this QR code with your authentication app</p>
            </motion.div>

            <motion.div
              className="space-y-3 mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.2,
                ease: "easeOut",
              }}
            >
              <label className="text-sm font-medium leading-none">Verification Code</label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className={`text-center text-lg tracking-wider transition-shadow duration-300 ${shadowClass}`}
              />
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-xl mx-auto px-4"
    >
      <Card className={`p-6 space-y-6 backdrop-blur-sm bg-background/95 transition-shadow duration-300 ${shadowClass}`}>
        <motion.div
          className="space-y-2 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Two-Factor Authentication</h2>
          <p className="text-muted-foreground">Select the authentication method:</p>
        </motion.div>

        <div className="space-y-6">
          <Tabs value={method} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="email" className="relative">
                Email
                {method === "email" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger value="authenticator" className="relative">
                Authenticator
                {method === "authenticator" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative h-auto overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={method}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 100, damping: 20, duration: 0.5 },
                  opacity: { duration: 0.3 },
                  layout: { duration: 0.4 },
                }}
                layout
                className="w-full"
              >
                <motion.div layout transition={{ duration: 0.4 }} className="w-full">
                  {renderMethodContent()}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Button className={`w-full transition-shadow duration-300 ${shadowClass}`} size="lg">
              Enable
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
