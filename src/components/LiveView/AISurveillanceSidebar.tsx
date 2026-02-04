// Camera Controls Sidebar Component
// Right sidebar with camera controls, PTZ, stream quality, and quick actions

import { useState } from "react";
import { 
  Home, 
  Plus, 
  Camera, 
  Play, 
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  Moon,
  X,
  Search,
  Settings,
  User,
  ScanFace,
  Flame,
  Car,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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

  const toggleFeature = (id: string) => {
    setFeatures(prev => 
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  // If no camera is selected, show workspace management view
  if (!selectedCamera) {
    return (
      <div className="hidden lg:flex w-72 border-l border-border bg-white flex-col flex-shrink-0">

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
      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["controls", "sequencing", "playback"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors capitalize",
              activeTab === tab 
                ? "text-foreground border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "controls" && (
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          {/* Camera Info */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{selectedCamera.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{selectedCamera.location}</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 text-white text-[10px] px-2 py-0.5">RECORDING</Badge>
              <span className="text-xs text-muted-foreground">{selectedCamera.bitrate} kbps</span>
            </div>
          </div>

          {/* Stream Quality */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Stream Quality
            </label>
            <Select value={streamQuality} onValueChange={setStreamQuality}>
              <SelectTrigger className="w-full h-9 bg-background">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border z-50">
                <SelectItem value="4k">High Definition (4K)</SelectItem>
                <SelectItem value="1080p">Full HD (1080p)</SelectItem>
                <SelectItem value="720p">HD (720p)</SelectItem>
                <SelectItem value="480p">Standard (480p)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PTZ Controls */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                PTZ Controls
              </span>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
                Manage Presets
              </Button>
            </div>
            
            {/* PTZ Joystick */}
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                {/* Outer circle */}
                <div className="absolute inset-0 rounded-full border-2 border-border bg-muted/30" />
                
                {/* Direction buttons */}
                <button className="absolute top-1 left-1/2 -translate-x-1/2 p-2 hover:text-primary transition-colors">
                  <MoveUp className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="absolute bottom-1 left-1/2 -translate-x-1/2 p-2 hover:text-primary transition-colors">
                  <MoveDown className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="absolute left-1 top-1/2 -translate-y-1/2 p-2 hover:text-primary transition-colors">
                  <MoveLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:text-primary transition-colors">
                  <MoveRight className="h-4 w-4 text-muted-foreground" />
                </button>
                
                {/* Center HOME button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-10 w-16 gap-1 text-xs border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <Home className="h-3 w-3" />
                    HOME
                  </Button>
                </div>
                
                {/* Plus buttons for zoom */}
                <button className="absolute top-3 right-3 p-1.5 hover:text-primary transition-colors">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </button>
                <button className="absolute top-3 left-3 p-1.5 hover:text-primary transition-colors">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          {/* Iris & Night Mode */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1">
              Iris +
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-8 text-xs gap-1">
              <Moon className="h-3 w-3" />
              Night Mode
            </Button>
          </div>

          {/* Quick Actions */}
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3 block">
              Quick Actions
            </span>
            <div className="flex gap-2 mb-2">
              <Button className="flex-1 h-9 gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="h-4 w-4" />
                <span className="text-sm">Snapshot</span>
              </Button>
              <Button variant="outline" className="flex-1 h-9 gap-2">
                <Play className="h-4 w-4" />
                <span className="text-sm">Instant Replay</span>
              </Button>
            </div>
            <Button variant="outline" className="w-full h-9 gap-2 border-primary text-primary hover:bg-primary/10">
              <Search className="h-4 w-4" />
              <span className="text-sm">Deep Search</span>
            </Button>
          </div>
        </div>
      )}

      {activeTab === "sequencing" && (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-sm text-muted-foreground text-center py-8">
            Sequencing controls coming soon
          </div>
        </div>
      )}

      {activeTab === "playback" && (
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-sm text-muted-foreground text-center py-8">
            Playback controls coming soon
          </div>
        </div>
      )}
    </div>
  );
}
