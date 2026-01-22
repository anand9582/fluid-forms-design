    // import { create } from "zustand";

    // interface RoleStore {
    //   selectedRoleId: string;
    //   setSelectedRole: (id: string) => void;
    // }

    // export const useRoleStore = create<RoleStore>((set) => ({
    //   selectedRoleId: "admin-super",
    //   setSelectedRole: (id) => set({ selectedRoleId: id }),
    // }));

    // Store/RoleStore.ts

import { create } from "zustand";

interface RoleStore {
  selectedRoleId: number;
  selectedRoleName: string;
  setSelectedRole: (id: number, name: string) => void;
}

export const useRoleStore = create<RoleStore>((set) => ({
  selectedRoleId: null,
  selectedRoleName: "",
  setSelectedRole: (id, name) =>
    set({ selectedRoleId: id, selectedRoleName: name }),
}));
