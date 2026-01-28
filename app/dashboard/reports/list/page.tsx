"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  Pencil,
  FileWarning,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { toast } from "sonner";

/* =======================
   Types
======================= */
type Report = {
  _id: string;
  reason: string;
  status: "pending" | "resolved" | "rejected";
  details?: string;
  adminNote?: string;
  createdAt: string;
  reporter?: {
    fullname: string;
    regNumber: string;
  };
  resolvedBy?: {
    fullname: string;
  };
};

/* =======================
   Page
======================= */
export default function AdminReportsPage() {
  const LIMIT = 10;

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [adminNote, setAdminNote] = useState("");

  /* =======================
     Fetch Reports
  ======================= */
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/report/all-report-list", {
        params: {
          page,
          limit: LIMIT,
          q: search || undefined,
        },
      });

      console.log("report",res.data);
      

      if (res.data?.ok) {
        setReports(res.data.items);
        setTotal(res.data.total);
      }
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, search]);

  /* =======================
     Actions
  ======================= */
  const updateReport = async (status: "resolved" | "rejected") => {
    if (!editReport) return;

    try {
      await api.patch(
        `/report/single-report-up/${editReport._id}`,
        {
          status,
          adminNote,
        }
      );

      toast.success("Report updated");
      setEditReport(null);
      setAdminNote("");
      fetchReports();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm("Delete this report permanently?")) return;

    try {
      await api.delete(
        `/report/single-report-delete/${id}`
      );
      toast.success("Report deleted");
      fetchReports();
    } catch {
      toast.error("Delete failed");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileWarning className="h-6 w-6 text-[#10897E]" />
        <h1 className="text-2xl font-semibold">
          Reports Management
        </h1>
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
        <Input
          className="pl-9"
          placeholder="Search reports..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="min-w-[1000px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3">
                Reporter
              </th>
              <th className="border px-4 py-3">
                Reason
              </th>
              <th className="border px-4 py-3">
                Status
              </th>
              <th className="border px-4 py-3">
                Time
              </th>
              <th className="border px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr
                key={r._id}
                className="hover:bg-gray-50"
              >
                <td className="border px-4 py-2">
                  {r.reporter?.fullname || "-"}
                  <div className="text-xs text-muted-foreground">
                    {r.reporter?.regNumber}
                  </div>
                </td>

                <td className="border px-4 py-2">
                  {r.reason}
                </td>

                <td className="border px-4 py-2">
                  <Badge
                    variant={
                      r.status === "pending"
                        ? "secondary"
                        : r.status === "resolved"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {r.status}
                  </Badge>
                </td>

                <td className="border px-4 py-2">
                  {new Date(
                    r.createdAt
                  ).toLocaleString()}
                </td>

                <td className="border px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setViewReport(r)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setEditReport(r);
                        setAdminNote(
                          r.adminNote || ""
                        );
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() =>
                        deleteReport(r._id)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && reports.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* View Modal */}
      <Dialog
        open={!!viewReport}
        onOpenChange={() => setViewReport(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Report Details
            </DialogTitle>
          </DialogHeader>

          {viewReport && (
            <div className="space-y-2 text-sm">
              <p>
                <b>Reason:</b>{" "}
                {viewReport.reason}
              </p>
              <p>
                <b>Status:</b>{" "}
                {viewReport.status}
              </p>
              <p>
                <b>Details:</b>{" "}
                {viewReport.details || "-"}
              </p>
              <p>
                <b>Admin Note:</b>{" "}
                {viewReport.adminNote || "-"}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={!!editReport}
        onOpenChange={() => setEditReport(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Update Report
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Admin note"
            value={adminNote}
            onChange={(e) =>
              setAdminNote(e.target.value)
            }
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditReport(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateReport("resolved")
              }
            >
              Resolve
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                updateReport("rejected")
              }
            >
              Reject
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
