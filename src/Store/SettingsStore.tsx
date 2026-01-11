import { create } from "zustand";

interface SettingsStore {
  activeItem: string;
  activeRoute: string;
  activeTab: string;

  setActiveItem: (id: string) => void;
  setActiveRoute: (route: string) => void;
  setActiveTab: (tab: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  activeItem: "manage-users",
  activeRoute: "/settings/users",
  activeTab: "roles",

  setActiveItem: (id) => set({ activeItem: id }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
