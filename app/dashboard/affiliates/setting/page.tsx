"use client";

import { useState } from "react";
import {
  Users,
  Wallet,
  CreditCard,
  AlertTriangle,
  Layers,
  Percent,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/* --------------------------------
 Affiliates Settings Page
---------------------------------*/
export default function AffiliatesSettingsPage() {
  const [affiliatesEnabled, setAffiliatesEnabled] = useState(true);
  const [withdrawEnabled, setWithdrawEnabled] = useState(true);
  const [transferToWallet, setTransferToWallet] = useState(true);
  const [accountActivation, setAccountActivation] = useState(true);

  const [minWithdraw, setMinWithdraw] = useState(50);
  const [customMethodName, setCustomMethodName] = useState("AT&T Cash");

  const [paymentType, setPaymentType] = useState<"fixed" | "percentage">(
    "fixed"
  );
  const [payWho, setPayWho] = useState<"buyer" | "seller">("buyer");

  const [methods, setMethods] = useState({
    paypal: true,
    skrill: false,
    bank: true,
    custom: true,
  });

  const [levels, setLevels] = useState([
    { level: 1, price: 0.25, percentage: 5 },
    { level: 2, price: 0.2, percentage: 4 },
    { level: 3, price: 0.15, percentage: 3 },
    { level: 4, price: 0.1, percentage: 2 },
    { level: 5, price: 0.05, percentage: 1 },
  ]);

  /* -----------------------------
    SAVE (API READY)
  ------------------------------*/
  const handleSave = async () => {
    const payload = {
        affiliates_enabled: affiliatesEnabled,
        withdraw_enabled: withdrawEnabled,
        transfer_to_wallet: transferToWallet,
        account_activation_required: accountActivation,

        minimum_withdrawal_amount: minWithdraw,
        custom_method_name: customMethodName,

        payment_type: paymentType,
        pay_referrer_who: payWho,

        payment_methods: {
        paypal: methods.paypal,
        skrill: methods.skrill,
        bank_transfer: methods.bank,
        custom_method: methods.custom,
        },

        affiliate_levels: levels,
    };

    // 🔔 Alert এ data দেখানোর জন্য
    alert(
        "AFFILIATE SETTINGS DATA 👇\n\n" +
        JSON.stringify(payload, null, 2)
    );

    /*
    ✅ Future API hit (যখন দরকার হবে)
    await fetch("/api/admin/affiliate-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    */
    };


  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Affiliates Settings
        </h1>

        {/* Warning */}
        <div className="mt-3 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <p className="text-sm">
            Affiliate earning will not be counted unless the new user activated
            his account.
          </p>
        </div>
      </div>

      {/* ================= General ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <SettingRow
            title="Affiliates Enabled"
            description="Enable or Disable the affiliates system"
          >
            <Switch
              checked={affiliatesEnabled}
              onCheckedChange={setAffiliatesEnabled}
            />
          </SettingRow>

          <SettingRow
            title="Users Can Withdraw Earned Money"
            description="If enabled users will be able to withdraw earned money"
          >
            <Switch
              checked={withdrawEnabled}
              onCheckedChange={setWithdrawEnabled}
            />
          </SettingRow>

          <SettingRow
            title="Users Can Transfer Earned Money To Wallet"
            description="Wallet system must be enabled"
          >
            <Switch
              checked={transferToWallet}
              onCheckedChange={setTransferToWallet}
            />
          </SettingRow>

          <SettingRow
            title="Account Activation Enabled"
            description="User must activate account to earn affiliate money"
          >
            <Switch
              checked={accountActivation}
              onCheckedChange={setAccountActivation}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* ================= Withdrawal ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Withdrawal Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(methods).map(([key, value]) => (
              <Label
                key={key}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <Checkbox
                  checked={value}
                  onCheckedChange={(v) =>
                    setMethods({ ...methods, [key]: Boolean(v) })
                  }
                />
                <span className="text-sm capitalize">
                  {key.replace("_", " ")}
                </span>
              </Label>
            ))}
          </div>

          <SettingRow
            title="Custom Method Name"
            description="Set the name of your custom withdrawal payment method"
          >
            <Input
              className="w-60"
              value={customMethodName}
              onChange={(e) => setCustomMethodName(e.target.value)}
            />
          </SettingRow>

          <SettingRow
            title="Minimum Withdrawal Request (USD)"
            description="The minimum amount user can send withdrawal request"
          >
            <Input
              type="number"
              className="w-40"
              value={minWithdraw}
              onChange={(e) => setMinWithdraw(Number(e.target.value))}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* ================= Commission ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            Commission Settings
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <SettingRow
            title="Payment Type"
            description="Fixed price or referred percentage"
          >
            <Select value={paymentType} onValueChange={(v: any) => setPaymentType(v)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Price</SelectItem>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>

          <SettingRow
            title="Pay The Referrer Who"
            description="Select who invited the buyer or seller"
          >
            <Select value={payWho} onValueChange={(v: any) => setPayWho(v)}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Invited The Buyer</SelectItem>
                <SelectItem value="seller">Invited The Seller</SelectItem>
              </SelectContent>
            </Select>
          </SettingRow>
        </CardContent>
      </Card>

      {/* ================= Levels ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Affiliate Levels
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {levels.map((lvl, index) => (
            <div
              key={lvl.level}
              className="rounded-lg border p-4 space-y-4"
            >
              <h3 className="text-sm font-semibold">
                Level {lvl.level}
              </h3>

              <div className="space-y-1">
                <Label>Price / Referred (USD)</Label>
                <Input
                  type="number"
                  value={lvl.price}
                  onChange={(e) => {
                    const copy = [...levels];
                    copy[index].price = Number(e.target.value);
                    setLevels(copy);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  The fixed price for each new referred user (level {lvl.level})
                </p>
              </div>

              <div className="space-y-1">
                <Label>Percentage (%)</Label>
                <Input
                  type="number"
                  value={lvl.percentage}
                  onChange={(e) => {
                    const copy = [...levels];
                    copy[index].percentage = Number(e.target.value);
                    setLevels(copy);
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  The percentage from price for each new referred user (level {lvl.level})
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ================= Save ================= */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="px-8">
          Save Changes
        </Button>
      </div>
    </div>
  );
}

/* --------------------------------
 Reusable Setting Row
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
