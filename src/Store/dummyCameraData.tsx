import { Device } from "@/components/LiveView/DeviceTypes";

export const dummyCameras: Device[] = [
  {
    cameraId: "cam-101",
    name: "Lobby Camera 1",
    groupName: "Grand Hotel",
    streams: [{ id: "s1", status: "ONLINE" }],
  },
  {
    cameraId: "cam-102",
    name: "Lobby Camera 2",
    groupName: "Grand Hotel",
    streams: [{ id: "s2", status: "OFFLINE" }],
  },
  {
    cameraId: "cam-201",
    name: "Pool Camera",
    groupName: "Grand Hotel",
    streams: [{ id: "s3", status: "ONLINE" }],
  },
  {
    cameraId: "cam-301",
    name: "Parking Camera",
    groupName: "City Resort",
    streams: [{ id: "s4", status: "OFFLINE" }],
  },
];
