"use client";

import { motion } from "framer-motion";
import { ProfileDropdown } from "./profile-dropdown";
import { Search, Bell, Settings, LogOut, User, HelpCircle } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Badge } from "./badge";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const transitionConfig = {
    type: "spring",
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
    mass: 1,
  };

  return (
    <div className="border-b border-border/40">
      <div className="container flex h-24 items-center justify-between px-6">
        <motion.div initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} transition={transitionConfig}>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </motion.div>

        <div className="flex items-center gap-4">
          <motion.div
            className="relative w-64"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transitionConfig, delay: 0.1 }}
          >
            {title !== "Requests Sent" &&
              title !== "Documents Received" &&
              title !== "Integrations" &&
              title !== "Manage account" &&
              title !== "Report issue" &&
              title !== "Verification Buttons" && (
                <>
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-10 w-full" />
                </>
              )}
          </motion.div>

          {action && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transitionConfig, delay: 0.15 }}
            >
              {action}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...transitionConfig, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            {/* Notifications */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
                </Button>
              </DropdownMenuTrigger> */}
              {/* <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-start gap-3 py-3 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-muted-foreground">John Doe has registered for your service</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 py-3 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Settings className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Settings updated</p>
                    <p className="text-xs text-muted-foreground">Your account settings have been updated</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-start gap-3 py-3 cursor-pointer">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Support ticket</p>
                    <p className="text-xs text-muted-foreground">New support ticket has been assigned to you</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-blue-600 cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent> */}
            {/* </DropdownMenu> */}

            {/* Profile Dropdown */}
            <ProfileDropdown />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
