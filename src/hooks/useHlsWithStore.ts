import { useEffect, useRef, useState, useMemo } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
  onReady?: () => void;
}

export function useHlsWithStore({
  src,
  cameraId,
  segments,
  onReady,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentTimestamp = usePlaybackStore((s) => s.currentTimestamp);
  const speedStr = usePlaybackStore((s) => s.speed);

  const speedMultiplier = parseFloat(speedStr.replace("x", "")) || 1;

  /* ---------- BUILD SEGMENT OFFSETS ---------- */
  const segmentOffsets = useMemo(() => {
    let acc = 0;
    return segments.map((s) => {
      const duration =
        (s.endTime.getTime() - s.startTime.getTime()) / 1000;
      const offset = acc;
      acc += duration;
      return { ...s, offset, duration };
    });
  }, [segments]);

  /* ---------- RESET ---------- */
  useEffect(() => {
    setFirstFrameReady(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [src, cameraId]);

  /* ---------- INIT HLS ---------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    const hls = new Hls({
      lowLatencyMode: true,
      maxBufferLength: 10,
    });

    hlsRef.current = hls;
    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(src);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => {});
    });

    video.onplaying = () => {
      if (!firstFrameReady) {
        setFirstFrameReady(true);
        onReady?.();
      }
    };

    return () => {
      hls.destroy();
      hlsRef.current = null;
    };
  }, [src, cameraId]);

  /* ---------- SEEK + GAP + END HANDLING ---------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !firstFrameReady || !segmentOffsets.length) return;

    const { setHasVideo, setIsPlaying } =
      usePlaybackStore.getState();

    const lastSegment =
      segmentOffsets[segmentOffsets.length - 1];

    /* ----- AFTER LAST RECORDING ----- */
    if (currentTimestamp > lastSegment.endTime) {
      setHasVideo(false);
      setIsPlaying(false);
      video.pause();
      return;
    }

    /* ----- FIND ACTIVE / NEXT SEGMENT ----- */
    const seg =
      segmentOffsets.find(
        (s) =>
          currentTimestamp >= s.startTime &&
          currentTimestamp <= s.endTime
      ) ||
      segmentOffsets.find(
        (s) => currentTimestamp < s.startTime
      );

    if (!seg) {
      setHasVideo(false);
      video.pause();
      return;
    }

    /* ----- GAP HANDLING ----- */
    if (currentTimestamp < seg.startTime) {
      setHasVideo(true);

      const jumpTime = seg.offset;
      if (Math.abs(video.currentTime - jumpTime) > 0.3) {
        video.currentTime = jumpTime;
      }

      video.pause();
      return;
    }

    /* ----- NORMAL SEEK ----- */
    setHasVideo(true);

    const logicalSeconds =
      (currentTimestamp.getTime() -
        seg.startTime.getTime()) /
      1000;

    const playlistTime =
      seg.offset + Math.max(0, logicalSeconds);

    if (Math.abs(video.currentTime - playlistTime) > 0.3) {
      video.currentTime = playlistTime;
    }

    if (isPlaying) {
      video.playbackRate = Math.min(speedMultiplier, 16);
      video.muted = speedMultiplier > 16;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [
    currentTimestamp,
    segmentOffsets,
    firstFrameReady,
    isPlaying,
    speedMultiplier,
  ]);

  return { videoRef, firstFrameReady };
}