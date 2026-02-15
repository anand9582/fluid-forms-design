import { create } from "zustand";
interface SettingsStore {
  activeItem: string;
  activeRoute: string;
  hasUnsavedChanges: boolean;
  setActiveItem: (id: string) => void;
  setActiveRoute: (route: string) => void;
  setUnsavedChanges: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
    activeItem: "manage-users",
    activeRoute: "/settings/users",
    hasUnsavedChanges: false,
    setActiveItem: (id) => set({ activeItem: id }),
    setActiveRoute: (route) => set({ activeRoute: route }),
    setUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}));
  