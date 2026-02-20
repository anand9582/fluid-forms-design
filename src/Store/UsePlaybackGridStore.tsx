import { create } from "zustand";

export interface GridLayout {
  rows: number;
  cols: number;
}

interface PlaybackGridStore {
  layout: GridLayout;
  slotAssignments: (string | null)[];
  playingCameraIds: Set<string>;

  setLayout: (rows: number, cols: number) => void;
  resizeSlots: () => void;

  assignCameraToSlot: (slotIndex: number, cameraId: string) => void;
  clearSlot: (slotIndex: number) => void;
  swapSlots: (from: number, to: number) => void;
  setPlayingCameraIds: (updater: (prev: Set<string>) => Set<string>) => void;
}

const usePlaybackGridStore = create<PlaybackGridStore>((set, get) => ({
  layout: { rows: 2, cols: 2 },
  slotAssignments: [],
  playingCameraIds: new Set(),

  setLayout: (rows, cols) =>
    set({ layout: { rows, cols } }),

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
      return {
        slotAssignments: copy,
        playingCameraIds: new Set([...state.playingCameraIds, cameraId]),
      };
    }),

  clearSlot: (slotIndex) =>
    set((state) => {
      const copy = [...state.slotAssignments];
      const removed = copy[slotIndex];
      copy[slotIndex] = null;
      const playing = new Set(state.playingCameraIds);
      if (removed) playing.delete(removed);
      return { slotAssignments: copy, playingCameraIds: playing };
    }),

  swapSlots: (from, to) =>
    set((state) => {
      const updated = [...state.slotAssignments];
      const temp = updated[from];
      updated[from] = updated[to];
      updated[to] = temp;
      return { slotAssignments: updated };
    }),

  setPlayingCameraIds: (updater) =>
    set((state) => ({ playingCameraIds: updater(state.playingCameraIds) })),
}));

export default usePlaybackGridStore;
