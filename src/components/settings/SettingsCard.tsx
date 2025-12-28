import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Star, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  recommended?: boolean;
  tooltip?: string;
}

export function SettingsCard({
  title,
  description,
  children,
  className,
  recommended,
  tooltip,
}: SettingsCardProps) {
  return (
    <div className={cn("settings-card", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            {recommended && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-xs font-medium">
                <Star className="h-3 w-3" />
                Recommended
              </span>
            )}
            {tooltip && (
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
