"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, X, LifeBuoy, MessageSquarePlus, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { useAppDispatch } from "@/app/store/hooks";
import { submitFeedback } from "@/app/store/features/tableSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("praveen@diro.io");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const isDark = theme === "dark";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    setEmailError(null);
    setCommentError(null);
    setError(null);
    
    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    // Validate comment length
    if (comment.trim().length < 10) {
      setCommentError("Please provide at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(submitFeedback({
        sessionId: "REPORT_ISSUE",
        comment,
        rating: 1,
        email
      })).unwrap();
      
      setShowSuccess(true);
      setComment("");
    } catch (error: any) {
      let errorMessage = "Failed to submit feedback. Please try again.";
      if (error?.status === 401) {
        errorMessage = "You are not authorized. Please login again.";
      } else if (error?.status === 400) {
        errorMessage = "Invalid input. Please check your details.";
      }
      setError(errorMessage);
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset success state after modal is closed
    setTimeout(() => {
      setShowSuccess(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm",
            isDark ? "bg-black/80" : "bg-black/80"
          )}
          onClick={handleClose}
        >
          <motion.div 
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
              }
            }}
            exit={{ 
              opacity: 0, 
              y: 20, 
              scale: 0.95,
              transition: { duration: 0.2 }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit}>
              <Card className={cn(
                "border-0 overflow-hidden shadow-2xl",
                isDark ? "bg-[#1A1F2C]" : "bg-white"
              )}>
                <CardContent className={cn(
                  "p-6 relative",
                  isDark ? "bg-[#1A1F2C]" : "bg-white"
                )}>
                  {!showSuccess && (
                    <>
                      <div className="flex flex-col items-center mb-4">
                        <motion.div 
                          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
                          initial={{ scale: 0.5, opacity: 0, y: 10 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1,
                            y: 0,
                            transition: {
                              delay: 0.1,
                              type: "spring",
                              stiffness: 400,
                              damping: 20
                            }
                          }}
                          whileHover={{ 
                            scale: 1.05,
                            rotate: 5,
                            transition: { duration: 0.2 }
                          }}
                        >
                          <motion.div
                            initial={{ rotate: -20 }}
                            animate={{ rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          >
                            <LifeBuoy className="w-7 h-7 text-white" />
                          </motion.div>
                        </motion.div>
                        <motion.h2 
                          className={cn(
                            "text-lg font-semibold mt-3 mb-1",
                            isDark ? "text-gray-100" : "text-gray-900"
                          )}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          Submit Your Issue
                        </motion.h2>
                        <motion.p
                          className={cn(
                            "text-sm text-center max-w-sm mx-auto mb-2",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          We're here to help! Please provide details about the issue you're experiencing.
                        </motion.p>
                      </div>

                      <motion.button 
                        onClick={handleClose}
                        type="button"
                        className={cn(
                          "absolute right-4 top-4 p-2 rounded-full transition-colors",
                          isDark 
                            ? "text-gray-400 hover:text-gray-300 hover:bg-white/5" 
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        )}
                        whileHover={{ rotate: 90, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </>
                  )}

                  {showSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center justify-center py-6 space-y-4"
                    >
                      <motion.div 
                        className="p-3 bg-green-500/10 dark:bg-green-500/20 rounded-full"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ 
                          scale: 1, 
                          opacity: 1,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 20
                          }
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <CheckCircle2 className="w-10 h-10 text-green-500 dark:text-green-400" />
                      </motion.div>
                      <motion.div 
                        className="space-y-2 text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <motion.h3 
                          className="text-lg font-semibold text-green-500 dark:text-green-400"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          Thank you for your feedback!
                        </motion.h3>
                        <motion.p 
                          className={cn(
                            "text-sm text-center",
                            isDark ? "text-gray-400" : "text-gray-600"
                          )}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          We appreciate your input and will review it shortly.
                        </motion.p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <motion.button
                          type="button"
                          onClick={handleClose}
                          className={cn(
                            "text-sm h-10 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium",
                            "hover:from-green-600 hover:to-green-700"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Close
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="space-y-4"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 p-3 text-sm bg-red-500/10 text-red-500 rounded-lg"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}

                      <motion.div 
                        className="space-y-2"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <Label 
                          htmlFor="email" 
                          className={cn(
                            "text-sm font-medium inline-flex items-center gap-2",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}
                        >
                          <Mail className="w-4 h-4 text-blue-500" />
                          Email address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(null);
                          }}
                          placeholder="Enter your email"
                          className={cn(
                            "h-10 text-sm border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg transition-all duration-200",
                            emailError ? "border-red-500 ring-2 ring-red-500/20" : "",
                            isDark 
                              ? "bg-[#111827] border-gray-700 text-gray-300 placeholder:text-gray-500" 
                              : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                          )}
                          required
                        />
                        {emailError && (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {emailError}
                          </p>
                        )}
                      </motion.div>

                      <motion.div 
                        className="space-y-2"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <Label 
                          htmlFor="comment" 
                          className={cn(
                            "text-sm font-medium inline-flex items-center gap-2",
                            isDark ? "text-gray-300" : "text-gray-700"
                          )}
                        >
                          <MessageSquarePlus className="w-4 h-4 text-blue-500" />
                          Describe your issue
                        </Label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => {
                            setComment(e.target.value);
                            setCommentError(null);
                          }}
                          placeholder="Please describe your issue in detail"
                          className={cn(
                            "text-sm border focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-lg resize-none min-h-[120px] transition-all duration-200",
                            commentError ? "border-red-500 ring-2 ring-red-500/20" : "",
                            isDark 
                              ? "bg-[#111827] border-gray-700 text-gray-300 placeholder:text-gray-500" 
                              : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                          )}
                          required
                        />
                        {commentError ? (
                          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {commentError}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">
                         Include any relevant details that might help us understand and resolve your issue faster.
                          </p>
                        )}
                      </motion.div>

                      <motion.div 
                        className="flex justify-end pt-4"
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className={cn(
                            "text-sm h-10 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium",
                            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-blue-700"
                          )}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Submit report
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 