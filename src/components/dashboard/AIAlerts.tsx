import { ExternalLink } from "lucide-react";
import alertFace1 from "@/assets/alert-face-1.jpg";
import alertIntrusion1 from "@/assets/alert-intrusion-1.jpg";
import alertVehicle1 from "@/assets/alert-vehicle-1.jpg";
import alertFace2 from "@/assets/alert-face-2.jpg";
import alertIntrusion2 from "@/assets/alert-intrusion-2.jpg";
import alertVehicle2 from "@/assets/alert-vehicle-2.jpg";

const alerts = [
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    color: "text-blue-500",
    image: alertFace1,
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    color: "text-red-500",
    image: alertIntrusion1,
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    color: "text-orange-500",
    image: alertVehicle1,
  },
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    color: "text-blue-500",
    image: alertFace2,
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    color: "text-red-500",
    image: alertIntrusion2,
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    color: "text-orange-500",
    image: alertVehicle2,
  },
];

export function AIAlerts() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm h-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">REAL-TIME AI ALERTS</h3>
        <div className="flex items-center gap-2">
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            122
          </span>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            {/* Thumbnail Image */}
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={alert.image} 
                alt={alert.type}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[10px] font-bold ${alert.color}`}>{alert.type}</span>
                <span className="text-[10px] text-gray-400">{alert.time}</span>
              </div>
              <p className="text-xs font-medium text-gray-900 truncate">{alert.location}</p>
              <p className="text-[10px] text-gray-500 truncate">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
