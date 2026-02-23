// useHls.ts
import { useEffect, useRef } from "react";
import Hls from "hls.js";

export function useHls(
  src: string,
  isMuted = true,
  isPlaying = true,
  onReady?: () => void
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

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
          onReady?.(); 
          video.play().catch(() => {});
        });

        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.error("HLS error:", data);
        });
      } else {
        video.src = src;
      }
    } else {
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

    return () => {
      if (playRetryRef.current) clearTimeout(playRetryRef.current);
    };
  }, [src, isMuted, onReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (playRetryRef.current) {
      clearTimeout(playRetryRef.current);
      playRetryRef.current = null;
    }

    if (isPlaying) {
      const tryPlay = () => {
        if (!video) return;
        if (video.readyState >= 3) {
          video.play().catch(() => {
            playRetryRef.current = setTimeout(tryPlay, 50);
          });
        } else {
          playRetryRef.current = setTimeout(tryPlay, 50);
        }
      };
      tryPlay();
    } else {
      video.pause();
    }

    return () => {
      if (playRetryRef.current) clearTimeout(playRetryRef.current);
    };
  }, [isPlaying, src]);

  return videoRef;
}