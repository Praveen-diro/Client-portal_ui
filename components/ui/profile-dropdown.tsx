"use client";

import { motion } from "framer-motion";
import { LogOut, User, Building2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteCookie, getCookies } from "cookies-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { store } from "@/app/store/store";


export function ProfileDropdown() {
  const router = useRouter();
  const alldatastate = store.getState().auth.alldata;
  console.log("user data in profile dropdown", alldatastate);

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

  const handleLogout = () => {
    // Get all cookies and clear them one by one
    const cookies = getCookies();

    // Check if cookies is an object before trying to iterate
    if (cookies && typeof cookies === "object") {
      Object.keys(cookies).forEach((cookieName) => {
        deleteCookie(cookieName);
      });
    }

    // Instead of router.push, use window.location to force a complete page reload
    window.location.href = "/";
  };

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
          <p className="text-sm font-medium">{alldatastate?.name}</p>
          <span className="font-normal text-xs text-muted-foreground">{alldatastate?.email}</span>
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
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
