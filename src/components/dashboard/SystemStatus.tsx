import React from "react";
import { Cctv,ChevronDown,ArrowRight  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DonutChart from "./DonutChart";
import StatCard from "./StatCard";
export const SystemStatus = () => {
  const stats = {
    total: 142,
    online: 138,
    offline:9,  
    recording: 135,
  };


  return (
    <Card className="border-border/80 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary border-b px-3 pt-2 rounded-t-sm">
        <CardTitle className="text-sm font-roboto font-semibold font-medium  uppercase tracking-wide text-textgray">
            System Status 
        </CardTitle>

        <Select defaultValue="camera">
          <SelectTrigger className="w-[140px] h-8 text-xs">
             <SelectValue placeholder="Select device" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="camera">Device: Camera</SelectItem>
            <SelectItem value="sensor">Device: Sensor</SelectItem>
            <SelectItem value="nvr">Device: NVR</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4 p-3">
        {/* Donut Chart */}
        <div className="flex justify-center py-4">
          <DonutChart
            total={stats.total}
            online={stats.online}
            offline={stats.offline}
            label="Cameras"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            value={stats.online}
            label="Online"
            icon={<Cctv className="w-5 h-5" />}
           variant="statusbg"
          />
          <StatCard
            value={String(stats.offline).padStart(2, "0")}
            label="Offline"
                icon={
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20H12.01" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.5 16.429C9.43464 15.5128 10.6912 14.9997 12 14.9997C13.3088 14.9997 14.5654 15.5128 15.5 16.429" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M5 12.859C6.41803 11.4689 8.21781 10.5325 10.17 10.169" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M19 12.859C18.3979 12.2687 17.7236 11.757 16.993 11.336" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 8.82C3.2366 7.71408 4.64809 6.82095 6.177 6.177" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M22 8.81997C20.4748 7.45579 18.6865 6.41812 16.7452 5.77081C14.804 5.12349 12.7508 4.88023 10.712 5.05597" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M2 2L22 22" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
            variant="danger"
          />
          <StatCard
                value={stats.recording}
                label="Rec"
                icon={
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 8L16 12L10 16V8Z" stroke="#525252" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                }
                variant="statusbg"
              />
        </div>

        {/* View offline cameras */}
        <button className="w-full text-center text-fontSize14px text-textlightred  hover:text-primary/80 transition-colors flex items-center justify-center gap-1 pt-4 border-t ">
          View {stats.offline} Offline Cameras
           <ArrowRight className="w-4 h-4 " />
        </button>
      </CardContent>
    </Card>
  );
};
