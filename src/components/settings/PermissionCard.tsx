import { PermissionToggle } from "./PermissionToggle";

interface PermissionCardProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function PermissionCard({ title, description, enabled, onChange }: PermissionCardProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-card border border-permission-border rounded-lg">
      <div className="flex-1 mr-4">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
       <PermissionToggle enabled={enabled} onChange={onChange} />
    </div>
  );
}
