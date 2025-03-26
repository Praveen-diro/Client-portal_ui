"use client";

import { motion } from "framer-motion";
import { Send, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { submitFeedback } from "@/app/store/features/tableSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReportIssuePage() {
  const dispatch = useAppDispatch();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [email, setEmail] = useState("praveen@diro.io");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

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
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const transitionConfig = {
    type: "spring",
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
    mass: 1,
  };

  const formContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        staggerDirection: 1,
        when: "beforeChildren",
      },
    },
  };

  const formItem = {
    hidden: { opacity: 0, x: 200 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 20,
        mass: 1,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <div className="flex-1">
          <PageHeader
            title="Report an Issue"
            description="We're here to help! Please provide details about the issue you're experiencing."
          />

          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transitionConfig, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Issue</CardTitle>
                  <CardDescription>
                    We're here to help! Please provide details about the issue you're experiencing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showSuccess && (
                    <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription className="ml-2">
                        Thank you for your feedback! Your issue has been reported successfully.
                      </AlertDescription>
                    </Alert>
                  )}
                  <motion.form onSubmit={handleSubmit} variants={formContainer} initial="hidden" animate="show" className="space-y-6">
                    <motion.div variants={formItem} className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-9"
                        required
                      />
                    </motion.div>

                    <motion.div variants={formItem} className="space-y-2">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Please describe your issue in detail"
                        className="min-h-[150px] resize-none"
                        required
                      />
                      <p className="text-sm text-muted-foreground">
                        Include any relevant details that might help us understand and resolve your issue faster.
                      </p>
                    </motion.div>

                    <motion.div variants={formItem} className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Report
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
