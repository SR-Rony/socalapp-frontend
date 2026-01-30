// components/profile/ProfileHeader.tsx
// ================================
"use client";


import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";


export default function ProfileHeader() {
const [profile, setProfile] = useState<any>(null);


useEffect(() => {
axios.get("/users/me").then((res) => setProfile(res.data.user));
}, []);


if (!profile) return null;


return (
<div className="bg-white rounded-xl shadow overflow-hidden">
{/* Cover */}
<div className="relative h-56 bg-gray-200">
{profile.cover?.url && (
<Image src={profile.cover.url} alt="cover" fill className="object-cover" />
)}
</div>


{/* Avatar */}
<div className="flex items-end px-6 -mt-16">
<div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
{profile.avatar?.url && (
<Image src={profile.avatar.url} alt="avatar" fill className="object-cover" />
)}
</div>


<div className="ml-6 mb-4">
<h1 className="text-2xl font-bold">{profile.name}</h1>
<p className="text-muted-foreground">@{profile.username}</p>
</div>
</div>
</div>
);
}