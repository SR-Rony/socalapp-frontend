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
    return <SignedImage url={media.url} keyPath={media.key} provider={media.provider} />;
  }

  if (media.type === "video") {
    return <SignedVideo
        url={media.url}
        keyPath={media.key}
        provider={media.provider}
      />;
  }

  return null;
}
