// File: components/ui/Typography.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "paragraph" | "heading" | "small";
  children: React.ReactNode;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "paragraph",
  children,
  className,
  ...props
}) => {
  let baseStyles = "font-roboto";

  switch (variant) {
    case "paragraph":
      baseStyles += " text-[12px] leading-[150%] font-normal tracking-[1.5%] mb-[12px]";
      break;
    case "small":
      baseStyles += " text-[10px] leading-[140%] font-normal tracking-[1.5%]";
      break;
    case "heading":
      baseStyles += " text-[16px] leading-[150%] font-medium tracking-[0.5%]";
      break;
  }

  return (
    <p className={cn(baseStyles, className)} {...props}>
      {children}
    </p>
  );
};