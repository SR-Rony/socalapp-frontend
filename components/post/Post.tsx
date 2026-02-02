import Image from "next/image";
// import PostMedia from "./PostMedia";
import { SignedImage } from "@/components/common/SignedImage";
// import { SignedImage } from "../common/SignedImage";


export type PostData = {
  user: {
    name: string;
    avatar: string;
  };
  time: string;
  content: string;
  media?: {
    type: "image" | "video";
    key?: string;
    url?: string;
    provider?: string;
  } | null;
};

export default function Post({
  user,
  time,
  content,
  media,
}: PostData) {

  console.log("user",user);
  
  
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      {/* user */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          {/* <SignedImage url={user.avatar.url} keyPath={user.avatar.url} provider={media.provider} className="h-[420px]" />; */}
          {/* <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="rounded-full object-cover"
            unoptimized // optional for external avatars
          /> */}
          <SignedImage
            provider="wasabi"
            keyPath={user.avatar.key}
            url={user.avatar.url}
            alt="profile"
            style={{ width: 220, height: 220, objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>

      {/* text */}
      {content && <p>{content}</p>}

      {/* 🔥 media */}
      {/* {media && <PostMedia media={media} />} */}
    </div>
  );
}
