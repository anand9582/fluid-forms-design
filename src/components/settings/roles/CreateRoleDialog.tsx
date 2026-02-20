import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // optional
import { API_BASE_URL, getAuthHeaders } from "@/components/Config/api";

interface FormValues {
  roleType: "operator" | "viewer" | "admin";
  roleName: string;
}

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate?: () => void; 
}

export function CreateRoleDialog({
  open,
  onClose,
  onCreate,
}: CreateRoleDialogProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      roleType: "operator",
      roleName: "",
    },
  });

  const { handleSubmit, reset, watch } = form;

  const onSubmit = async (data: FormValues) => {
    try {
      const roleTypeMap: Record<string, string> = {
        operator: "OPERATOR",
        viewer: "VIEWER",
        admin: "ADMINISTRATOR",
      };

      const payload = {
        roleName: data.roleName.trim(),
        roleType: roleTypeMap[data.roleType],
      };

      const response = await fetch(`${API_BASE_URL}/roles/create-role`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create role");
      }

      toast.success("Role created successfully!");
      reset();
      onClose();
      onCreate?.(); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="Create New Role"
      description="Choose how to handle recordings."
      confirmLabel="Create Role"
      confirmDisabled={!watch("roleName")?.trim()}
      onConfirm={handleSubmit(onSubmit)}
      headerCentered={false}
      size="lg"
    >
      <Form {...form}>
        <form className="space-y-4 text-left">
          {/* Role Type */}
          <FormField
            control={form.control}
            name="roleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-roboto text-medium text-xs uppercase text-black">
                  Role Type
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Role Name */}
          <FormField
            control={form.control}
            name="roleName"
            rules={{
              required: "Role name is required",
              minLength: { value: 2, message: "Minimum 2 characters" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-roboto text-medium text-xs uppercase text-black">
                  New Role Name
                </FormLabel>
                <FormControl>
                    <Input placeholder="Operator 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ConfirmDialog>
  );
}
