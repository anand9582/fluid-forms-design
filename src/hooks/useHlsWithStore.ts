// import { useEffect, useMemo, useRef, useState } from "react";
// import Hls from "hls.js";
// import { Segment, usePlaybackStore } from "@/Store/playbackStore";

// interface Props {
//   src: string;
//   cameraId: string | null;
//   segments: Segment[];
//   slotIndex: number;
//   isMaster?: boolean;
// }

// export function useHlsWithStore({
//   src,
//   cameraId,
//   segments,
//   slotIndex,
//   isMaster = false,
// }: Props) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const hlsRef = useRef<Hls | null>(null);
//   const reverseIntervalRef = useRef<number | null>(null);
//   const [isVideoReady, setIsVideoReady] = useState(false);

//   const {
//     globalTime,
//     cameraTimes,
//     isSync,
//     isPlaying,
//     playbackSpeed,
//     isSeeking,
//     updateFromVideo,
//   } = usePlaybackStore();

//   const currentTime = isSync ? globalTime : cameraTimes[slotIndex] || globalTime;

//   const segmentOffsets = useMemo(() => {
//     let acc = 0;
//     return segments.map((s) => {
//       const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000;
//       const offset = acc;
//       acc += duration;
//       return { ...s, offset, duration };
//     });
//   }, [segments]);

//   // ---------------- HLS INIT ----------------
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !src || !cameraId) return;

//     setIsVideoReady(false);
//     const startTime = performance.now();
//     console.log(`[HLS] start loading camera ${cameraId} at`, new Date());

//     const hls = new Hls({
//       startLevel: 0, // low bitrate first → fast first frame
//       maxBufferLength: 10,
//       enableWorker: true,
//     });
//     hlsRef.current = hls;

//     hls.attachMedia(video);
//     hls.loadSource(src);

//     hls.on(Hls.Events.MANIFEST_PARSED, () => {
//       console.log(`[HLS] camera ${cameraId} manifest parsed at`, new Date());
//     });

//     const onCanPlay = () => {
//       setIsVideoReady(true); // loader hide
//       const endTime = performance.now();
//       console.log(`[HLS] camera ${cameraId} can start playing at`, new Date());
//       console.log(`[HLS] camera ${cameraId} loading took`, Math.round(endTime - startTime), "ms");
//     };

//     video.addEventListener("canplay", onCanPlay);

//     return () => {
//       hls.destroy();
//       hlsRef.current = null;
//       setIsVideoReady(false);
//       video.removeEventListener("canplay", onCanPlay);
//     };
//   }, [src, cameraId]);

//   /* ---------------- SEEK LOADER ---------------- */

//   useEffect(() => {

//     const video = videoRef.current;
//     if (!video) return;

//     if (isSeeking) {
//       setIsVideoReady(false);
//     }

//     const onCanPlay = () => {
//       if (isSeeking) setIsVideoReady(true);
//     };

//     video.addEventListener("canplay", onCanPlay);

//     return () =>
//       video.removeEventListener("canplay", onCanPlay);

//   }, [isSeeking]);

//   // ---------------- MASTER → VIDEO SYNC ----------------
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !segmentOffsets.length) return;

//     let seg = segmentOffsets.find(
//       (s) => currentTime >= s.startTime && currentTime <= s.endTime
//     );

//     if (!seg) {
//       seg = segmentOffsets[0];
//       video.currentTime = seg.offset;
//       return;
//     }

//     const logicalSeconds = (currentTime.getTime() - seg.startTime.getTime()) / 1000;
//     const targetTime = seg.offset + logicalSeconds;

//     if (!isFinite(targetTime) || targetTime < 0) return;
//     if (Math.abs(video.currentTime - targetTime) > 0.5) video.currentTime = targetTime;

//     if (reverseIntervalRef.current !== null) {
//       clearInterval(reverseIntervalRef.current);
//       reverseIntervalRef.current = null;
//     }

//     if (isPlaying) {
//       if (playbackSpeed >= 0) {
//         video.playbackRate = Math.min(playbackSpeed, 16);
//         video.muted = playbackSpeed > 4;
//         video.play().catch(() => {});
//       } else {
//         video.pause();
//         const step = Math.abs(playbackSpeed) / 30;
//         reverseIntervalRef.current = window.setInterval(() => {
//           if (!video) return;
//           video.currentTime = video.currentTime - step;
//           if (video.currentTime <= seg!.offset) {
//             if (reverseIntervalRef.current !== null) {
//               clearInterval(reverseIntervalRef.current);
//               reverseIntervalRef.current = null;
//             }
//           }
//         }, 33);
//       }
//     } else video.pause();
//   }, [currentTime, isPlaying, playbackSpeed, segmentOffsets]);

//   // ---------------- VIDEO → STORE ----------------
//   useEffect(() => {
//     if (!isMaster) return;
//     const video = videoRef.current;
//     if (!video || !segmentOffsets.length) return;

//     const firstSeg = segmentOffsets[0];
//     const lastSeg = segmentOffsets[segmentOffsets.length - 1];

//     const onTimeUpdate = () => {
//       if (isSeeking) return;
//       const current = video.currentTime;
//       if (!isFinite(current)) return;

//       const endOfTimeline = lastSeg.offset + lastSeg.duration;
//       if (current >= endOfTimeline - 0.2) {
//         video.currentTime = firstSeg.offset;
//         updateFromVideo(new Date(firstSeg.startTime), slotIndex);
//         return;
//       }

//       const seg = segmentOffsets.find(
//         (s) => current >= s.offset && current <= s.offset + s.duration
//       );
//       if (!seg) return;

//       const realTime = new Date(seg.startTime.getTime() + (current - seg.offset) * 1000);
//       updateFromVideo(realTime, slotIndex);
//     };

//     video.addEventListener("timeupdate", onTimeUpdate);
//     return () => video.removeEventListener("timeupdate", onTimeUpdate);
//   }, [isMaster, isSeeking, segmentOffsets]);

//   // ---------------- CLEANUP ----------------
//   useEffect(() => {
//     return () => {
//       if (reverseIntervalRef.current !== null) {
//         clearInterval(reverseIntervalRef.current);
//         reverseIntervalRef.current = null;
//       }
//     };
//   }, []);

//   return { videoRef, isVideoReady };
// }



import { useEffect, useMemo, useRef, useState } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
  slotIndex: number;
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
  const fastForwardIntervalRef = useRef<number | null>(null);

  const [isVideoReady, setIsVideoReady] = useState(false);

  const {
    globalTime,
    cameraTimes,
    isSync,
    isPlaying,
    playbackSpeed,
    isSeeking,
    updateFromVideo,
  } = usePlaybackStore();

  const currentTime =
    isSync ? globalTime : cameraTimes[slotIndex] || globalTime;

  /* ---------------- SEGMENT OFFSETS ---------------- */

  const segmentOffsets = useMemo(() => {

    let acc = 0;

    return segments.map((s) => {

      const duration =
        (s.endTime.getTime() - s.startTime.getTime()) / 1000;

      const offset = acc;

      acc += duration;

      return {
        ...s,
        offset,
        duration
      };

    });

  }, [segments]);

  /* ---------------- HLS INIT ---------------- */

  useEffect(() => {

    const video = videoRef.current;

    if (!video || !src || !cameraId) return;

    setIsVideoReady(false);

    const hls = new Hls({
      startLevel: 0,
      maxBufferLength: 10,
      enableWorker: true,
    });

    hlsRef.current = hls;

    hls.attachMedia(video);
    hls.loadSource(src);

    const onCanPlay = () => setIsVideoReady(true);

    video.addEventListener("canplay", onCanPlay);

    return () => {

      hls.destroy();
      hlsRef.current = null;

      video.removeEventListener("canplay", onCanPlay);

      setIsVideoReady(false);

    };

  }, [src, cameraId]);

  /* ---------------- SEEK LOADER ---------------- */

  useEffect(() => {

    const video = videoRef.current;
    if (!video) return;

    if (isSeeking) setIsVideoReady(false);

    const onCanPlay = () => {
      if (isSeeking) setIsVideoReady(true);
    };

    video.addEventListener("canplay", onCanPlay);

    return () =>
      video.removeEventListener("canplay", onCanPlay);

  }, [isSeeking]);

  /* ---------------- PLAYBACK ENGINE ---------------- */

  useEffect(() => {

    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    let seg = segmentOffsets.find(
      (s) =>
        currentTime >= s.startTime &&
        currentTime <= s.endTime
    );

    if (!seg) {
      seg = segmentOffsets[0];
      video.currentTime = seg.offset;
      return;
    }

    const logicalSeconds =
      (currentTime.getTime() -
        seg.startTime.getTime()) / 1000;

    const targetTime =
      seg.offset + logicalSeconds;

    if (!isFinite(targetTime) || targetTime < 0)
      return;

    if (Math.abs(video.currentTime - targetTime) > 0.5)
      video.currentTime = targetTime;

    /* CLEAR OLD INTERVALS */

    if (reverseIntervalRef.current !== null) {
      clearInterval(reverseIntervalRef.current);
      reverseIntervalRef.current = null;
    }

    if (fastForwardIntervalRef.current !== null) {
      clearInterval(fastForwardIntervalRef.current);
      fastForwardIntervalRef.current = null;
    }

    if (!isPlaying) {
      video.pause();
      return;
    }

    /* ---------- FORWARD PLAYBACK ---------- */

    if (playbackSpeed >= 0) {

      if (playbackSpeed <= 16) {

        video.playbackRate = playbackSpeed;
        video.muted = playbackSpeed > 4;
        video.play().catch(() => {});

      }

      else {

        video.playbackRate = 16;
        video.muted = true;

        video.play().catch(() => {});

        const extra = playbackSpeed / 16;

        fastForwardIntervalRef.current =
          window.setInterval(() => {

            if (!video) return;

            video.currentTime +=
              (extra - 1) * 0.5;

          }, 100);

      }

    }

    /* ---------- REVERSE PLAYBACK ---------- */

    else {

      video.pause();

      const step =
        Math.abs(playbackSpeed) / 60;

      reverseIntervalRef.current =
        window.setInterval(() => {

          if (!video) return;

          video.currentTime -= step;

          if (video.currentTime <= seg!.offset) {

            clearInterval(
              reverseIntervalRef.current!
            );

            reverseIntervalRef.current = null;

          }

        }, 33);

    }

  }, [
    currentTime,
    isPlaying,
    playbackSpeed,
    segmentOffsets
  ]);

  /* ---------------- VIDEO → STORE ---------------- */

  useEffect(() => {

    if (!isMaster) return;

    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    const firstSeg = segmentOffsets[0];
    const lastSeg =
      segmentOffsets[
        segmentOffsets.length - 1
      ];

    const onTimeUpdate = () => {

      if (isSeeking) return;

      const current = video.currentTime;
      if (!isFinite(current)) return;

      const endOfTimeline =
        lastSeg.offset + lastSeg.duration;

      if (current >= endOfTimeline - 0.2) {

        video.currentTime =
          firstSeg.offset;

        updateFromVideo(
          new Date(firstSeg.startTime),
          slotIndex
        );

        return;

      }

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

      updateFromVideo(
        realTime,
        slotIndex
      );

    };

    video.addEventListener(
      "timeupdate",
      onTimeUpdate
    );

    return () =>
      video.removeEventListener(
        "timeupdate",
        onTimeUpdate
      );

  }, [
    isMaster,
    isSeeking,
    segmentOffsets
  ]);

  /* ---------------- CLEANUP ---------------- */

  useEffect(() => {

    return () => {

      if (reverseIntervalRef.current !== null)
        clearInterval(reverseIntervalRef.current);

      if (fastForwardIntervalRef.current !== null)
        clearInterval(fastForwardIntervalRef.current);

    };

  }, []);

  return { videoRef, isVideoReady };

}