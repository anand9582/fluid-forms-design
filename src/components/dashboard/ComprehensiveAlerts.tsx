import { ArrowRight } from "lucide-react";

const alertTypes = [
  { label: "Motion detection alerts", count: 30, dotColor: "bg-blue-500" },
  { label: "Intrusion alerts", count: 22, dotColor: "bg-red-500" },
  { label: "Temperature monitoring", count: 15, dotColor: "bg-orange-500" },
  { label: "Unauthorized access attempts", count: 2, dotColor: "bg-blue-500" },
  { label: "System performance issues", count: 1, dotColor: "bg-red-500" },
];

export function ComprehensiveAlerts() {
  const motionAlerts = 30;
  const totalCapacity = 360;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.45s" }}>
      {/* Header */}
      <h3 className="font-semibold text-gray-900 text-sm mb-3">COMPREHENSIVE ALERTS</h3>

      {/* Content */}
      <div className="flex gap-4">
        {/* Alert List */}
        <div className="flex-1 space-y-2">
          {alertTypes.map((alert, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 px-2 py-1.5 rounded bg-gray-50"
            >
              <div className={`w-2 h-2 rounded-full ${alert.dotColor} flex-shrink-0`} />
              <span className="text-[10px] text-gray-700">
                <span className="font-semibold text-gray-900">{alert.count}</span> {alert.label}
              </span>
            </div>
          ))}
        </div>

        {/* Circular Chart */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="5"
              />
              {/* Blue segment */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="5"
                strokeDasharray="44 88"
                strokeDashoffset="0"
              />
              {/* Dark navy segment */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#1e3a5f"
                strokeWidth="5"
                strokeDasharray="22 88"
                strokeDashoffset="-44"
              />
              {/* Orange segment */}
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#f97316"
                strokeWidth="5"
                strokeDasharray="18 88"
                strokeDashoffset="-66"
              />
            </svg>
          </div>
          <div className="text-center mt-1">
            <span className="text-sm font-bold text-gray-900">{motionAlerts} / {totalCapacity}</span>
            <p className="text-[10px] text-gray-500">Motion alerts</p>
          </div>
        </div>
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center justify-end gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors mt-3 font-medium"
      >
        View All
        <ArrowRight className="w-3 h-3" />
      </a>
    </div>
  );
}