// Store/UseGridStore.ts
import { create } from "zustand";

export interface GridLayout {
  rows: number;
  cols: number;
}

interface GridStore {
  layout: GridLayout;
  setLayout: (rows: number, cols: number) => void;
}

const useGridStore = create<GridStore>((set) => ({
  layout: { rows: 2, cols: 2 },

  setLayout: (rows, cols) =>
    set({
      layout: { rows, cols },
    }),
}));

export default useGridStore;
