import { useState } from "react";
import { Copy, Video, Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionCard } from "./PermissionCard";

interface Permission {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface PermissionGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
}

const initialPermissionGroups: PermissionGroup[] = [
  {
    id: "video-access",
    name: "Video Access Control",
    icon: <Video size={16} />,
    permissions: [
      { id: "live-sd", title: "Live view (SD)", description: "View standard definition streams", enabled: true },
      { id: "live-hd", title: "Live view (HD)", description: "View high definition streams", enabled: true },
      { id: "playback", title: "Playback", description: "Access recorded footage", enabled: true },
      { id: "ptz", title: "PTZ Control", description: "Control Pan-Tilt-Zoom cameras", enabled: false },
      { id: "two-way", title: "Two-way Audio", description: "Listen and speak through cameras", enabled: false },
      { id: "export", title: "Export Video", description: "Download video clips", enabled: false },
    ],
  },
  {
    id: "system-admin",
    name: "System Administration",
    icon: <Settings size={16} />,
    permissions: [
      { id: "manage-users", title: "Manage Users", description: "Create and edit user accounts", enabled: false },
      { id: "assign-cameras", title: "Assign Cameras", description: "Change camera assignments", enabled: false },
      { id: "firmware", title: "Firmware Updates", description: "Update device firmware", enabled: false },
    ],
  },
  {
    id: "alerts",
    name: "Alerts and Monitoring",
    icon: <Bell size={16} />,
    permissions: [
      { id: "view-alerts", title: "View Alerts", description: "See real-time alarms", enabled: true },
      { id: "ack-alerts", title: "Acknowledge Alerts", description: "Mark alerts as handled", enabled: true },
    ],
  },
];

interface PermissionsContentProps {
  roleName: string;
}

export function PermissionsContent({ roleName }: PermissionsContentProps) {
  const [permissionGroups, setPermissionGroups] = useState(initialPermissionGroups);

  const togglePermission = (groupId: string, permissionId: string) => {
    setPermissionGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              permissions: group.permissions.map((perm) =>
                perm.id === permissionId ? { ...perm, enabled: !perm.enabled } : perm
              ),
            }
          : group
      )
    );
  };

  const totalPermissions = permissionGroups.reduce(
    (acc, group) => acc + group.permissions.length,
    0
  );
  const enabledPermissions = permissionGroups.reduce(
    (acc, group) => acc + group.permissions.filter((p) => p.enabled).length,
    0
  );

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="ml-16 md:ml-0">
          <h2 className="text-lg md:text-xl font-semibold text-foreground">{roleName} dd</h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Showing {enabledPermissions} of {totalPermissions} permissions available for this Role Type.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" className="gap-2 text-sm">
            <Copy size={16} />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            <span className="hidden sm:inline">Save changes</span>
            <span className="sm:hidden">Save</span>
          </Button>
        </div>
      </div>

      {/* Permission Groups */}
      <div className="space-y-6 md:space-y-8">
        {permissionGroups.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <span className="text-muted-foreground">{group.icon}</span>
              <h3 className="text-sm font-semibold text-foreground">{group.name}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
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
