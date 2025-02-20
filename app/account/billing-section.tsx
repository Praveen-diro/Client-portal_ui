"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function BillingSection() {
  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
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
        <h2 className="text-2xl font-semibold tracking-tight">Billing details</h2>
      </motion.div>
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transitionConfig, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transitionConfig, delay: 0.2 }}
              >
                <div className="text-3xl font-bold">$0 USD</div>
                <p className="text-sm text-muted-foreground mt-2">4 documents submitted</p>
                <Button className="mt-4 bg-foreground text-background hover:bg-foreground/90">Manage billing</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transitionConfig, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...transitionConfig, delay: 0.3 }}
                className="flex justify-between items-start"
              >
                <div>
                  <div className="text-2xl font-bold">Free Plan</div>
                  <Badge variant="secondary" className="mt-2">
                    Active
                  </Badge>
                </div>
                <Button variant="outline">Upgrade Plan</Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.3 }}
        className="rounded-md border"
      >
        <Table>
          <TableHeader>
            <motion.tr
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transitionConfig, delay: 0.4 }}
            >
              <TableHead>Transaction ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </motion.tr>
          </TableHeader>
          <TableBody>
            <motion.tr
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...transitionConfig, delay: 0.5 }}
            >
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No data found...
              </TableCell>
            </motion.tr>
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
