import { create } from "zustand";

interface SettingsStore {
  activeItem: string;
  activeRoute: string;
  activeTab: string;

  hasUnsavedChanges: boolean;

  setActiveItem: (id: string) => void;
  setActiveRoute: (route: string) => void;
  setActiveTab: (tab: string) => void;

  setUnsavedChanges: (value: boolean) => void;
}


export const useSettingsStore = create<SettingsStore>((set) => ({
  activeItem: "manage-users",
  activeRoute: "/settings/users",
  activeTab: "roles",

  hasUnsavedChanges: false,

  setActiveItem: (id) => set({ activeItem: id }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  setUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),
}));

  