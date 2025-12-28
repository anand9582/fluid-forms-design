import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Role {
  id: string;
  name: string;
  userCount?: number;
}

interface RoleGroup {
  id: string;
  name: string;
  roles?: Role[];
}

const roleGroups: RoleGroup[] = [
  { id: "admin", name: "ADMINISTRATOR" },
  {
    id: "operator",
    name: "OPERATOR",
    roles: [
      { id: "operator-l1", name: "Operator L1", userCount: 21 },
      { id: "operator-l2", name: "Operator L2", userCount: 23 },
    ],
  },
  { id: "viewer", name: "VIEWER" },
];

interface RolesPanelProps {
  selectedRole: string;
  onRoleSelect: (id: string) => void;
}

export function RolesPanel({ selectedRole, onRoleSelect }: RolesPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["operator"]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <div className="w-[240px] md:w-[240px] border-r border-border flex-shrink-0 flex flex-col h-full bg-card md:bg-transparent">
      {/* Create New Role Button */}
      <div className="p-4 border-b border-border">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-sm font-medium"
        >
          <Plus size={16} />
          Create New Role
        </Button>
      </div>

      {/* Defined Roles */}
      <div className="p-4 flex-1 overflow-auto">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Defined Roles
        </h3>

        <div className="space-y-1">
          {roleGroups.map((group) => (
            <div key={group.id}>
              {/* Group Header */}
              <button
                onClick={() => group.roles && toggleGroup(group.id)}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {group.roles ? (
                  expandedGroups.includes(group.id) ? (
                    <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                  )
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                )}
                <span className="truncate">{group.name}</span>
              </button>

              {/* Sub-roles */}
              {group.roles && expandedGroups.includes(group.id) && (
                <div className="ml-2 mt-1 space-y-0.5">
                  {group.roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => onRoleSelect(role.id)}
                      className={`w-full flex flex-col items-start px-3 py-2 text-sm rounded-md transition-all ${
                        selectedRole === role.id
                          ? "bg-primary/5 border-l-3 border-primary"
                          : "hover:bg-muted border-l-3 border-transparent"
                      }`}
                    >
                      <span className="font-medium text-foreground truncate w-full text-left">{role.name}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users size={12} />
                        {role.userCount} users
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
