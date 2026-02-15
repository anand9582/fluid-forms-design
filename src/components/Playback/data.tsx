// Static data for Playback components

import type { TimelineTrack, PlaybackCameraSlot } from "./types";

// Camera feeds for playback grid
export const playbackCameraFeeds: PlaybackCameraSlot[] = [
  { id: 1, name: "Lobby Entrance main", location: "Building A", hasCamera: true },
  { id: 2, name: "Hall Entrance main", location: "Building A", hasCamera: true },
  { id: 3, name: "Gym area", location: "Building B", hasCamera: true },
  { id: 4, name: "Fifth floor cafe", location: "Building A", hasCamera: true },
];

// Timeline tracks data
export const timelineTracks: TimelineTrack[] = [
  {
    name: "Grand Lobby Watcher",
    selected: false,
    segments: [
      { start: 25, end: 35, type: "recording" },
      { start: 35, end: 45, type: "alert" },
      { start: 45, end: 55, type: "recording" },
      { start: 60, end: 65, type: "alert" },
    ],
  },
  {
    name: "Main Hall Guardian",
    selected: true,
    segments: [
      { start: 15, end: 40, type: "recording" },
      { start: 40, end: 50, type: "alert" },
      { start: 50, end: 75, type: "recording" },
      { start: 75, end: 78, type: "alert" },
    ],
  },
  {
    name: "Fitness Center Sentinel",
    selected: false,
    segments: [
      { start: 20, end: 35, type: "recording" },
      { start: 35, end: 45, type: "alert" },
      { start: 45, end: 55, type: "recording" },
      { start: 80, end: 95, type: "recording" },
    ],
  },
  {
    name: "Main Hall Protector",
    selected: false,
    segments: [
      { start: 18, end: 40, type: "recording" },
      { start: 40, end: 50, type: "recording" },
    ],
  },
  {
    name: "Hallway Overseer",
    selected: false,
    segments: [
      { start: 85, end: 100, type: "recording" },
    ],
  },
];

// Time labels for timeline
export const timeLabels = [
  "6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM",
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "10:30 AM", "10:30 AM",
  "10:30 AM", "10:30 AM", "10:30 AM", "10:30 AM", "10:30 AM", "10:30 AM", "10:30 AI",
];

// Playback alerts data
export const playbackAlertsData = [
  {
    type: "Security Alert",
    description: "Unattended Baggage Detected",
    icon: "🛡️",
    camera: "Cam-lobby-04, First floor desk",
    status: "New",
    statusColor: "text-primary",
    date: "25 Dec 2025, 12:21 AM",
    aiMatch: "10%",
    actionBy: { initials: "AH", name: "Anand H" },
  },
  {
    type: "Jerome Bell",
    description: "VIP Guest Arrival: Mr. Varun Gupta",
    icon: "👤",
    camera: "Cam-lobby-04, First floor desk",
    status: "Acknowledged",
    statusColor: "text-yellow-500",
    date: "26 Dec 2025, 01:45 PM",
    aiMatch: "20%",
    actionBy: { initials: "BK", name: "Bina K" },
  },
  {
    type: "System Alert",
    description: "Loitering in guest corridor",
    icon: "⚠️",
    camera: "Cam-lobby-04, First floor desk",
    status: "Resolved",
    statusColor: "text-green-500",
    date: "27 Dec 2025, 03:30 PM",
    aiMatch: "50%",
    actionBy: { initials: "CR", name: "Carlos R" },
  },
];
