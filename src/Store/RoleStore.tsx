    import { create } from "zustand";

    interface RoleStore {
      selectedRoleId: string;
      setSelectedRole: (id: string) => void;
    }

    export const useRoleStore = create<RoleStore>((set) => ({
      selectedRoleId: "admin-super",
      setSelectedRole: (id) => set({ selectedRoleId: id }),
    }));
