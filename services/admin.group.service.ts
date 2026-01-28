import api from "@/lib/api";

export const adminGroupService = {
  getAllGroups(params?: { limit?: number }) {
    return api.get("/admin/Allgroups", { params });
  },

  updateGroup(groupId: string, data: any) {
    return api.patch(`/admin/groups/${groupId}`, data);
  },

  restoreGroup(groupId: string) {
    return api.patch(`/admin/groups/${groupId}/restore`);
  },

  softDeleteGroup(groupId: string) {
    return api.patch(`/admin/groups/${groupId}/soft`);
  },
 hardDeleteGroup(groupId: string) {
  return api.delete(`/admin/groups/${groupId}/hard`);
}

};
