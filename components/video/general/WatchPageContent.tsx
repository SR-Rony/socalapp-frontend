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
  const [others, setOthers] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get(`videos/feed/general?limit=50`);
        const allVideos: VideoItem[] = res.data.items || [];

        // 🎬 main video
        let mainVideo = allVideos.find((v) => v._id === videoId);

        if (!mainVideo) mainVideo = allVideos[0] || null;

        if (mainVideo) {
          setVideo(mainVideo);

          // 📺 related videos
          const relatedVideos = allVideos.filter(
            (v) =>
              v._id !== mainVideo!._id &&
              v.subCategory === mainVideo!.subCategory
          );

          setRelated(relatedVideos);

          // 📺 other videos (different category)
          const otherVideos = allVideos.filter(
            (v) =>
              v._id !== mainVideo!._id &&
              v.subCategory !== mainVideo!.subCategory
          );

          setOthers(otherVideos);
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

        {/* Right Sidebar Videos */}
        <div className="lg:col-span-4 space-y-6">

          {/* Related Videos */}
          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Related videos
              </h3>

              <RelatedVideoList videos={related} />
            </div>
          )}

          {/* Other Videos */}
          <div>
            <h3 className="text-sm font-semibold mb-3">
              {related.length > 0 ? "More videos" : "Videos"}
            </h3>

            <RelatedVideoList videos={others} />
          </div>

        </div>
      </div>
    </div>
  );
}