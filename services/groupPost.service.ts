import api from "@/lib/api";

export const groupPostService = {
  createPost: (groupId: string, data: any) =>
    api.post(`/admin/groups/post/${groupId}/posts`, data),

  getPosts: (groupId: string, params?: any) =>
    api.get(`/admin/groups/post/${groupId}/posts`, { params }),

  getSinglePost: (groupId: string, postId: string) =>
    api.get(`/admin/groups/post/${groupId}/posts/${postId}`),

  updatePost: (groupId: string, postId: string, data: any) =>
    api.patch(
      `/admin/groups/post/${groupId}/posts/${postId}`,
      data,
    ),

  deletePost: (groupId: string, postId: string) =>
    api.delete(
      `/admin/groups/post/${groupId}/posts/${postId}`,
    ),
};
