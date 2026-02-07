
export const DeviceAlertData = [
  /* ================= DEVICE HEALTH ================= */
  {
    id: "device-health",
    title: "Device Health Alerts",
    defaultOpen: true,
    alerts: [
      {
        id: "device-offline",
        name: "Device Offline",
        enabled: true,
        channels: { mail: true, sms: true, desktop: false, webhook: false },
      },
      {
        id: "device-rebooted",
        name: "Device Rebooted",
        enabled: true,
        channels: { mail: true, sms: true, desktop: false, webhook: false },
      },
      {
        id: "firmware-crash",
        name: "Firmware Crash",
        enabled: true,
        channels: { mail: true, sms: false, desktop: false, webhook: true },
      },
      {
        id: "temp-threshold",
        name: "Temperature Threshold Exceeded",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
      {
        id: "power-failure",
        name: "Power Failure",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
      {
        id: "storage-media-failure",
        name: "Storage Media Failure (SD/NVR)",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
    ],
  },

  /* ================= NETWORK ================= */
  {
    id: "network",
    title: "Network Alerts",
    defaultOpen: true,
    alerts: [
      {
        id: "connection-lost",
        name: "Connection Lost",
        enabled: true,
        channels: { mail: true, sms: false, desktop: true, webhook: false },
      },
      {
        id: "ip-conflict",
        name: "IP Conflict",
        enabled: true,
        channels: { mail: true, sms: false, desktop: true, webhook: false },
      },
      {
        id: "network-firmware-crash",
        name: "Firmware Crash",
        enabled: true,
        channels: { mail: true, sms: false, desktop: false, webhook: true },
      },
      {
        id: "packet-loss",
        name: "Packet Loss High",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
      {
        id: "gateway-unreachable",
        name: "Gateway Unreachable",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
    ],
  },

  /* ================= STREAM & RECORDING ================= */
  {
    id: "stream-recording",
    title: "Stream and Recording Alerts",
    defaultOpen: true,
    alerts: [
      {
        id: "recording-stopped",
        name: "Recording Stopped",
        enabled: true,
        channels: { mail: true, sms: true, desktop: false, webhook: false },
      },
      {
        id: "stream-interrupted",
        name: "Stream Interrupted",
        enabled: true,
        channels: { mail: true, sms: true, desktop: false, webhook: false },
      },
      {
        id: "bitrate-drop",
        name: "Bitrate Drop",
        enabled: true,
        channels: { mail: true, sms: false, desktop: false, webhook: true },
      },
      {
        id: "frame-loss",
        name: "Frame Loss Detected",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
      {
        id: "encoding-failure",
        name: "Encoding Failure",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
    ],
  },

  /* ================= AI / ANALYTICS ================= */
  {
    id: "ai-analytics",
    title: "AI Analytics Alerts",
    defaultOpen: true,
    alerts: [
      {
        id: "ai-engine-down",
        name: "AI Engine Down",
        enabled: true,
        channels: { mail: true, sms: true, desktop: false, webhook: false },
      },
      {
        id: "model-load-failed",
        name: "Model Load Failed",
        enabled: true,
        channels: { mail: true, sms: false, desktop: false, webhook: true },
      },
      {
        id: "inference-latency",
        name: "Inference Latency High",
        enabled: true,
        channels: { mail: true, sms: false, desktop: false, webhook: true },
      },
      {
        id: "camera-not-mapped",
        name: "Camera Not Mapped to Analytics",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
      {
        id: "ai-rule-trigger",
        name: "AI Rule Triggered (Panic)",
        enabled: false,
        channels: { mail: false, sms: false, desktop: false, webhook: false },
      },
    ],
  },
];

