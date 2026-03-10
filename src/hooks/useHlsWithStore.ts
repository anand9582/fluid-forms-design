import { useEffect, useMemo, useRef } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
  slotIndex: number; // ⭐ important
  isMaster?: boolean;
}

export function useHlsWithStore({
  src,
  cameraId,
  segments,
  slotIndex,
  isMaster = false,
}: Props) {

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const reverseIntervalRef = useRef<number | null>(null);

  const {
    globalTime,
    cameraTimes,
    isSync,
    isPlaying,
    playbackSpeed,
    isSeeking,
    updateFromVideo,
  } = usePlaybackStore();

  // ⭐ decide which time to follow
  const currentTime = isSync
    ? globalTime
    : cameraTimes[slotIndex] || globalTime;

  // ---------------- AUTO PLAY ----------------

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    video.muted = true;
    video.play().catch(() => {});
  }, [isPlaying]);

  // ---------------- SEGMENT OFFSETS ----------------

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

  // ---------------- HLS INIT ----------------

  useEffect(() => {

    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    const hls = new Hls({
      maxBufferLength: 20,
      enableWorker: true,
    });

    hlsRef.current = hls;

    hls.attachMedia(video);
    hls.loadSource(src);

    return () => {
      hls.destroy();
      hlsRef.current = null;
    };

  }, [src, cameraId]);

  // ---------------- MASTER → VIDEO SYNC ----------------

  useEffect(() => {

    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    let seg = segmentOffsets.find(
      (s) => currentTime >= s.startTime && currentTime <= s.endTime
    );

    if (!seg) {
      seg = segmentOffsets[0];
      video.currentTime = seg.offset;
      return;
    }

    const logicalSeconds =
      (currentTime.getTime() - seg.startTime.getTime()) / 1000;

    const targetTime = seg.offset + logicalSeconds;

    if (!isFinite(targetTime) || targetTime < 0) return;

    if (Math.abs(video.currentTime - targetTime) > 0.5) {
      video.currentTime = targetTime;
    }

    // --------- REVERSE CLEANUP ---------

    if (reverseIntervalRef.current !== null) {
      clearInterval(reverseIntervalRef.current);
      reverseIntervalRef.current = null;
    }

    // --------- PLAY / REVERSE ---------

    if (isPlaying) {

      if (playbackSpeed >= 0) {

        video.playbackRate = Math.min(playbackSpeed, 16);
        video.muted = playbackSpeed > 4;
        video.play().catch(() => {});

      } else {

        video.pause();

        const step = Math.abs(playbackSpeed) / 30;

        reverseIntervalRef.current = window.setInterval(() => {

          if (!video) return;

          video.currentTime =
            video.currentTime - step;

          if (video.currentTime <= seg!.offset) {

            if (reverseIntervalRef.current !== null) {
              clearInterval(reverseIntervalRef.current);
              reverseIntervalRef.current = null;
            }

          }

        }, 33);

      }

    } else {

      video.pause();

    }

  }, [currentTime, isPlaying, playbackSpeed, segmentOffsets]);

  // ---------------- VIDEO → STORE ----------------

  useEffect(() => {

    if (!isMaster) return;

    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    const onTimeUpdate = () => {

      if (isSeeking) return;

      const current = video.currentTime;

      if (!isFinite(current)) return;

      const seg = segmentOffsets.find(
        (s) =>
          current >= s.offset &&
          current <= s.offset + s.duration
      );

      if (!seg) return;

      const realTime = new Date(
        seg.startTime.getTime() +
          (current - seg.offset) * 1000
      );

      updateFromVideo(realTime, slotIndex);

    };

    video.addEventListener("timeupdate", onTimeUpdate);

    return () =>
      video.removeEventListener("timeupdate", onTimeUpdate);

  }, [isMaster, isSeeking, segmentOffsets]);

  // ---------------- CLEANUP ----------------

  useEffect(() => {

    return () => {

      if (reverseIntervalRef.current !== null) {
        clearInterval(reverseIntervalRef.current);
        reverseIntervalRef.current = null;
      }

    };

  }, []);

  return { videoRef };
}