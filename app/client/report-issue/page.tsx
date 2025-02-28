"use client";

import { motion } from "framer-motion";
import { Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";

export default function ReportIssuePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

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
                  <motion.div variants={formContainer} initial="hidden" animate="show" className="space-y-6">
                    <motion.div variants={formItem} className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        defaultValue="praveen@diro.io"
                        className="h-9"
                      />
                    </motion.div>

                    <motion.div variants={formItem} className="space-y-2">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        placeholder="Please describe your issue in detail"
                        className="min-h-[150px] resize-none"
                      />
                      <p className="text-sm text-muted-foreground">
                        Include any relevant details that might help us understand and resolve your issue faster.
                      </p>
                    </motion.div>

                    <motion.div variants={formItem} className="flex justify-end">
                      <Button className="w-full sm:w-auto">
                        <Send className="mr-2 h-4 w-4" />
                        Submit Report
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
