"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Trash2,
  LogOut,
} from "lucide-react";

import api from "@/lib/api";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

/* =======================
   Types
======================= */
type User = {
  _id: string;
  name: string;
  username: string;
  role: "USER" | "ADMIN" | "MODERATOR";
  isBlocked: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
};

/* =======================
   Component
======================= */
export default function UsersPage() {
  const ITEMS_PER_PAGE = 10;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* =======================
     Fetch users
  ======================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");

      if (res.data?.ok) {
        setUsers(res.data.data);
      }
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =======================
     Actions
  ======================= */
  const updateRole = async (id: string, role: string) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Role update failed");
    }
  };

  const toggleBlock = async (u: User) => {
    try {
      await api.patch(`/admin/users/${u._id}/block`, {
        blocked: !u.isBlocked,
      });
      toast.success(u.isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const toggleVerify = async (u: User) => {
    try {
      await api.patch(`/admin/users/${u._id}/verify`, {
        verified: !u.isVerified,
      });
      toast.success(
        u.isVerified ? "User unverified" : "User verified",
      );
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const forceLogout = async (id: string) => {
    try {
      await api.patch(`/admin/users/${id}/force-logout`);
      toast.success("User force logged out");
    } catch {
      toast.error("Force logout failed");
    }
  };

  /* =======================
     Filter + Pagination
  ======================= */
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-8 bg-white p-4 rounded-xl">
      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total Users" value={users.length} icon={Users} />
        <Stat
          title="Verified"
          value={users.filter((u) => u.isVerified).length}
          icon={UserCheck}
        />
        <Stat
          title="Blocked"
          value={users.filter((u) => u.isBlocked).length}
          icon={UserX}
        />
        <Stat
          title="Admins"
          value={users.filter((u) => u.role === "ADMIN").length}
          icon={ShieldCheck}
        />
      </div>

      {/* ===== Table ===== */}
      <div className="border rounded-xl shadow">
        <div className="flex justify-between p-4 border-b">
          <h2 className="font-semibold">Users</h2>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
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

        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3">#</th>
                <th className="border px-4 py-3">Name</th>
                <th className="border px-4 py-3">Username</th>
                <th className="border px-4 py-3">Role</th>
                <th className="border px-4 py-3">Verified</th>
                <th className="border px-4 py-3">Blocked</th>
                <th className="border px-4 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((u, i) => (
                <tr key={u._id}>
                  <td className="border px-4 py-2">
                    {start + i + 1}
                  </td>
                  <td className="border px-4 py-2">
                    {u.name}
                  </td>
                  <td className="border px-4 py-2">
                    @{u.username}
                  </td>

                  <td className="border px-4 py-2">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        updateRole(u._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="USER">USER</option>
                      <option value="MODERATOR">
                        MODERATOR
                      </option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td className="border px-4 py-2 text-center">
                    <Switch
                      checked={u.isVerified}
                      onCheckedChange={() => toggleVerify(u)}
                    />
                  </td>

                  <td className="border px-4 py-2 text-center">
                    <Switch
                      checked={u.isBlocked}
                      onCheckedChange={() => toggleBlock(u)}
                    />
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => forceLogout(u._id)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => deleteUser(u._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginated.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-6"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between p-4 border-t">
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
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
              <Button size="sm">{page}</Button>
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
        )}
      </div>
    </div>
  );
}

/* =======================
   Stat Card
======================= */
function Stat({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-xl">
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
