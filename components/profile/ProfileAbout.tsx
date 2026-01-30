// components/profile/ProfileAbout.tsx
// ================================
"use client";


import { useEffect, useState } from "react";
import axios from "axios";


export default function ProfileAbout() {
const [profile, setProfile] = useState<any>(null);


useEffect(() => {
axios.get("/users/me").then((res) => setProfile(res.data.user));
}, []);


if (!profile) return null;


return (
<div className="bg-white rounded-xl p-4 border">
<h2 className="font-semibold mb-2">About</h2>


<p className="text-sm">📍 {profile.country || "Not set"}</p>
<p className="text-sm">📧 {profile.contact?.email || "Not set"}</p>
<p className="text-sm">📞 {profile.contact?.phone || "Not set"}</p>
</div>
);
}