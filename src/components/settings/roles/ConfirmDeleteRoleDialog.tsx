import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import {
  Form,
  FormField,
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

interface RoleType {
  id: string;
  name: string;
  userCount: number;
}

interface ConfirmDeleteRoleDialogProps {
  open: boolean;
  onClose: () => void;
  role: RoleType | null;
}

interface FormValues {
  reassignRole: string;
}

export function ConfirmDeleteRoleDialog({ open, onClose, role }: ConfirmDeleteRoleDialogProps) {
  const [roles, setRoles] = useState<RoleType[]>([]);

  const form = useForm<FormValues>({
    defaultValues: { reassignRole: "" },
  });

  useEffect(() => {
    if (!open) return;
    fetch("/api/roles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch roles");
        return res.json();
      })
      .then((data) => setRoles(data))
      .catch((err) => console.error(err));
  }, [open]);

  const handleConfirm = () => {
    const selectedRoleId = form.getValues("reassignRole");
    if (!role || !selectedRoleId) return;

    // TODO: Call your API to reassign users and delete the role
    console.log("Reassigning users to:", selectedRoleId);

    onClose();
    form.reset();
  };

  const selectOptions = roles.filter((r) => r.id !== role?.id);

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onClose}
      title="Role has assigned users"
      icon="warning"
      confirmLabel="Confirm and Delete"
      confirmVariant="destructive"
      onConfirm={handleConfirm}
      headerCentered
      size="md"
    >
      <Form {...form}>
  <FormField
    control={form.control}
    name="reassignRole"
    render={({ field }) => (
      <FormItem >
        {/* Description text */}
        <p className="text-center text-sm text-muted-foreground">
            Role{" "}
            <span className="font-semibold text-foreground">
              "{role?.name}"
            </span>{" "}
            has{" "}
            <span className="font-semibold text-blue-600">
              {role?.userCount}
            </span>{" "}
            assigned users. Reassign users before deleting this role.
        </p>

        {/* Label + Select together */}
        {/* <div className="space-y-2">
          <FormLabel className="text-sm font-medium">
            Reassign Users To
          </FormLabel>

          <FormControl>
            <Select {...field} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </div> */}
      </FormItem>
    )}
  />
      </Form>

    </ConfirmDialog>
  );
}
