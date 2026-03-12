// Static data for Live View components

import type { CameraTreeData, AIFeature, GridLayout, SavedView, Alert, CameraSlot } from "@/components/LiveView/Types";

// Camera tree hierarchy data
export const cameraTreeData: CameraTreeData = {
  property: "Grand...",
  totalCameras: 45,
  alerts: 3,
  buildings: [
    {
      name: "Building A (Guest)",
      floors: [
        {
          name: "Floor 1 (Lobby)",
          cameras: [
            { name: "Lobby Entrance...", status: "alert" },
            { name: "Concierge Desk", status: "online" },
            { name: "Elevator Bank A", status: "online" },
            { name: "Service Corridor", status: "warning" },
          ],
        },
      ],
    },
    {
      name: "Exterior",
      cameras: [
        { name: "Valet Dropoff", status: "alert" },
      ],
    },
    {
      name: "Building B (Amenities)",
      floors: [
        {
          name: "Rooftop Pool",
          cameras: [
            { name: "Pool Area North", status: "alert" },
            { name: "Pool Bar", status: "online" },
          ],
        },
      ],
    },
    {
      name: "Parking Garage",
      cameras: [
        { name: "Parking L1 Entry", status: "online" },
      ],
    },
  ],
};

// AI Surveillance features configuration
export const defaultAIFeatures: AIFeature[] = [
  { name: "Person Detection", icon: "", enabled: true },
  { name: "Face Recognition", icon: "", enabled: true },
  { name: "Fire & Smoke Alert", icon: "", enabled: true },
  { name: "Vehicle Tracking", icon: "", enabled: true },
  { name: "Behavioral Anomaly", icon: "", enabled: false },
];

// Available grid layout options
export const gridLayouts: GridLayout[] = [
  { value: "1x1", label: "1×1", cols: 1, rows: 1 },
  { value: "2x1", label: "2×1", cols: 2, rows: 1 },
  { value: "2x2", label: "2×2", cols: 2, rows: 2 },
  { value: "3x3", label: "3×3", cols: 3, rows: 3 },
  { value: "4x4", label: "4×4", cols: 4, rows: 4 },
  { value: "5x5", label: "5×5", cols: 5, rows: 5 },
  { value: "6x6", label: "6×6", cols: 6, rows: 6 },
  { value: "8x8", label: "8×8", cols: 8, rows: 8 },
  { value: "10x10", label: "10×10", cols: 10, rows: 10 },
  { value: "12x12", label: "12×12", cols: 12, rows: 12 },
  { value: "16x16", label: "16×16", cols: 16, rows: 16 },
];

// Sample alerts data
export const alertsData: Alert[] = [
  {
    type: "Security Alert",
    description: "Unattended Baggage Detected",
    icon: "",
    camera: "Cam-lobby-04, First floor desk",
    status: "New",
    statusColor: "text-primary",
    date: "25 Dec 2025, 12:21 AM",
    aiMatch: "10%",
    actionBy: { initials: "AH", name: "Anand H" }
  },
  {
    type: "Jerome Bell",
    description: "VIP Guest Arrival: Mr. Varun Gupta",
    icon: "",
    camera: "Cam-lobby-04, First floor desk",
    status: "Acknowledged",
    statusColor: "text-yellow-500",
    date: "26 Dec 2025, 01:45 PM",
    aiMatch: "20%",
    actionBy: { initials: "BK", name: "Bina K" }
  },
  {
    type: "System Alert",
    description: "Loitering in guest corridor",
    icon: "",
    camera: "Cam-lobby-04, First floor desk",
    status: "Resolved",
    statusColor: "text-green-500",
    date: "27 Dec 2025, 03:30 PM",
    aiMatch: "50%",
    actionBy: { initials: "CR", name: "Carlos R" }
  },
];

// Default camera feeds for the grid
export const baseCameraFeeds: NonNullable<CameraSlot>[] = [
  { id: 1, name: "Lobby Entrance main", location: "Building A", hasCamera: true },
  { id: 2, name: "Hall Entrance main", location: "Building A", hasCamera: true },
  { id: 3, name: "Gym area", location: "Building B", hasCamera: true },
  { id: 4, name: "Fifth floor", location: "Building A", hasCamera: true },
];
