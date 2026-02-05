import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EditProfileModal({ user, onUpdated }: any) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    country: user.country || "",
    address: {
      fullAddress: user.address?.fullAddress || "",
      city: user.address?.city || "",
      state: user.address?.state || "",
    },
    contact: {
      phone: user.contact?.phone || "",
      email: user.contact?.email || "",
      website: user.contact?.website || "",
    },
  });

  const submit = async () => {
    try {
      setLoading(true);
      const res = await api.patch("/users/me", form);

      if (res.data?.ok) {
        toast.success("Profile updated");
        onUpdated(res.data.user);
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <Input
        placeholder="Country"
        value={form.country}
        onChange={(e) =>
          setForm({ ...form, country: e.target.value })
        }
      />

      <Input
        placeholder="Full address"
        value={form.address.fullAddress}
        onChange={(e) =>
          setForm({
            ...form,
            address: {
              ...form.address,
              fullAddress: e.target.value,
            },
          })
        }
      />

      <Input
        placeholder="City"
        value={form.address.city}
        onChange={(e) =>
          setForm({
            ...form,
            address: {
              ...form.address,
              city: e.target.value,
            },
          })
        }
      />

      <Input
        placeholder="State"
        value={form.address.state}
        onChange={(e) =>
          setForm({
            ...form,
            address: {
              ...form.address,
              state: e.target.value,
            },
          })
        }
      />

      <Input
        placeholder="Phone"
        value={form.contact.phone}
        onChange={(e) =>
          setForm({
            ...form,
            contact: {
              ...form.contact,
              phone: e.target.value,
            },
          })
        }
      />

      <Input
        placeholder="Email"
        value={form.contact.email}
        onChange={(e) =>
          setForm({
            ...form,
            contact: {
              ...form.contact,
              email: e.target.value,
            },
          })
        }
      />

      <Input
        placeholder="Website"
        value={form.contact.website}
        onChange={(e) =>
          setForm({
            ...form,
            contact: {
              ...form.contact,
              website: e.target.value,
            },
          })
        }
      />

      <Button
        onClick={submit}
        disabled={loading}
        className="w-full"
      >
        Save changes
      </Button>
    </div>
  );
}
