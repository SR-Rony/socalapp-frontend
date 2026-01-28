"use client";

import { useState } from "react";
import {
  Search,
  Pencil,
  Trash2,
  RotateCcw,
  Flame,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAdminGroups } from "@/hooks/useAdminGroups";
import { adminGroupService } from "@/services/admin.group.service";
import { toast } from "sonner";

/* =======================
   Types
======================= */
type Group = {
  _id: string;
  name: string;
  privacy: "public" | "private";
  about?: string;
  category?: string;
  location?: { country?: string; city?: string };
  approval?: { memberApprovalRequired?: boolean; postApprovalRequired?: boolean };
  counts?: { members: number; posts: number };
  isDeleted?: boolean;
};

/* =======================
   Page
======================= */
export default function AdminGroupsPage() {
  const { groups, loading, refetch } = useAdminGroups();

  console.log("groups",groups);
  

  /* =======================
     UI State
  ======================== */
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);

  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrivacy, setEditPrivacy] = useState<"public" | "private">("public");
  const [editAbout, setEditAbout] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editMemberApproval, setEditMemberApproval] = useState(false);
  const [editPostApproval, setEditPostApproval] = useState(false);

  /* =======================
     Filter + Pagination
  ======================== */
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const ITEMS_PER_PAGE = Number(perPage);
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedGroups = filteredGroups.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* =======================
     Actions
  ======================== */
  const softDeleteGroup = async (id: string) => {
  if (!confirm("Soft delete this group?")) return;
  try {
    await adminGroupService.softDeleteGroup(id);
    toast.success("Group soft deleted");
    refetch();
  } catch {
    toast.error("Soft delete failed");
  }
};

const hardDeleteGroup = async (id: string) => {
  if (!confirm("⚠️ This will permanently delete the group. Continue?")) return;
  try {
    await adminGroupService.hardDeleteGroup(id);
    toast.success("Group permanently deleted");
    refetch();
  } catch {
    toast.error("Hard delete failed");
  }
};

const restoreGroup = async (id: string) => {
  try {
    await adminGroupService.restoreGroup(id);
    toast.success("Group restored");
    refetch(); // Backend থেকে fresh data নিয়ে আসবে
  } catch {
    toast.error("Restore failed");
  }
};


  const openEdit = (group: Group) => {
    setEditGroup(group);
    setEditName(group.name);
    setEditPrivacy(group.privacy);
    setEditAbout(group.about || "");
    setEditCategory(group.category || "");
    setEditCity(group.location?.city || "");
    setEditCountry(group.location?.country || "");
    setEditMemberApproval(group.approval?.memberApprovalRequired || false);
    setEditPostApproval(group.approval?.postApprovalRequired || false);
  };

  const updateGroup = async () => {
    if (!editGroup) return;
    try {
      await adminGroupService.updateGroup(editGroup._id, {
        name: editName,
        privacy: editPrivacy,
        about: editAbout,
        category: editCategory,
        location: { city: editCity, country: editCountry },
        approval: { memberApprovalRequired: editMemberApproval, postApprovalRequired: editPostApproval },
      });
      toast.success("Group updated");

      // frontend state update
      groups.forEach((g) => {
        if (g._id === editGroup._id) {
          g.name = editName;
          g.privacy = editPrivacy;
          g.about = editAbout;
          g.category = editCategory;
          g.location = { city: editCity, country: editCountry };
          g.approval = { memberApprovalRequired: editMemberApproval, postApprovalRequired: editPostApproval };
        }
      });

      setEditGroup(null);
      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <div>Loading groups...</div>;

  return (
    <div className="space-y-5 bg-white p-4 rounded-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Groups Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage all user created groups
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
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

          <Select
            value={perPage}
            onValueChange={(v) => {
              setPerPage(v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
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
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3">ID</th>
              <th className="border px-4 py-3">Name</th>
              <th className="border px-4 py-3">Admin</th>
              <th className="border px-4 py-3">Privacy</th>
              <th className="border px-4 py-3">Members</th>
              <th className="border px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGroups.map((group,index) => (
              <tr
                key={group._id}
                className={`hover:bg-gray-50 ${group.isDeleted ? "opacity-60" : ""}`}
              >
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2 font-medium">{group.name}</td>
                <td className="border px-4 py-2">
                  {group.createdBy.name || "—"}
                </td>
                <td className="border px-4 py-2">{group.privacy}</td>
                <td className="border px-4 py-2">{group.counts?.members || 0}</td>
                <td className="border px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    {/* Update */}
                    {!group.isDeleted && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => openEdit(group)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Soft delete */}
                    {!group.isDeleted && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => softDeleteGroup(group._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Restore */}
                    {group.isDeleted && (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => restoreGroup(group._id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Hard delete (only when deleted) */}
                    {group.isDeleted && (
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => hardDeleteGroup(group._id)}
                      >
                        <Flame className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} – {Math.min(startIndex + ITEMS_PER_PAGE, filteredGroups.length)} of {filteredGroups.length}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              Prev
            </Button>
            <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editGroup} onOpenChange={() => setEditGroup(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
            <Select value={editPrivacy} onValueChange={(v) => setEditPrivacy(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>

            <Input value={editAbout} onChange={(e) => setEditAbout(e.target.value)} placeholder="About" />
            <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} placeholder="Category" />
            <Input value={editCountry} onChange={(e) => setEditCountry(e.target.value)} placeholder="Country" />
            <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} placeholder="City" />

            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={editMemberApproval} onChange={(e) => setEditMemberApproval(e.target.checked)} />
                Member Approval Required
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={editPostApproval} onChange={(e) => setEditPostApproval(e.target.checked)} />
                Post Approval Required
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditGroup(null)}>Cancel</Button>
              <Button onClick={updateGroup}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
