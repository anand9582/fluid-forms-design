import { ExternalLink, Activity, Footprints, Thermometer, ShieldAlert, AlertCircle } from "lucide-react";

const alertTypes = [
  { icon: Activity, label: "Motion detection alerts", count: 30, color: "text-primary" },
  { icon: Footprints, label: "Intrusion alerts", count: 22, color: "text-destructive" },
  { icon: Thermometer, label: "Temperature monitoring", count: 15, color: "text-warning" },
  { icon: ShieldAlert, label: "Unauthorized access attempts", count: 2, color: "text-destructive" },
  { icon: AlertCircle, label: "System performance issues", count: 1, color: "text-muted-foreground" },
];

export function ComprehensiveAlerts() {
  const total = alertTypes.reduce((sum, a) => sum + a.count, 0);
  const motionAlerts = 30;

  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.45s" }}>
      {/* Header */}
      <h3 className="font-semibold text-foreground mb-4">COMPREHENSIVE ALERTS</h3>

      {/* Content */}
      <div className="flex gap-4">
        {/* Alert List */}
        <div className="flex-1 space-y-2">
          {alertTypes.map((alert, index) => (
            <div key={index} className="flex items-center gap-2">
              <alert.icon className={`w-4 h-4 ${alert.color}`} />
              <span className="text-xs text-muted-foreground flex-1 truncate">{alert.label}</span>
              <span className={`text-xs font-medium ${alert.color}`}>{alert.count}</span>
            </div>
          ))}
        </div>

        {/* Circular Chart */}
        <div className="flex-shrink-0">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={`${(motionAlerts / 360) * 100} 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-foreground">30 / 360</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-1">Motion alerts</p>
        </div>
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center justify-end gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
      >
        View All
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
