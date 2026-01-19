"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PostList from "@/components/post/PostList";
import StorySlider from "@/components/story/StorySlider";
import { useAppSelector } from "@/redux/hook/hook";
import PostComposer from "@/components/post/PostComposer";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, initialized } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    // wait until Redux hydration finishes
    if (initialized && !isAuthenticated) {
      toast.error("Please log in to continue.");
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  // wait for hydration
  if (!initialized) return null;

  // hide page if not authenticated
  if (!isAuthenticated) return null;

  return (
    <div className="pt-4">
      <PostComposer />
      <StorySlider />
      <PostList />
    </div>
  );
}
