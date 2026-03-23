import { create } from "zustand";
import { Device } from "@/components/LiveView/DeviceTypes";
import { APISERVERURL, API_URLS } from "@/components/Config/api";

export interface SequencingDevice extends Device {
  duration?: string;
}

interface CameraStore {
  cameras: Device[];
  loading: boolean;
  sequencingPlaylist: SequencingDevice[];
  isSequencing: boolean;

  fetchCameras: () => Promise<void>;
  addCamera: (camera: Device) => void;
  reset: () => void;
  setSequencingPlaylist: (playlist: SequencingDevice[]) => void;
  setIsSequencing: (is: boolean) => void;
  updateDeviceDuration: (cameraId: string, duration: string) => void;
}

export const SidebarCameraStore = create<CameraStore>((set) => ({
  cameras: [],
  loading: false,
  sequencingPlaylist: [],
  isSequencing: false,

  fetchCameras: async () => {
    set({ loading: true });

    const res = await fetch(
      `${APISERVERURL}${API_URLS.get_all_devices}`
    );
    const json = await res.json();

    const mapped: Device[] =
      json?.data?.map((d: any) => ({
        cameraId: String(d.cameraId),
        name: d.cameraName,
        groupName: d.groupName,
        streams: d.streams,
      })) || [];

    set({ cameras: mapped, loading: false });
  },
  addCamera: (camera) =>
    set((state) => ({
      cameras: [...state.cameras, camera],
    })),

  reset: () => set({ cameras: [] }),

  setSequencingPlaylist: (playlist) => set({ sequencingPlaylist: playlist }),
  setIsSequencing: (is) => set({ isSequencing: is }),
  updateDeviceDuration: (cameraId, duration) =>
    set((state) => ({
      sequencingPlaylist: state.sequencingPlaylist.map((d) =>
        d.cameraId === cameraId ? { ...d, duration } : d
      ),
    })),
}));
