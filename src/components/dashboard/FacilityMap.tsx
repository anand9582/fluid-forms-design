import { ExternalLink, ChevronDown } from "lucide-react";
import facilityFloorPlan from "@/assets/facility-floor-plan.png";

export function FacilityMap() {
  // Camera positions based on floor plan - blue for normal, red for alert
  const cameras = [
    { x: 12, y: 8, status: "normal" },
    { x: 8, y: 32, status: "normal" },
    { x: 8, y: 48, status: "normal" },
    { x: 8, y: 62, status: "alert" },
    { x: 12, y: 78, status: "normal" },
    { x: 22, y: 88, status: "normal" },
    { x: 32, y: 58, status: "normal" },
    { x: 48, y: 12, status: "normal" },
    { x: 52, y: 38, status: "normal" },
    { x: 58, y: 52, status: "normal" },
    { x: 52, y: 72, status: "normal" },
    { x: 62, y: 88, status: "normal" },
    { x: 72, y: 38, status: "normal" },
    { x: 78, y: 58, status: "normal" },
    { x: 88, y: 72, status: "normal" },
    { x: 92, y: 88, status: "normal" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.35s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">FACILITY MAP</h3>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-lg text-xs">
          <span>All Location</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">11:57:36 AM</span>
          <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">Live</span>
        </div>
      </div>

      {/* Map */}
      <div className="relative rounded-lg overflow-hidden bg-gray-50 aspect-[4/3]">
        {/* Floor plan image */}
        <img 
          src={facilityFloorPlan} 
          alt="Facility Floor Plan" 
          className="w-full h-full object-contain"
        />

        {/* Camera markers */}
        {cameras.map((cam, index) => (
          <div
            key={index}
            className="absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
          >
            {/* Pulse ring for alert cameras */}
            {cam.status === "alert" && (
              <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
            )}
            <div 
              className={`relative w-full h-full rounded-full flex items-center justify-center ${
                cam.status === "alert" 
                  ? "bg-red-500" 
                  : "bg-blue-500"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
