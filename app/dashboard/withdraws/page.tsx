"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* =======================
   Types
======================= */
type Withdraw = {
  _id: string;
  amount: number;
  method: string;
  status: "pending" | "approved" | "rejected";
  note?: string;
  createdAt: string;
  account?: string;
  userId?: {
    name: string;
    username: string;
    uid?: string;
    profilePic?: string;
  };
};

type Cursor = {
  createdAt: string;
  _id: string;
} | null;

/* =======================
   Component
======================= */
export default function AdminWithdrawPage() {
  const LIMIT = 10;

  const [items, setItems] = useState<Withdraw[]>([]);
  const [status, setStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [cursor, setCursor] = useState<Cursor>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [actionWd, setActionWd] = useState<Withdraw | null>(null);
  const [note, setNote] = useState("");
  const [actionType, setActionType] = useState<
    "approve" | "reject" | null
  >(null);

  /* =======================
     Fetch Withdraws
  ======================= */
  const fetchWithdraws = async (reset = false) => {
    try {
      setLoading(true);

      const res = await api.get("/admin/all-withdraw", {
        params: {
          status,
          limit: LIMIT,
          cursor: reset ? null : cursor,
        },
      });

      console.log("withdraw mony",res.data);
      

      if (res.data?.ok) {
        setItems((prev) =>
          reset ? res.data.items : [...prev, ...res.data.items],
        );
        setCursor(res.data.nextCursor);
        setHasMore(Boolean(res.data.nextCursor));
      }
    } catch {
      toast.error("Failed to load withdraws");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setItems([]);
    setCursor(null);
    fetchWithdraws(true);
  }, [status]);

  /* =======================
     Actions
  ======================= */
  const submitAction = async () => {
    if (!actionWd || !actionType) return;

    try {
      const url = `/admin/${actionWd._id}/${actionType}`;
      await api.patch(url, { note });

      toast.success(
        actionType === "approve"
          ? "Withdraw approved"
          : "Withdraw rejected",
      );

      setItems((prev) =>
        prev.filter((w) => w._id !== actionWd._id),
      );
      setActionWd(null);
      setNote("");
      setActionType(null);
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Action failed",
      );
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Withdraw Requests
        </h1>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as any)
          }
          className="border rounded px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3">#</th>
              <th className="border px-4 py-3">
                User
              </th>
              <th className="border px-4 py-3">
                Amount
              </th>
              <th className="border px-4 py-3">
                Method
              </th>
              <th className="border px-4 py-3">
                Status
              </th>
              <th className="border px-4 py-3">
                Date
              </th>
              <th className="border px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((w, i) => (
              <tr key={w._id}>
                <td className="border px-4 py-2">
                  {i + 1}
                </td>

                <td className="border px-4 py-2">
                  <div className="font-medium">
                    {w.userId?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    @{w.userId?.username}
                  </div>
                </td>

                <td className="border px-4 py-2 font-semibold">
                  ৳ {w.amount}
                </td>

                <td className="border px-4 py-2">
                  {w.method}
                </td>

                <td className="border px-4 py-2 capitalize">
                  {w.status}
                </td>

                <td className="border px-4 py-2">
                  {new Date(
                    w.createdAt,
                  ).toLocaleString()}
                </td>

                <td className="border px-4 py-2 text-right">
                  {w.status === "pending" && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setActionWd(w);
                          setActionType("approve");
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setActionWd(w);
                          setActionType("reject");
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {items.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6"
                >
                  No withdraw found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchWithdraws()}
            disabled={loading}
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Load More
          </Button>
        </div>
      )}

      {/* Approve / Reject Dialog */}
      <Dialog
        open={!!actionWd}
        onOpenChange={() => setActionWd(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Approve Withdraw"
                : "Reject Withdraw"}
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionWd(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                actionType === "reject"
                  ? "destructive"
                  : "default"
              }
              onClick={submitAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
