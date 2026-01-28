import { cn } from "@/lib/utils";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5";
type FontWeight = "normal" | "medium" | "semibold" | "bold";

interface HeadingProps {
  children: React.ReactNode;
  as?: HeadingTag;
  className?: string; // manual override
  weight?: FontWeight; // control font-weight dynamically
}

const defaultStyles: Record<HeadingTag, string> = {
  h1: "text-[32px] sm:text-[36px]",
  h2: "text-[24px] sm:text-[28px]",
  h3: "text-[20px]",
  h4: "text-[16px]",
  h5: "text-[14px]",
};

// mapping weight to Tailwind classes
const weightClasses: Record<FontWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function Heading({
  children,
  as = "h3",
  className,
  weight = "bold", // default bold
}: HeadingProps) {
  const Tag = as;

  return (
    <Tag
      className={cn(
        "font-roboto leading-[120%] tracking-[-0.02em] text-primarydarkblack",
        defaultStyles[as],     
        weightClasses[weight],  
        className             
      )}
    >
      {children}
    </Tag>
  );
}
