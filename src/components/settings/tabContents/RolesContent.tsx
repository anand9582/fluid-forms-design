// src/components/settings/tabContents/RolesContent.tsx
import { RolesPanel } from "../RolesPanel";
import { PermissionsContent } from "../PermissionsContent";

interface RolesContentProps {
  selectedRole: string;
  onRoleSelect: (id: string) => void;
  getRoleName: (id: string) => string;
}

export function RolesContent({ selectedRole, onRoleSelect, getRoleName }: RolesContentProps) {
  return (
    <div className="flex flex-1 overflow-hidden mt-4 bg-muted/30 rounded-lg p-4">
        <RolesPanel selectedRole={selectedRole} onRoleSelect={onRoleSelect} />
        <PermissionsContent roleName={getRoleName(selectedRole)} />
    </div>
  );
}
