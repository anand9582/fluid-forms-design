export interface Role {
 id: number 
  name: string
  userCount: number
}

export interface RoleGroup {
  id: string
  name: string
  roles: Role[]
}

export interface Permission {
    id: string
    title: string
    description: string
    enabled: boolean
}

export interface PermissionGroup {
  id: string
  name: string
  permissions: Permission[]
}


//////////////////////
 // Types user managments system 
//////////////////////
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  assignedCameras: number;
  lastActive: string;
  status: "Active" | "Inactive" | "Locked" | "Reset required";
}

// This Use RolePanel
export interface RolesPanelProps {
    roleGroups?: RoleGroup[]
     selectedRole: number     
    onRoleSelect: (id: number, name: string) => void;
    onCreateRole: () => void
}

// permissioncontent interface
export interface PermissionsContentProps {
  roleId: number                 
  roleName?: string 
}

// VerticalTabItem interface
export interface VerticalTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}