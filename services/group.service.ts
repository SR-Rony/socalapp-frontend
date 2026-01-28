import api from "@/lib/api";

export const groupService = {
  createGroup: (data: any) =>
    api.post("/admin/groups/createGroup", data),

  getMyGroups: (params?: any) =>
    api.get("/admin/groups/my-groups", { params }),

  getGroupDetails: (groupId: string) =>
    api.get(`/admin/groups/${groupId}/details`),
};
