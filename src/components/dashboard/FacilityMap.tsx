import { ExternalLink, ChevronDown, Camera } from "lucide-react";

export function FacilityMap() {
  const cameras = [
    { x: 20, y: 30 },
    { x: 35, y: 25 },
    { x: 50, y: 40 },
    { x: 65, y: 35 },
    { x: 25, y: 55 },
    { x: 40, y: 60 },
    { x: 55, y: 55 },
    { x: 70, y: 50 },
    { x: 30, y: 75 },
    { x: 45, y: 80 },
    { x: 60, y: 70 },
    { x: 75, y: 65 },
    { x: 80, y: 40 },
    { x: 85, y: 55 },
    { x: 15, y: 45 },
  ];

  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.35s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">FACILITY MAP</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-lg text-sm">
          <span>All Location</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">11:57:36 AM</span>
          <span className="status-badge status-badge-live text-xs">Live</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden bg-muted aspect-[4/3]">
        {/* Grid pattern background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Room outlines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Main areas */}
          <rect x="10" y="20" width="30" height="25" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <rect x="45" y="20" width="25" height="25" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <rect x="75" y="20" width="15" height="25" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <rect x="10" y="50" width="20" height="30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <rect x="35" y="50" width="30" height="30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          <rect x="70" y="50" width="20" height="30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          
          {/* Labels */}
          <text x="20" y="35" className="text-[3px] fill-muted-foreground">Reception</text>
          <text x="52" y="35" className="text-[3px] fill-muted-foreground">The Canopy</text>
          <text x="77" y="35" className="text-[3px] fill-muted-foreground">Patio</text>
          <text x="15" y="65" className="text-[3px] fill-muted-foreground">Gym</text>
          <text x="45" y="65" className="text-[3px] fill-muted-foreground">Café</text>
        </svg>

        {/* Camera markers */}
        {cameras.map((cam, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
          >
            <div className="w-full h-full rounded-full bg-success/20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-success flex items-center justify-center">
                <Camera className="w-1.5 h-1.5 text-success-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
