"use client";

import { useState } from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// =============================
// Dummy Data (Replace with API)
// =============================
const mockRequests = [
  {
    id: "PR-001",
    user: "John Doe",
    amount: 120,
    method: "PayPal",
    transferTo: "john@gmail.com",
    status: "pending",
  },
  {
    id: "PR-002",
    user: "Sarah Khan",
    amount: 75,
    method: "Bank Transfer",
    transferTo: "IBAN •••• 2345",
    status: "pending",
  },
];

export default function PaymentRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);

  // =============================
  // Handlers (API Ready)
  // =============================
  const markAsPaid = async (id: string) => {
    const toastId = toast.loading("Processing payment...");

    try {
      // 👉 future API call here
      setRequests((prev) => prev.filter((req) => req.id !== id));

      toast.success("Payment marked as paid", { id: toastId });
    } catch (error) {
      toast.error("Failed to update payment", { id: toastId });
    }
  };

  const rejectRequest = async (id: string) => {
    const toastId = toast.loading("Rejecting request...");

    try {
      // 👉 future API call here
      setRequests((prev) => prev.filter((req) => req.id !== id));

      toast.success("Payment request rejected", { id: toastId });
    } catch (error) {
      toast.error("Action failed", { id: toastId });
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Payment Requests</h1>
        <p className="text-sm text-muted-foreground">
          Manage users withdrawal requests
        </p>
      </div>

      {/* Warning Box */}
      <div className="mt-3 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertTriangle className="h-5 w-5 mt-0.5" />
        <p className="text-sm">
          <strong>PayPal & Moneypoolscash</strong> support automatic payout APIs,
          so no need to make them manually.
        </p>
      </div>

      {/* Info Box */}
      <div className="mt-3 flex items-start gap-3 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-blue-800 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200">
        <Info className="h-5 w-5 mt-0.5" />
        <p className="text-sm">
            You will need to make the payments from your <strong>Skrill, Bank Account</strong>, etc.
            After making the payment you can mark the payment request as <strong>paid</strong>.
        </p>
        </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Transfer To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm">
                  No payment requests found
                </TableCell>
              </TableRow>
            )}

            {requests.map((req) => (
              <TableRow key={req.id}>
                <TableCell>{req.id}</TableCell>
                <TableCell>{req.user}</TableCell>
                <TableCell>
                  <Badge variant="secondary">${req.amount}</Badge>
                </TableCell>
                <TableCell>{req.method}</TableCell>
                <TableCell>{req.transferTo}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    onClick={() => markAsPaid(req.id)}
                    className="bg-green-600 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Paid
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => rejectRequest(req.id)}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
