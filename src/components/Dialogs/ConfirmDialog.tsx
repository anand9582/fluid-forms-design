import { ReactNode, useState } from "react";
import { AlertTriangle, Trash2, Info, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Icon types
type IconType = "warning" | "danger" | "info" | "success";

// Size variants
type SizeVariant = "sm" | "md" | "lg";

interface SelectOption {
  id: string;
  label: string;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string | ReactNode;
   icon?: IconType | React.ComponentType<any>; 
  size?: SizeVariant;
  headerCentered?: boolean; 
 fullWidthActions?: boolean;
  // Primary action
  confirmLabel?: string;
  confirmVariant?: "default" | "destructive" | "outline";
  onConfirm: (selectedValue?: string) => void;
  confirmDisabled?: boolean;

  // Cancel action
  cancelLabel?: string;
  onCancel?: () => void;
  showCancel?: boolean;

  // Optional select dropdown
  selectOptions?: SelectOption[];
  selectLabel?: string;
  selectPlaceholder?: string;
  selectRequired?: boolean;

  // Custom content
  children?: ReactNode;
}

// Icon configuration
const iconConfig: Record<IconType, { icon: typeof AlertTriangle; bgClass: string; iconClass: string }> = {
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-red-50",  
    iconClass: "text-red-600" 
  },
  danger: {
    icon: Trash2,
    bgClass: "bg-red-50",
    iconClass: "text-red-500"
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-100",
    iconClass: "text-blue-600"
  },
  success: {
    icon: CheckCircle,
    bgClass: "bg-green-100",
    iconClass: "text-green-600"
  }
};

// Size configuration
const sizeConfig: Record<SizeVariant, { dialog: string; icon: string; iconSize: number }> = {
  sm: { dialog: "sm:max-w-[320px]", icon: "w-10 h-10", iconSize: 20 },
  md: { dialog: "sm:max-w-[425px]", icon: "w-12 h-12", iconSize: 24 },
  lg: { dialog: "sm:max-w-[520px]", icon: "w-14 h-14", iconSize: 28 },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon, 
  size = "md",
  confirmLabel = "Confirm",
  confirmVariant = "default",
  onConfirm,
  confirmDisabled = false,
  cancelLabel = "Cancel",
  onCancel,
  showCancel = true,
  selectOptions,
  selectLabel,
  selectPlaceholder = "Select an option",
  selectRequired = false,
  fullWidthActions = false,
  headerCentered = false, 
  children,
}: ConfirmDialogProps) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const { dialog, icon: iconSizeClass, iconSize } = sizeConfig[size];

  const handleConfirm = () => {
    onConfirm(selectedValue || undefined);
    setSelectedValue("");
  };

  const handleCancel = () => {
    setSelectedValue("");
    onCancel?.();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setSelectedValue("");
    onOpenChange(newOpen);
  };

  const isConfirmDisabled = confirmDisabled || (selectRequired && !selectedValue);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("p-4 sm:p-6 Dailogcross", dialog)}>
      <DialogHeader
        className={cn(
          "flex flex-col text-center space-y-0",
          headerCentered ? "items-center gap-3" : "items-start"
        )}
      >
     {icon && (() => {
            let IconComponent: React.ComponentType<any> | undefined;
            let bgClass = "bg-gray-100";     
            let iconClass = "text-gray-600";   

            if (typeof icon === "string") {
              const cfg = iconConfig[icon as IconType];
              if (cfg) {
                IconComponent = cfg.icon;
                bgClass = cfg.bgClass;
                iconClass = cfg.iconClass;
              }
            } else {
              IconComponent = icon as React.ComponentType<any>;
            }

            return IconComponent ? (
              <div className={cn("rounded-full flex items-center justify-center", bgClass, iconSizeClass)}>
                <IconComponent className={iconClass} size={iconSize} />
              </div>
            ) : null;
          })()}


        <DialogTitle
          className={cn(
            "font-semibold",
            size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-lg"
          )}
        >
          {title}
        </DialogTitle>

        {description && (
          <div className="text-sm text-muted-foreground mt-0">
            {description}
          </div>
        )}
      </DialogHeader>


        {/* Optional Select Dropdown */}
        {selectOptions && selectOptions.length > 0 && (
          <div className="py-4">
            {selectLabel && (
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
                   {selectLabel}
              </label>
            )}
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={selectPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Custom content slot */}
        {children && <div className="py-2">{children}</div>}

  <DialogFooter
  className={cn(
    "footerbottom mt-2 gap-2 flex",
    fullWidthActions
      ? "flex-col sm:flex-row"
      : "flex-col-reverse sm:flex-row sm:justify-end"
  )}
>
  {showCancel && (
    <Button
      variant="outline"
      onClick={handleCancel}
      className={cn(
        "px-8",
        fullWidthActions && "w-full  flex-1"
      )}
      size={size === "sm" ? "sm" : "default"}
    >
      {cancelLabel}
    </Button>
  )}

  <Button
    variant={confirmVariant}
    onClick={handleConfirm}
    className={cn(
      "bg-primary",
      fullWidthActions && "w-full flex-1 bg-red-600"
    )}
    size={size === "sm" ? "sm" : "default"}
  >
    {confirmLabel}
  </Button>
</DialogFooter>



                </DialogContent>
              </Dialog>
            );
          }

// Hook for easy dialog management
  export function useConfirmDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const openDialog = () => setIsOpen(true);
    const closeDialog = () => setIsOpen(false);

    return { isOpen, openDialog, closeDialog, setIsOpen };
  }
