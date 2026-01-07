"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const page = () => {
  const [settings, setSettings] = useState({
    enableAds: true,
    approvalSystem: true,
    authorCanSeeAds: true,
    costByView: "0.01",
    costByClick: "0.05",
  });

  return (
    <div className="space-y-6">

      {/* ================= Header ================= */}
      <div>
        <h1 className="text-2xl font-bold">Ads › Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage ads campaigns and pricing configuration
        </p>
      </div>

      {/* ================= Ads Campaigns ================= */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Ads Campaigns</h2>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Enable Ads */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow users to create ads</Label>
              <p className="text-sm text-muted-foreground">
                Enable it will enable wallet by default
              </p>
            </div>
            <Switch
              checked={settings.enableAds}
              onCheckedChange={(value) =>
                setSettings({ ...settings, enableAds: value })
              }
            />
          </div>

          {/* Approval System */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Ads Campaigns Approval System</Label>
              <p className="text-sm text-muted-foreground">
                If disabled all campaigns will be approved by default
              </p>
            </div>
            <Switch
              checked={settings.approvalSystem}
              onCheckedChange={(value) =>
                setSettings({ ...settings, approvalSystem: value })
              }
            />
          </div>

          {/* Author Can See Ads */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Ads Author Can See His Ads</Label>
              <p className="text-sm text-muted-foreground">
                If disabled the author will not be able to see his ads
              </p>
            </div>
            <Switch
              checked={settings.authorCanSeeAds}
              onCheckedChange={(value) =>
                setSettings({ ...settings, authorCanSeeAds: value })
              }
            />
          </div>

        </CardContent>
      </Card>

      {/* ================= Cost Settings ================= */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Ads Cost Settings</h2>
        </CardHeader>

        <CardContent className="grid grid-cols-12 gap-4">

          {/* Cost by View */}
          <div className="col-span-12 md:col-span-6 space-y-2">
            <Label>Cost by View</Label>
            <Input
              type="number"
              step="0.01"
              value={settings.costByView}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  costByView: e.target.value,
                })
              }
            />
          </div>

          {/* Cost by Click */}
          <div className="col-span-12 md:col-span-6 space-y-2">
            <Label>Cost by Click</Label>
            <Input
              type="number"
              step="0.01"
              value={settings.costByClick}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  costByClick: e.target.value,
                })
              }
            />
          </div>

        </CardContent>
      </Card>

    </div>
  );
};

export default page;
