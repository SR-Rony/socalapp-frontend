import VideoFeed from "@/components/video/reel/VideoFeed";

export default function GeneralVideosPage() {
  return (
    <VideoFeed endpoint="/feed/videos/general" />
  );
}
