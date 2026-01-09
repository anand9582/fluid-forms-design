import { Usertick, Usermanagement, AuditLogs } from "@/components/ui/icons";

export const manageUsersTabs = [
  { id: "roles", label: "Roles & Permissions", icon: <Usertick size={16} /> },
  { id: "users", label: "User Management", icon: <Usermanagement size={16} /> },
  { id: "audit", label: "Audit Logs", icon: <AuditLogs size={16} /> },
];
