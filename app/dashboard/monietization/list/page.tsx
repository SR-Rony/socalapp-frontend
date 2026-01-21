"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import api from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
type MonetizationItem = {
  _id: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  userId: {
    name: string;
    username: string;
    email: string;
  };
};

/* =======================
   Component
======================= */
export default function MonetizationListPage() {
  const ITEMS_PER_PAGE = 10;

  const [items, setItems] = useState<MonetizationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] =
    useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Reject dialog
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  /* =======================
     Fetch Monetization
  ======================= */
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/admin/monetization/list?status=${status}`
      );
      if (res.data?.ok) {
        setItems(res.data.items);
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
          "Failed to load monetization list"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    setPage(1);
  }, [status]);

  /* =======================
     Actions
  ======================= */
  const approveItem = async (id: string) => {
    try {
      await api.post(`/admin/monetization/${id}/approve`);
      toast.success("Monetization approved");
      fetchItems();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Approve failed"
      );
    }
  };

  const rejectItem = async () => {
    if (!rejectId) return;

    try {
      await api.post(
        `/admin/monetization/${rejectId}/reject`,
        { reason: rejectReason }
      );
      toast.success("Monetization rejected");
      setRejectId(null);
      setRejectReason("");
      fetchItems();
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Reject failed"
      );
    }
  };

  /* =======================
     Filter + Pagination
  ======================= */
  const filtered = items.filter(
    (i) =>
      i.userId.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      i.userId.username
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      i.userId.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(
    start,
    start + ITEMS_PER_PAGE
  );

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DollarSign className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-semibold">
          Monetization Requests
        </h1>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <StatusButton
          active={status === "pending"}
          onClick={() => setStatus("pending")}
          icon={Clock}
          label="Pending"
        />
        <StatusButton
          active={status === "approved"}
          onClick={() => setStatus("approved")}
          icon={CheckCircle}
          label="Approved"
        />
        <StatusButton
          active={status === "rejected"}
          onClick={() => setStatus("rejected")}
          icon={XCircle}
          label="Rejected"
        />
      </div>

      {/* Card */}
      <div className="rounded-xl border shadow">
        {/* Top */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 border-b">
          <h2 className="font-semibold capitalize">
            {status} Requests
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search user..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">
                  Name
                </th>
                <th className="border px-4 py-3 text-left">
                  Username
                </th>
                <th className="border px-4 py-3 text-left">
                  Email
                </th>
                <th className="border px-4 py-3 text-left">
                  Status
                </th>
                <th className="border px-4 py-3 text-left">
                  Requested
                </th>
                <th className="border px-4 py-3 text-left">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50"
                >
                  <td className="border px-4 py-2">
                    {item.userId.name}
                  </td>
                  <td className="border px-4 py-2">
                    @{item.userId.username}
                  </td>
                  <td className="border px-4 py-2">
                    {item.userId.email}
                  </td>
                  <td className="border px-4 py-2">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(
                      item.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {item.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            approveItem(item._id)
                          }
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setRejectId(item._id)
                          }
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog
        open={!!rejectId}
        onOpenChange={() => setRejectId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject Monetization
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Reject reason"
            value={rejectReason}
            onChange={(e) =>
              setRejectReason(e.target.value)
            }
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={rejectItem}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =======================
   Helpers
======================= */
function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return <Badge className="bg-green-600">Approved</Badge>;
  if (status === "rejected")
    return <Badge variant="destructive">Rejected</Badge>;
  return <Badge variant="secondary">Pending</Badge>;
}

function StatusButton({
  active,
  icon: Icon,
  label,
  onClick,
}: any) {
  return (
    <Button
      variant={active ? "default" : "outline"}
      onClick={onClick}
      className="gap-2"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}
