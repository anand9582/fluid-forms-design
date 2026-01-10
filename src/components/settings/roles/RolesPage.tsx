  import { useState } from "react";
  import { PermissionCard } from "../PermissionCard";

  interface PermissionsContentProps {
    roleName: string;
  }
  export function PermissionsContent({ roleName }: PermissionsContentProps) {
    const [permissionGroups, setPermissionGroups] = useState();

    const togglePermission = (groupId: string, permissionId: string) => {
      setPermissionGroups((groups) =>
        groups.map((group) =>
          group.id === groupId
            ? {
                ...group,
                permissions: group.permissions.map((perm) =>
                  perm.id === permissionId
                    ? { ...perm, enabled: !perm.enabled }
                    : perm
                ),
              }
            : group
        )
      );
    };

    // 🔥 IMPORTANT: sirf enabled permissions
    const visibleGroups = permissionGroups
        .map((group) => ({
          ...group,
          permissions: group.permissions.filter((p) => p.enabled),
        }))
      .filter((group) => group.permissions.length > 0);

    return (
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{roleName}</h2>
          <p className="text-sm text-muted-foreground">
              Showing enabled permissions only
          </p>
        </div>

        {/* Permission Groups */} 
        <div className="space-y-8">
          {visibleGroups.map((group) => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-3">
                  {group.icon}
                  <h3 className="font-medium">{group.name}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.permissions.map((permission) => (
                    <PermissionCard
                        key={permission.id}
                        title={permission.title}
                        description={permission.description}
                        enabled={permission.enabled}
                        onChange={() => togglePermission(group.id, permission.id)}
                      />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
