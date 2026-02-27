import { create } from "zustand";

interface PlaybackGridStore {
  layout: { rows: number; cols: number };
  slotAssignments: (string | null)[];
  assignCameraToSlot: (slotIndex: number, cameraId: string) => void;
  clearSlot: (slotIndex: number) => void;
  clearAllSlots: () => void;
  setLayout: (rows: number, cols: number) => void;
  resizeSlots: () => void;
}

const usePlaybackGridStore = create<PlaybackGridStore>((set, get) => ({
  layout: { rows: 2, cols: 2 },
  slotAssignments: [],

  setLayout: (rows, cols) => set({ layout: { rows, cols } }),

  resizeSlots: () => {
    const { layout, slotAssignments } = get();
    const total = layout.rows * layout.cols;
    const updated = [...slotAssignments];
    if (updated.length > total) updated.length = total;
    while (updated.length < total) updated.push(null);
    set({ slotAssignments: updated });
  },

  assignCameraToSlot: (slotIndex, cameraId) =>
    set((state) => {
      const copy = [...state.slotAssignments];
      copy[slotIndex] = cameraId;
      return { slotAssignments: copy };
    }),

  clearSlot: (slotIndex) =>
    set((state) => {
      const copy = [...state.slotAssignments];
      copy[slotIndex] = null;
      return { slotAssignments: copy };
    }),

    clearAllSlots: () => set((state) => ({
    })),
}));

export default usePlaybackGridStore;