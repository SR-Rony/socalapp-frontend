import { SignedImage } from "../common/SignedImage";
import { SignedVideo } from "../common/SignedVideo";

interface Media {
  type: "image" | "video";
  key?: string;
  url?: string;
  provider?: string;
}


export default function PostMedia({ media }: { media: Media }) {
  if (!media) return null;

  if (media.type === "image") {
    return <SignedImage url={media.url} keyPath={media.key} provider={media.provider} className="w-full h-full" />;
  }

  if (media.type === "video") {
      return (
        <SignedVideo
          key={media.key} // ✅ important
          url={media.url}
          keyPath={media.key}
          provider={media.provider}
          mode="feed"
        />
      );
    }

  return null;
}
