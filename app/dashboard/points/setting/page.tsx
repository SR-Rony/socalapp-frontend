"use client";

/**
 * Points Settings Page (Professional & API Ready)
 * -------------------------------------------------
 * ✔ shadcn/ui
 * ✔ Sonner Toast
 * ✔ Clean Admin UI
 * ✔ Single Save Button (Easy API Call)
 */

import { useState } from "react";
import {
  Star,
  CreditCard,
  Wallet,
  Percent,
  Users,
  MessageCircle,
  Heart,
  Eye,
  Repeat,
  BadgeDollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";

const API_ENDPOINT = "/api/points-settings";

export default function PointsSettingsPage() {
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    pointsEnabled: true,
    withdrawEnabled: true,
    paymentMethods: {
      paypal: true,
      skrill: false,
      bank: true,
      custom: false,
    },
    customMethodName: "Vodafone Cash",
    minWithdrawAmount: 50,
    transferToWalletEnabled: true,

    pointsPerDollar: 100,
    pointsPerPost: 20,
    pointsPerPostView: 0.001,
    pointsPerPostComment: 5,
    pointsPerPostReaction: 5,

    pointsPerUserComment: 10,
    pointsPerUserReaction: 5,
    pointsPerFollower: 5,
    pointsPerReferral: 5,

    freeUserDailyLimit: 1000,
    proUserDailyLimit: 2000,
  });

  // =============================
  // Save Handler (API Ready)
  // =============================
  const handleSave = async () => {
    const toastId = toast.loading("Saving points settings...");

    try {
      setLoading(true);

      // await fetch(API_ENDPOINT, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings),
      // });

      toast.success("Points settings saved successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to save settings", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Points Settings</h1>
        <p className="text-sm text-muted-foreground">
          Control points earning, limits and monetization system
        </p>
      </div>

      {/* Points System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" /> Points System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            label="Enable Points System"
            value={settings.pointsEnabled}
            onChange={(v) => setSettings({ ...settings, pointsEnabled: v })}
          />
        </CardContent>
      </Card>

      {/* Withdraw Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Withdraw Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            label="Users Can Withdraw Earned Money"
            value={settings.withdrawEnabled}
            onChange={(v) => setSettings({ ...settings, withdrawEnabled: v })}
          />

          <Label>Payment Methods</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(settings.paymentMethods).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  checked={(settings.paymentMethods as any)[key]}
                  onCheckedChange={(v) =>
                    setSettings({
                      ...settings,
                      paymentMethods: {
                        ...settings.paymentMethods,
                        [key]: !!v,
                      },
                    })
                  }
                />
                <span className="capitalize">{key}</span>
              </div>
            ))}
          </div>

          {settings.paymentMethods.custom && (
            <div>
              <Label>Custom Method Name</Label>
              <Input
                value={settings.customMethodName}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    customMethodName: e.target.value,
                  })
                }
              />
            </div>
          )}

          <div>
            <Label>Minimum Withdrawal Request (USD)</Label>
            <Input
              type="number"
              value={settings.minWithdrawAmount}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  minWithdrawAmount: Number(e.target.value),
                })
              }
            />
          </div>

          <SettingSwitch
            label="Users Can Transfer Earned Money To Wallet"
            note="Make sure Wallet System is enabled"
            value={settings.transferToWalletEnabled}
            onChange={(v) =>
              setSettings({ ...settings, transferToWalletEnabled: v })
            }
          />
        </CardContent>
      </Card>

      {/* Points Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" /> Points Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <NumberField
            label="Points / $1.00"
            value={settings.pointsPerDollar}
            onChange={(v) => setSettings({ ...settings, pointsPerDollar: v })}
          />
          <NumberField
            label="Points / Post"
            value={settings.pointsPerPost}
            onChange={(v) => setSettings({ ...settings, pointsPerPost: v })}
          />
          <NumberField
            label="Points / Post View (Author)"
            value={settings.pointsPerPostView}
            step="0.001"
            onChange={(v) =>
              setSettings({ ...settings, pointsPerPostView: v })
            }
          />
          <NumberField
            label="Points / Post Comment (Author)"
            value={settings.pointsPerPostComment}
            onChange={(v) =>
              setSettings({ ...settings, pointsPerPostComment: v })
            }
          />
          <NumberField
            label="Points / Post Reaction (Author)"
            value={settings.pointsPerPostReaction}
            onChange={(v) =>
              setSettings({ ...settings, pointsPerPostReaction: v })
            }
          />
          <NumberField
            label="Points / Comment (User)"
            value={settings.pointsPerUserComment}
            onChange={(v) =>
              setSettings({ ...settings, pointsPerUserComment: v })
            }
          />
          <NumberField
            label="Points / Reaction (User)"
            value={settings.pointsPerUserReaction}
            onChange={(v) =>
              setSettings({ ...settings, pointsPerUserReaction: v })
            }
          />
          <NumberField
            label="Points / Follower"
            value={settings.pointsPerFollower}
            onChange={(v) =>
              setSettings({ ...settings, pointsPerFollower: v })
            }
          />
          <NumberField
            label="Points / Referred User"
            value={settings.pointsPerReferral}
            onChange={(v) =>
              setSettings({ ...settings, pointsPerReferral: v })
            }
          />
        </CardContent>
      </Card>

      {/* Daily Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> Daily Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <NumberField
            label="Free Users Daily Limit"
            value={settings.freeUserDailyLimit}
            onChange={(v) =>
              setSettings({ ...settings, freeUserDailyLimit: v })
            }
          />
          <NumberField
            label="Pro Users Daily Limit"
            value={settings.proUserDailyLimit}
            onChange={(v) =>
              setSettings({ ...settings, proUserDailyLimit: v })
            }
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="px-8">
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// =============================
// Reusable Components
// =============================
function SettingSwitch({
  label,
  note,
  value,
  onChange,
}: {
  label: string;
  note?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label>{label}</Label>
        {note && <p className="text-xs text-muted-foreground">{note}</p>}
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

function NumberField({
  label,
  value,
  step = "1",
  onChange,
}: {
  label: string;
  value: number;
  step?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}