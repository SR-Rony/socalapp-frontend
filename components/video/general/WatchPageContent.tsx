"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import VideoPlayerSection from "./VideoPlayerSection";
import RelatedVideoList from "./RelatedVideoList";
import type { VideoItem } from "../types/video";

type Props = {
  videoId: string;
};

export default function WatchPageContent({ videoId }: Props) {
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [related, setRelated] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // ✅ backend কে touch না করে general videos fetch
        const res = await api.get(`videos/feed/general?limit=50`); 
        const videos: VideoItem[] = res.data.items || [];

        // 🎬 main video by id
        let mainVideo = videos.find(v => v._id === videoId);
        

        // fallback: first video
        if (!mainVideo) mainVideo = videos[0] || null;

        if (mainVideo) {
          setVideo(mainVideo);

          // 📺 related videos
          const relatedVideos = videos.filter(
            v => v._id !== mainVideo!._id && v.subCategory === mainVideo!.subCategory
          );

          setRelated(relatedVideos);
        }
      } catch (err) {
        console.error("Video fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [videoId]);

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found</p>;

  return (
    <div className="w-full px-4 py-6 container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 🎬 Left - Main Video */}
        <div className="lg:col-span-8">
          <VideoPlayerSection video={video} />
        </div>

        {/* 📺 Right - Related Videos */}
        <div className="lg:col-span-4">
          <RelatedVideoList videos={related} />
        </div>
      </div>
    </div>
  );
}
