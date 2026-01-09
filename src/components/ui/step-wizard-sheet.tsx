import * as React from "react";
import { ArrowLeft, ArrowRight, Check, LucideIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
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

interface StepWizardSheetProps {
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
  side?: "left" | "right";
  className?: string;
  /** Validation state per step - if provided, enables validation */
  validation?: StepValidation;
  /** Called before navigating to next step, return false to prevent */
  onValidateStep?: (stepIndex: number) => boolean;
}

export function StepWizardSheet({
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
  side = "left",
  className,
  validation,
  onValidateStep,
}: StepWizardSheetProps) {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn("w-full sm:max-w-2xl overflow-hidden flex flex-col p-0", className)}
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl">
            {titleIcon}
            {title}
          </SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

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
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative",
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground"
                      : hasError
                      ? "text-destructive"
                      : "text-muted-foreground",
                    isActive &&
                      "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
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
      </SheetContent>
    </Sheet>
  );
}
