import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/components/ui/AppTooltip";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

export function PlaybackControlButton({
  label,
  onClick,
  active,
  children,
  className,
}: Props) {
  return (
    <AppTooltip label={label} side="top">
      <Button
        variant="ghost"
        onClick={onClick}
        className={cn(
          "h-6 w-6 p-0 bg-timelinebg text-slate-600 rounded hover:bg-primary hover:text-white",
          active && "bg-primary text-white",
          className
        )}
      >
        {children}
      </Button>
    </AppTooltip>
  );
}