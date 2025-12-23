import React from "react";
import { Cpu, MemoryStick, HardDrive,Activity,ArrowRight  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Gauge = ({
  value,
  label,
  icon: Icon,
  gradientId,
  bgColor,
  textAlignClass,
  needlePosition,
  needleColor,
}: any) => {
  const rotation = (value / 100) * 180 - 90;

  return (
    <div
      className="relative p-3 w-full shadow-sm rounded-sm"
      style={{ backgroundColor: bgColor }}
    >
      {/* ---------- ICON (Top Right) ---------- */}
      {Icon && (
      <div className="absolute top-2 right-2 text-gray-500">
        <Icon className="w-5 h-5 font-roboto font-semibold" strokeWidth={2} />
      </div>
    )}

      {/* ---------- GAUGE ---------- */}
      <div className="relative w-full flex justify-center">
        <svg width="380" height="60" viewBox="0 0 100 30">
          <defs>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="80%" stopColor="#FDBA74" />
            </linearGradient>

            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2B43FF" />
              <stop offset="100%" stopColor="#8492FF" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            stroke="#e5e7eb"
            strokeWidth="22"
            fill="none"
          />

          {/* Active arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            stroke={`url(#${gradientId})`}
            strokeWidth="22"
            fill="none"
            strokeDasharray={`${(value / 100) * 125} 300`}
          />
        </svg>

        {/* ---------- NEEDLE ---------- */}
        <div
          className="absolute origin-bottom"
          style={{
            top: needlePosition.top,
            left: needlePosition.left,
            right: needlePosition.right,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div
            className="w-[2px] h-5"
            style={{ backgroundColor: needleColor }}
          />
        </div>
      </div>

      {/* ---------- VALUE ---------- */}
      <p className={`font-roboto font-medium text-center  text-[16px] ${textAlignClass}`}>
        {value}%
      </p>

      {/* ---------- LABEL ---------- */}
      <p className={`font-roboto font-medium text-gray-600 text-sm  ${textAlignClass}`}>
        {label}
      </p>
    </div>
  );
};


export const SystemHealth = () => {
  return (
  <Card className=" border-border/80 shadow-none overflow-hidden rounded">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b p-2 rounded-t-sm">
        <CardTitle className="font-roboto font-semibold font-medium  uppercase tracking-wide text-textgray">
            SYSTEM HEALTH
        </CardTitle>
         <p className="text-sm text-gray-500 flex items-center gap-1">
            <Activity className="w-4 h-4" /> Uptime 14d 2h 12m
         </p>
    </CardHeader>

    <div className="border shadow-sm bg-white p-3 rounded-none">

      <div className="grid grid-cols-3 gap-2 mt-4">

        {/* CPU Gauge → Left */}
        <Gauge
          value={37}
          label="CPU Load"
          icon={Cpu}
          gradientId="blueGradient"
          bgColor="#F1F5F9"
          textAlignClass="text-left"
          needlePosition={{ top: "18px", left: "29px" }}
          needleColor="#3B82F6"
        />

        {/* Memory Gauge → Center */}
        <Gauge
          value={76}
          label="Memory"
          icon={MemoryStick}
          gradientId="orangeGradient"
          bgColor="#FFFBEB"
          textAlignClass="text-center"
          needlePosition={{ top: "22px", left: "68%" }}
          needleColor="#F59E0B"
        />

        {/* Disk Gauge → Right */}
        <Gauge
          value={22}
          label="Disk"
          icon={HardDrive}
          gradientId="greenGradient"
          bgColor="#F1F5F9"
          textAlignClass="text-center"
          needlePosition={{ top: "23px", right: "52px" }}
          needleColor="#2B43FF"
        />
      </div>

      <div className="mt-5 border-t pt-4 flex justify-center">
        <button className="text-blue-600 flex items-center justify-center gap-1 text-fontSize15px font-roboto font-medium">
          View Diagnostics 
           <ArrowRight className="w-4 h-4 font-roboto" />
        </button>
      </div>
    </div>
    </Card>
  );
};
