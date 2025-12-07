import { Monitor, WifiOff, PlayCircle, ChevronDown, ArrowRight } from "lucide-react";

export function SystemStatus() {
  const totalCameras = 142;
  const percentage = 100;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">SYSTEM STATUS</h3>
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors bg-gray-100 px-2 py-1 rounded">
          <span>Device: Camera</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Gauge */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="130" height="130" viewBox="0 0 130 130">
            {/* Background circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="gauge-ring"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{totalCameras}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Cameras</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <Monitor className="w-4 h-4 text-emerald-500 mb-1" />
          <span className="text-lg font-bold text-gray-900">138</span>
          <span className="text-[10px] text-gray-500">Online</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
          <WifiOff className="w-4 h-4 text-red-500 mb-1" />
          <span className="text-lg font-bold text-gray-900">04</span>
          <span className="text-[10px] text-gray-500">Offline</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
          <PlayCircle className="w-4 h-4 text-blue-500 mb-1" />
          <span className="text-lg font-bold text-gray-900">135</span>
          <span className="text-[10px] text-gray-500">Rec</span>
        </div>
      </div>

      {/* Link */}
      <a
        href="#"
        className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
      >
        View 4 Offline Cameras
        <ArrowRight className="w-3 h-3" />
      </a>
    </div>
  );
}
