// import { create } from "zustand";

// export interface Segment {
//   startTime: Date;
//   endTime: Date;
// }

// interface PlaybackStore {
//   globalTime: Date;
//   isPlaying: boolean;
//   isSeeking: boolean;
//   playbackSpeed: number;
//   hasVideo: boolean;

//   play: () => void;
//   pause: () => void;
//   setSpeed: (speed: number) => void;
//   seekTo: (date: Date) => void;
//   updateFromVideo: (date: Date) => void;
//   setHasVideo: (value: boolean) => void;
// }

// export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
//   globalTime: new Date(),
//   isPlaying: false,
//   isSeeking: false,
//   playbackSpeed: 1,
//   hasVideo: false,

//   play: () => set({ isPlaying: true }),
//   pause: () => set({ isPlaying: false }),
//   setSpeed: (speed) => set({ playbackSpeed: speed }),

//   seekTo: (date) => {
//     console.log("🔹 [seekTo] called with:", date);
//     set({
//       globalTime: new Date(date),
//       isSeeking: true,
//     });

//     // ✅ Use timeout to allow HLS effect to pick up the seek
//     setTimeout(() => {
//       set({ isSeeking: false });
//       const { globalTime } = get();
//       console.log("🔹 [seekTo] isSeeking set false, globalTime =", globalTime);
//     }, 50); // 50ms is usually safe
//   },

//   updateFromVideo: (date) => {
//     const { isSeeking, isPlaying } = get();
//     if (isSeeking || !isPlaying) return;
//     set({ globalTime: new Date(date) });
//   },

//   setHasVideo: (value) => set({ hasVideo: value }),
// }));



import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

interface PlaybackStore {
  globalTime: Date;
  isPlaying: boolean;
  isSeeking: boolean;
  playbackSpeed: number;

  seekTo: (date: Date) => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;

  updateFromVideo: (date: Date) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  globalTime: new Date(),
  isPlaying: false,
  isSeeking: false,
  playbackSpeed: 1,

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  setSpeed: (speed) => set({ playbackSpeed: speed }),

  seekTo: (date) => {
    set({ globalTime: date, isSeeking: true });

    setTimeout(() => {
      set({ isSeeking: false });
    }, 120);
  },

  updateFromVideo: (date) => {
    if (get().isSeeking) return;
    set({ globalTime: date });
  },
}));