// Camera Controls Sidebar Component
// Right sidebar with camera controls, PTZ, stream quality, and quick actions

import { useState } from "react";
import { 
  Move, 
  Camera,
  Video , 
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
  ScanSearch ,
  PlayCircle
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
import { cn } from "@/lib/utils";

import {
  AISurveillanceIcons,
  PersonIcons,
  FaceIcons,
  FireIcons,
  CareIcons,
  BehavioralIcons
} from "@/components/Icons/Svg/liveViewIcons";

interface ControlsSidebarProps {
  selectedCamera?: {
    name: string;
    location: string;
    bitrate: string;
  } | null;
}

// AI Features data
const aiFeatures = [
  { id: "person", name: "Person Detection", enabled: true, icon:PersonIcons },
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

export function AISurveillanceSidebar({ selectedCamera }: ControlsSidebarProps) {
  const [activeTab, setActiveTab] = useState<"controls" | "sequencing" | "playback">("controls");
  const [streamQuality, setStreamQuality] = useState("4k");
  const [features, setFeatures] = useState(aiFeatures);
  const [zoomLevel, setZoomLevel] = useState([50]);
  const [dwellTime, setDwellTime] = useState("5s");
const [loopMode, setLoopMode] = useState(false);
const [alertPriority, setAlertPriority] = useState(false);

const [playlist, setPlaylist] = useState<string[]>([
  "Camera 1",
  "Camera 2",
  "Camera 3",
]);


  const toggleFeature = (id: string) => {
    setFeatures(prev => 
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  // If no camera is selected, show workspace management view
  if (!selectedCamera) {
    return (
      <div className="hidden lg:flex w-72 border-l border-border bg-white flex-col flex-shrink-0 h-full">

      {/* Workspace Management */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-roboto font-medium text-slate-500 uppercase tracking-wide">
                Workspace Management
            </span>
        </div>

          <Button
              variant="outline"
              size="sm"
              className="w-full justify-between rounded-sm h-10 text-sm font-roboto font-medium shadow-sm bg-white"
            >
              <span className="text-slate-500"> 
                Clear all grid slot
              </span>
              <X className="h-4 w-4 text-slate-500" />
            </Button>

      </div>

      {/* AI Surveillance Suite */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <AISurveillanceIcons className="h-4 w-4" />
          <span className="text-[12px] font-semibold text-slate-500  uppercase tracking-wide">
              AI Surveillance Suite
          </span>
          <span className="ml-auto rounded-lg bg-violet-600 px-3 py-2 text-sm font-roboto font-medium text-white">
              PRO
          </span>
        </div>

        {/* Feature List */}
          <div className="space-y-2">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-3",
                  feature.enabled
                    ? "bg-slate-100"
                    : "bg-slate-100 "
                )}
              >
                <div className="flex items-center gap-3">
                  <feature.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-roboto font-medium text-foreground">
                     {feature.name}
                  </span>
                </div>

                <Switch
                  checked={feature.enabled}
                  onCheckedChange={() => toggleFeature(feature.id)}
                  disabled={!feature.enabled && feature.proOnly}
                />
              </div>
            ))}
          </div>
      </div>
    </div>
    );
  }

  // Camera selected - show controls view
  return (
    <div className="hidden lg:flex w-72 border-l border-border bg-card flex-col flex-shrink-0">
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
  <TabsContent value="controls"className="flex-1   overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-[60px]">
  <div className="flex-1 p-3 pt-0 space-y-6">
           <div className="rounded-sm border border-border p-4 space-y-1.5 bg-[#f8fafc]">
               <h3 className="text-sm font-semibold text-foreground mb-1">{selectedCamera.name}</h3>
            <p className="text-xs text-muted-foreground mb-3 font-roboto font-medium">{selectedCamera.location}</p>
                    <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-600 hover:bg-red-200  font-roboto font-bold text-[10px] px-2 tracking-widest py-1 mt-2 border border-red-300 rounded">RECORDING</Badge>
                 {/* Vertical Divider */}
                     <span className="h-4 w-px bg-border" />
                 <span className="text-xs text-muted-foreground font-roboto font-medium">{selectedCamera.bitrate} kbps</span>
              </div>
                </div>
        

            
         {/* Stream Quality */}
            <div className="space-y-1">
              <label className=" uppercase tracking-wide text-xs text-muted-foreground  font-roboto font-bold">
                Stream Quality
              </label>
              <Select value={streamQuality} onValueChange={setStreamQuality}>
                <SelectTrigger className="w-full bg-white text-black border border-border focus:bg-white">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4k">High Definition (4K)</SelectItem>
                  <SelectItem value="1080p">Full HD (1080p)</SelectItem>
                  <SelectItem value="720p">HD (720p)</SelectItem>
                  <SelectItem value="480p">SD (480p)</SelectItem>
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
                  <Video  size={14} />
                  Instant Replay
                </Button>
              </div>

              <Button className="w-full gap-2" size="default">
                <ScanSearch  size={16} />
                Deep Search
              </Button>
            </div>

        </div>
  </TabsContent>

  {/* SEQUENCING TAB */}
  <TabsContent value="sequencing" className="flex-1 p-4 pt-0 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pb-[60px]">
  <div className="space-y-4">
                {/* Camera Info Card */}
                 <div className="rounded-sm border border-border p-4 space-y-1.5 bg-[#f8fafc]">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{selectedCamera.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 font-roboto font-medium">{selectedCamera.location}</p>
                            <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-600 hover:bg-red-200  font-roboto font-bold text-[10px] px-2 tracking-widest py-1 mt-2 border border-red-300 rounded">RECORDING</Badge>
                        {/* Vertical Divider */}
                            <span className="h-4 w-px bg-border" />
                        <span className="text-xs text-muted-foreground font-roboto font-medium">{selectedCamera.bitrate} kbps</span>
                      </div>
                </div>

                {/* Sequence Configuration Card */}
                <div className="rounded-lg border border-border p-4 space-y-4 bg-[#f8fafc]">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-foreground">Sequence Configuration</h4>
                    <p className="text-xs  font-roboto font-medium text-gray-500">Configure this tile to cycle through a list of cameras automatically.</p>
                  </div>

                  {/* Dwell Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground font-roboto font-medium">Dwell Time</span>
                    </div>
                    <Select value={dwellTime} onValueChange={setDwellTime}>
                      <SelectTrigger className="w-[70px] h-8 bg-white rounded">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3s">3s</SelectItem>
                        <SelectItem value="5s">5s</SelectItem>
                        <SelectItem value="10s">10s</SelectItem>
                        <SelectItem value="15s">15s</SelectItem>
                        <SelectItem value="30s">30s</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loop Mode */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Repeat size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">Loop Mode</span>
                    </div>
                <Checkbox
                    variant="soft"
                    size="sm"
                    checked={loopMode}
                    onCheckedChange={(v) => setLoopMode(!!v)}
                  />
                  </div>

                  {/* Alert Priority */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground">Alert Priority</span>
                    </div>
                    <Checkbox 
                     variant="soft"
                    size="sm"
                      checked={alertPriority} 
                      onCheckedChange={(checked) => setAlertPriority(checked as boolean)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </div>

                {/* Playlist Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-roboto font-medium">Playlist</span>
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-roboto font-medium">
                      <Plus size={12} />
                      Add from selection
                    </button>
                  </div>

                  <div className="space-y-2">
                    {playlist.map((camera, index) => (
                      <div 
                        key={index}
                        className="rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        {camera}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* PLAYBACK TAB */}
            <TabsContent value="playback" className="flex-1 p-4 pt-0 overflow-y-auto">
                <div className="space-y-4">
                {/* Camera Info Card */}
                 <div className="rounded-sm border border-border p-4 space-y-1.5 bg-[#f8fafc]">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{selectedCamera.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3 font-roboto font-medium">{selectedCamera.location}</p>
                            <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-600 hover:bg-red-200  font-roboto font-bold text-[10px] px-2 tracking-widest py-1 mt-2 border border-red-300 rounded">RECORDING</Badge>
                        {/* Vertical Divider */}
                            <span className="h-4 w-px bg-border" />
                        <span className="text-xs text-muted-foreground font-roboto font-medium">{selectedCamera.bitrate} kbps</span>
                      </div>
                </div>
               <Button className="w-full gap-2" size="default">
                    Start Playback
                     <PlayCircle   size={16} />
                </Button>
              </div>
            </TabsContent>
          </Tabs>

    </div>
  );
}
