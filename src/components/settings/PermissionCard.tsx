import { PermissionToggle } from "./PermissionToggle";
interface PermissionCardProps {
  id: string;  
  title: string;
  description: string;
  enabled: boolean;
  onChange: (id: string) => void;  
  icon?: JSX.Element;
}

export function PermissionCard({id, title, description, enabled, onChange }: PermissionCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-permission-border rounded-lg">
        <div className="flex-1 mr-4">
            <h4 className="text-sm font-roboto font-medium text-foreground">{title}</h4>
            <p className="text-xs font-roboto font-normal text-[#737373] mt-0.5 ">{description}</p>
        </div>
         <PermissionToggle enabled={enabled} onChange={() => onChange(id)} />
    </div>
  );
}
