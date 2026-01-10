import { RolesPanel } from "../RolesPanel"
import { PermissionsContent } from "../PermissionsContent"

interface RoleGroup {
  id: string
  name: string
  roles: Array<{ id: string; name: string; userCount: number }>
}

const roleGroups: RoleGroup[] = [
  {
    id: "admin",
    name: "Admin",
    roles: [
      { id: "admin-super", name: "Super Admin", userCount: 0 },
      { id: "admin-sub", name: "Sub Admin", userCount: 0 },
    ],
  },
  {
    id: "operator",
    name: "Operator",
    roles: [
      { id: "operator-l1", name: "Operator L1", userCount: 0 },
      { id: "operator-l2", name: "Operator L2", userCount: 0 },
    ],
  },
  { id: "viewer", name: "Viewer", roles: [] },  
]


interface RolesContentProps {
  selectedRole: string
  onRoleSelect: (id: string) => void
  getRoleName: (id: string) => string
}

export default function RolesContent({
  selectedRole,
  onRoleSelect,
}: RolesContentProps) {
  return (
    <div className="flex h-full">
        <RolesPanel
          roleGroups={roleGroups}
          selectedRole={selectedRole}
          onRoleSelect={onRoleSelect}
         onCreateRole={() => {
            console.log("Create role clicked")
          }}
        />
       <PermissionsContent roleId={selectedRole} />
    </div>
  )
}
