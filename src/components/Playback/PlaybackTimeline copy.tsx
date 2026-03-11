// import React, { useRef, useMemo, useEffect } from "react";

// export interface SegmentHour {
//   start: number;
//   end: number;
//   type: "recording" | "gap";
// }

// interface Props {
//   playheadPosition: number
//   zoomLevel: number
//   isExpanded: boolean
//   segmentsPerSlot: Record<number, SegmentHour[]>
//   slotCount: number
//   cameraNames: Record<number, string>

//   onSeek: (absHour:number,slotIndex?:number)=>void
//   onZoomChange:(z:number)=>void

//   isSync:boolean
// }

// const CAMERA_COL_WIDTH = 160

// export function PlaybackTimelinePro({
//   playheadPosition,
//   zoomLevel,
//   isExpanded,
//   segmentsPerSlot,
//   slotCount,
//   cameraNames,
//   onSeek,
//   onZoomChange,
//   isSync
// }:Props){

// const trackRef = useRef<HTMLDivElement|null>(null)
// const dragging = useRef(false)

// /* ================= VIEWPORT ================= */

// const totalHours = 24
// const visibleHours = totalHours / zoomLevel

// let viewStart = playheadPosition - visibleHours/2
// viewStart = Math.max(0,Math.min(totalHours-visibleHours,viewStart))

// const toViewport=(hour:number)=>
// ((hour-viewStart)/visibleHours)*100

// const viewportToAbs=(vp:number)=>
// viewStart+(vp/100)*visibleHours

// /* ================= SEEK ================= */

// const getVpFromX=(x:number)=>{
//  if(!trackRef.current) return null
//  const r=trackRef.current.getBoundingClientRect()
//  return ((x-r.left)/r.width)*100
// }

// const seek=(vp:number,slotIndex?:number)=>{

//  const abs=viewportToAbs(vp)

//  if(isSync){
//    onSeek(abs)
//  }else{
//    onSeek(abs,slotIndex)
//  }

// }

// /* ================= DRAG PLAYHEAD ================= */

// const onMouseDown=(e:React.MouseEvent,slotIndex?:number)=>{

//  dragging.current=true

//  const move=(me:MouseEvent)=>{

//    if(!dragging.current) return

//    const vp=getVpFromX(me.clientX)

//    if(vp!==null){
//      seek(vp,slotIndex)
//    }

//  }

//  const up=()=>{
//    dragging.current=false
//    window.removeEventListener("mousemove",move)
//    window.removeEventListener("mouseup",up)
//  }

//  const vp=getVpFromX(e.clientX)
//  if(vp!==null) seek(vp,slotIndex)

//  window.addEventListener("mousemove",move)
//  window.addEventListener("mouseup",up)

// }

// /* ================= WHEEL ZOOM ================= */

// const onWheel=(e:React.WheelEvent)=>{

//  if(e.deltaY<0){
//    onZoomChange(Math.min(zoomLevel*2,64))
//  }else{
//    onZoomChange(Math.max(zoomLevel/2,1))
//  }

// }

// /* ================= TIME LABELS ================= */

// const labels=useMemo(()=>{

//  const arr:string[]=[]

//  const step=
//  visibleHours<=1?0.0833:
//  visibleHours<=2?0.166:
//  visibleHours<=4?0.25:
//  visibleHours<=8?0.5:1

//  for(let t=viewStart;t<=viewStart+visibleHours;t+=step){

//  const h=Math.floor(t)
//  const m=Math.floor((t-h)*60)

//  const h12=h%12||12
//  const period=h<12?"AM":"PM"

//  arr.push(`${h12}:${String(m).padStart(2,"0")} ${period}`)

//  }

//  return arr

// },[zoomLevel,playheadPosition])

// /* ================= PLAYHEAD ================= */

// const playheadVp=toViewport(playheadPosition)

// const nonEmptySlots=Object.entries(segmentsPerSlot)
// .filter(([_,s])=>s.length>0)
// .map(([k])=>Number(k))

// /* ================================================= */

// return(

// <div
// className="border-t overflow-hidden"
// style={{maxHeight:isExpanded?slotCount*26+50:0}}
// >

// <div className="flex border-b">

// {/* CAMERA COLUMN */}

// <div style={{width:CAMERA_COL_WIDTH}}>

// {nonEmptySlots.map((slot)=>(
// <div
// key={slot}
// className="h-[16px] text-xs px-2 mb-2 flex items-center truncate"
// >
// {cameraNames?.[slot]??`Camera ${slot+1}`}
// </div>
// ))}

// </div>

// {/* TIMELINE */}

// <div
// ref={trackRef}
// onWheel={onWheel}
// className="flex-1 relative bg-muted/20 flex flex-col pt-3"
// >

// {nonEmptySlots.map((slot)=>{

// const segments=segmentsPerSlot[slot]||[]

// return(

// <div
// key={slot}
// className="relative h-[14px] mb-2 cursor-pointer"
// onMouseDown={(e)=>onMouseDown(e,slot)}
// >

// {segments.map((s,i)=>{

// const startVp=toViewport(s.start)
// const endVp=toViewport(s.end)

// if(endVp<0||startVp>100) return null

// const left=Math.max(0,startVp)
// const right=Math.min(100,endVp)
// const width=right-left

// if(width<=0) return null

// return(

// <div
// key={i}
// className={`absolute top-0 h-full rounded-sm ${
// s.type==="recording"?"bg-blue-500":"bg-gray-400"
// }`}
// style={{
// left:`${left}%`,
// width:`${width}%`
// }}
// />

// )

// })}

// </div>

// )

// })}

// {/* PLAYHEAD */}

// {playheadVp>=0&&playheadVp<=100&&(

// <>
// <div
// className="absolute w-[1px] bg-red-600 top-0"
// style={{
// left:`${playheadVp}%`,
// height:"100%"
// }}
// />

// <div
// className="absolute w-2 h-2 bg-red-600 rounded-full -translate-x-1/2"
// style={{left:`${playheadVp}%`}}
// />
// </>

// )}

// </div>

// </div>

// {/* TIME LABELS */}

// <div className="flex border-t text-[10px] bg-neutral-100">

// <div
// style={{width:CAMERA_COL_WIDTH}}
// className="px-2 py-1 font-medium"
// >
// TIME
// </div>

// <div className="flex-1 flex justify-between px-2">

// {labels.map((l,i)=>(
// <span key={i}>{l}</span>
// ))}

// </div>

// </div>

// </div>

// )

// }


// usehhl mutlipel code 



// import { useEffect, useMemo, useRef } from "react";
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

//   const {
//     globalTime,
//     cameraTimes,
//     isSync,
//     isPlaying,
//     playbackSpeed,
//     isSeeking,
//     updateFromVideo,
//   } = usePlaybackStore();

//   /* ---------------- ACTIVE TIME ---------------- */

//   const activeTime = isSync
//     ? globalTime
//     : cameraTimes[slotIndex] || globalTime;

//   /* ---------------- AUTO PLAY ---------------- */

//   useEffect(() => {

//     const video = videoRef.current;
//     if (!video || !isPlaying) return;

//     video.muted = true;

//     video.play().catch(() => {});

//   }, [isPlaying]);

//   /* ---------------- SEGMENT OFFSETS ---------------- */

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

//   /* ---------------- HLS INIT ---------------- */

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

//   /* ---------------- MASTER → VIDEO SYNC ---------------- */

//   useEffect(() => {

//     const video = videoRef.current;

//     if (!video || !segmentOffsets.length) return;

//     let seg = segmentOffsets.find(
//       (s) => activeTime >= s.startTime && activeTime <= s.endTime
//     );

//     if (!seg) {

//       seg = segmentOffsets[0];

//       video.currentTime = seg.offset;

//       return;

//     }

//     const logicalSeconds =
//       (activeTime.getTime() - seg.startTime.getTime()) / 1000;

//     const targetTime = seg.offset + logicalSeconds;

//     if (!isFinite(targetTime) || targetTime < 0) return;

//     if (Math.abs(video.currentTime - targetTime) > 0.5) {
//       video.currentTime = targetTime;
//     }

//     /* -------- REVERSE CLEANUP -------- */

//     if (reverseIntervalRef.current !== null) {
//       clearInterval(reverseIntervalRef.current);
//       reverseIntervalRef.current = null;
//     }

//     /* -------- PLAY LOGIC -------- */

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

//           video.currentTime = Math.max(
//             seg!.offset,
//             video.currentTime - step
//           );

//           if (video.currentTime <= seg!.offset) {

//             if (reverseIntervalRef.current !== null) {

//               clearInterval(reverseIntervalRef.current);

//               reverseIntervalRef.current = null;

//             }

//           }

//         }, 33);

//       }

//     } else {

//       video.pause();

//     }

//   }, [
//     activeTime,
//     isPlaying,
//     playbackSpeed,
//     segmentOffsets
//   ]);

//   /* ---------------- VIDEO → STORE SYNC ---------------- */

//   useEffect(() => {

//     if (!isMaster) return;

//     const video = videoRef.current;

//     if (!video || !segmentOffsets.length) return;

//     const onTimeUpdate = () => {

//       if (isSeeking) return;

//       const current = video.currentTime;

//       if (!isFinite(current)) return;

//       const seg = segmentOffsets.find(
//         (s) =>
//           current >= s.offset &&
//           current <= s.offset + s.duration
//       );

//       if (!seg) return;

//       const realTime = new Date(
//         seg.startTime.getTime() +
//           (current - seg.offset) * 1000
//       );

//       updateFromVideo(realTime, slotIndex);

//     };

//     video.addEventListener("timeupdate", onTimeUpdate);

//     return () =>
//       video.removeEventListener("timeupdate", onTimeUpdate);

//   }, [isMaster, isSeeking, segmentOffsets]);

//   /* ---------------- CLEANUP ---------------- */

//   useEffect(() => {

//     return () => {

//       if (reverseIntervalRef.current !== null) {

//         clearInterval(reverseIntervalRef.current);

//         reverseIntervalRef.current = null;

//       }

//     };

//   }, []);

//   return { videoRef };

// }


// slot playbackcamerslot.tsx


// import React, { useRef } from "react";
// import { useDrop } from "react-dnd";
// import { Devices } from "@/components/Icons/Svg/liveViewIcons";
// import { cn } from "@/lib/utils";
// import { useHlsWithStore } from "@/hooks/useHlsWithStore";

// interface RawSegment {
//   startTime: Date;
//   endTime: Date;
// }

// interface Props {
//   index: number;
//   cameraId: string | null;
//   selected: boolean;
//   onSelect: () => void;
//   onCameraDrop: (cameraId: string, slotIndex: number) => void;
//   getVideoSrc: (slotIndex: number) => string;
//   isCameraLoading: (cameraId: string) => boolean;
//   rawSegmentsPerSlot: Record<number, RawSegment[]>;
//   errorMessage?: string;
// }

// export function PlaybackCameraSlot({
//   index,
//   cameraId,
//   selected,
//   onSelect,
//   onCameraDrop,
//   getVideoSrc,
//   isCameraLoading,
//   rawSegmentsPerSlot = {},
//   errorMessage,
// }: Props) {

//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const [{ isOver }, dropRef] = useDrop({
//     accept: "SIDEBAR_CAMERA",
//     drop: (item: { cameraId: string }) =>
//       onCameraDrop(item.cameraId, index),
//     collect: (monitor) => ({
//       isOver: monitor.isOver({ shallow: true }),
//     }),
//   });

//   dropRef(containerRef);

//   const segments = rawSegmentsPerSlot?.[index] || [];

//   const src = cameraId ? getVideoSrc(index) : "";

//   /* ================= HLS HOOK ================= */

//   const { videoRef } = useHlsWithStore({
//     src,
//     cameraId,
//     segments,
//     slotIndex: index,
//     isMaster: index === 0, // only first camera drives timeline
//   });

//   /* ================= FULLSCREEN ================= */

//   const toggleFullscreen = () => {
//     const el = containerRef.current;
//     if (!el) return;

//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     } else {
//       el.requestFullscreen().catch(() => {});
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       onClick={onSelect}
//       onDoubleClick={toggleFullscreen}
//       className={cn(
//         "relative w-full h-full overflow-hidden border cursor-pointer select-none bg-black",
//         selected && "ring-2 ring-primary",
//         isOver && "border-primary"
//       )}
//     >

//       {/* VIDEO */}

//       {cameraId && src && !errorMessage && (
//         <video
//           ref={videoRef}
//           className="absolute inset-0 w-full h-full object-cover"
//           muted
//           autoPlay
//           playsInline
//           preload="auto"
//           controls
//         />
//       )}

//       {/* EMPTY SLOT */}

//       {!cameraId && !errorMessage && (
//         <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
//           <Devices className="h-4 w-4" />
//           <span className="text-sm">Drop Camera</span>
//         </div>
//       )}

//       {/* ERROR */}

//       {errorMessage && (
//         <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
//           {errorMessage}
//         </div>
//       )}

//       {/* LOADING */}

//       {cameraId && isCameraLoading(cameraId) && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60">
//           <div className="flex flex-col items-center gap-2 text-muted-foreground">
//             <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//             <span className="text-xs">Loading stream…</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// slot playbackcamerslot.tsx


// import React, { useRef } from "react";
// import { useDrop } from "react-dnd";
// import { Devices } from "@/components/Icons/Svg/liveViewIcons";
// import { cn } from "@/lib/utils";
// import { useHlsWithStore } from "@/hooks/useHlsWithStore";

// interface RawSegment {
//   startTime: Date;
//   endTime: Date;
// }

// interface Props {
//   index: number;
//   cameraId: string | null;
//   selected: boolean;
//   onSelect: () => void;
//   onCameraDrop: (cameraId: string, slotIndex: number) => void;
//   getVideoSrc: (slotIndex: number) => string;
//   isCameraLoading: (cameraId: string) => boolean;
//   rawSegmentsPerSlot: Record<number, RawSegment[]>;
//   errorMessage?: string;
// }

// export function PlaybackCameraSlot({
//   index,
//   cameraId,
//   selected,
//   onSelect,
//   onCameraDrop,
//   getVideoSrc,
//   isCameraLoading,
//   rawSegmentsPerSlot = {},
//   errorMessage,
// }: Props) {

//   const containerRef = useRef<HTMLDivElement | null>(null);

//   const [{ isOver }, dropRef] = useDrop({
//     accept: "SIDEBAR_CAMERA",
//     drop: (item: { cameraId: string }) =>
//       onCameraDrop(item.cameraId, index),
//     collect: (monitor) => ({
//       isOver: monitor.isOver({ shallow: true }),
//     }),
//   });

//   dropRef(containerRef);

//   const segments = rawSegmentsPerSlot?.[index] || [];

//   const src = cameraId ? getVideoSrc(index) : "";

//   /* ================= HLS HOOK ================= */

//   const { videoRef } = useHlsWithStore({
//     src,
//     cameraId,
//     segments,
//     slotIndex: index,
//     isMaster: index === 0, // only first camera drives timeline
//   });

//   /* ================= FULLSCREEN ================= */

//   const toggleFullscreen = () => {
//     const el = containerRef.current;
//     if (!el) return;

//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     } else {
//       el.requestFullscreen().catch(() => {});
//     }
//   };

//   return (
//     <div
//       ref={containerRef}
//       onClick={onSelect}
//       onDoubleClick={toggleFullscreen}
//       className={cn(
//         "relative w-full h-full overflow-hidden border cursor-pointer select-none bg-black",
//         selected && "ring-2 ring-primary",
//         isOver && "border-primary"
//       )}
//     >

//       {/* VIDEO */}

//       {cameraId && src && !errorMessage && (
//         <video
//           ref={videoRef}
//           className="absolute inset-0 w-full h-full object-cover"
//           muted
//           autoPlay
//           playsInline
//           preload="auto"
//           controls
//         />
//       )}

//       {/* EMPTY SLOT */}

//       {!cameraId && !errorMessage && (
//         <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
//           <Devices className="h-4 w-4" />
//           <span className="text-sm">Drop Camera</span>
//         </div>
//       )}

//       {/* ERROR */}

//       {errorMessage && (
//         <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
//           {errorMessage}
//         </div>
//       )}

//       {/* LOADING */}

//       {cameraId && isCameraLoading(cameraId) && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60">
//           <div className="flex flex-col items-center gap-2 text-muted-foreground">
//             <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//             <span className="text-xs">Loading stream…</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// playbackergrid.tsx


// import React, { useMemo } from "react";
// import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
// import { PlaybackCameraSlot } from "./PlaybackCameraSlot";

// interface RawSegment {
//   startTime: Date;
//   endTime: Date;
// }

// interface Props {
//   selectedSlot: number | null;
//   onSlotSelect: (i: number | null) => void;
//   getVideoSrc: (slotIndex: number) => string;
//   onCameraDrop: (cameraId: string, slotIndex: number) => void;
//   isCameraLoading: (cameraId: string) => boolean;
//   rawSegmentsPerSlot: Record<number, RawSegment[]>;
// }

// export function PlaybackCameraGrid({
//   selectedSlot,
//   onSlotSelect,
//   getVideoSrc,
//   onCameraDrop,
//   isCameraLoading,
//   rawSegmentsPerSlot,
// }: Props) {

//   const { layout, slotAssignments } = usePlaybackGridStore();

//   const totalSlots = layout.rows * layout.cols;

//   const displaySlots = useMemo(
//     () =>
//       Array.from(
//         { length: totalSlots },
//         (_, i) => slotAssignments[i] || null
//       ),
//     [slotAssignments, totalSlots]
//   );

//   return (
//     <div className="flex-1 min-h-0 overflow-hidden">

//       <div
//         className="grid h-full"
//         style={{
//           gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
//           gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
//         }}
//       >

//         {displaySlots.map((cameraId, index) => (

//           <PlaybackCameraSlot
//             key={index}
//             index={index}
//             cameraId={cameraId}
//             selected={selectedSlot === index}
//             onSelect={() =>
//               onSlotSelect(selectedSlot === index ? null : index)
//             }
//             onCameraDrop={onCameraDrop}
//             getVideoSrc={getVideoSrc}
//             isCameraLoading={isCameraLoading}
//             rawSegmentsPerSlot={rawSegmentsPerSlot}
//           />

//         ))}

//       </div>

//     </div>
//   );
// }