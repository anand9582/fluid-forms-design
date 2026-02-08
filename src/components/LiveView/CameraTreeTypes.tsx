// Types for the camera tree

export interface CameraStatus {
  name: string;
  status: "online" | "alert" | "warning" | "offline";
}

export interface Floor {
  name: string;
  cameras: CameraStatus[];
}

export interface Building {
  name: string;
  floors?: Floor[];
  cameras?: CameraStatus[]; // cameras directly under building
}

export interface CameraTreeData {
  property: string;
  totalCameras: number;
  alerts: number;
  buildings: Building[];
}
