// Camera Controls Sidebar Component
// Right sidebar with camera controls, PTZ, stream quality, and quick actions

import { useState, useEffect } from "react";
import axios from "axios";
import { API_VIVEK_URL, API_VAISHALI_URL, API_URLS, getAuthHeaders } from "@/components/Config/api";
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
  ChevronDown,
  Loader2
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  AISurveillanceIcons,
  PersonIcons,
  FaceIcons,
  FireIcons,
  CareIcons,
  BehavioralIcons,
} from "@/components/Icons/Svg/liveViewIcons";
import { AddCamerasDialog } from "./AddCamerasDialog";
import { AddViewsDialog } from "./AddViewsDialog";
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
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [streamQuality, setStreamQuality] = useState("4k");
  const [features, setFeatures] = useState(aiFeatures);
  const [zoomLevel, setZoomLevel] = useState([50]);
  const [dwellTime, setDwellTime] = useState("5s");
  const [loopMode, setLoopMode] = useState(false);
  const [alertPriority, setAlertPriority] = useState(false);
  const [availableSequences, setAvailableSequences] = useState<any[]>([]);
  const [availableViews, setAvailableViews] = useState<any[]>([]);
  console.log("availableSequences", availableSequences);
  const [loadingSequences, setLoadingSequences] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [sequenceToDelete, setSequenceToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleStreamChange = (value: "main" | "sub") => {
    setStreamQuality(value);
  };

  const fetchSequences = async () => {
    setLoadingSequences(true);
    try {
      const type = activeSequencingSubTab.toUpperCase();

      let currentViews = availableViews;
      if (type === "VIEW" && availableViews.length === 0) {
        const response = await fetch(`${API_VAISHALI_URL}${API_URLS.get_all_views}`, {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const json = await response.json();
          currentViews = json?.data?.map((v: any) => ({
            id: String(v.id),
            name: v.viewName,
          })) || [];
          setAvailableViews(currentViews);
        }
      }

      const res = await axios.get(`${API_VIVEK_URL}/api/getAllSequencesBySequenceType/${type}`);
      if (res.data?.success) {
        const sequences = res.data.data || [];
        setAvailableSequences(sequences);

        if (sequences.length > 0 && !activeSequence && !isCreatingSequence) {
          // Auto-select the first sequence if nothing is active
          const firstSeq = sequences[0];
          mapSequenceToState(firstSeq, currentViews);
        }
      }
    } catch (error) {
      console.error("Failed to fetch sequences:", error);
    } finally {
      setLoadingSequences(false);
    }
  };

  const mapSequenceToState = (seq: any, optViews?: any[]) => {
    const allCameras = SidebarCameraStore.getState().cameras;
    const viewsList = optViews || availableViews;
    
    const items = seq.items || [];
    const isView = seq.sequenceType === "VIEW";

    const mappedPlaylist = items.map((item: any) => {
      const itemId = isView ? item.viewId : item.cameraId;
      
      let cam;
      if (isView) {
          cam = viewsList.find(v => Number(v.id) === Number(itemId));
      } else {
          cam = allCameras.find(c => Number(c.cameraId) === Number(itemId));
      }

      return {
        ...cam,
        cameraId: String(itemId),
        name: cam ? (cam.name || cam.viewName) : (isView ? `View ${itemId}` : `Camera ${itemId}`),
        duration: `${item.duration}s`,
        order: item.order
      };
    });

    const seqData = {
      sequenceId: seq.sequenceId,
      sequenceName: seq.sequenceName,
      playlist: mappedPlaylist,
      customDuration: items.some((item: any) => item.duration !== 10),
      loopMode: seq.repeatSequence,
      sequenceType: seq.sequenceType,
    };

    setActiveSequence(seqData);
    setPlaylist(mappedPlaylist);
    setSequenceName(seq.sequenceName);
    setCustomDuration(seqData.customDuration);
    setLoopMode(seq.repeatSequence);
    SidebarCameraStore.getState().setIsSequencing(true);
  };

  useEffect(() => {
    if (activeTab === "sequencing") {
      fetchSequences();
    }
  }, [activeTab, activeSequencingSubTab]);

  const handleSaveSequence = async () => {
    if (playlist.length === 0) return;

    setIsSaving(true);
    try {
      const commonItems = playlist.map((camera, index) => {
        let durStr = camera.duration || "10s";
        let durSeconds = 10;
        if (durStr.endsWith("m")) {
          durSeconds = parseInt(durStr) * 60;
        } else {
          durSeconds = parseInt(durStr);
        }
        if (isNaN(durSeconds)) durSeconds = 10;

        return {
          id: Number(camera.cameraId),
          order: index + 1,
          duration: durSeconds
        };
      });

      const payload: any = {
        sequenceName: sequenceName || (activeSequencingSubTab === "view" ? "Untitled View Sequence" : "Untitled Sequence"),
        sequenceType: activeSequencingSubTab === "view" ? "VIEW" : "CAMERA",
        repeatSequence: loopMode,
      };

      if (activeSequencingSubTab === "view") {
        payload.viewItems = commonItems.map(item => ({
          viewId: item.id,
          order: item.order,
          duration: item.duration
        }));
      } else {
        payload.cameraItems = commonItems.map(item => ({
          cameraId: item.id,
          order: item.order,
          duration: item.duration
        }));
      }

      const isUpdating = !!activeSequence?.sequenceId;
      const url = isUpdating
        ? `${API_VIVEK_URL}/api/updateBySequenceId/${activeSequence.sequenceId}`
        : `${API_VIVEK_URL}/api/createSequence`;

      const res = isUpdating
        ? await axios.put(url, payload)
        : await axios.post(url, payload);

      if (res.data?.success) {

        toast.success(res.data?.message || "Sequence saved successfully");

        setActiveSequence({
          sequenceId: res.data?.data?.sequenceId || activeSequence?.sequenceId,
          sequenceName: payload.sequenceName,
          playlist: [...playlist],
          customDuration,
          loopMode,
          sequenceType: payload.sequenceType,
        });
        setIsCreatingSequence(false);
        SidebarCameraStore.getState().setIsSequencing(true);
        fetchSequences(); // Refresh the list
      } else {

        toast.error(res.data?.message || "Failed to save sequence");
      }
    } catch (error: any) {
      console.error("Failed to call sequence save API", error);
      toast.error(error.response?.data?.message || "Failed to call sequence save API");
    } finally {
      setIsSaving(false);
    }
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

  const handleDeleteClick = (e: React.MouseEvent, seq: any) => {
    e.stopPropagation();
    setSequenceToDelete(seq);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sequenceToDelete || !sequenceToDelete.sequenceId) {
      console.error("Delete failed: Sequence ID is missing", sequenceToDelete);
      return;
    }

    setIsDeleting(true);
    try {
      const res = await axios.delete(`${API_VIVEK_URL}/api/deleteBySequenceId/${sequenceToDelete.sequenceId}`);
      if (res.data?.success) {
        toast.success(res.data?.message || "Sequence deleted successfully");
        setIsDeleteConfirmOpen(false);
        // If we deleted the active sequence, clear the view
        if (activeSequence?.sequenceId === sequenceToDelete.sequenceId) {
          handleDeleteSequence();
        }
        setSequenceToDelete(null);
        fetchSequences();
      } else {
        toast.error(res.data?.message || "Failed to delete sequence");
      }
    } catch (error: any) {
      console.error("Failed to delete sequence:", error);
      toast.error(error.response?.data?.message || "Failed to delete sequence");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubTabChange = (targetTab: "camera" | "view") => {
    if (activeSequencingSubTab !== targetTab) {
      setActiveSequence(null);
      setPlaylist([]);
      setSequenceName("");
      setCustomDuration(false);
      setLoopMode(false);
      setIsCreatingSequence(false);
      setAvailableSequences([]);
      SidebarCameraStore.getState().setIsSequencing(false);
      setActiveSequencingSubTab(targetTab);
    }
  };

  const handleAddNewSequence = () => {
    setActiveSequence(null);
    setPlaylist([]);
    setSequenceName("");
    setCustomDuration(false);
    setLoopMode(false);
    setIsCreatingSequence(true);
    SidebarCameraStore.getState().setIsSequencing(false);
  };

  const handleCancelCreate = () => {
    setIsCreatingSequence(false);
    if (!activeSequence && availableSequences.length > 0) {
      // Re-select the first available sequence if we were in a blank 'new' state
      mapSequenceToState(availableSequences[0]);
    }
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
      <div className="flex items-center justify-between px-4 py-0 border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
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
        className="flex flex-col h-full w-full overflow-hidden"
      >
        {/* Tabs Header */}
        <div className="px-3 pt-2 shrink-0">
          <TabsList className="w-full grid grid-cols-3 bg-muted rounded-xl p-1">
            <TabsTrigger
              value="controls"
              className="rounded-lg text-black text-sm font-roboto font-medium data-[state=active]:bg-white data-[state=active]:shadow data-[state=active]:text-foreground"
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
        <TabsContent
          value="controls"
          className="mt-0 data-[state=active]:flex-1 data-[state=inactive]:hidden overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex flex-col"
        >
          <div className="flex-1 p-3 pt-0 space-y-6 pb-[60px]">
            {/* Stream Quality */}
            <div className="space-y-1">
              <label className="uppercase tracking-wide text-xs text-muted-foreground font-roboto font-bold">
                Stream Quality
              </label>
              <Select
                value={
                  selectedSlotIndex !== null && mainSubMap[selectedSlotIndex]
                    ? mainSubMap[selectedSlotIndex]
                    : "sub"
                }
                onValueChange={(value: "main" | "sub") => {
                  if (selectedCamera && selectedSlotIndex !== null) {
                    toggleMainSub(selectedSlotIndex, selectedCamera.id, value);
                  }
                }}
              >
                <SelectTrigger className="w-full bg-white text-black border border-border focus:bg-white text-[13px] h-10">
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
              <label className="uppercase tracking-wide text-xs text-muted-foreground mb-4 font-roboto font-bold">
                PTZ Controls
              </label>
              <div className="bg-[#f8fafc] border rounded-lg p-3">
                <div className="flex justify-center">
                  <div className="relative w-[130px] h-[130px]">
                    <div className="absolute inset-0 rounded-full border-2 border-border bg-muted/30"></div>
                    <button className="absolute top-2 left-1/2 -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground">
                      <Move size={16} />
                    </button>
                    <button className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground">
                      <Move size={16} className="rotate-180" />
                    </button>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
                      <Move size={16} className="-rotate-90" />
                    </button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
                      <Move size={16} className="rotate-90" />
                    </button>
                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#f1f5f9] border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <span className="text-xs font-bold text-muted-foreground">HOME</span>
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
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-white rounded font-medium text-xs">
                    <Sun size={14} /> Iris +
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-white rounded font-medium text-xs">
                    <Moon size={14} /> Night
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <label className="uppercase tracking-wide text-xs text-muted-foreground font-roboto font-bold">
                Quick Actions
              </label>
              <div className="flex items-center gap-2">
                <Button size="sm" className="flex-1 gap-2 rounded-lg text-xs h-9">
                  <Camera size={14} /> Snapshot
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2 bg-white rounded-lg text-xs h-9">
                  <Video size={14} /> Replay
                </Button>
              </div>
              <Button className="w-full gap-2 rounded-lg h-10" size="default">
                <ScanSearch size={16} /> Deep Search
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* SEQUENCING TAB */}
        <TabsContent
          value="sequencing"
          className="mt-0 data-[state=active]:flex-1 data-[state=inactive]:hidden p-3 pt-0 flex flex-col overflow-hidden"
        >
          {/* Sub Tabs: Camera / View (Fixed) */}
          <div className="flex bg-[#f1f5f9] p-0 rounded-xl mb-2 mt-1 h-10 w-full border border-slate-200/50 shrink-0">
            <button
              onClick={() => handleSubTabChange("camera")}
              className={cn(
                "flex-1 text-sm font-roboto font-medium rounded-lg transition-all",
                activeSequencingSubTab === "camera" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Camera
            </button>
            <button
              onClick={() => handleSubTabChange("view")}
              className={cn(
                "flex-1 text-sm font-roboto font-medium rounded-lg transition-all",
                activeSequencingSubTab === "view" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-700"
              )}
            >
              View
            </button>
          </div>

          {/* Add New Button (Fixed) */}
          {(activeSequence || isCreatingSequence) && (
            <Button
              variant="outline"
              disabled={loadingSequences}
              onClick={handleAddNewSequence}
              className="w-full bg-[#f8fafc] border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 rounded-xl h-11 mb-2 shrink-0 flex items-center justify-center gap-2 shadow-sm"
            >
              <Plus size={16} strokeWidth={2.5} /> Add new {activeSequencingSubTab === "view" ? "view" : "sequence"}
            </Button>
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {loadingSequences ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-300 rounded-[24px] bg-[#f8fafc]/40 mx-1 mb-8">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                <p className="text-sm font-medium text-slate-500">Fetching sequences...</p>
              </div>
            ) : !isCreatingSequence && !activeSequence ? (
              /* EMPTY STATE */
              <div className="flex-1 flex flex-col items-center justify-center p-6 border border-dashed border-slate-300 rounded-[24px] bg-[#f8fafc]/40 mx-1 mb-4 text-center">
                <div className="w-14 h-14 bg-slate-200 border border-slate-300 rounded-xl flex items-center justify-center mb-6">
                  <SwitchCamera className="text-slate-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-[15px] font-bold text-slate-800 mb-2">No {activeSequencingSubTab === "view" ? "views" : "sequences"} created yet.</h3>
                <p className="text-[12px] text-slate-500 mb-8 max-w-[200px] font-roboto">Create your first {activeSequencingSubTab === "view" ? "view" : "sequence"} to rotate {activeSequencingSubTab === "view" ? "views" : "cameras"} automatically.</p>
                <Button
                  onClick={() => setIsCreatingSequence(true)}
                  className="w-full bg-[#1d4ed8] hover:bg-blue-700 text-white rounded-xl h-12 flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-[0.98]"
                >
                  <Plus size={18} strokeWidth={3} /> Create first {activeSequencingSubTab === "view" ? "view" : "sequence"}.
                </Button>
              </div>
            ) : isCreatingSequence ? (
              /* CREATE/EDIT SEQUENCE STATE */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1 pb-4 gap-6 flex flex-col scrollbar-hide">
                  <div className="space-y-6 rounded-[20px] border border-slate-200 p-5 bg-white shadow-sm">
                    {/* Sequence Name */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Sequence Name</label>
                      <Input
                        placeholder="Enter sequence name"
                        value={sequenceName}
                        onChange={(e) => setSequenceName(e.target.value)}
                        className="h-11 text-sm border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl font-roboto"
                      />
                    </div>

                    {/* Cameras Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">{activeSequencingSubTab === "view" ? "Views" : "Cameras"} in Sequence</label>
                        <Badge variant="outline" className="bg-[#fff7e6] text-[#fa8c16] border-[#ffe7ba] font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">Unsaved</Badge>
                      </div>

                      {/* Custom Duration Switch */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner">
                        <div className="space-y-1 flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-700">Custom Duration</p>
                          <p className="text-[10px] text-slate-400 font-roboto italic leading-tight">Per-{activeSequencingSubTab === "view" ? "view" : "camera"} durations configured.</p>
                        </div>
                        <Switch
                          checked={customDuration}
                          onCheckedChange={setCustomDuration}
                          className="data-[state=checked]:bg-blue-600 h-6 w-11"
                        />
                      </div>

                      {/* Add Cameras Box */}
                      <div
                        onClick={() => setIsAddCamerasDialogOpen(true)}
                        className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-200 rounded-2xl bg-white hover:bg-blue-50/30 hover:border-blue-200 cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3 shadow-sm">
                          <Plus size={20} className="text-slate-500" strokeWidth={2.5} />
                        </div>
                        <p className="text-sm font-bold text-slate-700 mb-1">Add {activeSequencingSubTab === "view" ? "views" : "cameras"}</p>
                        <p className="text-[11px] text-slate-400 font-roboto">Click to add {activeSequencingSubTab === "view" ? "views" : "cameras"} to the sequence.</p>
                      </div>

                      {/* Selected Cameras List */}
                      {playlist.length > 0 && (
                        <div className="flex flex-col gap-2 max-h-[300px] overflow-hidden">
                          <div className="space-y-2 overflow-y-auto pr-1 scrollbar-hide">
                            {playlist.map((camera, index) => (
                              <div
                                key={camera.cameraId}
                                draggable
                                onDragStart={(e) => {
                                  setDraggedIdx(index);
                                  e.dataTransfer.effectAllowed = "move";
                                  e.dataTransfer.setData("text/plain", `${index}`);
                                }}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                  e.dataTransfer.dropEffect = "move";
                                }}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (draggedIdx === null || draggedIdx === index) return;
                                  const newPlaylist = [...playlist];
                                  const draggedItem = newPlaylist.splice(draggedIdx, 1)[0];
                                  newPlaylist.splice(index, 0, draggedItem);
                                  setPlaylist(newPlaylist);
                                  setDraggedIdx(null);
                                }}
                                onDragEnd={() => setDraggedIdx(null)}
                                className={cn(
                                  "flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-sm group hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing",
                                  draggedIdx === index ? "opacity-50 border-blue-300 ring-2 ring-blue-100" : ""
                                )}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <GripVertical size={16} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                  <span className="text-[13px] font-bold text-slate-700 truncate font-roboto select-none">{camera.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TooltipProvider delayDuration={100}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="cursor-not-allowed">
                                          <Select disabled={!customDuration} value={camera.duration || "10s"} onValueChange={(val) => updateDeviceDuration(camera.cameraId, val)}>
                                            <SelectTrigger className={cn("h-7 w-[65px] text-[11px] font-bold bg-slate-50 border-none rounded-lg px-2 focus:ring-0", !customDuration && "opacity-50 pointer-events-none")}>
                                              <SelectValue placeholder="10s" />
                                            </SelectTrigger>
                                            <SelectContent className="min-w-[70px]">
                                              {["5s", "10s", "15s", "30s", "1m"].map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </TooltipTrigger>
                                      {!customDuration && (
                                        <TooltipContent side="top" sideOffset={6} className="bg-slate-800/95 text-white text-[11px] px-3 py-2 rounded-lg shadow-xl border-slate-700/50">
                                          Enable <strong className="font-semibold text-blue-300">Custom Duration</strong> to unlock timings.
                                        </TooltipContent>
                                      )}
                                    </Tooltip>
                                  </TooltipProvider>
                                  <button onClick={() => setPlaylist(playlist.filter(c => c.cameraId !== camera.cameraId))} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-colors">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Loop Sequence Switch */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner">
                        <div className="space-y-1 flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-700">Loop Sequence</p>
                          <p className="text-[10px] text-slate-400 font-roboto italic leading-tight">Repeat from start after last camera.</p>
                        </div>
                        <Switch checked={loopMode} onCheckedChange={setLoopMode} className="data-[state=checked]:bg-blue-600 h-6 w-11" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="flex gap-2 pt-4 px-1 pb-1 shrink-0 border-t bg-card">
                  <Button variant="outline" disabled={isSaving} onClick={handleCancelCreate} className="flex-1 h-9 rounded-lg bg-[#F1F5F9] border-0 text-sm font-medium">Cancel</Button>
                  <Button
                    onClick={handleSaveSequence}
                    disabled={playlist.length === 0 || !sequenceName.trim() || isSaving}
                    className={cn(
                      "flex-1 h-9 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-2",
                      (playlist.length === 0 || !sequenceName.trim() || isSaving) ? "bg-[#1D4ED8] opacity-50 cursor-not-allowed" : "bg-[#1D4ED8] hover:bg-[#1e40af]"
                    )}
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : (activeSequence ? "Save changes" : "Create sequence")}
                  </Button>
                </div>
              </div>
            ) : (
              /* SAVED SEQUENCE READ-ONLY STATE */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-1 pb-4 gap-6 flex flex-col scrollbar-hide">
                  <div className="space-y-6 rounded-[20px] border border-slate-200 p-5 bg-white shadow-sm">
                    {/* Sequence Name Dropdown */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Sequence Name</label>
                      <Select
                        value={activeSequence.sequenceId?.toString()}
                        onValueChange={(val) => {
                          const seq = availableSequences.find(s => s.sequenceId.toString() === val);
                          if (seq) mapSequenceToState(seq);
                        }}
                      >
                        <SelectTrigger className="h-11 border-slate-200 rounded-xl bg-white text-sm font-roboto shadow-sm focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSequences.map((seq) => (
                            <SelectItem key={seq.sequenceId} value={seq.sequenceId.toString()}>{seq.sequenceName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cameras Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">{activeSequencingSubTab === "view" ? "Views" : "Cameras"} in Sequence</label>
                        <span className="text-[11px] text-slate-500 font-roboto">{activeSequence.playlist.length} items</span>
                      </div>

                      {/* Read-Only Custom Duration Switch */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner">
                        <div className="space-y-1 flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-700">Custom Duration</p>
                          <p className="text-[10px] text-slate-400 font-roboto italic leading-tight">Per-{activeSequencingSubTab === "view" ? "view" : "camera"} durations configured.</p>
                        </div>
                        <Switch checked={activeSequence.customDuration} disabled className="data-[state=checked]:bg-blue-600 h-6 w-11 opacity-100" />
                      </div>

                      {/* Read-Only Camera List */}
                      {activeSequence.playlist.length > 0 && (
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                          {activeSequence.playlist.map((camera: SequencingDevice) => (
                            <div key={camera.cameraId} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                              <span className="text-[13px] font-bold text-slate-700 truncate font-roboto flex-1 mr-2" title={camera.name}>
                                {camera.name}
                              </span>
                              {activeSequence.customDuration && (
                                <div className="h-7 min-w-[50px] flex items-center justify-center text-[11px] font-black bg-slate-100/50 rounded-lg px-2 text-slate-800">
                                  {camera.duration || "10s"}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Read-Only Loop Switch */}
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 shadow-inner">
                        <div className="space-y-1 flex-1 pr-2">
                          <p className="text-xs font-bold text-slate-700">Loop Sequence</p>
                          <p className="text-[10px] text-slate-400 font-roboto italic leading-tight">Repeat from start after last camera.</p>
                        </div>
                        <Switch checked={activeSequence.loopMode} disabled className="data-[state=checked]:bg-blue-600 h-6 w-11 opacity-100" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div className="flex gap-2 pt-4 px-1 pb-1 shrink-0 border-t bg-card">
                  <Button variant="outline" onClick={handleEditSequence} className="flex-1 h-9 rounded-lg bg-[#F1F5F9] border-0 text-sm font-medium gap-2"><Pencil size={14} /> Edit</Button>
                  <Button variant="outline" onClick={(e) => handleDeleteClick(e, activeSequence)} className="flex-1 h-9 rounded-lg bg-white border border-slate-200 text-sm font-medium gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"><Trash2 size={14} /> Delete</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {activeSequencingSubTab === "view" ? (
          <AddViewsDialog
            isOpen={isAddCamerasDialogOpen}
            onOpenChange={setIsAddCamerasDialogOpen}
            onAdd={setPlaylist}
            existingViewIds={playlist.map((c) => c.cameraId)}
          />
        ) : (
          <AddCamerasDialog
            isOpen={isAddCamerasDialogOpen}
            onOpenChange={setIsAddCamerasDialogOpen}
            onAdd={setPlaylist}
            existingCameraIds={playlist.map((c) => c.cameraId)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="w-[360px] h-[214px] p-0 rounded-lg bg-white border-none shadow-xl overflow-hidden">

            <div className="flex flex-col h-full justify-between">

              {/* Content */}
              <div className="flex flex-col items-center text-center px-6 pt-6">

                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-3">
                  <Trash2 className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                </div>

                {/* Title */}
                <DialogTitle className="text-[20px] font-semibold leading-[120%] tracking-[-0.4px] text-[#0A0A0A] mb-2">
                  Remove sequence
                </DialogTitle>

                {/* Description */}
                <div className="text-[12px] font-normal leading-[150%] tracking-[0.18px] text-[#737373] max-w-[280px]">
                  Delete camera sequence{" "}
                  <span className="text-[#334155] font-medium">
                    "{sequenceToDelete?.sequenceName}"
                  </span>
                  ?
                  <br />
                  <span>This will remove all cameras in this sequence.</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between px-6 pb-4 gap-2">

                {/* Cancel */}
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="w-[154px] min-h-[36px] px-4 py-[7.5px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[150%] tracking-[0.07px] text-[#171717] border border-gray-200 rounded-lg bg-white hover:bg-gray-100"
                >
                  Cancel
                </Button>

                {/* Remove */}
                <Button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="w-[154px] min-h-[36px] px-4 py-[7.5px] flex items-center justify-center gap-2 text-[14px] font-medium leading-[150%] tracking-[0.07px] text-[#FAFAFA] bg-[#B91C1C] rounded-lg hover:bg-red-800 active:scale-[0.98] transition"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Remove"
                  )}
                </Button>

              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* PLAYBACK TAB */}
        <TabsContent
          value="playback"
          className="mt-0 data-[state=active]:flex-1 data-[state=inactive]:hidden p-3 pt-2 overflow-y-auto"
        >
          <div className="space-y-4">
            <Button className="w-full gap-2 rounded-lg h-10" size="default">Start Playback <PlayCircle size={16} /></Button>
          </div>
        </TabsContent>
      </Tabs>
    </div >
  );
}
