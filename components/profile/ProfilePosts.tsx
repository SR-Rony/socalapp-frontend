// components/profile/ProfilePosts.tsx
// ================================
"use client";


import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";


export default function ProfilePosts() {
const [posts, setPosts] = useState<any[]>([]);
const [cursor, setCursor] = useState<string | null>(null);
const [loading, setLoading] = useState(false);


const loadPosts = async () => {
setLoading(true);
const res = await axios.get("/users/me/posts", {
params: { cursor },
});


setPosts((p) => [...p, ...res.data.posts]);
setCursor(res.data.nextCursor);
setLoading(false);
};


useEffect(() => {
loadPosts();
}, []);


return (
<div className="space-y-4">
{posts.map((post) => (
<div key={post._id} className="bg-white border rounded-xl p-4">
<p className="font-medium">{post.text}</p>


{post.medias?.length > 0 && (
<div className="grid grid-cols-2 gap-2 mt-2">
{post.medias.map((m: any, i: number) => (
<img key={i} src={m.url} className="rounded-lg" />
))}
</div>
)}


<p className="text-xs text-muted-foreground mt-2">
{new Date(post.createdAt).toLocaleString()}
</p>
</div>
))}


{cursor && (
<Button variant="outline" onClick={loadPosts} disabled={loading}>
{loading ? "Loading..." : "Load more"}
</Button>
)}
</div>
);
}