import React, { useState } from "react";
 import { ArrowRight, Info, AlertCircle, AlertTriangle, ThermometerSun, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell , Tooltip  } from "recharts";

const alertTypes = [
  
  { label: "Motion detection alerts", count: 25, icon: AlertCircle, color: "text-orange-600", fill: "#FF9E69" },
  { label: " Intrusion alerts", count: 25, icon: AlertCircle, color: "text-orange-600", fill: " #263B9E" },
  { label: "Temperature monitoring", count: 25, icon: AlertCircle, color: "text-blue-600", fill: "#2B4DED" },
  { label: "Unauthorized access attempts", count: 25, icon: AlertCircle, color: "text-orange-400", fill: "#FFD1A7" },
];

export function ComprehensiveAlerts() {
    const [activeSlice, setActiveSlice] = useState<{ name: string; value: number } | null>(null);
    const totalCapacity = 360;
    const pieData = alertTypes.map((alert) => ({ name: alert.label, value: alert.count, fill: alert.fill }));


  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-4 bg-bgprimary rounded-t border-b">
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
              <div key={index} className="flex items-center gap-2 px-2 py-1 rounded-md bg-[#dbeafe]">
                {/* Icon Bubble */}
                <div className={`w-6 h-6 rounded-full ${alert.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${alert.color}`} />
                </div>

                {/* Text */}
                <span className="text-[11px] text-[#535353] font-roboto font-medium ">
                  <span className="font-semibold text-gray-900">{alert.count}</span> {alert.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Donut Chart */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <PieChart width={130} height={130}>
          <Pie
            data={pieData}
            dataKey="value"
            innerRadius={29}
            outerRadius={55}
            startAngle={90}
            endAngle={-270}
            onMouseEnter={(_, index) => setActiveSlice({ name: pieData[index].name, value: pieData[index].value })}
            onMouseLeave={() => setActiveSlice(null)}
            stroke="none" 
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          </PieChart>

             {/* Floating Info Card */}
            <div className="absolute -right-2 bottom-4 translate-y-6 bg-white rounded-lg shadow-lg  px-4 py-2 text-center w-32">
              <p className="text-base font-semibold text-gray-900">
                {activeSlice ? `${activeSlice.value} / ${totalCapacity}` : `30 / ${totalCapacity}`}
              </p>
              <p className="text-xs text-gray-500">
                {activeSlice ? activeSlice.name : "Motion alerts"}
              </p>
            </div>
        </div>
      </div>

      <div className="mt-5 border-t flex justify-center">
        <button className="text-blue-600 flex items-center justify-center gap-1 text-fontSize15px font-roboto font-medium py-3">
          View All
          <ArrowRight className="w-4 h-4 font-roboto" />
        </button>
      </div>
    </Card>
  );
}
