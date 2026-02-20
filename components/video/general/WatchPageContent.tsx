"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import VideoPlayerSection from "./VideoPlayerSection";
import RelatedVideoList from "./RelatedVideoList";
import GeneralVideoCard from "../general/GeneralVideoCard";
import type { VideoItem } from "../types/video";

type Props = {
  videoId: string;
};

export default function WatchPageContent({ videoId }: Props) {
  const [video, setVideo] = useState<VideoItem | null>(null);
  const [related, setRelated] = useState<VideoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]); // 👈 all videos for bottom grid
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get(`videos/feed/general?limit=50`);
        const allVideos: VideoItem[] = res.data.items || [];

        setVideos(allVideos); // 👈 bottom grid এর জন্য

        // 🎬 main video
        let mainVideo = allVideos.find(v => v._id === videoId);

        if (!mainVideo) mainVideo = allVideos[0] || null;

        if (mainVideo) {
          setVideo(mainVideo);

          // 📺 related videos (same subCategory)
          const relatedVideos = allVideos.filter(
            v =>
              v._id !== mainVideo!._id &&
              v.subCategory === mainVideo!.subCategory
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
    <div className="w-full container mx-auto px-4 py-6">
      {/* 🎬 Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Video */}
        <div className="lg:col-span-8">
          <VideoPlayerSection video={video} />
        </div>

        {/* Related Videos */}
        <div className="lg:col-span-4">
          <RelatedVideoList videos={related} />
        </div>
      </div>

      {/* 📺 Bottom - More Videos Grid */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">More videos</h2>

        <div
          className="
            grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
          "
        >
          {videos
            .filter(v => v._id !== video._id) // current video বাদ
            .map(v => (
              <GeneralVideoCard key={v._id} video={v} />
            ))}
        </div>
      </div>
    </div>
  );
}