"use client";

import { motion } from "framer-motion";
import { LogOut, User, Building2, CreditCard } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfileDropdown() {
  const dropdownItems = [
    {
      label: "Organization",
      icon: Building2,
      href: "/account?tab=organization",
    },
    {
      label: "Billing",
      icon: CreditCard,
      href: "/account?tab=billing",
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-8 w-8 rounded-full bg-muted hover:bg-muted/80 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback>PD</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-1">
          <span>change name</span>
          <span className="font-normal text-xs text-muted-foreground">praveen@diro.io</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dropdownItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <DropdownMenuItem className="cursor-pointer">
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
