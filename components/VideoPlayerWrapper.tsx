"use client";

import { VideoPlayer } from "./VideoPlayer";
import { handleVideoEndedAction } from "@/app/actions/handleVideoEndedAction";
import { LoomEmbed } from "./LoomEmbed";

interface VideoPlayerWrapperProps {
  courseId: string;
  lessonId: string;
  videoUrl?: string;
  videoFileUrl?: string;
  mimeType?: string;
  loomUrl?: string;
}

export function VideoPlayerWrapper({
  courseId,
  lessonId,
  videoUrl,
  videoFileUrl,
  mimeType,
  loomUrl,
}: VideoPlayerWrapperProps) {
  const handleEnded = () => {
    handleVideoEndedAction(courseId, lessonId);
  };

  if (videoFileUrl) {
    return (
      <VideoPlayer
        url={videoFileUrl}
        useLocalStream={true}
        mimeType={mimeType}
        onEnded={handleEnded}
      />
    );
  }

  if (videoUrl) {
    return (
      <VideoPlayer
        url={videoUrl}
        useLocalStream={true}
        onEnded={handleEnded}
      />
    );
  }

  if (loomUrl) {
      return <LoomEmbed shareUrl={loomUrl} />
  }

  return null;
}
