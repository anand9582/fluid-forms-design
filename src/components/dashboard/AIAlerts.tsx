import { ExternalLink, User, AlertTriangle, Car, Footprints } from "lucide-react";

const alerts = [
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    icon: User,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    icon: Car,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    icon: User,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    icon: Footprints,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

export function AIAlerts() {
  return (
    <div className="dashboard-card p-4 h-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">REAL-TIME AI ALERTS</h3>
        <div className="flex items-center gap-2">
          <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-0.5 rounded">
            122
          </span>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 max-h-[450px] overflow-y-auto scrollbar-thin pr-1">
        {alerts.map((alert, index) => (
          <div key={index} className="alert-item">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-xs font-bold ${alert.color}`}>{alert.type}</span>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">{alert.location}</p>
              <p className="text-xs text-muted-foreground truncate">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
