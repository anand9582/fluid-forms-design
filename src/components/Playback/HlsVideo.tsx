import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function useHls(src: string, isMuted = true, isPlaying = true) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playRetryRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Initialize HLS only once
    if (!hlsRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          lowLatencyMode: true,
          maxBufferLength: 10,
          backBufferLength: 0,
        });
        hlsRef.current = hls;
        hls.attachMedia(video);

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(src);
          hls.startLoad(0);
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          tryPlay();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
        });
      } else {
        video.src = src;
      }
    } else {
      // HLS already exists, just load new src
      if (Hls.isSupported() && hlsRef.current) {
        hlsRef.current.loadSource(src);
        hlsRef.current.startLoad(0);
      } else {
        video.src = src;
      }
    }

    video.muted = isMuted;
    video.playsInline = true;
    video.preload = "auto";

    const tryPlay = () => {
      if (!video) return;

      // Retry until video can play
      if (video.readyState >= 3) {
        video.play().catch(() => {
          playRetryRef.current = setTimeout(tryPlay, 50);
        });
      } else {
        playRetryRef.current = setTimeout(tryPlay, 50);
      }
    };

    // Sync play/pause immediately
    if (isPlaying) {
      tryPlay();
    } else {
      video.pause();
      if (playRetryRef.current) clearTimeout(playRetryRef.current);
    }

    return () => {
      if (playRetryRef.current) clearTimeout(playRetryRef.current);
    };
  }, [src, isMuted, isPlaying]);

  return videoRef;
}