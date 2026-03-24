
export interface Player {
  slotIndex: number;
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: Date;
}

export interface RawSegment {
  startTime: Date;
  endTime: Date;
  type?: "recording" | "motion" | "alarm";
}

export interface SegmentHour {
  start: number;
  end: number;
  type: "recording" | "gap";
}

export interface PlaybackBookmark {
  id: string;
  cameraId: string;
  name?: string;
  title: string;
  position?: number;
  timestamp: string;
  bookmarkTime?: string;
  createdAt?: Date;
}

export interface PlaybackState {
  // Date & Time
  selectedDate: Date;

  // Segments & Data
  segmentsPerSlot: Record<number, SegmentHour[]>;
  rawSegmentsPerSlot: Record<number, RawSegment[]>;
  bookmarksPerSlot: Record<number, PlaybackBookmark[]>;

  // UI State
  selectedSlot: number | null;
  zoomLevel: number;
  isTimelineExpanded: boolean;
  showCameraList: boolean;
  selectedLayout: string;

  // Loading & Errors
  loadingSlots: Set<number>;
  slotErrors: Record<number, string>;

  // Video Players
  players: Player[];
}

export interface PlaybackContextType {
  // State
  state: PlaybackState;

  // Date/Time
  setSelectedDate: (date: Date) => void;

  // Slot Selection
  setSelectedSlot: (slot: number | null) => void;

  // Timeline
  setZoomLevel: (level: number) => void;
  setTimelineExpanded: (expanded: boolean) => void;

  // Camera Drop
  handleCameraDrop: (cameraId: string, slotIndex: number) => Promise<void>;

  // Seek
  handleSeek: (absHour: number, slotIndex?: number) => void;
  handleSeekToDate: (date: Date) => void;
  handleJumpToBookmark: (position: number) => void;

  // Playback Controls
  handleFastForward: () => void;
  handleRewind: () => void;
  handleSkipBack: () => void;
  handleSkipForward: () => void;

  // Bookmarks
  handleTimelineAddBookmark: (slotIndex: number, position: number) => Promise<void>;
  handleTimelineRemoveBookmark: (id: string, camId: string) => Promise<void>;

  // Layout
  handleLayoutChange: (layout: string) => void;
  handleToggleCameraList: () => void;
}
