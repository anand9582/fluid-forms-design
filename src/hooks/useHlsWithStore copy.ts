// import { useEffect, useMemo, useRef } from "react";
// import Hls from "hls.js";
// import { Segment, usePlaybackStore } from "@/Store/playbackStore";

// interface Props {
//   src: string;
//   cameraId: string | null;
//   segments: Segment[];
//   isMaster?: boolean; 
// }

// export function useHlsWithStore({
//   src,
//   cameraId,
//   segments,
//   isMaster = false,
// }: Props) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);

//   const { globalTime, isPlaying, playbackSpeed, isSeeking, updateFromVideo } =
//     usePlaybackStore();

//   const segmentOffsets = useMemo(() => {
//     let acc = 0;
//     return segments.map((s) => {
//       const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000;
//       const offset = acc;
//       acc += duration;
//       return { ...s, offset, duration };
//     });
//   }, [segments]);

//   // HLS Init
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !src || !cameraId) return;

//     console.log("[HLS] attaching media for camera", cameraId);
//     const hls = new Hls({ maxBufferLength: 20, enableWorker: true });
//     hlsRef.current = hls;
//     hls.attachMedia(video);
//     hls.loadSource(src);

//     return () => {
//       console.log("[HLS] destroy for camera", cameraId);
//       hls.destroy();
//       hlsRef.current = null;
//     };
//   }, [src, cameraId]);

//   // Master → Video Sync
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !segmentOffsets.length) return;

//     const seg = segmentOffsets.find(
//       (s) => globalTime >= s.startTime && globalTime <= s.endTime
//     );

//     if (!seg) {
//       console.log("[HLS] No segment found at globalTime", globalTime);
//       video.pause();
//       return;
//     }

//     const logicalSeconds = (globalTime.getTime() - seg.startTime.getTime()) / 1000;
//     const targetTime = seg.offset + logicalSeconds;

//     if (Math.abs(video.currentTime - targetTime) > 0.5) {
//       console.log(
//         `[HLS] Seeking camera ${cameraId} to ${targetTime} (segment offset ${seg.offset})`
//       );
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



  
//   // Video → Master sync (only master)
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
//         const realTime = new Date(seg.startTime.getTime() + (current - seg.offset) * 1000);
//         updateFromVideo(realTime);
//       }

//       rafId = requestAnimationFrame(sync);
//     };

//     rafId = requestAnimationFrame(sync);
//     return () => cancelAnimationFrame(rafId);
//   }, [isMaster, isPlaying, isSeeking, segmentOffsets]);

//   return { videoRef };
// }



// new upated 


// import { useEffect, useMemo, useRef } from "react";
// import Hls from "hls.js";
// import { Segment, usePlaybackStore } from "@/Store/playbackStore";

// interface Props {
//   src: string;
//   cameraId: string | null;
//   segments: Segment[];
//   isMaster?: boolean;
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

//   // ----------------------------------------------------
//   // SEGMENT OFFSETS (continuous timeline mapping)
//   // ----------------------------------------------------
//   const segmentOffsets = useMemo(() => {
//     let acc = 0;

//     return segments.map((s) => {
//       const duration =
//         (s.endTime.getTime() - s.startTime.getTime()) / 1000;

//       const offset = acc;
//       acc += Math.max(0, duration);

//       return { ...s, offset, duration };
//     });
//   }, [segments]);

//   // ----------------------------------------------------
//   // HELPER: nearest available recording
//   // ----------------------------------------------------
//   const findNearestRecordingSegment = (time: Date) => {
//     const recordings = segments.filter(
//       (s) => s.endTime.getTime() > s.startTime.getTime()
//     );

//     if (!recordings.length) return null;

//     let nearest = recordings[0];
//     let minDist = Math.abs(
//       time.getTime() - nearest.startTime.getTime()
//     );

//     for (const s of recordings) {
//       const dist = Math.abs(time.getTime() - s.startTime.getTime());
//       if (dist < minDist) {
//         nearest = s;
//         minDist = dist;
//       }
//     }
//     return nearest;
//   };

//   // ----------------------------------------------------
//   // HLS INIT (ONLY on src / camera change)
//   // ----------------------------------------------------
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !src || !cameraId) return;

//     const hls = new Hls({
//       maxBufferLength: 20,
//       enableWorker: true,
//     });

//     hlsRef.current = hls;
//     hls.attachMedia(video);
//     hls.loadSource(src);

//     return () => {
//       hls.destroy();
//       hlsRef.current = null;
//     };
//   }, [src, cameraId]);

//   // ----------------------------------------------------
//   // MASTER → VIDEO SYNC
//   // ----------------------------------------------------
//   useEffect(() => {
//     if (isSeeking) return; // 🔒 IMPORTANT GUARD

//     const video = videoRef.current;
//     const hls = hlsRef.current;
//     if (!video || !segmentOffsets.length) return;

//     // 1️⃣ Find segment for globalTime
//     let seg = segmentOffsets.find(
//       (s) =>
//         globalTime >= s.startTime &&
//         globalTime <= s.endTime
//     );

//     // 2️⃣ GAP → nearest recording
//     if (!seg) {
//       const nearest = findNearestRecordingSegment(globalTime);
//       if (!nearest) {
//         video.pause();
//         return;
//       }
//       seg = nearest;
//     }

//     // 3️⃣ Logical offset inside segment
//     const logicalSeconds =
//       (globalTime.getTime() - seg.startTime.getTime()) / 1000;

//     // ------------------------------------------------
//     // FUTURE: segment-wise HLS source switching
//     // (keep commented until API provides seg.src)
//     // ------------------------------------------------
//     /*
//     if (seg.src && hls && hls.url !== seg.src) {
//       hls.loadSource(seg.src);

//       hls.once(Hls.Events.MANIFEST_PARSED, () => {
//         video.currentTime = Math.max(0, logicalSeconds);
//         if (isPlaying) video.play().catch(() => {});
//       });

//       return; // ⛔ stop normal seek flow
//     }
//     */

//     // 4️⃣ Same stream → normal seek
//     const targetTime = (seg.offset ?? 0) + logicalSeconds;

//     if (video.readyState < 2) return; // 🛡️ safety

//     if (Math.abs(video.currentTime - targetTime) > 0.5) {
//       video.currentTime = targetTime;
//     }

//     // 5️⃣ Play / Pause + speed
//     if (isPlaying) {
//       video.playbackRate = Math.min(playbackSpeed, 16);
//       video.muted = playbackSpeed > 4;
//       video.play().catch(() => {});
//     } else {
//       video.pause();
//     }
//   }, [
//     globalTime,
//     isPlaying,
//     playbackSpeed,
//     segmentOffsets,
//     isSeeking,
//   ]);

//   // ----------------------------------------------------
//   // VIDEO → TIMELINE (timeupdate)
//   // ----------------------------------------------------
//   useEffect(() => {
//     if (!isMaster) return;

//     const video = videoRef.current;
//     if (!video || !segmentOffsets.length) return;

//     const onTimeUpdate = () => {
//       if (!isPlaying || isSeeking) return;

//       const current = video.currentTime;
//       if (!isFinite(current)) return;

//       const seg = segmentOffsets.find(
//         (s) =>
//           current >= (s.offset ?? 0) &&
//           current <= (s.offset ?? 0) + (s.duration ?? 0)
//       );

//       if (!seg || seg.offset == null) return;

//       const realTime = new Date(
//         seg.startTime.getTime() +
//           (current - seg.offset) * 1000
//       );

//       updateFromVideo(realTime);
//     };

//     video.addEventListener("timeupdate", onTimeUpdate);

//     return () => {
//       video.removeEventListener("timeupdate", onTimeUpdate);
//     };
//   }, [isMaster, isPlaying, isSeeking, segmentOffsets]);

//   return { videoRef };
// }

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

  // Helper: find nearest recording segment
  const findNearestRecordingSegment = (time: Date) => {
    const recordings = segments.filter(s => s.endTime.getTime() > s.startTime.getTime());
    if (recordings.length === 0) return null;

    let nearest = recordings[0];
    let minDist = Math.abs(time.getTime() - nearest.startTime.getTime());

    for (const s of recordings) {
      const dist = Math.abs(time.getTime() - s.startTime.getTime());
      if (dist < minDist) {
        nearest = s;
        minDist = dist;
      }
    }
    return nearest;
  };

  // ---------------- HLS INIT ----------------
  useEffect(() => {
    

    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    const hls = new Hls({ maxBufferLength: 20, enableWorker: true });
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
      (s) => globalTime >= s.startTime && globalTime <= s.endTime
    );

    // If globalTime is in a gap → jump to nearest recording
    if (!seg) {
      const nearest = findNearestRecordingSegment(globalTime);
      if (nearest) {
        console.log("[HLS] Jumping to nearest recording segment", nearest);
        video.currentTime = nearest.offset;
        seg = nearest;
      } else {
        video.pause();
        return;
      }
    }

    const logicalSeconds = (globalTime.getTime() - seg.startTime.getTime()) / 1000;
    const targetTime = seg.offset + logicalSeconds;

    if (Math.abs(video.currentTime - targetTime) > 0.5) {
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

// ---------------- VIDEO → TIMELINE (timeupdate) ----------------
useEffect(() => {
  if (!isMaster) return;

  const video = videoRef.current;
  if (!video || !segmentOffsets.length) return;

  const onTimeUpdate = () => {
    if (!isPlaying || isSeeking) return;

    const current = video.currentTime;
    if (!isFinite(current)) return;

    const seg = segmentOffsets.find(
      (s) =>
        current >= (s.offset ?? 0) &&
        current <= (s.offset ?? 0) + (s.duration ?? 0)
    );

    if (!seg || seg.offset == null) return;

    // video time → real date
    const realTime = new Date(
      seg.startTime.getTime() + (current - seg.offset) * 1000
    );

    updateFromVideo(realTime);
  };

  video.addEventListener("timeupdate", onTimeUpdate);

  return () => {
    video.removeEventListener("timeupdate", onTimeUpdate);
  };
}, [isMaster, isPlaying, isSeeking, segmentOffsets]);

  return { videoRef };
}