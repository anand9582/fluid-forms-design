import { useState, useMemo } from "react"
import { PermissionCard } from "./PermissionCard"
import { ALL_PERMISSION_GROUPS } from "./Permissions.config"
import { ROLE_PERMISSION_MAP } from "./RolePermissions"
import { Button } from "@/components/ui/button"
import type { PermissionsContentProps } from "../../lib/types"
import { Video, Settings, Users, FileText, Key } from "lucide-react"

const GROUP_ICON_MAP: Record<string, JSX.Element> = {
  "video-access": <Video size={18} />,
  "system-admin": <Settings size={18} />,
} 

const PERMISSION_ICON_MAP: Record<string, JSX.Element> = {
  "live-sd": <Video size={16} />,
  "live-hd": <Video size={16} />,
  playback: <FileText size={16} />,
  ptz: <Key size={16} />,
  "two-way": <Users size={16} />,
  export: <FileText size={16} />,
  users: <Users size={16} />,
  roles: <Key size={16} />,
  settings: <Settings size={16} />,
  firmware: <Settings size={16} />,
  logs: <FileText size={16} />,
}

export function PermissionsContent({
  roleId,
  roleName,
}: PermissionsContentProps) {
  const allowedPermissionIds = ROLE_PERMISSION_MAP[roleId] || []

  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() =>
    allowedPermissionIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  )

  const togglePermission = (id: string) => {
    setEnabledMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const visibleGroups = useMemo(() => {
    return ALL_PERMISSION_GROUPS.map((group) => ({
      ...group,
      icon: GROUP_ICON_MAP[group.id],
      permissions: group.permissions
        .filter((p) => allowedPermissionIds.includes(p.id))
        .map((p) => ({
          ...p,
          icon: PERMISSION_ICON_MAP[p.id],
        })),
    })).filter((group) => group.permissions.length > 0)
  }, [roleId])

  const handleSave = () => {
    const enabledPermissions = Object.entries(enabledMap)
      .filter(([_, enabled]) => enabled)
      .map(([id]) => id)
    console.log("Saving permissions for role:", roleId, enabledPermissions)
    alert("Permissions saved! Check console for output.")
  }

  return (
    <div className="flex-1 pl-3 pt-3 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">
              {roleName || roleId}
          </h2>
          <p className="text-sm text-muted-foreground">
               {allowedPermissionIds.length} permissions available
          </p>
        </div>
        <Button size="sm" onClick={handleSave}>
          Save changes
        </Button>
      </div>

      {/* No permissions case */}
      {visibleGroups.length === 0 && (
        <p className="text-gray-500">No permissions assigned to this role.</p>
      )}

      {/* Permission Groups */}
      <div className="space-y-8">
        {visibleGroups.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-3">
              {group.icon}
              <h3 className="font-medium">{group.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.permissions.map((p) => (
                <PermissionCard
                  key={p.id}
                  title={p.title}
                  description={p.description}
                  enabled={!!enabledMap[p.id]}
                  icon={p.icon}
                  onChange={() => togglePermission(p.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
