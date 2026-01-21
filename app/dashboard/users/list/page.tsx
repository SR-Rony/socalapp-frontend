"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Search,
  Trash2,
  Pencil,
} from "lucide-react";

import api from "@/lib/api";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
type User = {
  id: string;
  name: string;
  username: string;
  joined: string;
  activated: boolean;
  approved: boolean;
};

/* =======================
   Component
======================= */
export default function UsersPage() {
  const ITEMS_PER_PAGE = 10;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /* =======================
     Fetch Users
  ======================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/all-users");

      if (res.data?.success) {
        const formatted = res.data.data.map((u: any) => ({
          id: u._id,
          name: u.name,
          username: u.username,
          activated: u.activated,
          approved: u.approved,
          joined: new Date(u.createdAt).toLocaleDateString(),
        }));

        setUsers(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =======================
     Delete User
  ======================= */
  const handleDeleteUser = async (userId: string) => {
    const ok = confirm("Are you sure you want to delete this user?");
    if (!ok) return;

    try {
      const res = await api.delete(`/users/${userId}`);

      if (res.data?.success) {
        toast.success("User deleted successfully");
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  };

  /* =======================
     Edit Modal
  ======================= */
  const openEditModal = (user: User) => {
    setSelectedUser({ ...user });
    setIsEditOpen(true);
  };

  /* =======================
     Filter + Pagination
  ======================= */
  const filteredUsers = users.filter(
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

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-8 bg-white p-4 rounded-xl">
      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={users.length} icon={Users} />
        <StatCard
          title="Active Users"
          value={users.filter((u) => u.activated).length}
          icon={UserCheck}
        />
        <StatCard
          title="Inactive Users"
          value={users.filter((u) => !u.activated).length}
          icon={UserX}
        />
        <StatCard
          title="Approved Users"
          value={users.filter((u) => u.approved).length}
          icon={ShieldCheck}
        />
      </div>

      {/* ===== Table ===== */}
      <div className="bg-white rounded-xl shadow border">
        <div className="flex justify-between p-4 border-b">
          <h2 className="font-semibold">User List</h2>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              className="pl-9"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-left">#</th>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3">Username</th>
                <th className="border px-4 py-3">Joined</th>
                <th className="border px-4 py-3">Status</th>
                <th className="border px-4 py-3">Approval</th>
                <th className="border px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user, i) => (
                <tr key={user.id}>
                  <td className="border px-4 py-2">
                    {startIndex + i + 1}
                  </td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">@{user.username}</td>
                  <td className="border px-4 py-2">{user.joined}</td>
                  <td className="border px-4 py-2">
                    {user.activated ? "Active" : "Inactive"}
                  </td>
                  <td className="border px-4 py-2">
                    {user.approved ? "Approved" : "Pending"}
                  </td>
                  <td className="border px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Edit Modal ===== */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <Input
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    name: e.target.value,
                  })
                }
              />
              <div className="flex gap-4">
                <Switch checked={selectedUser.activated} />
                <Switch checked={selectedUser.approved} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsEditOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =======================
   Stat Card
======================= */
function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-5 rounded-xl">
      <div className="flex gap-4 items-center">
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon />
        </div>
        <div>
          <p className="text-sm">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
    </div>
  );
}
