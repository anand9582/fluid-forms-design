import * as React from "react";
import { RefreshCw, X, Search } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface DynamicFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;

  onApply?: () => void;
  onReset?: () => void;

  applyLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;

  direction?: "left" | "right";
  width?: string;
  className?: string;

  children: React.ReactNode;
}

export function DynamicFilterDrawer({
  open,
  onOpenChange,
  title = "Advanced Filters",
  onApply,
  onReset,
  applyLabel = "Apply Filters",
  cancelLabel = "Cancel",
  resetLabel = "Reset All Filters",
  direction = "right",
  width = "max-w-md",
  className,
  children,
}: DynamicFilterDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent
        className={cn(
          "flex flex-col h-full  inset-y-0 mt-0 rounded-none",
          width,
          direction === "right" && "ml-auto rounded-l-[10px]",
          direction === "left" && "mr-auto rounded-r-[10px]",
          className
        )}
      >
        {/* HEADER (FIXED) */}
        <DrawerHeader className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-4">
            <DrawerTitle className="font-roboto text-lg font-medium">
              {title}
            </DrawerTitle>

            {onReset && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReset}
                className="gap-2 bg-transparent shadow-added"
              >
                <RefreshCw className="h-4 w-4" />
                {resetLabel}
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="bg-accent h-8 w-8 rounded-sm"
          >
            <X className="h-3 w-3" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6">
          {children}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t  border-border bg-[#E2E8F0]">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>

          {onApply && (
            <Button onClick={onApply}>{applyLabel}</Button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
