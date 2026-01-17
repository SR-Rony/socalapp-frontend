"use client";

import { useState } from "react";
import {
  DollarSign,
  CreditCard,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

/* =======================
   Types
======================= */
type Permission = {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
};

/* =======================
   Component
======================= */
export default function MonetizationPermissionsPage() {
  /* =======================
     Permissions State
     (API-ready)
  ======================= */
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 1,
      name: "View Earnings",
      description: "Can view monetization earnings & revenue summary",
      enabled: true,
    },
    {
      id: 2,
      name: "Withdraw Balance",
      description: "Can withdraw available balance",
      enabled: false,
    },
    {
      id: 3,
      name: "Manage Pricing",
      description: "Can update product pricing & monetization rules",
      enabled: true,
    },
    {
      id: 4,
      name: "View Sales Reports",
      description: "Can view detailed monetization & sales reports",
      enabled: true,
    },
  ]);

  /* =======================
     Handlers (API ready)
  ======================= */
  const togglePermission = (id: number, value: boolean) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, enabled: value } : p
      )
    );

    /**
     * 👉 Later API Call example:
     * fetch("/api/permissions/update", {
     *   method: "POST",
     *   body: JSON.stringify({ id, enabled: value })
     * })
     */
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow">
      {/* =======================
          Page Header
      ======================= */}
      <div>
        <h1 className="text-2xl font-bold">Monetization Permissions</h1>
        <p className="text-muted-foreground text-sm">
          Manage monetization-related permissions for this group
        </p>
      </div>

      {/* =======================
          Summary Cards
      ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <DollarSign className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-sm text-muted-foreground">
                Monetization Permissions
              </p>
              <h3 className="text-xl font-semibold">
                {permissions.length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">
                Enabled
              </p>
              <h3 className="text-xl font-semibold">
                {permissions.filter((p) => p.enabled).length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">
                Payment Related
              </p>
              <h3 className="text-xl font-semibold">2</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-sm text-muted-foreground">
                Reports Access
              </p>
              <h3 className="text-xl font-semibold">1</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =======================
          Permissions Table
      ======================= */}
      <div className="bg-white border rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">
            Monetization Permissions List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-muted-foreground">
              <tr>
                <th className="border px-4 py-3 text-left">
                  Permission
                </th>
                <th className="border px-4 py-3 text-left">
                  Description
                </th>
                <th className="border px-4 py-3 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {permissions.map((permission) => (
                <tr
                  key={permission.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="border px-4 py-3 font-medium">
                    {permission.name}
                  </td>
                  <td className="border px-4 py-3 text-muted-foreground">
                    {permission.description}
                  </td>
                  <td className="border px-4 py-3 text-center">
                    <Switch
                      checked={permission.enabled}
                      onCheckedChange={(value) =>
                        togglePermission(permission.id, value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end p-4 border-t">
          <Button variant="outline">Reset</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
