import { create } from "zustand";
import { API_BASE_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { useRoleStore } from "./RoleStore";
import { ALL_PERMISSION_GROUPS } from "@/components/settings/Permissions.config";

interface PermissionStore {
  enabledMap: Record<string, boolean>;
  roleName: string;
  togglePermission: (id: string) => void;
  loadRolePermissions: () => Promise<void>;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  enabledMap: {},
  roleName: "",

  togglePermission: (id) =>
    set((state) => ({
      enabledMap: {
        ...state.enabledMap,
        [id]: !state.enabledMap[id],
      },
    })),

  loadRolePermissions: async () => {
    const { selectedRoleId } = useRoleStore.getState();
    if (!selectedRoleId) return;

    const res = await fetch(
      `${API_BASE_URL}${API_URLS.GetRoleByRoleId}/${selectedRoleId}`,
      { headers: getAuthHeaders() }
    );

    const json = await res.json();
    if (!json.success) return;

    const roleData = Array.isArray(json.data)
      ? json.data.find((r) => r.roleId === selectedRoleId)
      : json.data;

    if (!roleData) return;

    const apiPermissionSet = new Set<string>();
    roleData.permissionGroups.forEach((group) => {
      group.permissions.forEach((p) => {
        apiPermissionSet.add(p.permissionCode);
      });
    });

    const map: Record<string, boolean> = {};

    ALL_PERMISSION_GROUPS.forEach((group) => {
      group.permissions.forEach((p) => {
        map[p.id] = apiPermissionSet.has(p.id);
      });
    });

    set({
      enabledMap: map,
      roleName: roleData.roleName,
    });

  },
}));
