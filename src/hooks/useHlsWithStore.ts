import { useEffect, useMemo, useRef } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
  isMaster?: boolean; 
}

export function useHlsWithStore({
  src,
  cameraId,
  segments,
  isMaster = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const { globalTime, isPlaying, playbackSpeed, isSeeking, updateFromVideo } =
    usePlaybackStore();

  const segmentOffsets = useMemo(() => {
    let acc = 0;
    return segments.map((s) => {
      const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000;
      const offset = acc;
      acc += duration;
      return { ...s, offset, duration };
    });
  }, [segments]);

  // HLS Init
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    console.log("[HLS] attaching media for camera", cameraId);
    const hls = new Hls({ maxBufferLength: 20, enableWorker: true });
    hlsRef.current = hls;
    hls.attachMedia(video);
    hls.loadSource(src);

    return () => {
      console.log("[HLS] destroy for camera", cameraId);
      hls.destroy();
      hlsRef.current = null;
    };
  }, [src, cameraId]);

  // Master → Video Sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    const seg = segmentOffsets.find(
      (s) => globalTime >= s.startTime && globalTime <= s.endTime
    );

    if (!seg) {
      console.log("[HLS] No segment found at globalTime", globalTime);
      video.pause();
      return;
    }

    const logicalSeconds = (globalTime.getTime() - seg.startTime.getTime()) / 1000;
    const targetTime = seg.offset + logicalSeconds;

    if (Math.abs(video.currentTime - targetTime) > 0.5) {
      console.log(
        `[HLS] Seeking camera ${cameraId} to ${targetTime} (segment offset ${seg.offset})`
      );
      video.currentTime = targetTime;
    }

    if (isPlaying) {
      video.playbackRate = Math.min(playbackSpeed, 16);
      video.muted = playbackSpeed > 4;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [globalTime, isPlaying, playbackSpeed, segmentOffsets]);

  // Video → Master sync (only master)
  useEffect(() => {
    if (!isMaster) return;
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    let rafId: number;

    const sync = () => {
      if (!isPlaying || isSeeking) {
        rafId = requestAnimationFrame(sync);
        return;
      }

      const current = video.currentTime;
      const seg = segmentOffsets.find(
        (s) => current >= s.offset && current <= s.offset + s.duration
      );

      if (seg) {
        const realTime = new Date(seg.startTime.getTime() + (current - seg.offset) * 1000);
        updateFromVideo(realTime);
      }

      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [isMaster, isPlaying, isSeeking, segmentOffsets]);

  return { videoRef };
}