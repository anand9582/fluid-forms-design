import { useEffect, useState } from "react"
import { PermissionGroup } from "../lib/types"

const MOCK_PERMISSION_BY_ROLE: Record<string, PermissionGroup[]> = {
  "operator-l1": [
    {
      id: "video",
      name: "Video Access",
      permissions: [
        {
          id: "live",
          title: "Live View",
          description: "View live stream",
          enabled: true,
        },
        {
          id: "playback",
          title: "Playback",
          description: "View recordings",
          enabled: false,
        },
      ],
    },
  ],

  "operator-l2": [
    {
      id: "video",
      name: "Video Access",
      permissions: [
        {
          id: "live",
          title: "Live View",
          description: "View live stream",
          enabled: true,
        },
      ],
    },
  ],
}

export function usePermissions(roleId: string) {
  const [permissionGroups, setPermissionGroups] =
    useState<PermissionGroup[]>([])

  useEffect(() => {
    setPermissionGroups(MOCK_PERMISSION_BY_ROLE[roleId] ?? [])
  }, [roleId])

  const togglePermission = (groupId: string, permId: string) => {
    setPermissionGroups(groups =>
      groups.map(g =>
        g.id === groupId
          ? {
              ...g,
              permissions: g.permissions.map(p =>
                p.id === permId ? { ...p, enabled: !p.enabled } : p
              ),
            }
          : g
      )
    )
  }

  return {
    permissionGroups,
    togglePermission,
  }
}
