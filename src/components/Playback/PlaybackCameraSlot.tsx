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
//   getVideoSrc: (cameraId: string) => string;
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
//     drop: (item: { cameraId: string }) => onCameraDrop(item.cameraId, index),
//     collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
//   });

//   dropRef(containerRef);

//   const segments = rawSegmentsPerSlot?.[index] || [];
//   const src = cameraId ? getVideoSrc(cameraId) : "";

//   // ✅ HLS + playback hook with video ready state
//   const { videoRef, isVideoReady } = useHlsWithStore({
//     src,
//     cameraId,
//     segments,
//     slotIndex: index,
//     isMaster: true,
//   });

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
//           controls={false}
//         />
//       )}

//       {/* LOADING SPINNER */}
//       {cameraId && (!isVideoReady || isCameraLoading(cameraId)) && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
//           <div className="flex flex-col items-center gap-2 text-muted-foreground">
//             <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
//             <span className="text-xs">Loading stream…</span>
//           </div>
//         </div>
//       )}

//       {/* DROP PLACEHOLDER */}
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
//     </div>
//   );
// }



import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { useHlsWithStore } from "@/hooks/useHlsWithStore";

interface RawSegment {
  startTime: Date;
  endTime: Date;
}

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (cameraId: string) => boolean;
  rawSegmentsPerSlot: Record<number, RawSegment[]>;
  errorMessage?: string;
  isSeeking?: boolean; // optional prop from store
}

export function PlaybackCameraSlot({
  index,
  cameraId,
  selected,
  onSelect,
  onCameraDrop,
  getVideoSrc,
  isCameraLoading,
  rawSegmentsPerSlot = {},
  errorMessage,
  isSeeking = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) => onCameraDrop(item.cameraId, index),
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  dropRef(containerRef);

  const segments = rawSegmentsPerSlot?.[index] || [];
  const src = cameraId ? getVideoSrc(cameraId) : "";

  // ✅ HLS + playback hook with video ready state
  const { videoRef, isVideoReady } = useHlsWithStore({
    src,
    cameraId,
    segments,
    slotIndex: index,
    isMaster: true,
  });

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  // ---------------- SPINNER LOGIC ----------------
  // show loader when:
  // 1️⃣ camera assigned but HLS not ready
  // 2️⃣ camera still loading
  // 3️⃣ user is seeking on timeline
  const showLoader =
    !!cameraId && (!isVideoReady || isCameraLoading(cameraId) || isSeeking);

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      onDoubleClick={toggleFullscreen}
      className={cn(
        "relative w-full h-full overflow-hidden border cursor-pointer select-none bg-black",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* VIDEO */}
      {cameraId && src && !errorMessage && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          autoPlay
          playsInline
          preload="auto"
          controls={false}
        />
      )}

      {/* LOADING SPINNER */}
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading stream…</span>
          </div>
        </div>
      )}

      {/* DROP PLACEHOLDER */}
      {!cameraId && !errorMessage && (
        <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
          <Devices className="h-4 w-4" />
          <span className="text-sm">Drop Camera</span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
          {errorMessage}
        </div>
      )}
    </div>
  );
}