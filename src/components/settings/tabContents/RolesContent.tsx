import { useEffect, useState } from "react";
import { RolesPanel } from "../RolesPanel";
import { PermissionsContent } from "../PermissionsContent";
import { API_BASE_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { getRoleType } from "@/lib/utils";

/* ===================== TYPES ===================== */

interface Permission {
  permissionCode: string;
  permissionName: string;
}

interface PermissionGroup {
  permissionGroupCode: string;
  permissionGroupName: string;
  permissions: Permission[];
}

interface Role {
  roleId: number;
  roleName: string;
  roleType: string;
  permissionGroups: PermissionGroup[];
}

interface RolesApiResponse {
  success: boolean;
  message: string;
  data: Role[];
  errorCode?: string;
}

interface RoleGroup {
  id: string;
  name: string;
  roles: { id: string; name: string; userCount: number }[];
}

interface RolesContentProps {
  selectedRole: string;
  onRoleSelect: (id: string) => void;
  getRoleName: (id: string) => string;
}

/* ===================== COMPONENT ===================== */

const ALL_ROLE_GROUPS = [
  { id: "ADMINISTRATOR", name: "ADMINISTRATOR", roles: [] },
  { id: "OPERATOR", name: "OPERATOR", roles: [] },
  { id: "VIEWER", name: "VIEWER", roles: [] },
];

export default function RolesContent({
  selectedRole,
  onRoleSelect,
}: RolesContentProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleGroups, setRoleGroups] = useState<RoleGroup[]>([]);

useEffect(() => {
  const fetchRoles = async () => {
    try {
      const roleType = getRoleType();
      if (!roleType) return;

      setLoading(true);
      setErrorMessage(null);

      const res = await fetch(
        `${API_BASE_URL}${API_URLS.GetRolesByRoleType}?roleType=${roleType}`,
         { headers: getAuthHeaders() }
      );

      const data: RolesApiResponse = await res.json();

      if (!data.success && data.errorCode === "FORBIDDEN") {
          setRoleGroups(ALL_ROLE_GROUPS);
          setErrorMessage("You do not have permission to view roles");
          return;
      }

      if (data.success && data.data && data.data.length > 0) {
        const updatedGroups = ALL_ROLE_GROUPS.map((group) =>
          group.id === roleType
            ? {
                ...group,
                roles: data.data.map((role) => ({
                  id: role.roleId.toString(),
                  name: role.roleName,
                  userCount: role.permissionGroups.length,
                })),
              }
            : group
        );

        setRoleGroups(updatedGroups);
      }
    } catch (error) {
      setErrorMessage("Something went wrong while loading roles");
    } finally {
      setLoading(false);
    }
  };

  fetchRoles();
}, []);

  return (
    <div className="flex flex-1 overflow-hidden mt-4 bg-muted/30 gap-3">
      <RolesPanel
        roleGroups={roleGroups}
        selectedRole={selectedRole}
        onRoleSelect={onRoleSelect}
        onCreateRole={() => console.log("Create role clicked")}
      />

      <PermissionsContent roleId={selectedRole} />
    </div>
  );
}
