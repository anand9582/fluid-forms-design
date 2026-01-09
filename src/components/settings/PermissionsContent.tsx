import { useMemo, useState } from "react"
import { PermissionCard } from "./PermissionCard"
import { ALL_PERMISSION_GROUPS } from "./Permissions.config"
import { Copy, Video, Settings, Users, FileText, Key,User } from "lucide-react"
import { ROLE_PERMISSION_MAP } from "./RolePermissions"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { System,OperatorIcons } from "@/components/ui/icons"

// Group icons
const GROUP_ICON_MAP: Record<string, JSX.Element> = {
  "video-access": <Video size={18} />,
  "system-admin": <System size={18} />,
}

// Permission icons
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

interface PermissionsContentProps {
  roleId: string
}

export function PermissionsContent({ roleId }: PermissionsContentProps) {
  const allowedPermissionIds = ROLE_PERMISSION_MAP[roleId] || []
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>({})

  const togglePermission = (id: string) => {
    setEnabledMap(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const visibleGroups = useMemo(() => {
    return ALL_PERMISSION_GROUPS
      .map(group => ({
        ...group,
        icon: GROUP_ICON_MAP[group.id],
        permissions: group.permissions
          .filter(p => allowedPermissionIds.includes(p.id))
          .map(p => ({
            ...p,
            icon: PERMISSION_ICON_MAP[p.id],
          })),
      }))
      .filter(group => group.permissions.length > 0)
  }, [roleId])

  return (
    <div className="flex-1 pl-3 pt-3 overflow-auto">
      <Card className="border shadow-none">
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between border-b h-[60px]">
          <CardTitle>
            <div className="flex items-center gap-3">
              {/* Circle Icon */}
                <div className="w-10 h-10 rounded-sm bg-[#EFF6FF] flex items-center justify-center">
                  <OperatorIcons  className="w-6 h-6 text-green-600" />
                </div>
                <div>

              <h2 className="text-xl font-semibold capitalize">{roleId}</h2>
                <p className="text-sm font-roboto font-medium text-[#737373]">
                  {allowedPermissionIds.length} permissions available
                </p>
                </div>
            </div>
          </CardTitle>

          <div className="flex gap-2">
            <Button variant="outline"  className="bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent" size="sm">
              <Copy size={14} />
               Duplicate
            </Button>
            <Button size="sm" disabled>Save changes</Button>
          </div>
        </CardHeader>

        {/* BODY */}
        <div className="p-4 space-y-8">
          {visibleGroups.map(group => (
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-3">
                {group.icon}
                <h3 className="font-roboto font-medium">{group.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.permissions.map(p => (
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
      </Card>
    </div>
  )
}
