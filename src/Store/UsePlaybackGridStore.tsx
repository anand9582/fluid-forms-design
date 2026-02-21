import { create } from "zustand";

interface PlaybackGridStore {
  layout: { rows: number; cols: number };
  slotAssignments: (string | null)[];

  setLayout: (rows: number, cols: number) => void;
  assignCameraToSlot: (slotIndex: number, cameraId: string) => void;
  clearSlot: (slotIndex: number) => void;
}

const usePlaybackGridStore = create<PlaybackGridStore>((set) => ({
  layout: { rows: 2, cols: 2 },
  slotAssignments: Array(4).fill(null),

  setLayout: (rows, cols) =>
    set({
      layout: { rows, cols },
      slotAssignments: Array(rows * cols).fill(null),
    }),

  assignCameraToSlot: (slotIndex, cameraId) =>
    set((state) => {
      const next = [...state.slotAssignments];
      next[slotIndex] = cameraId;   // ✅ ONLY THIS SLOT
      return { slotAssignments: next };
    }),

  clearSlot: (slotIndex) =>
    set((state) => {
      const next = [...state.slotAssignments];
      next[slotIndex] = null;
      return { slotAssignments: next };
    }),
}));

export default usePlaybackGridStore;