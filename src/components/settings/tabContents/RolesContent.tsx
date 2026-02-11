import { useEffect, useState } from "react";
import { RolesPanel } from "../RolesPanel";
import { PermissionsContent } from "../PermissionsContent";
import { API_BASE_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";

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
  roles: { id: number; name: string; userCount: number }[];
}

interface RolesContentProps {
  selectedRole: number;
 onRoleSelect: (id: number, name: string) => void;
  getRoleName?: (id: number) => string;
}


/* ===================== COMPONENT ===================== */

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
        setLoading(true);
        setErrorMessage(null);

        const res = await fetch(`${API_BASE_URL}${API_URLS.GetRolesByRoleType}`, {
          headers: getAuthHeaders(),
        });

        const data: RolesApiResponse = await res.json();

        if (!data.success && data.errorCode === "FORBIDDEN") {
          setRoleGroups([]);
            setErrorMessage("You do not have permission to view roles");
          return;
        }

        if (data.success && data.data && data.data.length > 0) {
          const groupsMap: Record<string, RoleGroup> = {};

          data.data.forEach((role) => {
            if (!groupsMap[role.roleType]) {
              groupsMap[role.roleType] = {
                id: role.roleType,
                name: role.roleType,
                roles: [],
              };
            }
            groupsMap[role.roleType].roles.push({
              id: role.roleId,
              name: role.roleName,
              userCount: role.permissionGroups.length,
            });
          });

          // Convert map to array
          const updatedGroups = Object.values(groupsMap);
          setRoleGroups(updatedGroups);
        } else {
          setRoleGroups([]); 
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Something went wrong while loading roles");
        setRoleGroups([]);
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

      <PermissionsContent />
    </div>
  );
}
