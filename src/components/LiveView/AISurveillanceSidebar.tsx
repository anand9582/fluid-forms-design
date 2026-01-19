// AI Surveillance Sidebar Component
// Right sidebar with workspace management and AI feature toggles

import { useState } from "react";
import { Settings, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { defaultAIFeatures } from "@/components/LiveView/data";
import type { AIFeature } from "@/components/LiveView/types";

export function AISurveillanceSidebar() {
  const [aiSettings, setAiSettings] = useState<AIFeature[]>(defaultAIFeatures);

  const toggleAiFeature = (index: number) => {
    setAiSettings(prev => prev.map((feature, i) => 
      i === index ? { ...feature, enabled: !feature.enabled } : feature
    ));
  };

  return (
    <div className="hidden lg:flex w-72 xl:w-80 border-l border-border bg-card flex-col flex-shrink-0">
      {/* Workspace Management Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Workspace Management
          </span>
        </div>
        <Button variant="outline" className="w-full justify-between">
          <span>Clear all grid slot</span>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* AI Surveillance Suite Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            AI Surveillance Suite
          </span>
          <Badge className="bg-primary text-primary-foreground text-xs ml-auto">PRO</Badge>
        </div>
        
        {/* AI Feature Toggles */}
        <div className="space-y-3">
          {aiSettings.map((feature, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm font-medium text-foreground">{feature.name}</span>
              </div>
              <Switch 
                checked={feature.enabled}
                onCheckedChange={() => toggleAiFeature(idx)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
