"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { adminAdsService } from "@/services/adminAdsService";
import { toast } from "sonner";

/* =======================
   Types
======================= */
type Ad = {
  _id: string;
  title: string;
  createdBy: {
    name: string;
    email: string;
  };
  budget: number;
  status: "pending" | "approved";
  isDeleted?: boolean;
};

/* =======================
   Page
======================= */
export default function AdminUserAdsPage() {
  const [activeTab, setActiveTab] =
    useState<"pending" | "approved">("pending");

  const [ads, setAds] = useState<Ad[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  

  /* =======================
     Fetch Ads
  ======================= */
  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await adminAdsService.getAds({
        status: activeTab,
        search,
        page,
        limit,
      });
      // setAds(res.data.items || []);
      console.log('ads data ',res.data);
      
    } catch {
      toast.error("Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [activeTab, search, page, limit]);

  /* =======================
     Actions
  ======================= */
  const approveAd = async (id: string) => {
    try {
      await adminAdsService.approveAd(id);
      toast.success("Ad approved");
      fetchAds();
    } catch {
      toast.error("Approve failed");
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    try {
      await adminAdsService.deleteAd(id);
      toast.success("Ad deleted");
      fetchAds();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl space-y-4">

      {/* ================= Header ================= */}
      <div>
        <h1 className="text-2xl font-bold">User Ads</h1>
        <p className="text-sm text-muted-foreground">
          Manage pending and approved ads campaigns
        </p>
      </div>

      {/* ================= Controls ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("pending");
              setPage(1);
            }}
          >
            Pending
          </Button>

          <Button
            variant={activeTab === "approved" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("approved");
              setPage(1);
            }}
          >
            Approved
          </Button>
        </div>

        {/* Search & Limit */}
        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

          <Input
            className="h-9 w-48"
            placeholder="Search ads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* ================= Table ================= */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">By</th>
                  <th className="px-4 py-3 text-left">Budget</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center">
                      Loading...
                    </td>
                  </tr>
                )}

                {!loading &&
                  ads.map((ad, index) => (
                    <tr key={ad._id} className="border-b last:border-0">
                      <td className="px-4 py-3">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        {ad.title}
                      </td>

                      <td className="px-4 py-3">
                        {ad.createdBy?.name || "Unknown"}
                      </td>

                      <td className="px-4 py-3 font-medium">
                        ৳{ad.budget}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            ad.status === "approved"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {ad.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>

                          {ad.status === "pending" && (
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => approveAd(ad._id)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}

                          <Button
                            size="icon"
                            variant="outline"
                            className="text-red-500"
                            onClick={() => deleteAd(ad._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}

                {!loading && ads.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No ads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ================= Pagination ================= */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {ads.length} entries
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <Button size="sm">{page}</Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
