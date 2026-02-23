"use client";

import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

export default function CreateGroupPage() {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const [rules, setRules] = useState<string[]>([""]);

  const [memberApproval, setMemberApproval] = useState(false);
  const [postApproval, setPostApproval] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverUploaded, setCoverUploaded] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter()

  // ===============================
  // rules
  // ===============================
  const updateRule = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const addRule = () => setRules([...rules, ""]);
  const removeRule = (index: number) =>
    setRules(rules.filter((_, i) => i !== index));

  // ===============================
  // cover preview
  // ===============================
  const handleCoverChange = (file: File) => {
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setCoverUploaded(null);
  };

  // ===============================
  // upload cover → Wasabi
  // ===============================
  const uploadCover = async () => {
    if (!coverFile) return null;

    const fd = new FormData();
    fd.append("file", coverFile);

    const res = await api.post("/upload/image", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.ok) {
      setCoverUploaded(res.data);
      return res.data;
    } else {
      throw new Error("Cover upload failed");
    }
  };

  // ===============================
  // submit
  // ===============================
  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Group name is required");

    setLoading(true);
    try {
      let coverData = coverUploaded;

      // 🔹 upload cover first if not uploaded yet
      if (coverFile && !coverUploaded) {
        coverData = await uploadCover();
      }

      const payload = {
        name,
        privacy,
        about,
        category,
        location: {
          country,
          city,
        },
        rules: rules.filter((r) => r.trim() !== ""),
        approval: {
          memberApprovalRequired: memberApproval,
          postApprovalRequired: postApproval,
        },
        coverUrl: coverData
          ? {
              key: coverData.key,
              url: coverData.url,
              provider: coverData.provider,
            }
          : undefined,
      };

      const res = await api.post("/groups/create", payload);

      if (res.data.success) {
        toast.success("Group created successfully!");

        // reset form
        setName("");
        setPrivacy("public");
        setAbout("");
        setCategory("");
        setCountry("");
        setCity("");
        setRules([""]);
        setMemberApproval(false);
        setPostApproval(false);
        setCoverFile(null);
        setCoverPreview(null);
        setCoverUploaded(null);

        setTimeout(()=>{
          router.push("/groups/my")
        },1000)

      } else {
        toast.error(res.data.message || "Failed to create group");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err.message || "Error creating group"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Group</h1>

      {/* name */}
      <div>
        <label className="block mb-1 font-medium">Group Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
        />
      </div>

      {/* privacy */}
      <div>
        <label className="block mb-1 font-medium">Privacy</label>
        <Select onValueChange={setPrivacy} defaultValue={privacy}>
          <SelectTrigger>
            <SelectValue placeholder="Select privacy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="secret">Secret</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* about */}
      <div>
        <label className="block mb-1 font-medium">About</label>
        <Textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Describe your group"
        />
      </div>

      {/* category */}
      <div>
        <label className="block mb-1 font-medium">Category</label>
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Technology, Sports"
        />
      </div>

      {/* cover */}
      <div>
        <label className="block mb-1 font-medium">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleCoverChange(e.target.files[0])
          }
        />

        {coverPreview && (
          <img
            src={coverPreview}
            className="mt-2 w-full h-40 object-cover rounded-md"
          />
        )}
      </div>

      {/* location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Country</label>
          <Input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">City</label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>
      </div>

      {/* rules */}
      <div>
        <label className="block mb-1 font-medium">Rules</label>
        {rules.map((rule, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <Input
              value={rule}
              onChange={(e) => updateRule(index, e.target.value)}
              placeholder={`Rule ${index + 1}`}
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeRule(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addRule}>
          Add Rule
        </Button>
      </div>

      {/* approvals */}
      <div className="flex gap-6 items-center">
        <div className="flex gap-2 items-center">
          <Switch
            checked={memberApproval}
            onCheckedChange={setMemberApproval}
          />
          <span>Member Approval Required</span>
        </div>

        <div className="flex gap-2 items-center">
          <Switch checked={postApproval} onCheckedChange={setPostApproval} />
          <span>Post Approval Required</span>
        </div>
      </div>

      {/* submit */}
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Group"}
      </Button>
    </div>
  );
}