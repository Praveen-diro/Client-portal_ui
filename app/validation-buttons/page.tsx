"use client";

import { motion } from "framer-motion";
import { Download, FileText, Globe, Info, LayoutGrid, Link2, Search, Plus, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PageHeader } from "@/components/ui/page-header";
import { Sidebar } from "@/components/ui/sidebar";

const buttons = [
  {
    id: 1,
    name: "Direct link",
    category: "Address",
    invites: 0,
    documents: 5,
    lastModified: "2 Weeks ago",
  },
  {
    id: 2,
    name: "Lock navigator",
    category: "Bank",
    invites: 0,
    documents: 0,
    lastModified: "2 Weeks ago",
  },
  {
    id: 3,
    name: "Bank download green",
    category: "Bank",
    invites: 0,
    documents: 75,
    lastModified: "3 Days ago",
  },
  {
    id: 4,
    name: "Multidownload + Livefeedback",
    category: "Bank",
    invites: 0,
    documents: 5,
    lastModified: "1 Month ago",
  },
];

const statsCards = [
  {
    title: "Buttons Overview",
    mainValue: "7",
    subValue: "7 Active",
    description: "Total Buttons",
    icon: LayoutGrid,
    color: "blue",
    subValueColor: "text-green-500",
  },
  {
    title: "Documents Received",
    mainValue: "235",
    subValue: "33.57 Avg. per Button",
    description: "Total Documents",
    icon: FileText,
    color: "teal",
    subValueColor: "text-teal-500",
  },
  {
    title: "Category Breakdown",
    mainValue: "3",
    secondaryValue: "4",
    description: "Address",
    secondaryDescription: "Bank",
    icon: Globe,
    color: "green",
  },
];

export default function ValidationButtons() {
  const pathname = usePathname();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    setShouldAnimate(true);
    const timer = setTimeout(() => {
      setShouldAnimate(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const initialAnimation = shouldAnimate ? { opacity: 0, x: 200 } : { opacity: 1, x: 0 };

  // Separate transition config for header elements
  const headerTransitionConfig = {
    type: "spring",
    stiffness: 50, // Reduced stiffness for smoother motion
    damping: 30, // Increased damping to prevent bouncing
    restDelta: 0.001,
    mass: 1, // Increased mass for more stability
  };

  // Main content transition config
  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-none">
        <Sidebar expanded={sidebarExpanded} onExpandedChange={setSidebarExpanded} />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarExpanded ? "ml-64" : "ml-16"}`}>
        <TooltipProvider>
          <div className="flex-1 relative">
            <PageHeader title="Verification Buttons" description="Manage and monitor your verification button performance" />
            <div className="container mx-auto px-6 py-8">
              <motion.div
                className="flex justify-end mb-6"
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={headerTransitionConfig}
              >
                <Button className="bg-foreground text-background hover:bg-foreground/90">
                  <Plus className="mr-2 h-4 w-4" /> Create Button
                </Button>
              </motion.div>

              <div className="grid grid-cols-3 gap-6">
                {statsCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={initialAnimation}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      ...transitionConfig,
                      delay: index * 0.1,
                    }}
                  >
                    <Card className="relative overflow-hidden h-[160px]">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <motion.div
                          initial={initialAnimation}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...transitionConfig,
                            delay: index * 0.1 + 0.1,
                          }}
                        >
                          <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                        </motion.div>
                        <card.icon className={`h-4 w-4 text-${card.color}-500`} />
                      </CardHeader>
                      <CardContent className="pt-2">
                        <motion.div
                          initial={initialAnimation}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            ...transitionConfig,
                            delay: index * 0.1 + 0.2,
                          }}
                        >
                          {card.secondaryValue ? (
                            <div className="flex justify-between items-start pt-2">
                              <div className="text-center flex-1">
                                <div className="text-3xl font-bold">{card.mainValue}</div>
                                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                              </div>
                              <div className="text-center flex-1">
                                <div className="text-3xl font-bold">{card.secondaryValue}</div>
                                <p className="text-xs text-muted-foreground mt-1">{card.secondaryDescription}</p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-3xl font-bold">{card.mainValue}</div>
                              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
                              {card.subValue && (
                                <p className={`text-sm mt-2 ${card.subValueColor} font-medium`}>{card.subValue}</p>
                              )}
                            </>
                          )}
                        </motion.div>
                        <div className={`absolute bottom-0 left-0 h-1 w-full bg-${card.color}-500/20`} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={initialAnimation}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  ...transitionConfig,
                  delay: 0.3,
                }}
                className="rounded-lg border bg-card shadow-sm mt-6"
              >
                <Table>
                  <TableHeader>
                    <motion.tr
                      className="hover:bg-transparent"
                      initial={initialAnimation}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        ...transitionConfig,
                        delay: 0.4,
                      }}
                    >
                      <TableHead>Name</TableHead>
                      <TableHead>Category & Type</TableHead>
                      <TableHead>Invites waiting</TableHead>
                      <TableHead>Documents received</TableHead>
                      <TableHead>Last modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </motion.tr>
                  </TableHeader>
                  <TableBody>
                    {buttons.map((button, index) => (
                      <motion.tr
                        key={`button-${button.id}`}
                        className="group hover:bg-muted/50"
                        initial={initialAnimation}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          ...transitionConfig,
                          delay: 0.5 + index * 0.05,
                        }}
                      >
                        <TableCell className="font-medium">{button.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Download
                              className={`h-4 w-4 ${button.category === "Address" ? "text-green-500" : "text-blue-500"}`}
                            />
                            <Badge
                              variant="outline"
                              className={
                                button.category === "Address"
                                  ? "border-green-500 text-green-700"
                                  : "border-blue-500 text-blue-700"
                              }
                            >
                              {button.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {button.invites > 0 ? (
                            <Badge variant="secondary">{button.invites}</Badge>
                          ) : (
                            <span className="text-muted-foreground">No invites</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{button.documents}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{button.lastModified}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                  <Link2 className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy link</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                  <Info className="h-4 w-4 text-blue-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit Button</DropdownMenuItem>
                                <DropdownMenuItem>View Analytics</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete Button</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            </div>
          </div>
        </TooltipProvider>
      </main>
    </div>
  );
}
