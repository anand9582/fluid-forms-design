import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { useDrop } from "react-dnd";
import { HlsVidio } from "./HlsVidio";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

interface PlaybackCameraGridProps {
  selectedSlot: number | null;
  onSlotSelect: (index: number | null) => void;
  getVideoSrc: (cameraId: string) => string;
}

export function PlaybackCameraGrid({ selectedSlot, onSlotSelect, getVideoSrc }: PlaybackCameraGridProps) {
  const { layout, slotAssignments, assignCameraToSlot } = usePlaybackGridStore();
  const totalSlots = layout.rows * layout.cols;

  const displaySlots = useMemo(
    () => Array.from({ length: totalSlots }, (_, i) => slotAssignments[i] || null),
    [slotAssignments, totalSlots]
  );

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <div
        className="grid h-full gap-2"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
        }}
      >
        {displaySlots.map((cameraId, index) => {
          const [{ isOver }, dropRef] = useDrop({
            accept: "CAMERA",
            collect: (monitor) => ({ isOver: monitor.isOver() }),
            drop: (item: { cameraId: string }) => assignCameraToSlot(index, item.cameraId),
          });

          return (
            <div
              key={index}
              ref={dropRef}
              onClick={() => onSlotSelect(selectedSlot === index ? null : index)}
              className={cn(
                "group relative w-full h-full rounded-lg border transition-all overflow-hidden",
                cameraId
                  ? ["bg-slate-900 cursor-pointer", selectedSlot === index && "ring-2 ring-primary"]
                  : [
                      "bg-muted/40 border-dashed hover:bg-muted/60 hover:border-primary/40",
                      isOver && "bg-primary/20 border-primary/50",
                    ]
              )}
            >
              {!cameraId && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Devices className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-medium opacity-70">Drop Camera</span>
                  {isOver && <span className="text-xs text-primary">Release to place</span>}
                </div>
              )}

              {cameraId && <HlsVidio src={getVideoSrc(cameraId)} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}