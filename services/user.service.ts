// src/services/user.service.ts
import api from "@/lib/api";

/* =====================
   ME
===================== */
export const getMe = () => api.get("/users/me");

export const updateMe = (data: any) =>
  api.patch("/users/me", data);

export const completeProfile = (data: any) =>
  api.patch("/users/other-info", data);

export const uploadAvatar = (formData: FormData) =>
  api.post("/users/me/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const uploadCover = (formData: FormData) =>
  api.post("/users/me/cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getMyPosts = (params?: any) =>
  api.get("/users/me/posts", { params });

export const getMyPhotos = (params?: any) =>
  api.get("/users/me/photos", { params });

export const getMyReels = (params?: any) =>
  api.get("/users/me/reels", { params });

export const getMyVideos = (params?: any) =>
  api.get("/users/videos/me", { params });

/* =====================
   OTHER USER
===================== */
export const getUserById = (userId: string) =>
  api.get(`/users/${userId}`);

export const getUserPosts = (userId: string, params?: any) =>
  api.get(`/users/${userId}/posts`, { params });

export const getUserPhotos = (userId: string, params?: any) =>
  api.get(`/users/${userId}/photos`, { params });

export const getUserReels = (userId: string, params?: any) =>
  api.get(`/users/${userId}/reels`, { params });
