import { useEffect, useMemo, useState } from "react";
 import axios from "axios";
import { PermissionCard } from "./PermissionCard";
import { ALL_PERMISSION_GROUPS } from "./Permissions.config";
import { useRoleStore } from "@/Store/RoleStore";
import { usePermissionStore } from "@/Store/PermissionStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Settings, Users, FileText, Key ,Copy } from "lucide-react";
import {CardHeader, CardTitle} from "@/components/ui/card";
import { useSettingsStore } from "@/Store/SettingsStore";
import { API_BASE_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { showAlert } from "@/components/SweetAlertpopup/SweetAlert";
import { DuplicateRoleDialog  } from "@/components/settings/RolePermissionModel/DuplicateDialog"; 
import { UnsavedChangesDialog   } from "@/components/settings/RolePermissionModel/UnsavedDialog"; 

import {
  PermissionIcons,
} from "@/components/ui/icons";

export function PermissionsContent() {
  const { selectedRoleId } = useRoleStore();
  const { roleName,enabledMap, togglePermission, loadRolePermissions } = usePermissionStore();
  const [initialMap, setInitialMap] = useState<Record<string, boolean>>({});
   const { setUnsavedChanges } = useSettingsStore();
   const [saving, setSaving] = useState(false);
const [isDuplicateOpen, setDuplicateOpen] = useState(false);
const [dialogOpen, setDialogOpen] = useState(false);
const [newRoleName, setNewRoleName] = useState("");

  const GROUP_ICON_MAP: Record<string, JSX.Element> = {
    "video-access": <Video size={18} />,
    "system-admin": <Settings size={18} />,
  };
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
    };

  // Load permissions whenever role changes
    useEffect(() => {
        if (!selectedRoleId) return;
         loadRolePermissions(); 
    }, [selectedRoleId]);


  // Prepare visible groups with icons
  const visibleGroups = useMemo(() => {
    return ALL_PERMISSION_GROUPS.map((group) => ({
      ...group,
      icon: GROUP_ICON_MAP[group.id],
      permissions: group.permissions
        .filter((p) => enabledMap[p.id] !== undefined)
        .map((p) => ({ ...p, icon: PERMISSION_ICON_MAP[p.id] })),
    })).filter((group) => group.permissions.length > 0);
  }, [enabledMap]);

  const totalPermissions = useMemo(() => {
  const total = ALL_PERMISSION_GROUPS.reduce(
    (total, group) => total + group.permissions.length,
    0
  );
  console.log("🔹 Total permissions:", total);
  return total;
}, []);


// Enabled permissions (API true wale)
const enabledPermissions = useMemo(() => {
  const enabled = Object.values(enabledMap).filter(Boolean).length;
  console.log("🔹 Enabled permissions:", enabled, "=>", enabledMap);
  return enabled;
}, [enabledMap]);

  // Detect if any permission changed
const hasChanges = useMemo(() => {
  const changed = Object.keys(enabledMap).some(
      (key) => enabledMap[key] !== initialMap[key]
  );

  return changed;
}, [enabledMap, initialMap]);

useEffect(() => {
  if (Object.keys(enabledMap).length > 0 && Object.keys(initialMap).length === 0) {
    setInitialMap(enabledMap);
  }
}, [enabledMap, initialMap]);


const handleSave = async () => {
  if (!selectedRoleId) return;
  setSaving(true);

  const permissionCodes = Object.entries(enabledMap)
    .filter(([_, enabled]) => enabled)
    .map(([key, _]) => key);

    try {
      const response = await axios.put(
        `${API_BASE_URL}${API_URLS.UpdateRoleById}/${selectedRoleId}`,
        { permissionCodes },
        { headers: getAuthHeaders() }
      );

      showAlert(
        "Success",
        "Save changes successfully",
        "success",
      );

      setInitialMap({ ...enabledMap });
    } catch (error: any) {
      console.error("Error updating permissions:", error);

      showAlert(
        "Save Failed",
        error.response?.data?.message || "Failed to save permissions. Please try again.",
        "error",
        "#ef4444"
      );
    } finally {
      setSaving(false);
    }
  };


useEffect(() => {
     setUnsavedChanges(hasChanges);
}, [hasChanges, setUnsavedChanges]);


const handleDuplicate = async (roleType: string) => {
  if (!newRoleName.trim()) {
    showAlert("Validation", "Role name cannot be empty", "warning");
    return;
  }

  try {
    const permissionCodes = Object.entries(enabledMap)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key);

    await axios.post(
      `${API_BASE_URL}${API_URLS.DuplicateRole}`,
      { newRoleName, roleType, permissionCodes },
      { headers: getAuthHeaders() }
    );

    showAlert("Success", "Role duplicated successfully", "success");
    setDuplicateOpen(false);
    setNewRoleName("");
  } catch (err: any) {
    console.error(err);
    showAlert(
      "Error",
      err.response?.data?.message || "Failed to duplicate role",
      "error"
    );
  }
};

  return (
   <div className="flex-1 overflow-auto border rounded-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4  border-b p-2 bg-white">
        <div className="ml-16 md:ml-0">
          <CardHeader className="p-2 rounded-t-sm h-[60px]">
            <div className="flex items-center gap-3 ">
               <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-blue-50">
                    <PermissionIcons className="text-blue-600" />
                </div>
            <div className="flex flex-col">
                {/* Title + Badge */}
                <div className="flex items-center gap-3">
                    <CardTitle className="font-roboto font-bold text-lg text-black-600">
                         {roleName}
                    </CardTitle>

                    {hasChanges && (
                      <Badge
                        className="
                          rounded-full
                          bg-orange-100
                          text-orange-600
                          hover:bg-orange-500
                          hover:text-white
                          border border-orange-200
                          text-[12px]
                          font-semibold
                          px-4 py-1
                        "
                      >
                        Unsaved changes
                       </Badge>
                     )}
                </div>
               <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Showing <span className="font-medium text-foreground">
                     {enabledPermissions}
                  </span>{" "}
                  of <span className="font-medium text-foreground">
                    {totalPermissions}
                  </span>{" "}
                  permissions enabled for this role.
               </p>
              </div>
           </div>
          </CardHeader>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" className="gap-2 text-sm shadow-sm" onClick={() => setDuplicateOpen(true)}>
            <Copy size={16} />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>

            <DuplicateRoleDialog 
              open={isDuplicateOpen}
              onClose={() => setDuplicateOpen(false)}
              existingRoleName={roleName}
              enabledPermissions={Object.keys(enabledMap)}
              onDuplicate={handleDuplicate}
            />
             {/* <UnsavedChangesDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onSave={handleSave}
              // onDiscard={handleDiscard}
              roleName={roleName}
            /> */}
                <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
                onClick={handleSave}
                disabled={!hasChanges}
               >
             <span className="hidden sm:inline">Save changes</span>
          </Button>
        </div>
      </div>

      {/* Permission Groups */}
      <div className="space-y-6 md:space-y-8 p-4 bg-white">
        {visibleGroups.map((group) => (
          <div key={group.id}>
            <div className="flex items-center gap-2 mb-3 md:mb-2">
              <span className="text-muted-foreground">{group.icon}</span>
              <h3 className="text-sm font-semibold text-foreground">{group.name}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
             {group.permissions.map((permission) => {
                  return (
                        <PermissionCard
                          key={permission.id}
                          id={permission.id}
                          title={permission.title}
                          description={permission.description}
                          enabled={!!enabledMap[permission.id]}
                          icon={permission.icon}
                          onChange={togglePermission}
                        />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
