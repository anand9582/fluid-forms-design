import * as React from "react";
import { ArrowLeft, ArrowRight ,LucideIcon,X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
} from "@/components/ui/icons";

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
  showCloseIcon?: boolean;
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
  showCloseIcon = false, 
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
            ? "h-full w-[100vw] max-w-4xl inset-y-0 mt-0 rounded-none bg-white" 
            : "max-h-[90vh]",
          direction === "right" && "ml-auto right-0 left-auto rounded-l-[10px]",
          direction === "left" && "mr-auto left-0 right-auto rounded-r-[10px]",
          className
        )}
      >
        <DrawerHeader className="border-b border-border px-6">
          <DrawerTitle className="flex items-center gap-2 text-xl">
                {titleIcon}
                {title}
          </DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
          {showCloseIcon && (
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="bg-accent h-8 w-8 rounded-sm absolute right-10 top-7"
                    >
                  <X className="h-3 w-3" />
             </Button>
            )}
        </DrawerHeader>

        {/* Step Navigation */}
        <div className="w-full ">
          <div className="flex items-center gap-0 px-6 font-medium border-b p-3 gap-2">
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
                  "flex items-center gap-2 px-4 py-2 text-sm font-normal relative whitespace-nowrap transition-all rounded-md",
                  isActive
                    ? "text-blue-600 font-semibold"
                    : isCompleted
                    ? "text-gray-700 bg-gray-100"
                    : hasError
                    ? "text-destructive"
                    : "text-gray-600 ",
                  isActive &&
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-blue-600"
                )}
              >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full   transition-colors",
                  isCompleted
                    ? "border-green-700 bg-transparent"
                    : isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-gray-300 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 text-green-700" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </span>

                  <span className="hidden sm:inline">{step.label}</span>
            </button>

              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>


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
