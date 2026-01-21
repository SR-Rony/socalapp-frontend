"use client";

import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* =======================
   Types
======================= */
type VerifiedUser = {
  id: number;
  name: string;
  username: string;
  joined: string;
};

/* =======================
   Mock Data
======================= */
const verifiedUsers: VerifiedUser[] = [
  { id: 1, name: "Jiy Bis", username: "jiybis", joined: "12 May 2025" },
  { id: 2, name: "Muse Incorporated", username: "museinc", joined: "8 May 2025" },
  { id: 3, name: "Karim Ali", username: "karimali", joined: "1 June 2025" },
];

/* =======================
   Component
======================= */
export default function VerifiedUsersPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     Filter + Pagination
  ======================= */
  const filteredUsers = verifiedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 bg-white p-4 rounded-xl">
      {/* ===== Header ===== */}
      <div className="flex items-center gap-3">
        <Eye className="h-6 w-6 text-green-600" />
        <h1 className="text-2xl font-semibold">Verified Users</h1>
      </div>

      {/* ===== Table Card ===== */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <h2 className="font-semibold">All Verified Users</h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by name or username"
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
          <table className="min-w-[700px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">ID</th>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3 text-left">Username</th>
                <th className="border px-4 py-3 text-left">Joined</th>
                <th className="border px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-2 font-medium">#{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">@{user.username}</td>
                  <td className="border px-4 py-2">{user.joined}</td>
                  <td className="border px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      {/* View */}
                      <Button size="icon" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>

                      {/* Remove */}
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No verified users found
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
              filteredUsers.length
            )} of {filteredUsers.length}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button size="sm">{currentPage}</Button>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
