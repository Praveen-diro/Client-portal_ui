"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { orgService } from "@/app/services/org.service";
import { getOrgItem, setError, setLoading } from "@/app/store/features/organizationSlice";
import { getTransactions, billingError, setLoading as setBillingLoading } from "@/app/store/features/billingSlice";
import { billingService } from "@/app/services/billing.service";
import Loader from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";

interface TransactionResponse {
  data: {
    data: Array<{
      id: string;
      amount: number;
      date: string;
      status: string;
    }>;
  };
}

export function BillingSection() {
  const dispatch = useAppDispatch();
  const { requestorg, loading, error } = useAppSelector((state) => state.organization);
  const { transactions, loading: transactionsLoading, error: transactionsError } = useAppSelector((state) => state.billing);
  const nicknamedata = requestorg?.plan?.nicknames || [];

  // Extract data array from transactions object, ensuring it exists and has items
  const transactionData = Array.isArray(transactions?.data) ? transactions.data : [];

  console.log(transactionData.length, "transaction data");

  const transitionConfig = {
    type: "spring",
    stiffness: 70,
    damping: 25,
    restDelta: 0.001,
    mass: 0.5,
  };

  useEffect(() => {
    const fetchBillingOrg = async () => {
      dispatch(setLoading(true));
      try {
        const response = await orgService.getOrgAccount();
        if (response.success && response.data) {
          dispatch(getOrgItem(response.data));

          // After getting org data, fetch transactions using the org's stripe ID
          if (response.data.id) {
            dispatch(setBillingLoading(true));
            const transactionsResponse = await billingService.getTransactions(response.data.id);
            if (transactionsResponse.success && transactionsResponse.data) {
              dispatch(getTransactions({ data: transactionsResponse.data }));
            } else {
              dispatch(billingError(transactionsResponse.error || "Failed to fetch transactions"));
            }
          }
        } else {
          dispatch(setError(response.error || "Failed to fetch billing organization"));
        }
      } catch (error) {
        dispatch(setError(error || "An error occurred while fetching billing organization"));
      }
    };

    fetchBillingOrg();
  }, [dispatch]);

  if (loading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8">
          <Loader />
        </div>
      </div>
    );
  }

  if ((error && Object.keys(error).length > 0) || (transactionsError && typeof transactionsError === "string")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-lg font-medium">
            {typeof (error || transactionsError) === "string" ? error || transactionsError : "Unable to load billing information"}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Please try refreshing the page or contact support if the problem persists.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const redirectusers = async () => {
    if (requestorg?.id) {
      try {
        const response = await billingService.redirectUser(requestorg.id);
        if (!response.success) {
          console.error("Failed to redirect to billing management:", response.error);
        }
      } catch (error) {
        console.error("Error redirecting to billing management:", error);
      }
    } else {
      console.error("Cannot redirect: Organization ID is missing");
    }
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
                <div className="text-3xl font-bold">
                  ${requestorg?.balance || 0} {requestorg?.currency || "USD"}
                </div>
                <div className="mt-4">
                  <Progress value={requestorg?.usage || 0} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{requestorg?.usage || 0} documents submitted</p>
                </div>
                <Button className="mt-4 bg-foreground text-background hover:bg-foreground/90" onClick={redirectusers}>
                  Manage billing
                </Button>
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
                className="flex flex-col gap-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-2xl font-bold">{requestorg?.plan?.name || "Free Plan"}</div>
                    <Badge variant="secondary" className="mt-2">
                      {requestorg?.plan?.status || "Active"}
                    </Badge>
                  </div>
                </div>
                {nicknamedata.length > 0 && (
                  <div className="mt-4">
                    <ul className="space-y-2">
                      {nicknamedata.map((nickname: string, index: number) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {nickname}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            {transactionData && transactionData.length > 0 ? (
              transactionData.map((transaction: any, index: number) => (
                <motion.tr
                  key={transaction.id || index}
                  initial={{ opacity: 0, x: 200 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...transitionConfig, delay: 0.5 + index * 0.1 }}
                >
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>${transaction.amount}</TableCell>
                  <TableCell>{transaction.date ? new Date(transaction.date).toLocaleDateString() : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>{transaction.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}
