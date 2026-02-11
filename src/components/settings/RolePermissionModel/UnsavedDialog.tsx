import { useState } from "react";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { Button } from "@/components/ui/button";

interface UnsavedChangesDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onDiscard: () => void;
  roleName: string;
}

export function UnsavedChangesDialog({
  open,
  onClose,
  onSave,
  onDiscard,
  roleName,
}: UnsavedChangesDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      title="Unsaved changes"
      icon="warning" // or "info" depending on your icon set
      headerCentered
      size="sm"
      confirmLabel="Save and continue"
      confirmVariant="primary"
      cancelLabel="Discard changes"
      cancelVariant="destructive"
      onConfirm={onSave}
      onCancel={onDiscard}
    >
      <p className="text-center text-sm text-muted-foreground">
        You have unsaved changes for <span className="font-semibold text-foreground">{roleName}</span>.
      </p>
    </ConfirmDialog>
  );
}
