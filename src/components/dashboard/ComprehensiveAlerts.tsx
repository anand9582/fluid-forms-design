import React, { useState } from "react";
import {
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell } from "recharts";

/* ---------------- DATA ---------------- */

const alertTypes = [
  {
    label: "Motion detection alerts",
    count: 25,
    icon: AlertCircle,
    color: "text-orange-600",
    fill: "#FF9E69",
  },
  {
    label: "Intrusion alerts",
    count: 25,
    icon: AlertCircle,
    color: "text-indigo-600",
    fill: "#263B9E",
  },
  {
    label: "Temperature monitoring",
    count: 25,
    icon: AlertCircle,
    color: "text-blue-600",
    fill: "#2B4DED",
  },
  {
    label: "Unauthorized access attempts",
    count: 25,
    icon: AlertCircle,
    color: "text-orange-400",
    fill: "#FFD1A7",
  },
];

/* ---------------- COMPONENT ---------------- */

export function ComprehensiveAlerts() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const totalCapacity = 360;

  const pieData = alertTypes.map((alert) => ({
    name: alert.label,
    value: alert.count,
    fill: alert.fill,
  }));

  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      {/* ---------------- HEADER ---------------- */}
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-4 bg-bgprimary rounded-t border-b">
        <CardTitle className="text-sm font-roboto font-medium text-gray-600  uppercase tracking-wide text-textgray">
          COMPREHENSIVE ALERTS
        </CardTitle>
      </CardHeader>

      {/* ---------------- CONTENT ---------------- */}
      <div className="flex gap-4 p-3">
        {/* ---------- ALERT LIST ---------- */}
        <div className="flex-1 space-y-2">
          {alertTypes.map((alert, index) => {
            const Icon = alert.icon;
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition
                  ${isActive ? "bg-blue-200" : "bg-[#dbeafe]"}`}
              >
                {/* Icon */}
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <Icon className={`w-4 h-4 ${alert.color}`} />
                </div>

                {/* Text */}
                <span className="text-[12px] text-gray-700 font-roboto font-medium">
                  <span className="font-semibold text-gray-900">
                    {alert.count}
                  </span>{" "}
                  {alert.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ---------- DONUT CHART ---------- */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <PieChart width={130} height={130}>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={37}
              outerRadius={55}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={
                    activeIndex === null || activeIndex === index ? 1 : 0.3
                  }
                />
              ))}
            </Pie>
          </PieChart>

          {/* ---------- FLOATING INFO CARD ---------- */}
          <div className="absolute -right-2 bottom-4 translate-y-6 bg-white rounded-lg shadow-lg px-4 py-2 text-center w-32">
            <p className="text-base font-semibold text-gray-900">
              {activeIndex !== null
                ? `${pieData[activeIndex].value} / ${totalCapacity}`
                : `30 / ${totalCapacity}`}
            </p>
            <p className="text-xs text-gray-500">
              {activeIndex !== null
                ? pieData[activeIndex].name
                : "Motion alerts"}
            </p>
          </div>
        </div>
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <div className="mt-5 border-t flex justify-center">
        <button className="text-blue-600 flex items-center gap-1 text-sm font-medium py-3">
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Card>
  );
}
