// Types for Live View components

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
  cameras?: CameraStatus[];
}

export interface CameraTreeData {
  property: string;
  totalCameras: number;
  alerts: number;
  buildings: Building[];
}

export interface AIFeature {
  name: string;
  icon: string;
  enabled: boolean;
}

export interface GridLayout {
  value: string;
  label: string;
  cols: number;
  rows: number;
}

export interface SavedView {
  id: number;
  name: string;
}

export interface Alert {
  type: string;
  description: string;
  icon: string;
  camera: string;
  status: string;
  statusColor: string;
  date: string;
  aiMatch: string;
  actionBy: {
    initials: string;
    name: string;
  };
}

export type CameraSlot = {
  id: number;
  name: string;
  location: string;
  hasCamera: boolean;
} | null;
