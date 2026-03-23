// Camera Controls Sidebar Component
// Right sidebar with camera controls, PTZ, stream quality, and quick actions

import { useState } from "react";
import {
  Move,
  Camera,
  Video,
  Clock,
  ZoomOut,
  ZoomIn,
  Sun,
  Moon,
  X,
  Search,
  Settings,
  Repeat,
  AlertCircle,
  Plus,
  ScanSearch,
  PlayCircle,
  PanelRightClose,
  SwitchCamera,
  GripVertical,
  Trash2,
  Pencil,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  AISurveillanceIcons,
  PersonIcons,
  FaceIcons,
  FireIcons,
  CareIcons,
  BehavioralIcons,
} from "@/components/Icons/Svg/liveViewIcons";
import { AddCamerasDialog } from "./AddCamerasDialog";
import { Device } from "./DeviceTypes";
import { SidebarCameraStore, SequencingDevice } from "@/Store/SidebarCameraStore";

interface ControlsSidebarProps {
  selectedCamera?: {
    id: string
    name: string;
    location: string;
    bitrate: string;
  } | null;
  selectedSlotIndex: number | null;
  mainSubMap: Record<number, "main" | "sub">;
  toggleMainSub: (slotIndex: number, cameraId: string, stream: "main" | "sub") => void;
  onCollapse?: () => void;
}

// AI Features data
const aiFeatures = [
  { id: "person", name: "Person Detection", enabled: true, icon: PersonIcons },
  { id: "face", name: "Face Recognition", enabled: true, icon: FaceIcons },
  { id: "fire", name: "Fire & Smoke Alert", enabled: false, icon: FireIcons },
  { id: "vehicle", name: "Vehicle Tracking", enabled: true, icon: CareIcons },
  {
    id: "behavior",
    name: "Behavioral Anomaly",
    enabled: false,
    icon: BehavioralIcons,
    proOnly: true,
  },
];

export function AISurveillanceSidebar({ selectedCamera, selectedSlotIndex, mainSubMap, toggleMainSub, onCollapse
}: ControlsSidebarProps) {
  const [activeTab, setActiveTab] = useState<"controls" | "sequencing" | "playback">("controls");
  const [activeSequence, setActiveSequence] = useState<any | null>(null);
  const [isCreatingSequence, setIsCreatingSequence] = useState(false);
  const [sequenceName, setSequenceName] = useState("");
  const [customDuration, setCustomDuration] = useState(false);
  const [activeSequencingSubTab, setActiveSequencingSubTab] = useState<"camera" | "view">("camera");
  const [isAddCamerasDialogOpen, setIsAddCamerasDialogOpen] = useState(false);
  const { sequencingPlaylist: playlist, setSequencingPlaylist: setPlaylist, updateDeviceDuration } = SidebarCameraStore();
  const [streamQuality, setStreamQuality] = useState("4k");
  const [features, setFeatures] = useState(aiFeatures);
  const [zoomLevel, setZoomLevel] = useState([50]);
  const [dwellTime, setDwellTime] = useState("5s");
  const [loopMode, setLoopMode] = useState(false);
  const [alertPriority, setAlertPriority] = useState(false);

  const handleStreamChange = (value: "main" | "sub") => {
    setStreamQuality(value);
  };

  const handleSaveSequence = () => {
    if (playlist.length === 0) return;
    setActiveSequence({
      sequenceName: sequenceName || "Untitled Sequence",
      playlist: [...playlist],
      customDuration,
      loopMode,
    });
    setIsCreatingSequence(false);
    SidebarCameraStore.getState().setIsSequencing(true);
  };

  const handleEditSequence = () => {
    setIsCreatingSequence(true);
  };

  const handleDeleteSequence = () => {
    setActiveSequence(null);
    setPlaylist([]);
    setSequenceName("");
    setCustomDuration(false);
    setLoopMode(false);
    SidebarCameraStore.getState().setIsSequencing(false);
  };

  const handleAddNewSequence = () => {
    setActiveSequence(null);
    setPlaylist([]);
    setSequenceName("");
    setCustomDuration(false);
    setLoopMode(false);
    setIsCreatingSequence(true);
  };

  // If no camera is selected, show workspace management view
  // if (!selectedCamera) {
  //   return (
  //     <div className="hidden lg:flex w-72 border-l border-border bg-white flex-col flex-shrink-0 h-full">

  //     {/* Workspace Management */}
  //     <div className="p-4">
  //       <div className="flex items-center gap-2 mb-5">
  //         <Settings className="h-5 w-5 text-slate-500" />
  //           <span className="text-sm font-roboto font-medium text-slate-500 uppercase tracking-wide">
  //               Workspace Management
  //           </span>
  //       </div>

  //         <Button
  //             variant="outline"
  //             size="sm"
  //             className="w-full justify-between rounded-sm h-10 text-sm font-roboto font-medium shadow-sm bg-white"
  //           >
  //             <span className="text-slate-500"> 
  //               Clear all grid slot
  //             </span>
  //             <X className="h-4 w-4 text-slate-500" />
  //           </Button>

  //     </div>

  //     {/* AI Surveillance Suite */}
  //     <div className="p-4">
  //       <div className="flex items-center gap-2 mb-4">
  //         <AISurveillanceIcons className="h-4 w-4" />
  //         <span className="text-[12px] font-semibold text-slate-500  uppercase tracking-wide">
  //             AI Surveillance Suite
  //         </span>
  //         <span className="ml-auto rounded-lg bg-violet-600 px-3 py-2 text-sm font-roboto font-medium text-white">
  //             PRO
  //         </span>
  //       </div>

  //       {/* Feature List */}
  //         <div className="space-y-2">
  //           {features.map((feature) => (
  //             <div
  //               key={feature.id}
  //               className={cn(
  //                 "flex items-center justify-between rounded-lg px-3 py-3",
  //                 feature.enabled
  //                   ? "bg-slate-100"
  //                   : "bg-slate-100 "
  //               )}
  //             >
  //               <div className="flex items-center gap-3">
  //                 <feature.icon className="h-4 w-4 text-muted-foreground" />
  //                 <span className="text-sm font-roboto font-medium text-foreground">
  //                    {feature.name}
  //                 </span>
  //               </div>

  //               <Switch
  //                 checked={feature.enabled}
  //                 onCheckedChange={() => toggleFeature(feature.id)}
  //                 disabled={!feature.enabled && feature.proOnly}
  //               />
  //             </div>
  //           ))}
  //         </div>
  //     </div>
  //   </div>
  //   );
  // }

  // Camera selected - show controls view
  return (
    <div className="hidden lg:flex w-72 border-l border-border bg-card flex-col flex-shrink-0 relative overflow-hidden">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-slate-400" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-roboto">
            Camera Management
          </span>
        </div>
        <div className="p-1 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCollapse}
            className="h-10 w-10 bg-muted hover:bg-slate-200 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <PanelRightClose size={18} className="text-slate-500" />
          </Button>
        </div>
      </div>


      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="flex flex-col h-full w-full"
      >
        {/* Tabs Header */}
        <div className="px-3 pt-3">
          <TabsList className="w-full grid grid-cols-3 bg-muted rounded-xl p-1">
            <TabsTrigger
              value="controls"
              className="rounded-lg text-black  text-sm font-roboto font-medium data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-foreground"
            >
              Controls
            </TabsTrigger>

            <TabsTrigger
              value="sequencing"
              className="rounded-lg text-black text-sm font-roboto font-medium data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-foreground"
            >
              Sequencing
            </TabsTrigger>

            <TabsTrigger
              value="playback"
              className="rounded-lg text-black text-sm font-roboto font-medium data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-foreground"
            >
              Playback
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CONTROLS TAB */}
        <TabsContent value="controls" className="flex-1   overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-[60px]">
          <div className="flex-1 p-3 pt-0 space-y-6">
            {/* <div className="rounded-sm border border-border p-4 space-y-1.5 bg-[#f8fafc]">
               <h3 className="text-sm font-semibold text-foreground mb-1">{selectedCamera.name}</h3>
               <p className="text-xs text-muted-foreground mb-3 font-roboto font-medium">{selectedCamera.location}</p>
                    <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-600 hover:bg-red-200  font-roboto font-bold text-[10px] px-2 tracking-widest py-1 mt-2 border border-red-300 rounded">RECORDING</Badge>
                     <span className="h-4 w-px bg-border" />
                 <span className="text-xs text-muted-foreground font-roboto font-medium">{selectedCamera.bitrate} kbps</span>
              </div>
                </div> */}



            {/* Stream Quality */}
            <div className="space-y-1">
              <label className="uppercase tracking-wide text-xs text-muted-foreground font-roboto font-bold">
                Stream Quality
              </label>
              <Select
                value={
                  selectedSlotIndex !== null && mainSubMap[selectedSlotIndex]
                    ? mainSubMap[selectedSlotIndex]
                    : "sub" // default value
                }
                onValueChange={(value: "main" | "sub") => {
                  console.log("Dropdown changed to:", value, "for slot:", selectedSlotIndex);
                  if (selectedCamera && selectedSlotIndex !== null) {
                    toggleMainSub(selectedSlotIndex, selectedCamera.id, value);
                  }
                }}
              >
                <SelectTrigger className="w-full bg-white text-black border border-border focus:bg-white">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sub">Sub</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* PTZ Controls */}
            <div className="space-y-1">
              {/* Directional Pad */}
              <label className=" uppercase tracking-wide text-xs text-muted-foreground mb-4 font-roboto font-bold">
                PTZ Controls
              </label>
              <div className="bg-[#f8fafc] border  rounded-lg  p-3 ">
                <div className="flex justify-center">
                  <div className="relative w-[130px] h-[130px]">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-border bg-muted/30"></div>

                    {/* Direction Buttons */}
                    <button className="absolute top-2 left-1/2 -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Move size={16} className="rotate-0" />
                    </button>
                    <button className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Move size={16} className="rotate-180" />
                    </button>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Move size={16} className="-rotate-90" />
                    </button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Move size={16} className="rotate-90" />
                    </button>

                    {/* Center Home Button */}
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#f1f5f9] border border-border flex flex-col items-center justify-center gap-0.5 hover:bg-muted transition-colors">
                      <span className="text-md  font-roboto font-semibold text-muted-foreground">HOME</span>
                    </button>
                  </div>
                </div>

                {/* Zoom Slider */}
                <div className="flex items-center gap-3 px-1 py-4">
                  <ZoomOut size={16} className="text-muted-foreground flex-shrink-0" />
                  <Slider
                    value={zoomLevel}
                    onValueChange={setZoomLevel}
                    max={100}
                    step={1}
                    trackHeight={3}
                    thumbSize={14}
                    className="flex-1"
                  />
                  <ZoomIn size={16} className="text-muted-foreground flex-shrink-0" />
                </div>

                {/* Iris and Night Mode */}
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-white rounded font-roboto font-medium">
                    <Sun size={14} />
                    Iris +
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-white rounded font-roboto font-medium">
                    <Moon size={14} />
                    Night Mode
                  </Button>
                </div>

              </div>
            </div>

            {/* Quick Actions */}

            <div className="space-y-3">
              <label className="uppercase tracking-wide text-xs text-muted-foreground mb-4 font-roboto font-bold">
                Quick Actions
              </label>

              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1 gap-2 rounded-sm">
                  <Camera size={14} />
                  Snapshot
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-white rounded-sm">
                  <Video size={14} />
                  Instant Replay
                </Button>
              </div>

              <Button className="w-full gap-2" size="default">
                <ScanSearch size={16} />
                Deep Search
              </Button>
            </div>

          </div>
        </TabsContent>

        {/* SEQUENCING TAB */}
        <TabsContent value="sequencing" className="flex-1 p-3 pt-0 flex flex-col h-full overflow-hidden pb-[60px]">
          {/* Sub Tabs: Camera / View */}
          <div className="flex bg-[#f1f5f9] p-1 rounded-xl mb-6 mt-4 h-10 w-full border border-slate-200/50">
            <button
              onClick={() => setActiveSequencingSubTab("camera")}
              className={cn(
                "flex-1 text-sm font-roboto font-medium rounded-lg transition-all flex items-center justify-center",
                activeSequencingSubTab === "camera" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Camera
            </button>
            <button
              onClick={() => setActiveSequencingSubTab("view")}
              className={cn(
                "flex-1 text-sm font-roboto font-medium rounded-lg transition-all flex items-center justify-center",
                activeSequencingSubTab === "view" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
              )}
            >
              View
            </button>
          </div>

          {(activeSequence || isCreatingSequence) && (
            <Button
              variant="outline"
              onClick={handleAddNewSequence}
              className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 rounded-xl h-11 mb-6 flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Plus size={16} strokeWidth={2.5} />
              Add new sequence
            </Button>
          )}

          {!isCreatingSequence && !activeSequence ? (
            /* EMPTY STATE */
            <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-300 rounded-[24px] bg-[#f8fafc]/40 mx-1 mb-8 min-w-0">
              <div className="w-14 h-14 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                <SwitchCamera className="text-slate-500" />
              </div>
              <h3 className="text-[15px] font-bold text-slate-800 text-center mb-2 px-4 leading-tight">
                No camera sequences created yet.
              </h3>
              <p className="text-[12px] text-slate-500 text-center mb-8 max-w-[200px] leading-relaxed font-roboto">
                Create your first sequence to rotate cameras automatically.
              </p>
              <Button
                onClick={() => setIsCreatingSequence(true)}
                className="w-full bg-[#1d4ed8] hover:bg-blue-700 text-white rounded-xl h-12 flex items-center justify-center gap-2 text-sm font-bold shadow-md transition-all active:scale-[0.98]"
              >
                <Plus size={18} strokeWidth={3} />
                Create first sequence.
              </Button>
            </div>
          ) : isCreatingSequence ? (
            /* CREATE/EDIT SEQUENCE STATE */
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 pb-4 scrollbar-hide">
              <div className="space-y-6 rounded-[20px] border border-slate-200 p-5 bg-white shadow-sm">
                {/* Sequence Name */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Sequence Name</label>
                  <Input
                    placeholder="Enter sequence name"
                    value={sequenceName}
                    onChange={(e) => setSequenceName(e.target.value)}
                    className="h-11 text-sm border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl transition-all font-roboto"
                  />
                </div>

                {/* Cameras Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Cameras in Sequence</label>
                    <Badge variant="outline" className="bg-[#fff7e6] text-[#fa8c16] border-[#ffe7ba] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
                      Unsaved
                    </Badge>
                  </div>

                  {/* Custom Duration Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner group min-w-0">
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-700 truncate">Custom Duration</p>
                      <p className="text-[10px] text-slate-400 font-medium font-roboto italic leading-tight">Per-camera durations configured.</p>
                    </div>
                    <Switch
                      checked={customDuration}
                      onCheckedChange={setCustomDuration}
                      className="data-[state=checked]:bg-blue-600 h-6 w-11 border-2 border-transparent transition-all flex-shrink-0"
                    />
                  </div>

                  {/* Add Cameras Box */}
                  <div
                    onClick={() => setIsAddCamerasDialogOpen(true)}
                    className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 rounded-2xl bg-[#ffffff] hover:bg-blue-50/30 hover:border-blue-200 cursor-pointer transition-all active:scale-[0.99] group min-w-0"
                  >
                    <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center mb-3 transition-colors shadow-sm">
                      <Plus size={20} className="text-slate-500 group-hover:text-blue-600" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-bold text-slate-700 mb-1 text-center">Add cameras</p>
                    <p className="text-[11px] text-slate-400 font-medium font-roboto text-center leading-tight">Click to add cameras from left panel.</p>
                  </div>

                  {/* Selected Cameras List */}
                  {playlist.length > 0 && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                      {playlist.map((camera) => (
                        <div key={camera.cameraId} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <GripVertical size={14} className="text-slate-300 cursor-grab active:cursor-grabbing" />
                            <span className="text-[13px] font-bold text-slate-700 truncate font-roboto">{camera.name}</span>
                          </div>

                          <div className="flex items-center gap-2">

                            <Select
                              value={camera.duration || "10s"}
                              onValueChange={(val) => updateDeviceDuration(camera.cameraId, val)}
                            >
                              <SelectTrigger className="h-7 w-[65px] text-[11px] font-bold bg-slate-50 border-none rounded-lg px-2 focus:ring-0">
                                <SelectValue placeholder="10s" />
                              </SelectTrigger>
                              <SelectContent className="min-w-[70px]">
                                <SelectItem value="5s" className="text-xs">5s</SelectItem>
                                <SelectItem value="10s" className="text-xs">10s</SelectItem>
                                <SelectItem value="15s" className="text-xs">15s</SelectItem>
                                <SelectItem value="30s" className="text-xs">30s</SelectItem>
                                <SelectItem value="1m" className="text-xs">1m</SelectItem>
                              </SelectContent>
                            </Select>

                            <button
                              onClick={() => setPlaylist(playlist.filter(c => c.cameraId !== camera.cameraId))}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors group-hover:opacity-100"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Loop Sequence Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner min-w-0">
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-700">Loop Sequence</p>
                      <p className="text-[10px] text-slate-400 font-medium font-roboto italic leading-tight break-words">Repeat from start after last camera.</p>
                    </div>
                    <Switch
                      checked={loopMode}
                      onCheckedChange={setLoopMode}
                      className="data-[state=checked]:bg-blue-600 h-6 w-11 border-2 border-transparent transition-all flex-shrink-0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto pt-6 px-1">
                {/* Cancel Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingSequence(false)}
                  className="
                            flex-1
                            flex justify-center items-center
                            h-[36px]
                            px-[16px] py-[8px]
                            gap-[6px]
                            text-[#0F172B]
                            text-center
                            font-inter text-[14px] font-medium leading-[20px]
                            rounded-[8px]
                            bg-[#F1F5F9]
                            border-0
                          "
                >
                  Cancel
                </Button>

                {/* Save Sequence Button */}
                <Button
                  onClick={handleSaveSequence}
                  disabled={playlist.length === 0}
                  className={cn(
                    `
                    flex-1
                    flex justify-center items-center
                    min-h-[36px]
                    px-[20px] py-[7.5px]
                    gap-[8px]
                    rounded-[8px]
                    text-[#FAFAFA]
                    text-center
                    font-roboto text-[14px] font-medium leading-[150%]
                    border-0
                    transition-all
                    `,
                    playlist.length === 0
                      ? "bg-[#1D4ED8] opacity-50 cursor-not-allowed"
                      : "bg-[#1D4ED8] hover:bg-[#1e40af] active:scale-[0.98]"
                  )}
                >
                  {activeSequence ? "Save changes" : "Create sequence"}
                </Button>
              </div>
            </div>
          ) : (
            /* SAVED SEQUENCE READ-ONLY STATE */
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 pb-4 scrollbar-hide">
              <div className="space-y-6 rounded-[20px] border border-slate-200 p-5 bg-white shadow-sm">

                {/* Read-Only Sequence Name Dropdown */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Sequence Name</label>
                  <div className="h-11 flex items-center justify-between px-3 border border-slate-200 rounded-xl bg-white text-sm font-roboto text-slate-800 shadow-sm">
                    <span>{activeSequence.sequenceName}</span>
                    <ChevronDown size={16} className="text-slate-400" />
                  </div>
                </div>

                {/* Cameras Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Cameras in Sequence</label>
                    <span className="text-[11px] text-slate-500 font-medium font-roboto">{activeSequence.playlist.length} items</span>
                  </div>

                  {/* Read-Only Custom Duration Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner min-w-0">
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-700 truncate">Custom Duration</p>
                      <p className="text-[10px] text-slate-400 font-medium font-roboto italic leading-tight">Per-camera durations configured.</p>
                    </div>
                    <Switch
                      checked={activeSequence.customDuration}
                      disabled
                      className="data-[state=checked]:bg-blue-600 h-6 w-11 border-2 border-transparent transition-all flex-shrink-0 opacity-100"
                    />
                  </div>

                  {/* Read-Only Selected Cameras List */}
                  {activeSequence.playlist.length > 0 && (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                      {activeSequence.playlist.map((camera: SequencingDevice) => (
                        <div key={camera.cameraId} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2" title={camera.name}>
                            <GripVertical size={14} className="text-slate-300 shrink-0" />
                            <span className="text-[13px] font-bold text-slate-700 font-roboto leading-tight whitespace-nowrap">
                              {camera.name.length > 2 ? camera.name.substring(0, 2) + "..." : camera.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {activeSequence.customDuration && (
                              <div className="h-7 w-[60px] flex items-center justify-center text-[11px] font-black bg-slate-100/50 rounded-lg px-2 text-slate-800">
                                {camera.duration || "10s"}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Read-Only Loop Sequence Switch */}
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner min-w-0">
                    <div className="space-y-1 min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-slate-700">Loop Sequence</p>
                      <p className="text-[10px] text-slate-400 font-medium font-roboto italic leading-tight break-words">Repeat from start after last camera.</p>
                    </div>
                    <Switch
                      checked={activeSequence.loopMode}
                      disabled
                      className="data-[state=checked]:bg-blue-600 h-6 w-11 border-2 border-transparent transition-all flex-shrink-0 opacity-100"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto pt-6 px-1">
                {/* Edit Sequence Button */}
                <Button
                  variant="outline"
                  onClick={handleEditSequence}
                  className="
                            flex-1
                            flex justify-center items-center
                            h-[36px]
                            px-[16px] py-[8px]
                            gap-[6px]
                            text-[#0F172B]
                            text-center
                            font-inter text-[14px] font-medium leading-[20px]
                            rounded-[8px]
                            bg-[#F1F5F9]
                            border-0
                            hover:bg-slate-200 transition-colors
                          "
                >
                  <Pencil size={14} />
                  Edit sequence
                </Button>

                {/* Delete Sequence Button */}
                <Button
                  variant="outline"
                  onClick={handleDeleteSequence}
                  className="
                    flex-1
                    flex justify-center items-center
                    h-[36px]
                    px-[16px] py-[8px]
                    gap-[6px]
                    text-[#0F172B]
                    text-center
                    font-inter text-[14px] font-medium leading-[20px]
                    rounded-[8px]
                    bg-white
                    border border-slate-200
                    hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors
                  "
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <AddCamerasDialog
          isOpen={isAddCamerasDialogOpen}
          onOpenChange={setIsAddCamerasDialogOpen}
          onAdd={setPlaylist}
          existingCameraIds={playlist.map((c) => c.cameraId)}
        />

        {/* PLAYBACK TAB */}
        <TabsContent value="playback" className="flex-1 p-4 pt-0 overflow-y-auto">
          <div className="space-y-4">
            {/* Camera Info Card */}
            {/* <div className="rounded-sm border border-border p-4 space-y-1.5 bg-[#f8fafc]">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{selectedCamera.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 font-roboto font-medium">{selectedCamera.location}</p>
                            <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-600 hover:bg-red-200  font-roboto font-bold text-[10px] px-2 tracking-widest py-1 mt-2 border border-red-300 rounded">RECORDING</Badge>
                            <span className="h-4 w-px bg-border" />
                        <span className="text-xs text-muted-foreground font-roboto font-medium">{selectedCamera.bitrate} kbps</span>
                      </div>
                </div> */}
            <Button className="w-full gap-2" size="default">
              Start Playback
              <PlayCircle size={16} />
            </Button>
          </div>
        </TabsContent>
      </Tabs>

    </div >
  );
}
