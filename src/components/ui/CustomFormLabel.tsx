import { FormLabel } from "@/components/ui/form";

type CustomFormLabelProps = React.ComponentProps<typeof FormLabel>;

export function CustomFormLabel({ className = "", children, ...props }: CustomFormLabelProps) {
  return (
    <FormLabel
      className={`text-sm text-black font-normal ${className}`}
      {...props}
    >
      {children}
    </FormLabel>
  );
}
