"use client";

/**
 * Payment Requests Page (API Ready Structure)
 * -----------------------------------------
 * Ei page ta emon vabe design kora hoise jate:
 * 1. API endpoint change korlei data asbe
 * 2. Pagination / Filter / Action easily connect kora jay
 * 3. Real project e production ready thake
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, CheckCircle, XCircle } from "lucide-react";

// =============================
// Types (Backend contract)
// =============================

type PaymentRequest = {
  id: string;
  userName: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

// =============================
// API Layer (single responsibility)
// =============================

const API_BASE = "/api/payment-requests"; // ekhane shudhu endpoint change korlei hobe

async function fetchPaymentRequests(params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) {
  const query = new URLSearchParams(params as any).toString();
  const res = await fetch(`${API_BASE}?${query}`);
  if (!res.ok) throw new Error("Failed to fetch payment requests");
  return res.json(); // { data, meta }
}

async function approveRequest(id: string) {
  return fetch(`${API_BASE}/${id}/approve`, { method: "POST" });
}

async function rejectRequest(id: string) {
  return fetch(`${API_BASE}/${id}/reject`, { method: "POST" });
}

// =============================
// Page Component
// =============================

export default function PaymentRequestsPage() {
  const [data, setData] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  // =============================
  // Fetch data effect
  // =============================
  useEffect(() => {
    loadData();
  }, [page, status, search]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetchPaymentRequests({
        page,
        limit: 10,
        status: status === "all" ? undefined : status,
        search,
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // =============================
  // Helpers
  // =============================

  const statusBadge = (status: PaymentRequest["status"]) => {
    if (status === "approved") return <Badge className="bg-green-600">Approved</Badge>;
    if (status === "rejected") return <Badge className="bg-red-600">Rejected</Badge>;
    return <Badge className="bg-yellow-500">Pending</Badge>;
  };

  // =============================
  // Render
  // =============================

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Payment Requests</h1>
          <p className="text-sm text-muted-foreground">
            API ready payment & withdrawal request management
          </p>
        </div>
        <Button>
          <DollarSign className="w-4 h-4 mr-2" /> New Request
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by user or request ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>Loading...</TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.userName}</TableCell>
                    <TableCell>${item.amount}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{statusBadge(item.status)}</TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveRequest(item.id).then(loadData)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => rejectRequest(item.id).then(loadData)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
