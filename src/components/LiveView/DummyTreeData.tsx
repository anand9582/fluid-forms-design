import { CameraTreeData } from "@/components/LiveView/CameraTreeTypes";

export const dummyCameraData: CameraTreeData = {
  property: "Grand...",
  totalCameras: 12,
  alerts: 2,
  buildings: [
    {
      name: "Building A (Guest Rooms)",
      floors: [
        {
          name: "Floor 1 (Lobby)",
          cameras: [
            { name: "Lobby Entrance", status: "online" },
            { name: "Front Desk", status: "alert" }
          ]
        },
        {
          name: "Floor 2 (Rooms)",
          cameras: [
            { name: "Corridor Cam 1", status: "online" },
            { name: "Corridor Cam 2", status: "warning" }
          ]
        }
      ],
    },
    {
      name: "Building B (Amenities)",
      floors: [
        {
          name: "Rooftop Pool",
          cameras: [
            { name: "Pool Area Cam", status: "online" },
            { name: "Pool Deck Cam", status: "online" }
          ]
        }
      ],
    }
  ]
};
