import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  variant?: "default" | "soft";
  size?: "sm" | "md";
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer shrink-0 ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",

        // SIZE
        size === "sm" && "h-4 w-4 rounded-sm",
        size === "md" && "h-5 w-5 rounded-sm",

        // VARIANT
        variant === "default" &&
          "border border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",

      variant === "soft" &&
"h-4 w-4 rounded border border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
,        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
