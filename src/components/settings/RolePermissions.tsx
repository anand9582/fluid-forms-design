export const ROLE_PERMISSION_MAP: Record<
  string,
  { id: string; enabled: boolean }[]
> = {
  "admin-super": [
    { id: "live-sd", enabled: true },
    { id: "live-hd", enabled: true },
    { id: "playback", enabled: true },
    { id: "ptz", enabled: true },
    { id: "two-way", enabled: true },
    { id: "export", enabled: true },

    { id: "manage-users", enabled: true },
    { id: "assign-cameras", enabled: true },
    { id: "firmware", enabled: true },

    { id: "view-alerts", enabled: true },
    { id: "ack-alerts", enabled: true },
  ],

  "admin-sub": [
    { id: "live-sd", enabled: true },
    { id: "playback", enabled: true },
    { id: "export", enabled: false },
    { id: "manage-users", enabled: false },
  ],

  operator: [
    { id: "live-sd", enabled: true },
    { id: "playback", enabled: true },
    { id: "export", enabled: false },
  ],
};
