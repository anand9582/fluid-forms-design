import { ArrowRight } from "lucide-react";

const alertTypes = [
  { label: "Motion detection alerts", count: 30, borderColor: "border-primary", iconBg: "bg-primary/20", iconColor: "text-primary" },
  { label: "Intrusion alerts", count: 22, borderColor: "border-destructive", iconBg: "bg-destructive/20", iconColor: "text-destructive" },
  { label: "Temperature monitoring", count: 15, borderColor: "border-warning", iconBg: "bg-warning/20", iconColor: "text-warning" },
  { label: "Unauthorized access attempts", count: 2, borderColor: "border-primary", iconBg: "bg-primary/20", iconColor: "text-primary" },
  { label: "System performance issues", count: 1, borderColor: "border-primary", iconBg: "bg-primary/20", iconColor: "text-primary" },
];

export function ComprehensiveAlerts() {
  const motionAlerts = 30;
  const totalCapacity = 360;

  return (
    <div className="dashboard-card p-4 sm:p-5 animate-fade-in" style={{ animationDelay: "0.45s" }}>
      {/* Header */}
      <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">COMPREHENSIVE ALERTS</h3>

      {/* Content - Stack on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Alert List */}
        <div className="flex-1 space-y-2.5">
          {alertTypes.map((alert, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/30 border-l-4 ${alert.borderColor}`}
            >
              <div className={`w-5 h-5 rounded-full ${alert.iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-[10px] font-bold ${alert.iconColor}`}>!</span>
              </div>
              <span className="text-xs sm:text-sm text-foreground">
                <span className="font-semibold">{alert.count}</span> {alert.label}
              </span>
            </div>
          ))}
        </div>

        {/* Circular Chart */}
        <div className="flex flex-col items-center justify-center flex-shrink-0 pt-2 sm:pt-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              {/* Background circle (gray remaining) */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="5"
              />
              {/* Navy/Dark blue segment - top right */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="5"
                strokeDasharray="22 88"
                strokeDashoffset="22"
                className="transition-all duration-500"
              />
              {/* Orange segment - right side */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="hsl(var(--warning))"
                strokeWidth="5"
                strokeDasharray="18 88"
                strokeDashoffset="-2"
                className="transition-all duration-500"
              />
              {/* Primary blue segment - bottom/left */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="5"
                strokeDasharray="30 88"
                strokeDashoffset="-22"
                className="transition-all duration-500"
              />
            </svg>
          </div>
          <div className="text-center mt-2">
            <span className="text-base sm:text-lg font-bold text-foreground">{motionAlerts} / {totalCapacity}</span>
            <p className="text-xs text-muted-foreground">Motion alerts</p>
          </div>
        </div>
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center justify-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors mt-5 font-medium"
      >
        View All
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}