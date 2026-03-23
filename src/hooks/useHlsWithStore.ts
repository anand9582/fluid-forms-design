import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { usePlaybackStore } from "@/Store/playbackStore";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
  slotIndex: number;
  isMaster?: boolean;
}

export function useHlsWithStore({ src, cameraId, segments, slotIndex }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const { globalTime, cameraTimes, isSync, isPlaying, playbackSpeed, isSeeking, slotSeeking } =
    usePlaybackStore();

  const currentTime = isSync ? globalTime : cameraTimes[slotIndex] || globalTime;
  const isCurrentSlotSeeking = isSync ? isSeeking : (slotSeeking[slotIndex] || isSeeking);

  // ---------------- SEGMENT OFFSETS ----------------
  const segmentOffsets = useMemo(() => {
    let acc = 0;
    return segments.map((s) => {
      const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000;
      const offset = acc;
      acc += duration;
      return { ...s, offset, duration };
    });
  }, [segments]);

  // ---------------- HLS INIT ----------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    setIsVideoReady(false);

    const hls = new Hls({ startLevel: 0, maxBufferLength: 10, enableWorker: true });
    hlsRef.current = hls;
    hls.attachMedia(video);
    hls.loadSource(src);

    const onCanPlay = () => {
      setIsVideoReady(true);
      // Do NOT autoplay, user controls play/pause
    };

    video.addEventListener("canplay", onCanPlay);

    return () => {
      hls.destroy();
      hlsRef.current = null;
      video.removeEventListener("canplay", onCanPlay);
      setIsVideoReady(false);
    };
  }, [src, cameraId]);

  // ---------------- SEEK LOADER ----------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isCurrentSlotSeeking) setIsVideoReady(false);

    const onCanPlay = () => {
      if (isCurrentSlotSeeking) setIsVideoReady(true);
    };

    video.addEventListener("canplay", onCanPlay);
    return () => video.removeEventListener("canplay", onCanPlay);
  }, [isCurrentSlotSeeking]);

  // ---------------- PLAY / PAUSE SYNC ----------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isPlaying]);

  // ---------------- MAIN PLAYBACK ENGINE ----------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    const currentSeg =
      segmentOffsets.find(
        (s) => currentTime >= s.startTime && currentTime <= s.endTime
      ) || segmentOffsets[0];

    if (!currentSeg) return;

    const logicalSeconds =
      (currentTime.getTime() - currentSeg.startTime.getTime()) / 1000;
    const targetTime = currentSeg.offset + logicalSeconds;

    const diff = Math.abs(video.currentTime - targetTime);
    const maxDrift = Math.abs(playbackSpeed) > 2 ? 0.6 : 0.15;

    // Keep video in sync with global logical timeline
    if (diff > maxDrift || !isPlaying || playbackSpeed < 0) {
      video.currentTime = Math.max(0, Math.min(targetTime, video.duration || targetTime));
    }

    if (playbackSpeed >= 0) {
      video.playbackRate = Math.min(Math.max(playbackSpeed, 0.25), 8);
      video.muted = Math.abs(playbackSpeed) > 2;
      if (isPlaying) {
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    } else {
      video.pause();
      // Negative speed is handled by store time decrements + sync loop (no native reverse playback).
    }
  }, [currentTime, isPlaying, playbackSpeed, segmentOffsets]);

  // ---------------- REVERSE FRAME LOOP (for smoother reverse feel) ----------------
  useEffect(() => {
    if (playbackSpeed >= 0) return;
    if (!isPlaying) return;

    let rafId: number;

    const stepReverse = () => {
      const video = videoRef.current;
      if (!video || !isPlaying) return;

      const step = Math.abs(playbackSpeed) * 0.02;
      const newTime = Math.max(0, video.currentTime - step);
      video.currentTime = newTime;
      rafId = requestAnimationFrame(stepReverse);
    };

    rafId = requestAnimationFrame(stepReverse);
    return () => cancelAnimationFrame(rafId);
  }, [playbackSpeed, isPlaying]);

  // ---------------- LOOP HANDLING ----------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    const firstSeg = segmentOffsets[0];
    const lastSeg = segmentOffsets[segmentOffsets.length - 1];

    const onTimeUpdate = () => {
      if (!isPlaying) return;
      const current = video.currentTime;

      // Forward loop
      if (playbackSpeed > 0 && current >= lastSeg.offset + lastSeg.duration - 0.2) {
        video.currentTime = firstSeg.offset;
      }

      // Reverse loop
      if (playbackSpeed < 0 && current <= firstSeg.offset + 0.2) {
        video.currentTime = lastSeg.offset + lastSeg.duration - 0.2;
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [segmentOffsets, isPlaying, playbackSpeed]);

  // ---------------- CLEANUP ----------------
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, []);

  return { videoRef, isVideoReady };
}