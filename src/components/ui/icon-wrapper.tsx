import { cn } from "@/lib/utils";

interface IconWrapperProps {
  icon: React.ReactNode;
  className?: string;
  isActive?: boolean; 
}

export function IconWrapper({ icon, className, isActive }: IconWrapperProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-sm transition-colors",
        isActive ? "bg-primary/5  text-primary" : "bg-slate-50 text-gray-600",
        className
      )}
    >
      {icon}
    </div>
  );
}
