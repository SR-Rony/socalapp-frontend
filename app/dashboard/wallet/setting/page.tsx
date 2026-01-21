"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/* --------------------------------
 Wallet Settings Page
---------------------------------*/
export default function WalletSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [walletEnabled, setWalletEnabled] = useState(false);
  const [transferEnabled, setTransferEnabled] = useState(false);
  const [withdrawEnabled, setWithdrawEnabled] = useState(false);

  const [maxTransfer, setMaxTransfer] = useState(0);
  const [minWithdraw, setMinWithdraw] = useState(0);

  const [methods, setMethods] = useState({
    paypal: false,
    skrill: false,
    bank: false,
    custom: false,
  });

  /* --------------------------------
  LOAD SETTINGS (GET API)
  ---------------------------------*/
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/admin/wallet-settings");
        if (!res.ok) throw new Error("Failed to load settings");

        const data = await res.json();

        setWalletEnabled(data.wallet_enabled);
        setTransferEnabled(data.transfer_enabled);
        setWithdrawEnabled(data.withdraw_enabled);
        setMaxTransfer(data.max_transfer_amount);
        setMinWithdraw(data.min_withdraw_amount);
        setMethods(data.payment_methods);
      } catch (error) {
        toast.error("Failed to load wallet settings");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchSettings();
  }, []);

  /* --------------------------------
  SAVE SETTINGS (POST API)
  ---------------------------------*/
  const handleSave = async () => {
    setLoading(true);

    const payload = {
      wallet_enabled: walletEnabled,
      transfer_enabled: transferEnabled,
      withdraw_enabled: withdrawEnabled,
      max_transfer_amount: maxTransfer,
      min_withdraw_amount: minWithdraw,
      payment_methods: methods,
    };

    try {
      const res = await fetch("/api/admin/wallet-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");

      toast.success("Wallet settings updated successfully");
    } catch (error) {
      toast.error("Failed to save wallet settings");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl">
      {/* Title */}
      <div>
        <h1 className="text-xl font-semibold">Wallet Settings</h1>

        <div className="mt-3 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5 mt-0.5" />

            <p className="text-sm">
            Make sure you have configured Payments Settings
            </p>
        </div>
        </div>

      {/* Wallet */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SettingRow title="Wallet Enabled" description="Turn the wallet On and Off">
            <Switch checked={walletEnabled} onCheckedChange={setWalletEnabled} />
          </SettingRow>

          <SettingRow
            title="Transfer Money Enabled"
            description="Turn transfer money between users On and Off"
          >
            <Switch
              checked={transferEnabled}
              onCheckedChange={setTransferEnabled}
              disabled={!walletEnabled}
            />
          </SettingRow>

          <SettingRow
            title="Maximum Transfer Amount (USD)"
            description="0 means unlimited transfer"
          >
            <Input
              type="number"
              className="w-40"
              value={maxTransfer}
              disabled={!walletEnabled}
              onChange={(e) => setMaxTransfer(Number(e.target.value))}
            />
          </SettingRow>

          <SettingRow
            title="Users Can Withdraw Money"
            description="Allow users to withdraw money from wallet"
          >
            <Switch
              checked={withdrawEnabled}
              onCheckedChange={setWithdrawEnabled}
              disabled={!walletEnabled}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Withdrawal */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Methods */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              Payment Method
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(methods).map(([key, value]) => (
                <MethodCheckbox
                  key={key}
                  label={key.replace("_", " ").toUpperCase()}
                  checked={value}
                  onChange={(v) =>
                    setMethods({ ...methods, [key]: v })
                  }
                />
              ))}
            </div>
          </div>

          <SettingRow
            title="Minimum Withdrawal Request (USD)"
            description="Minimum amount required for withdrawal"
          >
            <Input
              type="number"
              className="w-40"
              value={minWithdraw}
              disabled={!withdrawEnabled}
              onChange={(e) => setMinWithdraw(Number(e.target.value))}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------
 Reusable Components
---------------------------------*/
function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function MethodCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Label className="flex items-center gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/30">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <span className="text-sm">{label}</span>
    </Label>
  );
}
