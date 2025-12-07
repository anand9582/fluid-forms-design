import { Cpu, HardDrive, Database, ArrowRight } from "lucide-react";

interface GaugeProps {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
}

function MiniGauge({ value, label, icon: Icon, color }: GaugeProps) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="60" height="60" viewBox="0 0 60 60">
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="5"
          />
          <circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="gauge-ring"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      </div>
      <span className="text-sm font-bold text-gray-900 mt-1">{value}%</span>
      <span className="text-[10px] text-gray-500">{label}</span>
    </div>
  );
}

export function SystemHealth() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.25s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">SYSTEM HEALTH</h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Uptime 14d 2h 12m
        </div>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <MiniGauge value={37} label="CPU Load" icon={Cpu} color="#22c55e" />
        <MiniGauge value={76} label="Memory" icon={Database} color="#f97316" />
        <MiniGauge value={22} label="Disk" icon={HardDrive} color="#3b82f6" />
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
      >
        View Diagnostics
        <ArrowRight className="w-3 h-3" />
      </a>
    </div>
  );
}
