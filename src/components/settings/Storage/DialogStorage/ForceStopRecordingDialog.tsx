import { AlertTriangle } from "lucide-react";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deviceName: string;
  onConfirm: () => void;
  fullWidthActions?: boolean;
}

export function ForceStopRecordingDialog({
  open,
  onOpenChange,
  deviceName,
  onConfirm,

 fullWidthActions = false,
}: Props) {
  return (
    <ConfirmDialog
      open={open}
      onConfirm={onConfirm}
      confirmLabel="Stop Recording"  
       fullWidthActions={fullWidthActions} 
      onOpenChange={onOpenChange}
     confirmVariant="destructive"
      size="md"  
    >
      <div className="flex flex-col items-center text-center px-6 ">
        {/* ICON */}
        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-900 mt-3">
          Force Stop Recording?
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-muted-foreground leading-relaxed mt-0">
          This will stop all active recordings on device{" "}
          <span className="font-medium text-gray-900">
            {deviceName}
          </span>
          . Recording can be resumed at any time.
        </p>

      </div>
    </ConfirmDialog>
  );
}
