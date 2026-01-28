"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CompleteProfilePage() {
  const router = useRouter();

  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await api.patch("/users/other-info", {
        birthDate,
        country,
        age: Number(age),
      });

      router.replace("/me");
    } catch {
      alert("Profile completion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow space-y-5">
        <h1 className="text-2xl font-semibold text-center">
          Complete your profile
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
          onChange={(e) => setAge(e.target.value)}
        />

        <Button
          className="w-full"
          onClick={submit}
          disabled={loading}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
