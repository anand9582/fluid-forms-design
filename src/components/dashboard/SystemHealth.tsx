import { Cpu, HardDrive, Database, ExternalLink } from "lucide-react";

interface GaugeProps {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
}

function MiniGauge({ value, label, icon: Icon, color }: GaugeProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="6"
          />
          <circle
            cx="35"
            cy="35"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="gauge-ring"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
      <span className="text-lg font-bold text-foreground mt-1">{value}%</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function SystemHealth() {
  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">SYSTEM HEALTH</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Uptime 14d 2h 12m
          </span>
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <MiniGauge value={37} label="CPU Load" icon={Cpu} color="hsl(var(--chart-green))" />
        <MiniGauge value={76} label="Memory" icon={Database} color="hsl(var(--chart-orange))" />
        <MiniGauge value={22} label="Disk" icon={HardDrive} color="hsl(var(--chart-blue))" />
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
      >
        View Diagnostics
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
