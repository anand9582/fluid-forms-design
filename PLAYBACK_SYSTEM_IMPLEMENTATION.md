# Video Playback System Implementation

## Overview
A complete, segment-aware video playback system with auto-seek, seamless looping, real-time timeline updates, and support for both forward and reverse playback speeds.

---

## Core Features

### 1. **Segment-Aware Playback** ✓
- **What**: Playback automatically understands recording segments and gaps
- **How**: 
  - Segments data is passed to the store via `setSegments()`
  - System tracks recording start/end times for each slot
  - Intelligently skips gaps during playback

### 2. **Automatic Segment Looping** ✓
- **Forward Playback**: When reaching the end of the last segment, seamlessly loops back to the first segment
- **Reverse Playback**: When reaching the start of the first segment at reverse speed, loops back to the end of the last segment
- **Implementation**:
  ```typescript
  // In playback loop, we check:
  if (updateHour > lastSeg.end) {
    updateHour = firstSeg.start; // Loop forward
  } else if (playbackSpeed < 0 && updateHour < firstSeg.start) {
    updateHour = lastSeg.end; // Loop reverse
  }
  ```

### 3. **Real-Time Timeline Updates** ✓
- **Update Frequency**: Every 100ms for smooth, responsive playback
- **Global Time (Sync Mode)**: All slots advance together
- **Per-Slot Time (Async Mode)**: Each slot has independent time tracking
- **Automatic Progress**: 
  ```typescript
  const updateAmount = deltaTime * playbackSpeed * 1000; // ms
  let updateHour = currentHour + (updateAmount / 3600000); // Convert to hours
  ```

### 4. **Forward & Reverse Speed Support** ✓
- **Forward Speeds**: 1×, 2×, 4×, 8×, 16×, 36×
- **Reverse Speeds**: -1×, -2×, -4×, -8×, -16×, -32×
- **Mutually Exclusive UI**: Only one dropdown (forward or reverse) can be open at a time
- **Speed Changes**: Update applies immediately without breaking the loop

### 5. **User Interaction Without Breaking Playback** ✓

#### Seek Operations
- **Seek To Date**: Clamps position to valid recording segments
- **Seek By Seconds**: Intelligently moves forward/backward while respecting segment boundaries
- **Seek To Hour**: Converts absolute hour to date, then clamps

#### Clamping Logic
```typescript
clampToRecordings(hour, segments) {
  - If before first segment: clamp to start of first
  - If within recording: keep as-is
  - If in gap: snap to nearest segment edge
  - If after last segment: clamp to end of last
}
```

#### Drag & Click on Timeline
- Timeline drag operations call `seekTo()`
- Clamping ensures position stays in valid recordings
- Loading indicator (`slotSeeking`) shows for 3 seconds during seek

### 6. **Playback Loop Management** ✓
- **Auto-Start**: `play()` starts the loop interval
- **Pause**: `pause()` stops the loop (time remains at current position)
- **Stop**: Clears interval and resets all state to beginning
- **No Memory Leaks**: Interval is properly cleared on pause/stop

---

## State Management (Zustand Store)

### New Properties
```typescript
segmentsPerSlot: Record<number, SegmentHour[]>  // Segment data per slot
dayStart: Date                                    // Start of playback day
```

### New Methods
```typescript
setSegments(segments, dayStart)  // Called when segments load
```

### Updated Methods That Respect Segments
- `play()` - Starts playback loop
- `pause()` - Stops loop without resetting
- `stop()` - Clears loop and resets state
- `seekTo()` - Clamps to valid segments
- `seekBySeconds()` - Handles looping intelligently
- `setSpeed()` - Works with both forward/reverse

---

## Integration Points

### 1. In `pages/PlayBack/index.tsx`
```typescript
// Sync segments to store when loaded
useEffect(() => {
  const dayStart = new Date(selectedDate);
  dayStart.setHours(0, 0, 0, 0);
  playback.setSegments(segmentsPerSlot, dayStart);
}, [segmentsPerSlot, selectedDate, playback]);

// Pass onStop handler
<PlaybackTimelineBar
  onStop={() => playback.stop()}
  {...otherProps}
/>
```

### 2. In `components/Playback/PlaybackTimelineBar.tsx`
```typescript
// Reverse and forward speed dropdowns are mutually exclusive
onClick={() => {
  setReverseSpeedOpen((v) => !v);
  setForwardSpeedOpen(false);  // Close the other
}}

onClick={() => {
  setForwardSpeedOpen((v) => !v);
  setReverseSpeedOpen(false);  // Close the other
}}
```

### 3. In `Store/playbackStore.tsx`
- Manages playback loop with `setInterval` (100ms tick rate)
- Calculates time deltas for smooth playback
- Applies speed multiplier and looping logic
- Updates `globalTime` (sync) or `cameraTimes` (async) accordingly

---

## How It Works End-to-End

### Initial Load
1. User selects date and cameras are assigned to slots
2. Timeline API loads recording segments
3. `setSegmentsPerSlot()` updates local state → triggers useEffect
4. `playback.setSegments()` syncs segments and dayStart to store

### User Clicks Play
1. `togglePlay()` checks `isPlaying` state
2. Calls `playback.play()` which:
   - Sets `isPlaying = true`
   - Calls `startPlaybackLoop()`
3. Loop starts ticking every 100ms

### Every Tick (100ms)
1. Get current time and playback speed
2. Calculate time delta: `(now - lastUpdateTime) / 1000`
3. Convert to hours: `delta * playbackSpeed * 1000 / 3600000`
4. Check if we've reached segment boundary (end or start depending on direction)
5. If yes, loop to first/last segment
6. Update `globalTime` (sync) or `cameraTimes` (async)

### User Drags Timeline
1. `onMouseDown` → `seekTo(clampedDate, slotIndex)`
2. `seekTo()` clamps the time to valid segment ranges
3. Sets `isSeeking = true` flag (shows loading)
4. After 80ms, sets `isSeeking = false`
5. **Playback loop continues** - it just updated time

### User Changes Speed
1. Calls `playback.setSpeed(newSpeed)`
2. Updates `playbackSpeed` value in store
3. **Playback loop continues** - next tick uses new speed value
4. No interruption, seamless speed change

### User Clicks Stop
1. Calls `playback.stop()`
2. Clears playback loop interval
3. Resets all state to initial values
4. Timeline returns to beginning

---

## Segment Looping Scenarios

### Scenario 1: Forward Playback
```
Segments: [Recording 08:00-09:00] [Gap 09:00-10:00] [Recording 10:00-11:30]

At 11:25 (in last rec segment):
- Next tick: advance +0:05
- New time: 11:30 (at end of segment)
- Next tick: advance +0:05 again
- Update: 11:35 > lastSegment.end (11:30)
- Loop: Reset to 08:00 ✓
```

### Scenario 2: Reverse Playback (Speed = -2x)
```
At 08:05 (in first rec segment):
- Next tick: go back -0:10
- New time: 07:55 < firstSegment.start (08:00)
- Loop: Reset to lastSegment.end (11:30) ✓
```

### Scenario 3: Seek Across Gap
```
User drags timeline to 09:30 (inside gap):
- clampToRecordings() called
- Find nearest edge: 09:00 (gap start) or 10:00 (gap end)
- If closer to 09:00: snap to 09:00 (end of first recording)
- If closer to 10:00: snap to 10:00 (start of next recording)
```

---

## Benefits

✅ **No More Manual Seeking** - Playback flows automatically through all segments  
✅ **Seamless User Experience** - Looping happens transparently  
✅ **Flexible Speed Control** - Reverse/forward work naturally with looping  
✅ **Responsive Timeline** - Updates every 100ms, smooth and fluid  
✅ **Segment-Aware** - Never gets stuck in gaps or invalid times  
✅ **No Breaking Changes** - User interactions (seek, pause, click) enhance rather than interrupt playback  
✅ **Mutually Exclusive UI** - Only one speed direction dropdown at a time, cleaner UX

---

## Files Modified

1. **`src/Store/playbackStore.tsx`**
   - Added segment-aware playback loop
   - Implemented smart clamping to recording segments
   - Added forward/reverse looping logic
   - Updated play/pause/stop to manage interval

2. **`src/pages/PlayBack/index.tsx`**
   - Added useEffect to sync segments to store
   - Added onStop handler to PlaybackTimelineBar

3. **`src/components/Playback/PlaybackTimelineBar.tsx`**
   - Made reverse and forward dropdowns mutually exclusive

---

## Testing Checklist

- [ ] Load playback page with recorded segments
- [ ] Click play → timeline advances **continuously**
- [ ] Timeline updates **every 100ms** (smooth)
- [ ] Reverse and forward dropdowns are **mutually exclusive**
- [ ] At end of last segment → **loops to first** seamlessly
- [ ] At start of first segment (reverse) → **loops to last** seamlessly
- [ ] Change speed while playing → applies immediately
- [ ] Drag timeline → seek works, playback **continues**
- [ ] Click pause → time stops updating
- [ ] Click play again → resumes from same position
- [ ] Click stop → resets to beginning
- [ ] Multiple slots in async mode → each has independent time
- [ ] Sync mode → all slots advance together
