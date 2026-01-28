"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GroupForm } from "./GroupForm";
import { useCreateGroup } from "@/hooks/useCreateGroup";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateEditGroupModal({ open, onClose }: Props) {
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

  const { createGroup, loading } = useCreateGroup(() => {
    onClose();
  });

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    createGroup(values);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <GroupForm
          values={values}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
