import { ExternalLink, Camera, Maximize2, Volume2, Settings } from "lucide-react";

export function LiveMonitor() {
  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">LIVE MONITOR:</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Video Feed */}
      <div className="relative rounded-lg overflow-hidden bg-sidebar aspect-video">
        {/* Placeholder for video - using gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar/90 to-sidebar/70">
          {/* Simulated lobby image with gradient overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-sidebar-foreground/50">
              <Camera className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">Live Feed Preview</p>
            </div>
          </div>
        </div>

        {/* Top Info Bar */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
          <div>
            <h4 className="text-card font-medium">Lobby main entrance</h4>
            <p className="text-card/70 text-sm">Building A, ground floor</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-card/80 text-sm">11:57:36 AM</span>
            <span className="status-badge status-badge-live text-xs">LIVE</span>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <button className="text-card hover:text-card/80 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 rounded-full bg-card/20 hover:bg-card/30 flex items-center justify-center text-card transition-colors">
                <Volume2 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-card/20 hover:bg-card/30 flex items-center justify-center text-card transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-card/20 hover:bg-card/30 flex items-center justify-center text-card transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
