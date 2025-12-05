import { Monitor, WifiOff, PlayCircle, ChevronDown, ExternalLink } from "lucide-react";

export function SystemStatus() {
  const totalCameras = 142;
  const percentage = 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="dashboard-card p-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">SYSTEM STATUS</h3>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span>Device: Camera</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Gauge */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <svg width="150" height="150" viewBox="0 0 150 150">
            {/* Background circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="gauge-ring"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{totalCameras}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Cameras</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <Monitor className="w-5 h-5 text-success mb-1" />
          <span className="text-xl font-bold text-foreground">138</span>
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-destructive/10 rounded-lg">
          <WifiOff className="w-5 h-5 text-destructive mb-1" />
          <span className="text-xl font-bold text-foreground">04</span>
          <span className="text-xs text-muted-foreground">Offline</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
          <PlayCircle className="w-5 h-5 text-primary mb-1" />
          <span className="text-xl font-bold text-foreground">135</span>
          <span className="text-xs text-muted-foreground">Rec</span>
        </div>
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        View 4 Offline Cameras
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
