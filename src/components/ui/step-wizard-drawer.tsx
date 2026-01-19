import * as React from "react";
import { ArrowLeft, ArrowRight, Check, LucideIcon } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface WizardStep {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface StepValidation {
  [stepIndex: number]: {
    isValid: boolean;
    errors?: Record<string, string>;
  };
}

interface StepWizardDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleIcon?: React.ReactNode;
  description?: string;
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
  className?: string;
  direction?: "top" | "bottom" | "left" | "right";
  validation?: StepValidation;
  onValidateStep?: (stepIndex: number) => boolean;
}

export function StepWizardDrawer({
  open,
  onOpenChange,
  title,
  titleIcon,
  description,
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  onCancel,
  submitLabel = "Create",
  nextLabel = "Save and Next",
  backLabel = "Back to previous step",
  cancelLabel = "Cancel",
  children,
  className,
  direction = "right",
  validation,
  onValidateStep,
}: StepWizardDrawerProps) {
  const handleNext = () => {
    if (onValidateStep && !onValidateStep(currentStep)) {
      return;
    }
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleStepClick = (index: number) => {
    // Allow going back freely, but validate when going forward
    if (index > currentStep) {
      if (onValidateStep && !onValidateStep(currentStep)) {
        return;
      }
    }
    onStepChange(index);
  };

  const isStepValid = (index: number) => {
    return validation?.[index]?.isValid ?? true;
  };

  const currentStepValid = isStepValid(currentStep);

  const isHorizontal = direction === "left" || direction === "right";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent
        className={cn(
          "flex flex-col",
          isHorizontal 
            ? "h-full w-[100vw] max-w-3xl inset-y-0 mt-0 rounded-none" 
            : "max-h-[90vh]",
          direction === "right" && "ml-auto right-0 left-auto rounded-l-[10px]",
          direction === "left" && "mr-auto left-0 right-auto rounded-r-[10px]",
          className
        )}
      >
        <DrawerHeader className="px-6 pt-6 pb-4">
          <DrawerTitle className="flex items-center gap-2 text-xl">
            {titleIcon}
            {title}
          </DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {/* Step Navigation */}
        <div className="w-full border-b border-border">
          <div className="flex items-center gap-0 px-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep && isStepValid(index);
              const hasError = validation?.[index] && !validation[index].isValid && index < currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap",
                   isActive
                  ? "text-blue-600 font-semibold"
                  : isCompleted
                  ? "text-blue-500"
                  : hasError
                  ? "text-destructive"
                  : "text-blue-500",
                isActive &&
                  "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-[#E2E8F0]">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2 text-black hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </Button>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button type="button" onClick={onSubmit} className="gap-2">
                {submitLabel}
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={handleNext} 
                className="gap-2"
                disabled={validation && !currentStepValid}
              >
                {nextLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
