"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { groupService } from "@/services/group.service";
import { GroupForm } from "@/components/dashboard/group/GroupForm";

export default function CreateGroupPage() {
  const router = useRouter();

  const [values, setValues] = useState({
    name: "",
    privacy: "public",
    about: "",
    category: "",
    location: {
      country: "",
      city: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await groupService.createGroup(values);
      // ✅ redirect to group details page after creation
      // router.push(`dashboard/groups/${res.data.data.slug}/details`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold">Create New Group</h1>

      {error && (
        <p className="text-red-500 text-sm border-l-4 border-red-500 pl-2">
          {error}
        </p>
      )}

      <GroupForm
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <div className="text-right">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mr-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
