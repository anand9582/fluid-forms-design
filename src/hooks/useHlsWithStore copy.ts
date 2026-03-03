// // useHlsWithStore.ts

// import { useEffect, useMemo, useRef } from "react";
// import Hls from "hls.js";
// import { Segment, usePlaybackStore } from "@/Store/playbackStore";

// interface Props {
//   src: string;
//   cameraId: string | null;
//   segments: Segment[];
//   isMaster?: boolean; // only one camera drives master clock
// }

// export function useHlsWithStore({
//   src,
//   cameraId,
//   segments,
//   isMaster = false,
// }: Props) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);

//   const {
//     globalTime,
//     isPlaying,
//     playbackSpeed,
//     isSeeking,
//     updateFromVideo,
//   } = usePlaybackStore();

//   /* ======================================================
//      BUILD CONTINUOUS OFFSET TIMELINE
//   ====================================================== */

//   const segmentOffsets = useMemo(() => {
//     let acc = 0;
//     return segments.map((s) => {
//       const duration =
//         (s.endTime.getTime() - s.startTime.getTime()) / 1000;

//       const offset = acc;
//       acc += duration;

//       return { ...s, offset, duration };
//     });
//   }, [segments]);

//   /* ======================================================
//      INIT HLS
//   ====================================================== */

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !src || !cameraId) return;

//     const hls = new Hls({ maxBufferLength: 20, enableWorker: true });
//     hlsRef.current = hls;
//     hls.attachMedia(video);
//     hls.loadSource(src);

//     return () => {
//       hls.destroy();
//       hlsRef.current = null;
//     };
//   }, [src, cameraId]);

//   /* ======================================================
//      🔴 MASTER CLOCK → VIDEO SYNC
//   ====================================================== */

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !segmentOffsets.length) return;

//     // find current segment
//     const seg = segmentOffsets.find(
//       (s) =>
//         globalTime >= s.startTime &&
//         globalTime <= s.endTime
//     );

//     if (!seg) {
//       video.pause();
//       return;
//     }

//     const logicalSeconds =
//       (globalTime.getTime() - seg.startTime.getTime()) / 1000;

//     const targetTime = seg.offset + logicalSeconds;

//     // smart threshold: only seek if difference > 0.5s
//     if (Math.abs(video.currentTime - targetTime) > 0.5) {
//       video.currentTime = targetTime;
//     }

//     if (isPlaying) {
//       video.playbackRate = Math.min(playbackSpeed, 16);
//       video.muted = playbackSpeed > 4;
//       video.play().catch(() => {});
//     } else {
//       video.pause();
//     }
//   }, [globalTime, isPlaying, playbackSpeed, segmentOffsets]);

//   /* ======================================================
//      🟢 VIDEO → MASTER CLOCK (ONLY MASTER CAMERA)
//   ====================================================== */

//   useEffect(() => {
//     if (!isMaster) return;

//     const video = videoRef.current;
//     if (!video || !segmentOffsets.length) return;

//     let rafId: number;

//     const sync = () => {
//       if (!isPlaying || isSeeking) {
//         rafId = requestAnimationFrame(sync);
//         return;
//       }

//       const current = video.currentTime;

//       const seg = segmentOffsets.find(
//         (s) => current >= s.offset && current <= s.offset + s.duration
//       );

//       if (seg) {
//         const realTime = new Date(
//           seg.startTime.getTime() + (current - seg.offset) * 1000
//         );
//         updateFromVideo(realTime);
//       }

//       rafId = requestAnimationFrame(sync);
//     };

//     rafId = requestAnimationFrame(sync);
//     return () => cancelAnimationFrame(rafId);
//   }, [isMaster, isPlaying, isSeeking, segmentOffsets]);

//   return { videoRef };
// }


// useHlsWithStore.ts

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

  const { globalTime, isPlaying, playbackSpeed, isSeeking, updateFromVideo } = usePlaybackStore();

  // Build offsets for each segment
  const segmentOffsets = useMemo(() => {
    let acc = 0;
    return segments.map((s) => {
      const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000;
      const offset = acc;
      acc += duration;
      return { ...s, offset, duration };
    });
  }, [segments]);

  // INIT HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    console.log("Initializing HLS for camera:", cameraId);

    const hls = new Hls({ maxBufferLength: 20, enableWorker: true });
    hlsRef.current = hls;
    hls.attachMedia(video);
    hls.loadSource(src);

    return () => {
      console.log("Destroying HLS for camera:", cameraId);
      hls.destroy();
      hlsRef.current = null;
    };
  }, [src, cameraId]);

  // MASTER CLOCK → VIDEO SYNC
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    // find current segment
    const seg = segmentOffsets.find(
      (s) => globalTime >= s.startTime && globalTime <= s.endTime
    );

    if (!seg) {
      video.pause();
      console.log("No segment for current globalTime, video paused");
      return;
    }

    const logicalSeconds = (globalTime.getTime() - seg.startTime.getTime()) / 1000;
    const targetTime = seg.offset + logicalSeconds;

    if (Math.abs(video.currentTime - targetTime) > 0.2) {
      console.log(`Seeking video: currentTime=${video.currentTime.toFixed(2)}, targetTime=${targetTime.toFixed(2)}`);
      video.currentTime = targetTime;
    }

    if (isPlaying) {
      video.playbackRate = Math.min(playbackSpeed, 16);
      video.muted = playbackSpeed > 4;
      video.play().catch(() => console.warn("Video play interrupted"));
    } else {
      video.pause();
    }
  }, [globalTime, isPlaying, playbackSpeed, segmentOffsets]);

  // VIDEO → MASTER CLOCK (only master camera)
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
        console.log(`Syncing globalTime: video.currentTime=${current.toFixed(2)}, realTime=${realTime.toISOString()}`);
      }

      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [isMaster, isPlaying, isSeeking, segmentOffsets]);

  return { videoRef };
}