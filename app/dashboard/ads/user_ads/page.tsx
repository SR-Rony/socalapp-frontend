"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

const ADS_DATA = {
  pending: [
    {
      id: "AD-101",
      title: "Winter Sale Banner",
      by: "John Doe",
      budget: "$150",
      status: "Pending",
    },
    {
      id: "AD-102",
      title: "New Product Launch",
      by: "Sarah Smith",
      budget: "$220",
      status: "Pending",
    },
  ],
  approved: [
    {
      id: "AD-201",
      title: "Black Friday Deal",
      by: "Alex Brown",
      budget: "$500",
      status: "Approved",
    },
    {
      id: "AD-202",
      title: "Eid Campaign",
      by: "Rony Ahmed",
      budget: "$300",
      status: "Approved",
    },
  ],
};

const page = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "approved">(
    "pending"
  );
  const [search, setSearch] = useState("");

  const ads = ADS_DATA[activeTab].filter(
    (ad) =>
      ad.title.toLowerCase().includes(search.toLowerCase()) ||
      ad.by.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-4 rounded-xl">

      {/* ================= Header ================= */}
      <div>
        <h1 className="text-2xl font-bold">User Ads</h1>
        <p className="text-sm text-muted-foreground">
          Manage pending and approved ads campaigns
        </p>
      </div>

      {/* ================= Top Controls ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </Button>
          <Button
            variant={activeTab === "approved" ? "default" : "outline"}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </Button>
        </div>

        {/* Show & Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm">
            <span>Show</span>
            <select className="border rounded-md px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <span>Search:</span>
            <Input
              className="h-9 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ================= Table ================= */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">By</th>
                  <th className="px-4 py-3 text-left">Budget</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {ads.map((ad, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0"
                  >
                    <td className="px-4 py-3">{ad.id}</td>
                    <td className="px-4 py-3">{ad.title}</td>
                    <td className="px-4 py-3">{ad.by}</td>
                    <td className="px-4 py-3 font-medium">
                      {ad.budget}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          ad.status === "Approved"
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
                        <Button size="icon" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {ads.length === 0 && (
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
          Showing 1 to {ads.length} entries
        </p>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Prev
          </Button>
          <Button size="sm">1</Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>

    </div>
  );
};

export default page;
