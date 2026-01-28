// services/adminAdsService.ts
import api from "@/lib/api";

export const adminAdsService = {
  getAds(params: {
    status: "pending" | "approved";
    search?: string;
    page?: number;
    limit?: number;
  }) {
    return api.get("/admin/ads", { params });
  },

  approveAd(id: string) {
    return api.patch(`/admin/ads/${id}`, { status: "approved" });
  },

  deleteAd(id: string) {
    return api.patch(`/admin/ads/${id}/delete`);
  },

  hardDelete(id: string) {
    return api.delete(`/admin/ads/${id}/hard`);
  },
};
