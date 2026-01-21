"use client";

import { useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  Eye,
  FileWarning,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* =======================
   Types
======================= */
type ReportType = "Post" | "User" | "Comment";

type ReportItem = {
  id: number;
  node: string;
  type: ReportType;
  by: string;
  reason: string;
  time: string;
};

/* =======================
   Mock Data
======================= */
const reports: ReportItem[] = [
  {
    id: 1,
    node: "",
    type: "Post",
    by: "Jiy Bis",
    reason: "Nudity",
    time: "11 May 2025",
  },
  {
    id: 2,
    node: "Testing User",
    type: "User",
    by: "Yarak Yarak",
    reason: "Nudity",
    time: "17 June 2025",
  },
  {
    id: 3,
    node: "",
    type: "Comment",
    by: "Karim Ali",
    reason: "Spam",
    time: "20 June 2025",
  },
];

/* =======================
   Component
======================= */
export default function ListReportsPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     Filter + Pagination
  ======================= */
  const filteredReports = reports.filter(
    (r) =>
      r.by.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredReports.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* ===== Page Header ===== */}
      <div className="flex items-center gap-3">
        <FileWarning className="h-6 w-6 text-[#10897E]" />
        <h1 className="text-2xl font-semibold">List Reports</h1>
      </div>

      {/* ===== Table Card ===== */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Reported Content</h2>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">ID</th>
                <th className="border px-4 py-3 text-left">Node</th>
                <th className="border px-4 py-3 text-left">Type</th>
                <th className="border px-4 py-3 text-left">By</th>
                <th className="border px-4 py-3 text-left">Reason</th>
                <th className="border px-4 py-3 text-left">Time</th>
                <th className="border px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-2 font-medium">
                    #{report.id}
                  </td>
                  <td className="border px-4 py-2">
                    {report.node || "-"}
                  </td>
                  <td className="border px-4 py-2">
                    <Badge variant="secondary">
                      {report.type}
                    </Badge>
                  </td>
                  <td className="border px-4 py-2">
                    {report.by}
                  </td>
                  <td className="border px-4 py-2">
                    <Badge
                      variant={
                        report.reason === "Spam"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {report.reason}
                    </Badge>
                  </td>
                  <td className="border px-4 py-2">
                    {report.time}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View */}
                      <Button size="icon" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Update */}
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>

                      {/* Delete */}
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedReports.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No reports found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t text-sm">
          <span className="text-muted-foreground">
            Displaying {startIndex + 1}–
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredReports.length
            )}{" "}
            of {filteredReports.length}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((p) => p - 1)
              }
            >
              Prev
            </Button>
            <Button size="sm">{currentPage}</Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => p + 1)
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
