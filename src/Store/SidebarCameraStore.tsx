import { create } from "zustand";
import { Device as BaseDevice } from "@/components/LiveView/DeviceTypes";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.11.131:9081";

export interface MappedDevice extends BaseDevice {
  groupId: number;
  groupName: string;
  streams: any[];
}

export interface SequencingDevice extends MappedDevice {
  duration?: string;
}

interface Group {
  id: number;
  name: string;
  children: Group[];
  devices?: any[];
}

interface CameraStore {
  cameras: MappedDevice[];
  groups: Group[];
  cameraMapByGroup: Record<number, MappedDevice[]>;
  loading: boolean;
  sequencingPlaylist: SequencingDevice[];
  isSequencing: boolean;

  fetchCameras: () => Promise<void>;
  setSequencingPlaylist: (playlist: SequencingDevice[]) => void;
  setIsSequencing: (is: boolean) => void;
  updateDeviceDuration: (cameraId: string, duration: string) => void;
}

// Helper: capitalize first letter
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const SidebarCameraStore = create<CameraStore>((set, get) => ({
  cameras: [],
  groups: [],
  cameraMapByGroup: {},
  loading: false,
  sequencingPlaylist: [],
  isSequencing: false,

  fetchCameras: async () => {
    if (get().loading) return;
    set({ loading: true });

    try {
      const res = await fetch(`${BASE_URL}/api/v1/groups/get-tree-view`);
      const json = await res.json();
      const groupData: Group[] = json?.data || [];

      const groupMap = new Map<number, string>();
      const cameras: MappedDevice[] = [];

      // Flatten groups and extract devices
      const flattenGroups = (groups: Group[], parentPath = "") => {
        groups.forEach((g) => {
          const currentName = parentPath
            ? `${parentPath} / ${g.name}`
            : capitalize(g.name);

          groupMap.set(g.id, currentName);

          // Extract devices from this group
          if (g.devices?.length) {
            g.devices.forEach((d: any) => {
              cameras.push({
                cameraId: String(d.id),
                name: d.name || "Unnamed Camera",
                groupId: Number(d.groupId || g.id),
                groupName: groupMap.get(Number(d.groupId || g.id)) || currentName,
                streams: d.streams || [],
              });
            });
          }

          if (g.children?.length) {
            flattenGroups(g.children, currentName);
          }
        });
      };

      flattenGroups(groupData);

      // Build camera map by group
      const cameraMap: Record<number, MappedDevice[]> = {};
      cameras.forEach((cam) => {
        if (!cam.groupId) return;
        if (!cameraMap[cam.groupId]) cameraMap[cam.groupId] = [];
        cameraMap[cam.groupId].push(cam);
      });

      set({
        cameras,
        groups: groupData,
        cameraMapByGroup: cameraMap,
        loading: false,
      });
    } catch (e) {
      console.error("Failed to fetch cameras/groups:", e);
      set({ loading: false });
    }
  },

  setSequencingPlaylist: (playlist) =>
    set({
      sequencingPlaylist: playlist.map((d) => ({
        ...d,
        duration: d.duration || "10s",
      })),
    }),
  setIsSequencing: (is) => set({ isSequencing: is }),
  updateDeviceDuration: (cameraId, duration) =>
    set((state) => ({
      sequencingPlaylist: state.sequencingPlaylist.map((d) =>
        d.cameraId === cameraId ? { ...d, duration } : d
      ),
    })),
}));