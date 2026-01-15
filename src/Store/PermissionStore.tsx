import { create } from "zustand";
import { ROLE_PERMISSION_MAP } from "@/components/settings/RolePermissions";

interface PermissionStore {
  enabledMap: Record<string, boolean>;
  loadRolePermissions: (roleId: string) => void;
  togglePermission: (id: string) => void;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  enabledMap: {},

  loadRolePermissions: (roleId) =>
    set(() => {
      const rolePermissions = ROLE_PERMISSION_MAP[roleId] || [];

      const map: Record<string, boolean> = {};
      rolePermissions.forEach((p) => {
        map[p.id] = p.enabled; 
      });

      return { enabledMap: map };
    }),

  togglePermission: (id) =>
    set((state) => ({
      enabledMap: {
        ...state.enabledMap,
        [id]: !state.enabledMap[id],
      },
    })),
}));
