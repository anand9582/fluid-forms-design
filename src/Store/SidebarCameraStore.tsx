import { create } from "zustand";
import { Device } from "@/components/LiveView/DeviceTypes";
import { APISERVERURL, API_URLS } from "@/components/Config/api";
import { dummyCameras } from "@/Store/dummyCameraData";


interface CameraStore {
  cameras: Device[];
  loading: boolean;

  fetchCameras: () => Promise<void>;
  addCamera: (camera: Device) => void;
  reset: () => void;
}

export const SidebarCameraStore = create<CameraStore>((set) => ({
  cameras: [],
  loading: false,
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
  
  //  fetchCameras: async () => {
  //   set({ loading: true });
  //   await new Promise((r) => setTimeout(r, 500));
  //   set({ cameras: dummyCameras, loading: false });
  // },

  addCamera: (camera) =>
    set((state) => ({
      cameras: [...state.cameras, camera],
    })),

  reset: () => set({ cameras: [] }),
}));
