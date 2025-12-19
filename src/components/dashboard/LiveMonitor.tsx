import { ExternalLink, Camera, Maximize2, Volume2, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LiveMonitor() {
  return (
     <Card className="border border-border/80 shadow-none overflow-hidden">
       <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary pt-4 rounded-t border-b pb-4">
          <CardTitle className="text-sm font-roboto font-medium uppercase tracking-wide text-textgray">
            LIVE MONITOR
          </CardTitle>
          <button className="text-gray-600 hover:text-gray-600  transition-colors pt-0">
                <ExternalLink className="w-4 h-4" />
          </button>
      </CardHeader>

        <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {/* Video Feed */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
            {/* Placeholder for video */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/50">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Live Feed Preview</p>
                </div>
              </div>
            </div>

            {/* Top Info Bar */}
            <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium text-sm">Lobby main entrance</h4>
                <p className="text-white/70 text-xs">Building A, ground floor</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs">11:57:36 AM</span>
                <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">Live</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <button className="text-white hover:text-white/80 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </Card>
  );
}
