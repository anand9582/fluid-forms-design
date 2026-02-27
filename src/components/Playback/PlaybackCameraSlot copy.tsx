import React from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { useHls } from "@/components/Playback/HlsVideo";
import { PlaybackState } from "@/hooks/use-playback";

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (cameraId: string) => boolean;
  errorMessage?: string;
  onVideoPlaying: (cameraId: string) => void;
  onVideoWaiting: (cameraId: string) => void;
  playback: PlaybackState; 
}

export function PlaybackCameraSlot({
  index,
  cameraId,
  selected,
  onSelect,
  onCameraDrop,
  getVideoSrc,
  isCameraLoading,
  errorMessage,
  onVideoPlaying,
  onVideoWaiting,
   playback,
}: Props) {

  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",

    drop: (item: { cameraId: string }, monitor) => {
      if (monitor.didDrop()) return;

      onCameraDrop(item.cameraId, index);
    },

    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const src = cameraId ? getVideoSrc(cameraId) : "";
  const videoRef = useHls(src);

  return (
    <div
      ref={dropRef}
      onClick={onSelect}
      className={cn(
        "relative w-full h-full overflow-hidden border",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* VIDEO */}
      {cameraId && (
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          onPlaying={() => onVideoPlaying(cameraId)}
          onWaiting={() => onVideoWaiting(cameraId)}
        />
      )}

      {/* EMPTY SLOT */}
      {!cameraId && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
          <Devices className="h-4 w-4" />
          <span className="text-sm font-medium">Drop Camera</span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm px-3 text-center">
          {errorMessage}
        </div>
      )}

      {/* LOADING */}
      {cameraId && !errorMessage && isCameraLoading(cameraId) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span className="text-xs">Loading stream…</span>
          </div>
        </div>
      )}
    </div>
  );


  
}


// /dldldld


import React, { useEffect, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import Hls from "hls.js";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (cameraId: string) => boolean;
  errorMessage?: string;
}

export function PlaybackCameraSlot({
  index,
  cameraId,
  selected,
  onSelect,
  onCameraDrop,
  getVideoSrc,
  isCameraLoading,
  errorMessage,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isReady, setIsReady] = useState(false);

  /* ---------------- DRAG DROP ---------------- */
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) => {
      onCameraDrop(item.cameraId, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  dropRef(containerRef);

  /* ---------------- HTML-STYLE HLS PLAY ---------------- */
  function playHls(src: string) {
    const video = videoRef.current;
    if (!video || !src) return;

    console.log("▶ HTML-style playHls", src);
    setIsReady(false);

    // ✅ create HLS only once (HTML jaisa)
    if (!hlsRef.current && Hls.isSupported()) {
      hlsRef.current = new Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        enableWorker: true,
        lowLatencyMode: true,
      });
    }

    if (hlsRef.current) {
      const hls = hlsRef.current;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.once(Hls.Events.MANIFEST_PARSED, () => {
        video
          .play()
          .then(() => console.log("▶ PLAY OK"))
          .catch((e) => console.error("❌ PLAY FAIL", e));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("⚠ HLS ERROR", data);
        if (data.fatal) {
          try {
            hls.recoverMediaError();
          } catch (e) {
            console.error("❌ HLS RECOVERY FAIL", e);
          }
        }
      });

      video.onplaying = () => {
        console.log("🟢 VIDEO PLAYING");
        setIsReady(true);
      };
    } else {
      // 🍎 Safari native HLS
      video.src = src;
      video
        .play()
        .then(() => console.log("▶ PLAY OK (Safari)"))
        .catch(() => {});
      video.onplaying = () => setIsReady(true);
    }
  }

  /* ---------------- CAMERA CHANGE ---------------- */
  useEffect(() => {
    if (!cameraId) return;

    const src = getVideoSrc(cameraId);
    if (!src) return;

    playHls(src);
  }, [cameraId]);

  /* ---------------- CLEANUP (ONLY ON UNMOUNT) ---------------- */
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  /* ---------------- UI ---------------- */
  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      className={cn(
        "relative w-full h-full overflow-hidden border cursor-pointer",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* VIDEO */}
      {cameraId && !errorMessage && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          autoPlay
          preload="auto"
        />
      )}

      {/* EMPTY SLOT */}
      {!cameraId && (
        <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
          <Devices className="h-4 w-4" />
          <span className="text-sm">Drop Camera</span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2">
          {errorMessage}
        </div>
      )}

      {/* LOADING */}
      {cameraId && (isCameraLoading(cameraId) || !isReady) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}