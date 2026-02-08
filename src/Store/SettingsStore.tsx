import { create } from "zustand";

interface SettingsStore {
  activeItem: string;
  activeRoute: string;
  activeTab: string;
  hasUnsavedChanges: boolean;

  routeHistory: string[]; // history stack

  setActiveItem: (id: string) => void;
  setActiveRoute: (route: string) => void;
  setActiveTab: (tab: string) => void;
  setUnsavedChanges: (value: boolean) => void;

  goBack: () => void; // multi-level back
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeItem: "manage-users",
  activeRoute: "/settings/users",
  activeTab: "roles",
  hasUnsavedChanges: false,

  routeHistory: [],

  setActiveItem: (id) => set({ activeItem: id }),

  setActiveRoute: (route) =>
    set((state) => ({
      routeHistory: [...state.routeHistory, state.activeRoute], // push current route to stack
      activeRoute: route,
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),

  goBack: () =>
    set((state) => {
      const history = [...state.routeHistory];
      const lastRoute = history.pop() || "/"; // fallback
      return { activeRoute: lastRoute, routeHistory: history };
    }),
}));
