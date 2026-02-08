import { create } from "zustand";

interface SettingsStore {
  activeItem: string;
  activeRoute: string;
  previousRoute: string | null; // new
  setActiveItem: (id: string) => void;
  setActiveRoute: (route: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeItem: "manage-users",
  activeRoute: "/settings/users",
  previousRoute: null, // initially null

  setActiveItem: (id) => set({ activeItem: id }),
  
  setActiveRoute: (route) => {
    const currentRoute = get().activeRoute;
    set({ previousRoute: currentRoute, activeRoute: route });
  },
}));
