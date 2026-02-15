// Types for Playback components

export interface TimelineTrack {
  name: string;
  selected: boolean;
  segments: TimelineSegment[];
}

export interface TimelineSegment {
  start: number;
  end: number;
  type: "recording" | "alert";
}

export type PlaybackCameraSlot = {
  id: number;
  name: string;
  location: string;
  hasCamera: boolean;
} | null;
