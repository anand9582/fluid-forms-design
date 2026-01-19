import { useState, useEffect } from "react";
import { X, ChevronUp, Info ,CheckCircle  } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Scan,
  Database,
  MonitorPlay,
  PlaySquare,
} from "lucide-react";


export function Wizard({
  title = "Get started",
  steps = [],
  navButtons = [],
  size = "medium",
  position = "right",
  autoShow = true,  
  autoShowDelay = 2000,
  onFinish = () => {}
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(!autoShow ? true : false);
  const [isExpanded, setIsExpanded] = useState(false);

  const widthClass = size === "small" ? "w-[400px]" :
                     size === "large" ? "w-[800px]" : "w-[650px]";

  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => setIsVisible(true), autoShowDelay);
      return () => clearTimeout(timer);
    }
  }, [autoShow, autoShowDelay]);

  const step = steps[currentStep];

  // Dynamic slide animation
  let slideClass = "";
  let positionClass = "";

  if (position === "right") {
  positionClass = "top-4 right-4";
  slideClass = isVisible ? "translate-x-0" : "translate-x-[100%]";
} else if (position === "left") {
  positionClass = "top-4 left-4";
  slideClass = isVisible ? "translate-x-0" : "translate-x-[-100%]";
} else if (position === "top") {
  positionClass = "top-4 left-1/2 -translate-x-1/2";
  slideClass = isVisible ? "translate-y-0" : "-translate-y-[100%]";
} else if (position === "bottom") {
  positionClass = "bottom-4 left-1/2 -translate-x-1/2";
  slideClass = isVisible ? "translate-y-0" : "translate-y-[100%]";
} else if (position === "right-top") {
  positionClass = "top-0 right-4";        
  slideClass = isVisible ? "translate-y-0" : "-translate-y-[100%]"; 
} else if (position === "right-bottom") {
  positionClass = "bottom-4 right-4";
  slideClass = isVisible ? "translate-y-0" : "translate-y-[100%]";  
}


  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onFinish();
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div
      className={`fixed z-50 ${positionClass} ${widthClass} max-w-[calc(100%-2rem)]
        bg-card rounded-xl shadow-xl border border-border transition-transform duration-700 ease-out
        ${slideClass}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-black">
            KR
          </div>
          <div>
           <h3 className="text-md font-medium  font-roboto">
            {isExpanded
              ? "Get started"
              : "Welcome — Let’s get your system ready"}
          </h3>
           <p className="text-sm font-medium  font-roboto">
              {isExpanded
                ? "4 quick steps to configure your system"
                : `${currentStep}/${steps.length} steps completed`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsVisible(false)} className="p-1.5 bg-muted hover:bg-muted rounded-sm">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 bg-muted hover:bg-muted rounded-sm">
            <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4">
          {/* Navigation Buttons */}
          {navButtons.length > 0 && (
         <div className="flex flex-wrap gap-2 mb-5">
        {navButtons.map((btn, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                
                isCompleted &&
                  "bg-green-50 text-green-700",

                isActive &&
                  "border border-neutral-300 bg-white shadow-sm text-foreground",

                !isCompleted &&
                  !isActive &&
                  "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-green-700" />
              ) : (
                btn.icon && <btn.icon className="w-4 h-4" />
              )}

              {btn.label}
            </button>
          );
        })}
      </div>

          )}

          {/* Step Content */}
          {step && (
            <>
            <div className="w-[514px]">
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary tracking-wide">
                  STEP {step.id} OF {steps.length}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-xl  font-roboto font-semibold  mb-1">{step.title}</h4>
                <p className="text-sm text-[#475569] whitespace-pre-line">{step.description}</p>
              </div>

              {step.hint && (
                <div className={cn(
                  "flex items-center gap-2 rounded-md border px-4 py-3 text-sm mb-4",
                    "border-blue-200 bg-blue-50 text-blue-600 "
                  )}>
                  <Info className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-blue-700">{step.hint}</span>
                </div>
              )}

                  <div className="flex items-center gap-3 mb-3">
                    {step.primaryAction && <Button className="flex-1 font-roboto font-medium bg-primary text-primary-foreground" onClick={handleNext}>{step.primaryAction}</Button>}
                    {step.secondaryAction && <Button variant="outline" className="flex-1 font-roboto font-medium" onClick={handlePrev}>{step.secondaryAction}</Button>}
                  </div>  
               </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
