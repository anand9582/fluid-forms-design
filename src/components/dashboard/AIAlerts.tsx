import { ExternalLink, User, AlertTriangle, Car, Footprints } from "lucide-react";
import { Card,CardHeader,CardTitle } from "@/components/ui/card";
import Facematch from "../../assets/img/icons/facematch-img.png";
import Facematch2 from "../../assets/img/icons/facematch1-img.png";
import Facematch3 from "../../assets/img/icons/facematch3-img.png";
import Facematch4 from "../../assets/img/icons/facematch4-img.png";
import Facematch5 from "../../assets/img/icons/facematch4-img.png";
import Facematch6 from "../../assets/img/icons/facematch3-img.png";

const alerts = [
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    image: Facematch,
    color: "text-Ailightorange",
    bgColor: "bg-blue-100",
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
    image: Facematch2,
    icon: AlertTriangle,
    color: "text-Ailightred",
    bgColor: "bg-red-100",
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
     image: Facematch3,
     color: "text-orange-500",
    bgColor: "bg-orange-100",
  },
  {
    type: "LOITERING",
    location: "Parking Garage B",
    description: "Vehicle stationary for > 20 min.",
    time: "11:57:36 AM",
    image: Facematch4,
    color: "text-Aidarkorange",
    bgColor: "bg-blue-100",
  },
  {
    type: "FACE MATCH",
    location: "Lobby Entrance",
    description: "Watchlist match: 85% confidence.",
    time: "11:57:36 AM",
    image: Facematch5,
    color: "text-Aidarkorange",
    bgColor: "bg-red-100",
  },
  {
    type: "INTRUSION",
    location: "Perimeter North",
    description: "Human detected in restricted zone",
    time: "11:57:36 AM",
   image: Facematch6,
    color: "text-Ailighteronered",
    bgColor: "bg-orange-100",
  },
];

export function AIAlerts() {
  return (
    <Card className="rounded-md bg-card text-card-foreground border border-border/80 shadow-none overflow-hidden">
       <CardHeader className="flex flex-row items-center justify-between py-3 bg-bgprimary rounded-t px-4">
        <CardTitle className="font-roboto font-medium uppercase tracking-wide text-textgray">
            REAL-TIME AI ALERTS
        </CardTitle>
          <div className="flex items-center gap-2">
              <span className="bg-red-500 text-white text-[14px] font-bold px-1.5 py-0.5 rounded-full">
                122
              </span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
          </div>
      </CardHeader>

      <div
        className="bg-white rounded-xl p-3 shadow-md h-full animate-fade-in "
        style={{ animationDelay: "0.2s" }}
      >
        {/* Alerts list */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
          {alerts.map((alert, index) => (
             <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors border p-3 shadow-md">
            {/* Thumbnail Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={alert.image} 
                alt={alert.type}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[12px] font-bold ${alert.color}`}>{alert.type}</span>
                <span className="text-[12px] text-[#64748B]  font-roboto font-medium">{alert.time}</span>
              </div>
              <p className="text-sm font-semibold text-gray-500 truncate font-roboto">{alert.location}</p>
              <p className="text-[13px] text-gray-500  font-roboto font-medium">{alert.description}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
