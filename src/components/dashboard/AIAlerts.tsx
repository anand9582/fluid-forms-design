import { ExternalLink } from "lucide-react";

const alerts = [
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    color: "text-blue-500",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    color: "text-red-500",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    color: "text-orange-500",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=100&h=100&fit=crop",
  },
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    color: "text-blue-500",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    color: "text-red-500",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    color: "text-orange-500",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=100&h=100&fit=crop",
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
