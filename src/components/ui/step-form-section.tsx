import * as React from "react";
import { cn } from "@/lib/utils";

interface StepFormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function StepFormSection({
  title,
  description,
  children,
  className,
}: StepFormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-sm font-medium text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-blue-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

interface StepFormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StepFormRow({
  children,
  columns = 2,
  className,
}: StepFormRowProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

interface StepFormFieldProps {
  children: React.ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4;
}

export function StepFormField({
  children,
  className,
  span,
}: StepFormFieldProps) {
  const spanClass = span ? `col-span-${span}` : "";
  
  return (
    <div className={cn("space-y-2", spanClass, className)}>
      {children}
    </div>
  );
}
