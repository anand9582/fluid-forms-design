import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  X,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Search,
  Calendar as CalendarIcon,
  Clock,
  FolderOpen,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ---------- Camera tree types ---------- */
interface CameraNode {
  id: string;
  name: string;
  checked: boolean;
}

interface FloorNode {
  id: string;
  name: string;
  cameras: CameraNode[];
  expanded: boolean;
}

interface BuildingNode {
  id: string;
  name: string;
  floors: FloorNode[];
  cameras: CameraNode[]; // direct cameras (no floor)
  expanded: boolean;
}

interface PropertyNode {
  name: string;
  totalCameras: number;
  alerts: number;
  buildings: BuildingNode[];
}

/* ---------- Sample tree data ---------- */
function buildSampleTree(): PropertyNode {
  return {
    name: "Grand ...",
    totalCameras: 45,
    alerts: 3,
    buildings: [
      {
        id: "ba", name: "Building A (Guest)", expanded: true, cameras: [],
        floors: [{
          id: "f1", name: "Floor 1 (Lobby)", expanded: true,
          cameras: [
            { id: "c1", name: "Main entrance cam...", checked: true },
            { id: "c2", name: "Reception Desk Cam...", checked: false },
          ]
        }]
      },
      {
        id: "ext", name: "Exterior", expanded: false, cameras: [
          { id: "c3", name: "Main entrance cam...", checked: false },
          { id: "c4", name: "Main entrance cam...", checked: false },
        ], floors: []
      },
      {
        id: "bb", name: "Building B (Amenities)", expanded: true, cameras: [],
        floors: [
          {
            id: "f2", name: "Rooftop Pool", expanded: true,
            cameras: [
              { id: "c5", name: "Main entrance cam...", checked: true },
              { id: "c6", name: "Main entrance cam...", checked: true },
            ]
          }
        ]
      },
      {
        id: "pg", name: "Parking Garage", expanded: false, cameras: [
          { id: "c7", name: "Reception Desk Cam...", checked: false },
        ], floors: []
      },
    ]
  };
}

/* ============================================= */

interface ExportVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTimestamp?: string;
}

export function ExportVideoDialog({
  open,
  onOpenChange,
  currentTimestamp,
}: ExportVideoDialogProps) {
  const [tree, setTree] = useState<PropertyNode>(buildSampleTree);
  const [cameraSearch, setCameraSearch] = useState("");
  const [exportName, setExportName] = useState("EXPORT_2026-01-06_01");
  const [destination, setDestination] = useState("C:/Users/Admin/Documents/VE");
  const [startDate, setStartDate] = useState("23 Dec 2025");
  const [startTime, setStartTime] = useState("10:20:21");
  const [endDate, setEndDate] = useState("23 Dec 2025");
  const [endTime, setEndTime] = useState("10:30:28");
  const [exportType, setExportType] = useState("video");
  const [fileFormat, setFileFormat] = useState("native");
  const [includePlayer, setIncludePlayer] = useState(false);
  const [exportSingleFile, setExportSingleFile] = useState(false);
  const [mergeStreams, setMergeStreams] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notes, setNotes] = useState("");

  const toggleCamera = (camId: string) => {
    setTree(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as PropertyNode;
      for (const b of next.buildings) {
        for (const c of b.cameras) {
          if (c.id === camId) { c.checked = !c.checked; return next; }
        }
        for (const f of b.floors) {
          for (const c of f.cameras) {
            if (c.id === camId) { c.checked = !c.checked; return next; }
          }
        }
      }
      return next;
    });
  };

  const toggleBuilding = (bId: string) => {
    setTree(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as PropertyNode;
      const b = next.buildings.find(x => x.id === bId);
      if (b) b.expanded = !b.expanded;
      return next;
    });
  };

  const toggleFloor = (bId: string, fId: string) => {
    setTree(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as PropertyNode;
      const b = next.buildings.find(x => x.id === bId);
      if (b) {
        const f = b.floors.find(x => x.id === fId);
        if (f) f.expanded = !f.expanded;
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setTree(buildSampleTree());
    setCameraSearch("");
    setExportName("EXPORT_2026-01-06_01");
    setNotes("");
  };

  const handleStartExport = () => {
    toast.success("Export started", {
      description: `Exporting ${exportName} as ${fileFormat.toUpperCase()}`,
    });
    onOpenChange(false);
  };

  const durationSeconds = 58;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[780px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Export Video
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Export selected camera footage for the chosen time range.
            </DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={handleResetFilters}
            >
              <RotateCcw className="h-3 w-3" />
              Reset All Filters
            </Button>
          </div>
        </div>

        <Separator />

        {/* Body — two columns */}
        <div className="flex min-h-[420px]">
          {/* LEFT — Camera tree */}
          <div className="w-[220px] border-r border-border flex flex-col">
            <div className="px-3 pt-3 pb-2">
              <p className="text-xs font-semibold text-foreground mb-2">Cameras</p>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                  placeholder="Search cameras..."
                  value={cameraSearch}
                  onChange={e => setCameraSearch(e.target.value)}
                  className="h-7 pl-7 text-xs"
                />
              </div>
            </div>
            <ScrollArea className="flex-1 px-2 pb-2">
              {/* Property */}
              <div className="mb-1">
                <div className="flex items-center gap-1.5 px-1 py-1">
                  <span className="text-[10px] font-medium text-muted-foreground">PROPERTY</span>
                  <span className="text-xs font-semibold text-foreground">{tree.name}</span>
                  <Badge variant="secondary" className="h-4 text-[9px] px-1 ml-auto">{tree.totalCameras}</Badge>
                  {tree.alerts > 0 && (
                    <Badge variant="destructive" className="h-4 text-[9px] px-1">{tree.alerts}</Badge>
                  )}
                </div>
              </div>

              {tree.buildings.map(building => (
                <div key={building.id} className="mb-0.5">
                  <button
                    className="flex items-center gap-1 px-1 py-1 w-full text-left hover:bg-muted/50 rounded-sm"
                    onClick={() => toggleBuilding(building.id)}
                  >
                    {building.expanded ? (
                      <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-[11px] font-medium text-foreground truncate">{building.name}</span>
                  </button>

                  {building.expanded && (
                    <div className="pl-3">
                      {/* Floors */}
                      {building.floors.map(floor => (
                        <div key={floor.id} className="mb-0.5">
                          <button
                            className="flex items-center gap-1 px-1 py-0.5 w-full text-left hover:bg-muted/50 rounded-sm"
                            onClick={() => toggleFloor(building.id, floor.id)}
                          >
                            {floor.expanded ? (
                              <ChevronDown className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                            ) : (
                              <ChevronRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                            )}
                            <span className="text-[11px] text-muted-foreground">{floor.name}</span>
                          </button>

                          {floor.expanded && (
                            <div className="pl-4 space-y-0.5">
                              {floor.cameras.map(cam => (
                                <label
                                  key={cam.id}
                                  className="flex items-center gap-2 px-1 py-0.5 hover:bg-muted/30 rounded-sm cursor-pointer"
                                >
                                  <Checkbox
                                    checked={cam.checked}
                                    onCheckedChange={() => toggleCamera(cam.id)}
                                    className="h-3.5 w-3.5"
                                  />
                                  <span className="text-[11px] text-foreground truncate">{cam.name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Direct cameras */}
                      {building.cameras.length > 0 && (
                        <div className="pl-1 space-y-0.5">
                          {building.cameras.map(cam => (
                            <label
                              key={cam.id}
                              className="flex items-center gap-2 px-1 py-0.5 hover:bg-muted/30 rounded-sm cursor-pointer"
                            >
                              <Checkbox
                                checked={cam.checked}
                                onCheckedChange={() => toggleCamera(cam.id)}
                                className="h-3.5 w-3.5"
                              />
                              <span className="text-[11px] text-foreground truncate">{cam.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* RIGHT — Export details */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-5 py-4">
              <div className="space-y-5">
                {/* EXPORT DETAILS */}
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3">Export Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Export Name</label>
                      <Input
                        value={exportName}
                        onChange={e => setExportName(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Destination</label>
                      <div className="flex gap-1.5">
                        <Input
                          value={destination}
                          onChange={e => setDestination(e.target.value)}
                          className="h-8 text-xs flex-1"
                        />
                        <Button variant="outline" size="sm" className="h-8 text-xs px-3 gap-1">
                          <FolderOpen className="h-3 w-3" />
                          Browse
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TIME RANGE */}
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-3">Time Range</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Start Time</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input value={startDate} onChange={e => setStartDate(e.target.value)} className="h-8 text-xs pl-7" />
                        </div>
                        <div className="relative w-[90px]">
                          <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input value={startTime} onChange={e => setStartTime(e.target.value)} className="h-8 text-xs pl-7" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground mb-1 block">End Time</label>
                      <div className="flex gap-1.5">
                        <div className="relative flex-1">
                          <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input value={endDate} onChange={e => setEndDate(e.target.value)} className="h-8 text-xs pl-7" />
                        </div>
                        <div className="relative w-[90px]">
                          <Clock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input value={endTime} onChange={e => setEndTime(e.target.value)} className="h-8 text-xs pl-7" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="h-3 w-3 text-emerald-500" />
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Duration: {durationSeconds} seconds</span>
                  </div>
                </div>

                {/* EXPORT TYPE & FILE FORMAT */}
                <div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Export Type</p>
                      <Select value={exportType} onValueChange={setExportType}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video" className="text-xs">Export Video</SelectItem>
                          <SelectItem value="snapshot" className="text-xs">Export Snapshot</SelectItem>
                          <SelectItem value="audio" className="text-xs">Export Audio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">File Format</p>
                      <Select value={fileFormat} onValueChange={setFileFormat}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="native" className="text-xs">Native</SelectItem>
                          <SelectItem value="mp4" className="text-xs">MP4</SelectItem>
                          <SelectItem value="avi" className="text-xs">AVI</SelectItem>
                          <SelectItem value="mkv" className="text-xs">MKV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* EXPORT OPTIONS */}
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Export Options</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 border border-border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/30">
                      <Checkbox checked={includePlayer} onCheckedChange={(v) => setIncludePlayer(!!v)} className="h-3.5 w-3.5" />
                      <span className="text-[11px] text-foreground">Include Export Player</span>
                    </label>
                    <label className="flex items-center gap-2 border border-border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/30">
                      <Checkbox checked={exportSingleFile} onCheckedChange={(v) => setExportSingleFile(!!v)} className="h-3.5 w-3.5" />
                      <span className="text-[11px] text-foreground">Export as Single File</span>
                    </label>
                  </div>
                  <label className="flex items-center gap-2 border border-border rounded-md px-3 py-2 cursor-pointer hover:bg-muted/30 mt-2 w-fit">
                    <Checkbox checked={mergeStreams} onCheckedChange={(v) => setMergeStreams(!!v)} className="h-3.5 w-3.5" />
                    <span className="text-[11px] text-foreground">Merge multiple camera streams</span>
                  </label>
                </div>

                {/* ADVANCED OPTIONS */}
                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger className="flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wide cursor-pointer hover:underline">
                    Show Advanced Options
                    <ChevronDown className={cn("h-3 w-3 transition-transform", showAdvanced && "rotate-180")} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Resolution</label>
                        <Select defaultValue="original">
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="original" className="text-xs">Original</SelectItem>
                            <SelectItem value="1080p" className="text-xs">1080p</SelectItem>
                            <SelectItem value="720p" className="text-xs">720p</SelectItem>
                            <SelectItem value="480p" className="text-xs">480p</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-muted-foreground mb-1 block">Frame Rate</label>
                        <Select defaultValue="original">
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="original" className="text-xs">Original</SelectItem>
                            <SelectItem value="30" className="text-xs">30 fps</SelectItem>
                            <SelectItem value="15" className="text-xs">15 fps</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* NOTES */}
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Notes (Optional)</p>
                  <Textarea
                    placeholder="Add case ID, reason or notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="min-h-[60px] text-xs resize-none"
                  />
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border">
              <Button variant="outline" size="sm" className="h-8 px-4 text-xs" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button size="sm" className="h-8 px-5 text-xs gap-1.5" onClick={handleStartExport}>
                Start Export
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
