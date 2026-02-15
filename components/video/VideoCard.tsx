"use client";

type Props = {
  video: {
    videoUrl: string;
    caption?: string;
    user: {
      name: string;
      avatar?: { url: string };
    };
  };
};

export default function VideoCard({ video }: Props) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* user */}
      <div className="flex items-center gap-3 p-3">
        {video.user.avatar?.url && (
          <img
            src={video.user.avatar.url}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span className="font-medium">{video.user.name}</span>
      </div>

      {/* video */}
      <video
        src={video.videoUrl}
        controls
        className="w-full max-h-[500px] bg-black"
      />

      {/* caption */}
      {video.caption && <p className="p-3 text-sm">{video.caption}</p>}
    </div>
  );
}
