"use client";

import { useState } from "react";
import {
  Store,
  ShoppingCart,
  Wallet,
  Truck,
  CreditCard,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // ✅ direct import, no useToast

const API_ENDPOINT = "/api/marketplace-settings";

export default function MarketplaceSettingsPage() {
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    marketplaceEnabled: true,
    cartEnabled: true,
    digitalProductsEnabled: true,
    walletPurchaseEnabled: true,
    cashOnDeliveryEnabled: false,
    autoDeliveryDays: 30,
    withdrawEnabled: true,
    paymentMethods: {
      paypal: true,
      skrill: false,
      bank: true,
      custom: false,
    },
    minWithdrawAmount: 50,
    transferToWalletEnabled: true,
    commission: 10,
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

      toast.success("Marketplace settings saved successfully!"); // ✅ success toast
    } catch (error) {
      toast.error("Something went wrong. Please try again."); // ✅ error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl">
      <div>
        <h1 className="text-2xl font-semibold">Marketplace Settings</h1>
        <p className="text-sm text-muted-foreground">
          Control marketplace behavior and commission system
        </p>
      </div>

      {/* Marketplace */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" /> Marketplace
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            label="Turn the marketplace On and Off"
            value={settings.marketplaceEnabled}
            onChange={(v) => setSettings({ ...settings, marketplaceEnabled: v })}
          />
          <SettingSwitch
            label="Shopping Cart"
            note="If disabled buyers can only contact sellers"
            value={settings.cartEnabled}
            onChange={(v) => setSettings({ ...settings, cartEnabled: v })}
          />
          <SettingSwitch
            label="Digital Products"
            value={settings.digitalProductsEnabled}
            onChange={(v) => setSettings({ ...settings, digitalProductsEnabled: v })}
          />
        </CardContent>
      </Card>

      {/* Wallet & Payment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" /> Wallet & Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingSwitch
            label="Users Can Buy From Wallet Balance"
            note="Make sure Wallet System is enabled"
            value={settings.walletPurchaseEnabled}
            onChange={(v) => setSettings({ ...settings, walletPurchaseEnabled: v })}
          />
          <SettingSwitch
            label="Users Select Cash On Delivery"
            note="If enabled commission will not be taken"
            value={settings.cashOnDeliveryEnabled}
            onChange={(v) => setSettings({ ...settings, cashOnDeliveryEnabled: v })}
          />
        </CardContent>
      </Card>

      {/* Delivery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" /> Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Days To Automatic Delivery</Label>
          <Input
            type="number"
            value={settings.autoDeliveryDays}
            onChange={(e) =>
              setSettings({ ...settings, autoDeliveryDays: Number(e.target.value) })
            }
          />
          <p className="text-xs text-muted-foreground">
            Order will be marked as delivered automatically if status not changed
          </p>
        </CardContent>
      </Card>

      {/* Withdraw */}
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

      {/* Commission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" /> Commission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Commission (%)</Label>
          <Input
            type="number"
            value={settings.commission}
            onChange={(e) => setSettings({ ...settings, commission: Number(e.target.value) })}
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
