import { useState, useEffect } from "react";
import { Bookmark, Plus, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PlaybackControlButton } from "@/components/Common/PlaybackControlButton";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { APISERVERURL, getAuthHeaders, API_URLS } from "@/components/Config/api";

export interface PlaybackBookmark {
  id: string | number;
  title?: string;
  name?: string;
  position?: number;
  timestamp?: string;
  bookmarkTime?: string;
  cameraId?: string | number;
  createdAt?: string | Date;
  note?: string;
  createdBy?: number;
}

interface PlaybackBookmarkPopoverProps {
  bookmarks: PlaybackBookmark[];
  currentPosition: number;
  currentTimestamp: string;
  cameraId: string;
  fromDate?: string;
  toDate?: string;
  onAddBookmark: (
    name: string,
    position: number,
    timestamp: string,
    cameraId: string
  ) => void;
  onRemoveBookmark: (id: string, cameraId: string) => void;
  onJumpToBookmark: (position: number) => void;
}

export function PlaybackBookmarkPopover({
  bookmarks,
  currentPosition,
  currentTimestamp,
  cameraId,
  fromDate,
  toDate,
  onAddBookmark,
  onRemoveBookmark,
  onJumpToBookmark,
}: PlaybackBookmarkPopoverProps) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [fetchedBookmarks, setFetchedBookmarks] = useState<PlaybackBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //  Helper: get position safely
  const getBookmarkPosition = (bm: PlaybackBookmark): number => {
    if (bm.position !== undefined) return bm.position;
    if (bm.bookmarkTime) return new Date(bm.bookmarkTime).getTime();
    return 0;
  };

  //  Helper: jump handler
  const handleJumpClick = (bm: PlaybackBookmark) => {
    const position = getBookmarkPosition(bm);

    const date = new Date(position);
    console.log("Converted date:", date.toString());

    if (!position || isNaN(position)) {
      console.warn(" Invalid bookmark position");
      return;
    }

    onJumpToBookmark(position);

    console.log("Jump triggered");
  };

  //  Helper: remove handler
  const handleRemoveClick = (bm: PlaybackBookmark) => {
    onRemoveBookmark(bm.id.toString(), cameraId);
    setFetchedBookmarks((prev) =>
      prev.filter((item) => item.id.toString() !== bm.id.toString())
    );
  };

  //  Helper: add handler
  const handleAdd = () => {
    const name = newName.trim() || `Bookmark ${bookmarks.length + 1}`;

    onAddBookmark(name, currentPosition, currentTimestamp, cameraId);

    setFetchedBookmarks((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        title: name,
        name,
        position: currentPosition,
        timestamp: currentTimestamp,
        bookmarkTime: currentTimestamp,
        cameraId,
        createdAt: new Date().toISOString(),
      },
    ]);

    setNewName("");
    setShowAdd(false);
  };

  //  Fetch bookmarks
  useEffect(() => {
    if (!open || !cameraId) return;

    const fetchBookmarks = async () => {
      setIsLoading(true);

      try {
        let startDate = fromDate;
        let endDate = toDate;

        if (!startDate || !endDate) {
          const now = new Date();

          const dayStart = new Date(now);
          dayStart.setHours(0, 0, 0, 0);

          const dayEnd = new Date(now);
          dayEnd.setHours(23, 59, 59, 999);

          startDate = dayStart.toISOString();
          endDate = dayEnd.toISOString();
        }

        const res = await axios.get(
          `${APISERVERURL}${API_URLS.Bookmark_List}`,
          {
            params: { cameraId, fromDate: startDate, toDate: endDate },
            headers: getAuthHeaders(),
          }
        );

        const list = res.data?.data || res.data || [];
        setFetchedBookmarks(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to fetch bookmarks", err);
        setFetchedBookmarks(bookmarks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [open, cameraId, fromDate, toDate, bookmarks]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <PlaybackControlButton label="Bookmark">
          <Bookmark className="h-3 w-3" />
        </PlaybackControlButton>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-0" align="center" side="top">
        {/* Header */}
        <div className="px-3 py-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">Bookmarks</p>
            <p className="text-[10px] text-muted-foreground">
              Mark & jump to points
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[10px] px-2 gap-1"
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus className="h-2.5 w-2.5" />
            Add
          </Button>
        </div>

        <Separator />

        {/* Add Section */}
        {showAdd && (
          <>
            <div className="p-2 space-y-1.5">
              <p className="text-[10px] text-muted-foreground">
                Current:{" "}
                <span className="font-mono font-semibold">
                  {currentTimestamp}
                </span>
              </p>

              <div className="flex gap-1.5">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Bookmark name..."
                  className="h-7 text-[11px]"
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />

                <Button
                  size="sm"
                  className="h-7 px-2.5 text-[10px]"
                  onClick={handleAdd}
                >
                  Save
                </Button>
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* List */}
        <ScrollArea className="max-h-48">
          {isLoading ? (
            <div className="px-3 py-4 text-center">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              <p className="text-[11px] text-muted-foreground">
                Loading bookmarks...
              </p>
            </div>
          ) : fetchedBookmarks.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <Bookmark className="h-5 w-5 mx-auto mb-1 opacity-40" />
              <p className="text-[11px] text-muted-foreground">
                No bookmarks yet
              </p>
            </div>
          ) : (
            <div className="p-1">
              {fetchedBookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-muted/50 group"
                >
                  <Bookmark className="h-3 w-3 text-primary" />

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">
                      {bm.title || bm.name || "Bookmark"}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-mono">
                      {bm.bookmarkTime
                        ? new Date(bm.bookmarkTime).toLocaleString()
                        : bm.timestamp}
                    </p>
                  </div>

                  {/* Jump */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                    onClick={() => handleJumpClick(bm)}
                  >
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => handleRemoveClick(bm)}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}