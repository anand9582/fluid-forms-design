import React, { ReactNode } from "react";
import {
  Tooltip as RadixTooltip,
  TooltipProvider,
  TooltipTrigger as RadixTrigger,
  TooltipContent as RadixContent,
  TooltipArrow,
} from "@radix-ui/react-tooltip";

interface AppTooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function AppTooltip({
  label,
  children,
  side = "top",
}: AppTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <RadixTooltip>
        <RadixTrigger asChild>{children}</RadixTrigger>
        <RadixContent
          side={side}
          sideOffset={2}
          className="z-50 rounded bg-black px-2 py-1 text-[11px] text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {label}
          <TooltipArrow className="fill-black" />
        </RadixContent>
      </RadixTooltip>
    </TooltipProvider>
  );
}