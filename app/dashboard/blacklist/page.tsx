"use client";

import { useState } from "react";
import {
  ShieldBan,
  Search,
  Eye,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* =======================
   Types
======================= */
type BlacklistItem = {
  id: number;
  type: "Email" | "IP" | "Username";
  value: string;
  added: string;
};

/* =======================
   Mock Data
======================= */
const blacklistData: BlacklistItem[] = [
  {
    id: 1,
    type: "Email",
    value: "temp-inbox.me",
    added: "a year ago",
  },
  {
    id: 2,
    type: "Email",
    value: "temp-inbox.me",
    added: "a year ago",
  },
  {
    id: 3,
    type: "Email",
    value: "temp-inbox.me",
    added: "a year ago",
  },
  {
    id: 4,
    type: "Email",
    value: "temp-inbox.me",
    added: "a year ago",
  },
];

/* =======================
   Component
======================= */
export default function BlacklistPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     Filter + Pagination
  ======================= */
  const filteredItems = blacklistData.filter(
    (item) =>
      item.value.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredItems.length / ITEMS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* ===== Page Header ===== */}
      <div className="flex items-center gap-3">
        <ShieldBan className="h-6 w-6 text-red-600" />
        <h1 className="text-2xl font-semibold">
          Blacklist
        </h1>
      </div>

      {/* ===== Table Card ===== */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <h2 className="font-semibold">
            Blocked Items
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by value or type"
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
          <table className="min-w-[800px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">
                  ID
                </th>
                <th className="border px-4 py-3 text-left">
                  Type
                </th>
                <th className="border px-4 py-3 text-left">
                  Value
                </th>
                <th className="border px-4 py-3 text-left">
                  Added
                </th>
                <th className="border px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-2 font-medium">
                    #{item.id}
                  </td>

                  <td className="border px-4 py-2">
                    <Badge variant="destructive">
                      {item.type}
                    </Badge>
                  </td>

                  <td className="border px-4 py-2 font-mono">
                    {item.value}
                  </td>

                  <td className="border px-4 py-2">
                    {item.added}
                  </td>

                  <td className="border px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">

                      {/* Remove */}
                      <Button
                        size="icon"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedItems.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No blacklisted items found
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
              filteredItems.length
            )}{" "}
            of {filteredItems.length}
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
