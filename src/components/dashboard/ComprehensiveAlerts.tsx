import { ArrowRight, Info, AlertCircle, AlertTriangle, ThermometerSun, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const alertTypes = [
  { label: "Motion detection alerts", count: 30, icon: Info, bg: "bg-blue-100", color: "text-blue-600" },
  { label: "Intrusion alerts", count: 22, icon: AlertCircle, bg: "bg-red-100", color: "text-red-600" },
  { label: "Temperature monitoring", count: 15, icon: ThermometerSun, bg: "bg-orange-100", color: "text-orange-600" },
  { label: "Unauthorized access attempts", count: 2, icon: ShieldAlert, bg: "bg-yellow-100", color: "text-yellow-600" },
  { label: "System performance issues", count: 1, icon: AlertTriangle, bg: "bg-blue-100", color: "text-blue-600" },
];

export function ComprehensiveAlerts() {
  const motionAlerts = 30;
  const totalCapacity = 360;

  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary pt-4 rounded-t border-b pb-4">
        <CardTitle className="text-sm font-roboto font-medium uppercase tracking-wide text-textgray">
          COMPREHENSIVE ALERTS
        </CardTitle>
      </CardHeader>

      {/* Content */}
      <div className="flex gap-4 p-3">
        {/* Alert List */}
        <div className="flex-1 space-y-2">
          {alertTypes.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-2 px-2 py-1 rounded-md bg-[#dbeafe]"
              >
                {/* Icon Bubble */}
                <div className={`w-6 h-6 rounded-full ${alert.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${alert.color}`} />
                </div>

                {/* Text */}
                <span className="text-[11px] text-gray-700 ">
                  <span className="font-semibold text-gray-900">
                    {alert.count}
                  </span>{" "}
                  {alert.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Donut Chart */}
        <div className="relative flex flex-col items-center justify-center flex-shrink-0">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#2B4DED" strokeWidth="5" strokeDasharray="40 88" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#1E3A5F" strokeWidth="5" strokeDasharray="22 88" strokeDashoffset="-40" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#FFD1A7" strokeWidth="5" strokeDasharray="18 88" strokeDashoffset="-62" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="#FF9E69" strokeWidth="5" strokeDasharray="14 88" strokeDashoffset="-80" />
            </svg>
          </div>

          {/* Center Badge */}
          <div className="absolute shadow top-1/2 left-1/2 -translate-x-1/2 translate-y-7 w-28 bg-white shadow-lg border-blue-400 rounded-sm p-2 shadow-sm text-center">
            <span className="text-sm font-bold text-gray-900">
              {motionAlerts} / {totalCapacity}
            </span>
            <p className="text-[10px] text-gray-500">Motion alerts</p>
          </div>
        </div>
      </div>

      {/* View All */}
      <a
        href="#"
        className="flex items-center justify-end gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors mt-3 font-medium pr-3 pb-3"
      >
        View All
        <ArrowRight className="w-3 h-3" />
      </a>
    </Card>
  );
}
