import { useState,useEffect } from "react"
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Users,
  Trash2,
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle } from "../ui/card"
import { cn } from "../../lib/utils"
import type { Role, RolesPanelProps } from "../../lib/types"
import { ConfirmDialog } from "../Dialogs/ConfirmDialog"
import { useRoleStore } from "@/Store/RoleStore";
import { useSettingsStore } from "@/Store/SettingsStore";
import { CreateRoleDialog } from "@/components/settings/roles/CreateRoleDialog";
import { ConfirmDeleteRoleDialog } from "@/components/settings/roles/ConfirmDeleteRoleDialog";
import { showAlert } from "@/components/SweetAlertpopup/SweetAlert";

export function RolesPanel({
  roleGroups = [],
  onCreateRole,
}: RolesPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["1"])
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const { selectedRoleId, setSelectedRole } = useRoleStore();
  const { hasUnsavedChanges } = useSettingsStore();
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

useEffect(() => {
  if (roleGroups.length > 0) {
    setExpandedGroups([roleGroups[0].id]);
    const firstRole = roleGroups[0].roles?.[0];
    if (firstRole) {
      setSelectedRole(Number(firstRole.id), firstRole.name);
    }
  }
}, [roleGroups, setSelectedRole]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleDeleteClick = (
    e: React.MouseEvent,
    role: Role
  ) => {
    e.stopPropagation()
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = (reassignToRoleId: string) => {
    console.log(
      `Deleting ${roleToDelete?.id}, reassign to ${reassignToRoleId}`
    )
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  return (
    <div className="w-[260px] flex flex-col h-full">
      <Button
        className="mb-4 gap-2 bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => setCreateRoleOpen(true)}
      >
        <Plus size={16} />
        Create New Role
      </Button>

      {/* Roles */}
      <Card className="flex-1 overflow-auto shadow-none border border-border ">
        <CardHeader className="flex py-2 px-4 border-b bg-[#f1f5f9] rounded-t-md h-12">
          <CardTitle className="font-roboto text-md font-medium uppercase text-gray-500 mt-1">
              Defined Roles
          </CardTitle>
        </CardHeader>

        <div className="bg-white space-y-2 p-2">
          {roleGroups.map((group) => {
            const isExpanded = expandedGroups.includes(group.id)
            return (
              <div key={group.id}>
                <button
                onClick={() => toggleGroup(group.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-3 border text-sm font-medium text-gray-500 transition-all shadow-sm",
                  isExpanded
                    ? "rounded-t-lg border-b-0 bg-gray-50"
                    : "rounded-sm hover:bg-gray-50"     
                )}
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}

                <span className="font-roboto font-medium uppercase">{group.name}</span>
              </button>

                {isExpanded && (
                  <div className="border border-t-0 rounded-b-lg overflow-hidden shadow-xs">
                      {/* {group.roles.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-400 italic">
                              No roles available
                        </div>
                      )} */}
                    {group.roles.map((role) => (
                      <div
                        key={role.id}
                        className="relative"
                        onMouseEnter={() =>
                          setHoveredRole(role.id)
                        }
                        onMouseLeave={() =>
                          setHoveredRole(null)
                        }
                      >
                      <button
                               onClick={() => {
                                  if (hasUnsavedChanges) {
                                    showAlert(
                                      "Unsaved changes",
                                      "Save changes before switching role",
                                      "warning",
                                      "#ff9966" 
                                    );
                                    return;
                                  }
                                  setSelectedRole(Number(role.id), role.name);
                                }}
                              className={cn(
                                "w-full px-4 py-2 text-left",
                                selectedRoleId === Number(role.id)
                                  ? "bg-blue-50 border-l-4 border-blue-600"
                                  : "hover:bg-gray-50"
                              )}
                            >
                          <div className="font-roboto font-medium text-md  text-gray-900">
                              {role.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users size={12} />
                             {role.userCount} users
                          </div>
                        </button>

                        {hoveredRole === role.id && (
                          <button
                            onClick={(e) =>
                               handleDeleteClick(e, role)
                             }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-destructive"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Confirm Dialog */}
        <ConfirmDeleteRoleDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          role={roleToDelete}
        />

         <CreateRoleDialog
            open={createRoleOpen}
            onClose={() => setCreateRoleOpen(false)}
          />
    </div>
  )
}
