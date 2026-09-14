"use client";

import Image from "next/image";

const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|ogg)$/i;

type SolutionMediaProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Drop-in replacement for `<Image fill ... />` wherever `heroImage` is
 * rendered. If the path looks like a video file, renders an autoplaying,
 * muted, looping <video> instead of an <Image>. Both fill their parent
 * (the parent must be `relative` with a set height, same as before).
 */
export default function SolutionMedia({
  src,
  alt,
  className = "",
  priority = false,
}: SolutionMediaProps) {
  const isVideo = VIDEO_EXTENSIONS.test(src);

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload={priority ? "auto" : "metadata"}
        aria-label={alt}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      unoptimized
      className={`object-cover ${className}`}
    />
  );
}
