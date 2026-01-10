"use client";

import { useState } from "react";
import { DollarSign, CreditCard, Wallet, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const API_ENDPOINT = "/api/monetization-settings";

export default function MonetizationSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    monetizationEnabled: true,
    walletSubscriptionEnabled: true,
    withdrawEnabled: true,
    paymentMethods: { paypal: true, skrill: false, bank: true, custom: false },
    minWithdrawAmount: 50,
    transferToWalletEnabled: true,
    commission: 10,
    maxPaidPostPrice: 0,
    maxPlanPrice: 0,
  });

  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Monetization settings saved successfully!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Monetization Settings</h1>
      <p className="text-sm text-muted-foreground">
        Control how users can monetize content and manage commission settings
      </p>

      {/* Warning Box */}
      <div className="mt-3 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400">
        <DollarSign className="h-5 w-5 mt-0.5" />
        <p className="text-sm">
          Make sure you have configured <strong>Payments Settings</strong> before enabling monetization.
        </p>
      </div>

      {/* Monetization Enabled */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Monetization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            label="Enable Monetization"
            note="Users can earn money from their content"
            value={settings.monetizationEnabled}
            onChange={(v) => setSettings({ ...settings, monetizationEnabled: v })}
          />
          <SettingSwitch
            label="Users Can Subscribe Via Wallet Balance"
            note="Make sure Wallet System is enabled"
            value={settings.walletSubscriptionEnabled}
            onChange={(v) => setSettings({ ...settings, walletSubscriptionEnabled: v })}
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

          <div className="space-y-2">
            <Label>Payment Methods</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.keys(settings.paymentMethods).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    checked={(settings.paymentMethods as any)[key]}
                    onCheckedChange={(v) =>
                      setSettings({
                        ...settings,
                        paymentMethods: { ...settings.paymentMethods, [key]: !!v },
                      })
                    }
                  />
                  <span className="capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>

          <Label>Minimum Withdrawal Request (USD)</Label>
          <Input
            type="number"
            value={settings.minWithdrawAmount}
            onChange={(e) =>
              setSettings({ ...settings, minWithdrawAmount: Number(e.target.value) })
            }
          />

          <SettingSwitch
            label="Users Can Transfer Earned Money To Wallet"
            note="Make sure Wallet System is enabled"
            value={settings.transferToWalletEnabled}
            onChange={(v) => setSettings({ ...settings, transferToWalletEnabled: v })}
          />
        </CardContent>
      </Card>

      {/* Commission & Max Prices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" /> Commission & Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Commission (%)</Label>
          <Input
            type="number"
            value={settings.commission}
            onChange={(e) => setSettings({ ...settings, commission: Number(e.target.value) })}
          />

          <Label>Maximum Paid Post Price (USD)</Label>
          <Input
            type="number"
            value={settings.maxPaidPostPrice}
            onChange={(e) => setSettings({ ...settings, maxPaidPostPrice: Number(e.target.value) })}
          />

          <Label>Maximum Monetization Plan Price (USD)</Label>
          <Input
            type="number"
            value={settings.maxPlanPrice}
            onChange={(e) => setSettings({ ...settings, maxPlanPrice: Number(e.target.value) })}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-white px-8"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

// =============================
// Reusable Switch Component
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
