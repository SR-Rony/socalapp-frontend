
import { useResolvedMediaUrl } from "@/hooks/useResolvedMediaUrl";
import React, { memo } from "react";

type SignedImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  url?: string;
  keyPath?: string;
  provider?: string; // "wasabi"
  showLoader?: boolean;
  finalUri?:any
};

function SignedImageBase({url,keyPath,provider,showLoader = false,...rest}: SignedImageProps) {

  
  const  finalUri  = useResolvedMediaUrl({ url, keyPath, provider });
  

  if (!finalUri &&  showLoader) return <div>Loading...</div>;
  if (!finalUri) return null;

  return <img {...rest} src={finalUri} />;
  
}

export const SignedImage = memo(SignedImageBase);
