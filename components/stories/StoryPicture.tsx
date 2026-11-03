"use client";
import { useState } from "react";
import StoryIllustration from "@/components/StoryIllustration";
import { isStoryPicture, storyImageSrcSet } from "@/lib/story-images";

// A story picture (cover or page), 4:3, in two sizes. A drawn scene name, a
// missing value or a file that fails to load shows the old drawn scene
// (components/StoryIllustration.tsx), or the open book.
export default function StoryPicture({
  src,
  alt,
  sizes,
  priority = false,
  endLabel,
  className = "",
}: {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  endLabel?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const picture = isStoryPicture(src) && !failed;
  return (
    <div className={`aspect-[4/3] w-full overflow-hidden bg-owl-cream ${className}`}>
      {picture ? (
        // eslint-disable-next-line @next/next/no-img-element -- static WebP files in two sizes, no image optimizer on Workers
        <img
          src={src}
          srcSet={storyImageSrcSet(src)}
          sizes={sizes}
          width={1200}
          height={900}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div role="img" aria-label={alt} className="flex h-full w-full items-center">
          <StoryIllustration scene={failed ? null : src} endLabel={endLabel} />
        </div>
      )}
    </div>
  );
}
