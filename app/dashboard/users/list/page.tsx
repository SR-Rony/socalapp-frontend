"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const ITEMS_PER_PAGE = 10;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* 🔹 Stats Data */
  const stats = [
    {
      title: "Total Users",
      value: 120,
      icon: Users,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Active Users",
      value: 95,
      icon: UserCheck,
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Inactive Users",
      value: 25,
      icon: UserX,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Approved Users",
      value: 88,
      icon: ShieldCheck,
      gradient: "from-pink-500 to-rose-600",
    },
  ];

  /* 🔹 Users Data */
  const users = [
    {
      id: 1,
      name: "SR Rony",
      username: "rony",
      joined: "2024-01-12",
      activated: true,
      approved: true,
    },
    {
      id: 2,
      name: "Admin",
      username: "admin",
      joined: "2023-11-05",
      activated: true,
      approved: false,
    },
    ...Array.from({ length: 25 }, (_, i) => ({
      id: i + 3,
      name: `User ${i + 3}`,
      username: `user_${i + 3}`,
      joined: `2024-02-${(i % 28) + 1}`,
      activated: i % 2 === 0,
      approved: i % 3 === 0,
    })),
  ];

  /* 🔹 Filter + Pagination */
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8">
      {/* 🔹 Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`bg-gradient-to-r ${item.gradient} rounded-xl p-5 text-white shadow hover:shadow-lg transition`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm text-white/80">{item.title}</p>
                  <h3 className="text-3xl font-bold">{item.value}</h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔹 Table Section */}
      <div className="bg-white rounded-xl shadow border">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
          <h2 className="text-lg font-semibold">User List</h2>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 border-collapse">
            <thead className="bg-gray-100 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left border font-semibold">ID</th>
                <th className="px-4 py-3 text-left border font-semibold">Name</th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Username
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Joined
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Activated
                </th>
                <th className="px-4 py-3 text-left border font-semibold">
                  Approved
                </th>
                <th className="px-4 py-3 text-right border font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-muted-foreground border"
                  >
                    No users found
                  </td>
                </tr>
              )}

              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border">{user.id}</td>
                  <td className="px-4 py-3 border font-medium">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 border text-muted-foreground">
                    @{user.username}
                  </td>
                  <td className="px-4 py-3 border">{user.joined}</td>
                  <td className="px-4 py-3 border">
                    {user.activated ? (
                      <span className="rounded-full bg-green-100 text-green-700 px-2 py-1 text-xs">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-red-100 text-red-700 px-2 py-1 text-xs">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    {user.approved ? (
                      <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-1 text-xs">
                        Approved
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 text-yellow-700 px-2 py-1 text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 border text-right">
                    <Button size="icon" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔹 Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing <b>{startIndex + 1}</b> to{" "}
              <b>
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)}
              </b>{" "}
              of <b>{filteredUsers.length}</b> users
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="sm"
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
