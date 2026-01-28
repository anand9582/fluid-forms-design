import { Label } from "@/components/ui/label";

type FormLabelProps = React.ComponentProps<typeof Label> & {
  text: string; 
};

export function FormLabel({ className = "", text, ...props }: FormLabelProps) {
  return (
    <Label
      className={`text-sm text-labelcolor font-roboto font-normal ${className}`}
      {...props}
    >
      {text}
    </Label>
  );
}
