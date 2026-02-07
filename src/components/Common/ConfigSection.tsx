import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface ConfigSectionProps {
  icon: React.ReactNode;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ConfigSection({
  icon,
  title,
  defaultOpen = false,
  children,
  className,
}: ConfigSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger
        className={cn(
          "flex items-center gap-3 w-full p-3 hover:bg-muted/50 transition-colors border-b",
          className
        )}
      >
        <IconWrapper icon={icon} isActive={isOpen} />

        <span className="font-medium flex-1 text-left font-roboto">
          {title}
        </span>

        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform p-1 rounded-full",
            isOpen && "rotate-180 bg-blue-100 text-blue-700"
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-4 pt-3 space-y-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
