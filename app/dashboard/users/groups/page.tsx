"use client";

import { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserGroupsPage() {
  /* =======================
     🔹 System Groups Data
  ======================= */
  const systemGroups = [
    {
      id: 1,
      title: "Admin",
      permissions: "All Access",
      users: 3,
    },
    {
      id: 2,
      title: "Moderator",
      permissions: "Manage Posts, Users",
      users: 8,
    },
    {
      id: 3,
      title: "User",
      permissions: "Read, Comment",
      users: 120,
    },
  ];

  /* =======================
     🔹 Custom Groups Data
  ======================= */
  const allCustomGroups = [
    {
      id: 101,
      title: "Editors",
      permissions: "Edit Posts",
      users: 12,
    },
    {
      id: 102,
      title: "Authors",
      permissions: "Create Posts",
      users: 25,
    },
    {
      id: 103,
      title: "Support Team",
      permissions: "Reply Tickets",
      users: 6,
    },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: i + 104,
      title: `Custom Group ${i + 1}`,
      permissions: "Limited Access",
      users: i + 2,
    })),
  ];

  /* =======================
     🔹 State
  ======================= */
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  /* =======================
     🔹 Filter + Pagination
  ======================= */
  const filteredGroups = allCustomGroups.filter((group) =>
    group.title.toLowerCase().includes(search.toLowerCase())
  );

  const ITEMS_PER_PAGE = Number(perPage);
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedGroups = filteredGroups.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-10">
      {/* =======================
         🔹 System Groups
      ======================= */}
      <div className="bg-white rounded-xl shadow border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">System Groups</h2>
          <p className="text-sm text-muted-foreground">
            Built-in system roles (cannot be deleted)
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left border">ID</th>
                <th className="px-4 py-3 text-left border">Title</th>
                <th className="px-4 py-3 text-left border">Permissions</th>
                <th className="px-4 py-3 text-left border">Users Count</th>
                <th className="px-4 py-3 text-right border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {systemGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{group.id}</td>
                  <td className="px-4 py-3 border font-medium">
                    {group.title}
                  </td>
                  <td className="px-4 py-3 border text-muted-foreground">
                    {group.permissions}
                  </td>
                  <td className="px-4 py-3 border">{group.users}</td>
                  <td className="px-4 py-3 border text-right">
                    <span className="text-xs text-muted-foreground">
                      System Locked
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================
         🔹 Custom Groups
      ======================= */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Custom Groups</h2>
            <p className="text-sm text-muted-foreground">
              User-created groups with custom permissions
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search group..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            {/* Per Page */}
            <Select
              value={perPage}
              onValueChange={(value) => {
                setPerPage(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / page</SelectItem>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="20">20 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left border">ID</th>
                <th className="px-4 py-3 text-left border">Title</th>
                <th className="px-4 py-3 text-left border">Permissions</th>
                <th className="px-4 py-3 text-left border">Users Count</th>
                <th className="px-4 py-3 text-right border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedGroups.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-muted-foreground border"
                  >
                    No groups found
                  </td>
                </tr>
              )}

              {paginatedGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border">{group.id}</td>
                  <td className="px-4 py-3 border font-medium">
                    {group.title}
                  </td>
                  <td className="px-4 py-3 border text-muted-foreground">
                    {group.permissions}
                  </td>
                  <td className="px-4 py-3 border">{group.users}</td>
                  <td className="px-4 py-3 border text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <b>{startIndex + 1}</b> to{" "}
              <b>
                {Math.min(
                  startIndex + ITEMS_PER_PAGE,
                  filteredGroups.length
                )}
              </b>{" "}
              of <b>{filteredGroups.length}</b> groups
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
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
        )}
      </div>
    </div>
  );
}
