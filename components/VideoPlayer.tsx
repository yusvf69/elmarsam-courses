"use client";

import dynamic from "next/dynamic";
import { getYouTubeId } from "@/lib/utils";
import { useState, useEffect } from "react";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface VideoPlayerProps {
  url: string;
  useLocalStream?: boolean;
  mimeType?: string;
  onEnded?: () => void;
}

export const VideoPlayer = ({
  url,
  useLocalStream = false,
  mimeType,
  onEnded,
}: VideoPlayerProps) => {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // Check if it's a YouTube URL
  const videoId = getYouTubeId(url);

  useEffect(() => {
    setIsClient(true);
    if (videoId && typeof window !== "undefined") {
      const origin = window.location.origin;
      const url = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&controls=1&color=white&iv_load_policy=3&fs=1&disablekb=1&playsinline=1&origin=${encodeURIComponent(origin)}`;
      setEmbedUrl(url);
    }
  }, [videoId]);

  // Use custom iframe for YouTube URLs to completely hide branding
  if (videoId && isClient && embedUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          style={{
            borderRadius: "8px",
            backgroundColor: "#000",
          }}
          title="Video Player"
        />
      </div>
    );
  }

  // For non-YouTube URLs, use local streaming if requested
  if (useLocalStream && url) {
    return (
      <div className="relative aspect-video">
        <video
          controls
          width="100%"
          height="100%"
          className="w-full h-full"
          preload="metadata"
          onEnded={onEnded}
        >
          <source src={url} type={mimeType || "video/mp4"} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Fallback to ReactPlayer for other URLs
  return (
    <div className="relative aspect-video">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={false}
        onEnded={onEnded}
      />
    </div>
  );
};
