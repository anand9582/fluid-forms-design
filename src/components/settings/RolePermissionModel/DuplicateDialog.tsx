import { useState } from "react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { Input } from "@/components/ui/input";
import { Copy, CheckCircle, Info } from "lucide-react"; // import any icons you want
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FormValues {
  roleType: string;
}

interface DuplicateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  existingRoleName: string;
  enabledPermissions: string[];
  onDuplicate: (newRoleName: string, roleType: string) => void;
  icon?: React.ComponentType<any>; // Accept dynamic icon
  iconColor?: string; // Accept icon color
}

export function DuplicateRoleDialog({
  open,
  onClose,
  existingRoleName,
  enabledPermissions,
  onDuplicate,
  icon: Icon = Copy, // default icon
  iconColor = "#3b82f6", // default blue
}: DuplicateRoleDialogProps) {
  const form = useForm<FormValues>({ defaultValues: { roleType: "" } });
  const [newRoleName, setNewRoleName] = useState("");

  const roleOptions = [
    { id: "ADMINISTRATOR", name: "Administrator" },
    { id: "OPERATOR", name: "Operator" },
    { id: "VIEWER", name: "Viewer" },
  ];

  const handleConfirm = () => {
    const roleType = form.getValues("roleType");
    if (!newRoleName.trim() || !roleType) {
      alert("Please enter role name and select role type");
      return;
    }
    onDuplicate(newRoleName.trim(), roleType);
    form.reset();
    setNewRoleName("");
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      title="Duplicate Role"
      icon={() => <Icon color={iconColor} size={28} />} // dynamic blue icon
      confirmLabel="Duplicate Role"
      confirmVariant="default"
      headerCentered
      size="md"
      onConfirm={handleConfirm}
    >
      <Form {...form}>
        <FormItem className="space-y-4">
          <p className="text-center text-sm font-roboto font-normal text-muted-foreground">
            This will create a new role with the same permissions. Assign a role name and role type before saving.
          </p>

          {/* New Role Name */}
          <div className="space-y-1">
            <FormLabel className="font-roboto text-medium text-xs uppercase text-black">
                  New Role Name
                </FormLabel>
                <FormControl>
                    <Input placeholder="Operator 1"  />
                </FormControl>
          </div>

          {/* Role Type */}
          <div className="space-y-1">
            <FormLabel className="text-sm font-medium">Role Type</FormLabel>
            <FormControl>
              <Select {...form.register("roleType")} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </div>
        </FormItem>
      </Form>
    </ConfirmDialog>
  );
}
