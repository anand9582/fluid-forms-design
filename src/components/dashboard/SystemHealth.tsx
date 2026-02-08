import React from "react";
import { Cpu, MemoryStick, HardDrive, Activity, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";
import { themeColors } from "@/theme/themeColors";

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
    <div className="relative p-3 w-full shadow-sm rounded-sm" style={{ backgroundColor: bgColor }}>
      {Icon && (
        <div className="absolute top-2 right-2 text-gray-500">
          <Icon className="w-5 h-5 font-roboto font-semibold" strokeWidth={2} />
        </div>
      )}

      <div className="relative w-full flex justify-center">
        <svg width="380" height="60" viewBox="0 0 100 30">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={needleColor} />
              <stop offset="100%" stopColor={needleColor + "80"} />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path d="M10 50 A40 40 0 0 1 90 50" stroke="#e5e7eb" strokeWidth="22" fill="none" />

          {/* Active Arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            stroke={`url(#${gradientId})`}
            strokeWidth="22"
            fill="none"
            strokeDasharray={`${(value / 100) * 125} 300`}
          />
        </svg>

        {/* Needle */}
        <div
          className="absolute origin-bottom"
          style={{
            top: needlePosition.top,
            left: needlePosition.left,
            right: needlePosition.right,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="w-[2px] h-5" style={{ backgroundColor: needleColor }} />
        </div>
      </div>

      <p className={`font-roboto font-medium text-center text-[16px] ${textAlignClass}`}>
        {value}%
      </p>
      <p className={`font-roboto font-medium text-slate-600 text-fontSize12px text-center`}>
        {label}
      </p>
    </div>
  );
};

export const SystemHealth = () => {
  const { isAltTheme } = useTheme(); 
  const theme = isAltTheme ? themeColors.dark : themeColors.light;

  return (
      <Card className="border-border/80 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b p-2 rounded-t-sm">
        <CardTitle className="font-roboto font-semibold font-medium uppercase tracking-wide text-textgray">
          SYSTEM HEALTH
        </CardTitle>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Activity className="w-4 h-4" /> Uptime 14d 2h 12m
        </p>
      </CardHeader>

      <div className=" shadow-sm p-3 bg-white rounded-none">
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Gauge
            value={37}
            label="CPU Load"
            icon={Cpu}
            gradientId="cpuGradient"
            bgColor={theme.background}
            textAlignClass="text-left"
            needlePosition={{ top: "18px", left: "29px" }}
            needleColor={theme.needleCpu}
          />
          <Gauge
            value={76}
            label="Memory"
            icon={MemoryStick}
            gradientId="memGradient"
            bgColor={theme.background}
            textAlignClass="text-center"
            needlePosition={{ top: "22px", left: "68%" }}
            needleColor={theme.needleMem}
          />
          <Gauge
            value={22}
            label="Disk"
            icon={HardDrive}
            gradientId="diskGradient"
            bgColor={theme.background}
            textAlignClass="text-center"
            needlePosition={{ top: "23px", right: "52px" }}
            needleColor={theme.needleDisk}
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
