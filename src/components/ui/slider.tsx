import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  trackHeight?: number; // line thickness
  thumbSize?: number;   // knob size
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      trackHeight = 3,   // default thin line
      thumbSize = 16,    // default knob
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      {/* TRACK */}
      <SliderPrimitive.Track
        className="relative w-full grow overflow-hidden rounded-full bg-muted"
        style={{ height: `${trackHeight}px` }}
      >
        <SliderPrimitive.Range className="absolute h-full bg-primary/60" />
      </SliderPrimitive.Track>

      {/* THUMB */}
      <SliderPrimitive.Thumb
        className={cn(
          "block rounded-full bg-blue-600 border-2 border-white shadow-md",
          "transition-transform focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-blue-500"
        )}
        style={{
          width: `${thumbSize}px`,
          height: `${thumbSize}px`,
        }}
      />
    </SliderPrimitive.Root>
  )
);

Slider.displayName = "Slider";

export { Slider };
