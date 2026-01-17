"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState<number | "">("");

  const handleSubmit = async () => {
    if (!birthDate || !country || !age) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.patch("/users/other-info", {
        birthDate,
        country,
        age,
      });

      if (res.data?.success) {
        toast.success("Profile completed successfully");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="bg-white p-8 rounded-xl w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Complete Your Profile
        </h1>

        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <Input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
