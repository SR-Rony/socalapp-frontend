"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GroupFormProps {
  values: any;
  onChange: (key: string, value: any) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function GroupForm({
  values,
  onChange,
  onSubmit,
  loading,
}: GroupFormProps) {
  return (
    <div className="space-y-4">
      {/* Group Name */}
      <div className="space-y-1">
        <Label>Group name</Label>
        <Input
          placeholder="Enter group name"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
        />
      </div>

      {/* Privacy */}
      <div className="space-y-1">
        <Label>Privacy</Label>
        <Select
          value={values.privacy}
          onValueChange={(v) => onChange("privacy", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-1">
        <Label>Category</Label>
        <Input
          placeholder="e.g. Education, Tech"
          value={values.category}
          onChange={(e) => onChange("category", e.target.value)}
        />
      </div>

      {/* About */}
      <div className="space-y-1">
        <Label>About</Label>
        <Input
          placeholder="Short description"
          value={values.about}
          onChange={(e) => onChange("about", e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Country</Label>
          <Input
            value={values.location.country}
            onChange={(e) =>
              onChange("location", {
                ...values.location,
                country: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label>City</Label>
          <Input
            value={values.location.city}
            onChange={(e) =>
              onChange("location", {
                ...values.location,
                city: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={onSubmit}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Saving..." : "Save Group"}
      </Button>
    </div>
  );
}
