import { create } from "zustand";

export interface CameraStream {
  instanceId: string;
  cameraId: string;
  pc: RTCPeerConnection;
  streamType: "main" | "sub";
  slotId: number;
}

interface StreamStore {
  streams: CameraStream[];
  addStream: (stream: CameraStream) => void;
  removeStreamByInstanceId: (instanceId: string) => void;
  removeStreamsByCameraId: (cameraId: string) => void;
  removeStreamsBySlotId: (slotId: number) => void;
  clearAll: () => void;
}

export const useStreamStore = create<StreamStore>((set) => ({
  streams: [],

  addStream: (stream) =>
    set((state) => ({
      streams: [...state.streams, stream],
    })),

  removeStreamByInstanceId: (instanceId) =>
    set((state) => ({
      streams: state.streams.filter(
        (s) => s.instanceId !== instanceId
      ),
    })),

  removeStreamsByCameraId: (cameraId) =>
    set((state) => ({
      streams: state.streams.filter(
        (s) => s.cameraId !== cameraId
      ),
    })),

  removeStreamsBySlotId: (slotId) =>
    set((state) => ({
      streams: state.streams.filter(
        (s) => s.slotId !== slotId
      ),
    })),

  clearAll: () => set({ streams: [] }),
}));
