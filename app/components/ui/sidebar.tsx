"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, Settings, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  onExpandedChange: (expanded: boolean) => void;
}

export function Sidebar({ onExpandedChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  const toggleExpanded = () => {
    setExpanded(!expanded);
    onExpandedChange(!expanded);
  };

  const sidebarItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
    },
    {
      name: "Account",
      href: "/account",
      icon: Settings,
    },
    {
      name: "Billing",
      href: "/billing",
      icon: CreditCard,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-background border-r transition-all duration-300", expanded ? "w-64" : "w-20")}>
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" onClick={toggleExpanded}>
          {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {expanded && <span>{item.name}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
