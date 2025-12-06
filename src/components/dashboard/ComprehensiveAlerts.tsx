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
  const percentage = (motionAlerts / totalCapacity) * 100;
  
  // Calculate stroke dasharray for donut chart
  const circumference = 2 * Math.PI * 16;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

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
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="3"
              />
              {/* Primary segment (motion alerts) */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
              {/* Secondary segment */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="hsl(var(--warning))"
                strokeWidth="3"
                strokeDasharray={`${(15 / totalCapacity) * circumference} ${circumference}`}
                strokeDashoffset={`-${(percentage / 100) * circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
              <span className="text-base sm:text-lg font-bold text-foreground">{motionAlerts} / {totalCapacity}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Motion alerts</p>
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
