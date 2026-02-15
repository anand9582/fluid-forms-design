// DeviceTypes.ts
// DeviceTypes.ts
export interface Device {
  cameraId: string;
  name: string;
  groupName?: string;
  streams?: {
    streamType: "MAIN" | "SUB";
    status: "ONLINE" | "OFFLINE";
    restreamUrls: string[];
  }[];
}



export interface CameraStatus {
  id: string;
  name: string;
  location: string;
  bitrate: string;
  hasCamera?: boolean;
}
