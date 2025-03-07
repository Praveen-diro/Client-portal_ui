"use client";

import { motion } from "framer-motion";
import { Pencil, Trash2, ArrowLeftRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const users = [
  {
    name: "pokep5 undefined",
    role: "Developer",
    email: "pokep53423@jonespal.com",
    mobile: "",
  },
  {
    name: "praveensds undefined",
    role: "User",
    email: "redifig204@kindomd.com",
    mobile: "",
  },
  {
    name: "click Here undefined",
    role: "Manager",
    email: "yedap81046@kindomd.com",
    mobile: "",
  },
  {
    name: "praveensds afsdf",
    role: "Admin",
    email: "kabah24495@evimzo.com",
    mobile: "",
  },
  {
    name: "praveen undefined",
    role: "Admin",
    email: "praveen@diro.io",
    mobile: "",
    isOwner: true,
  },
];

export function UsersSection() {
  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: 200 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transitionConfig}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.1 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-2xl font-semibold tracking-tight">User Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.2 }}
        className="rounded-md border"
      >
        <Table>
          <TableHeader>
            <motion.tr
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transitionConfig, delay: 0.3 }}
            >
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </motion.tr>
          </TableHeader>
          <motion.tbody variants={container} initial="hidden" animate="show">
            {users.map((user, index) => (
              <motion.tr key={user.email} variants={item} transition={transitionConfig} className="group">
                <TableCell className="font-medium">
                  {user.name}
                  {user.isOwner && (
                    <Badge variant="secondary" className="ml-2">
                      Owner
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile || "—"}</TableCell>
                <TableCell className="text-right">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-end gap-2"
                  >
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {!user.isOwner && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ArrowLeftRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </motion.div>
                </TableCell>
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
