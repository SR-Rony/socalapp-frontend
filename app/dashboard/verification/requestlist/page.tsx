"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Search,
  Check,
  X,
  Eye,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* =======================
   Types
======================= */
type VerificationRequest = {
  id: number;
  user: string;
  type: "User" | "Page";
  time: string;
};

/* =======================
   Mock Data
======================= */
const requests: VerificationRequest[] = [
  {
    id: 1,
    user: "Jiy Bis",
    type: "User",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "Muse Incorporated",
    type: "Page",
    time: "1 day ago",
  },
  {
    id: 3,
    user: "Karim Ali",
    type: "User",
    time: "5 days ago",
  },
];

/* =======================
   Component
======================= */
export default function VerificationRequestsPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     Filter + Pagination
  ======================= */
  const filtered = requests.filter(
    (r) =>
      r.user.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3">
        <BadgeCheck className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold">
          Verification Requests
        </h1>
      </div>

      {/* ===== Card ===== */}
      <div className="bg-white rounded-xl shadow border">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <h2 className="font-semibold">
            Pending Requests
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search user or page"
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
          <table className="min-w-[750px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">
                  ID
                </th>
                <th className="border px-4 py-3 text-left">
                  User / Page
                </th>
                <th className="border px-4 py-3 text-left">
                  Type
                </th>
                <th className="border px-4 py-3 text-left">
                  Time
                </th>
                <th className="border px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-2 font-medium">
                    #{item.id}
                  </td>

                  <td className="border px-4 py-2">
                    {item.user}
                  </td>

                  <td className="border px-4 py-2">
                    <Badge
                      variant={
                        item.type === "User"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {item.type}
                    </Badge>
                  </td>

                  <td className="border px-4 py-2">
                    {item.time}
                  </td>

                  <td className="border px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View */}
                      <Button
                        size="icon"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Approve */}
                      <Button
                        size="icon"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 text-white" />
                      </Button>

                      {/* Reject */}
                      <Button
                        size="icon"
                        variant="destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No verification requests found
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
              filtered.length
            )}{" "}
            of {filtered.length}
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

            <Button size="sm">
              {currentPage}
            </Button>

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
