export const ALL_PERMISSION_GROUPS = [
  {
    id: "LIVEVIEW",
    name: "Live View",
    permissions: [
      {
        id: "LiveView_HD",
        title: "Live View (HD)",
        description: "View live video in HD quality",
      },
      {
        id: "LiveView_SD",
        title: "Live View (SD)",
        description: "View live video in SD quality",
      },
      {
        id: "PTZControl",
        title: "PTZ Control",
        description: "Pan, Tilt and Zoom camera",
      },
      {
        id: "Snapshot",
        title: "Snapshot",
        description: "Capture snapshot",
      },
      {
        id: "TwoWayAudio",
        title: "Two-way Audio",
        description: "Talk using camera microphone",
      },
    ],
  },
  {
    id: "PLAYBACK",
    name: "Playback",
    permissions: [
      {
        id: "PlayBack",
        title: "Playback",
        description: "Play recorded videos",
      },
      {
        id: "ExportVideo",
        title: "Export Video",
        description: "Export recorded videos",
      },
    ],
  },
   {
    id: "ALERTS",
    name: "Alerts",
    permissions: [
      {
        id: "View_Alerts",
        title: "View Alerts",
        description: "See real-time alarms",
      },
       {
        id: "Acknowledge_Alerts",
        title: "Acknowledge Alerts",
        description: "Mark alerts as handled",
      },
    ],
  },
];
