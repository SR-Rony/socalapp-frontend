import VideoFeed from "@/components/video/VideoFeed";

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
    
  return (
    <VideoFeed
      type="reels"               // এটা লাগবে
      singleVideoId={params.id}
    />
  );
}