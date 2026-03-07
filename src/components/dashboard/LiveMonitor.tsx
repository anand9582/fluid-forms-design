import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Cctv, Camera, Minimize, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useGridController } from "@/hooks/useGridController";

// Mock camera data
const cameras = [
  { id: "1", name: "Lobby Main Entrance", location: "Building A, Ground Floor", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { id: "2", name: "Parking Lot", location: "Building A, Basement", url: "https://www.w3schools.com/html/movie.mp4" },
  { id: "3", name: "Entrance Gate", location: "Building B, Ground Floor", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

export function LiveMonitor() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { play,handleSnapshot} = useGridController();

useEffect(() => {
  const currentCamera = cameras[currentIndex];
  if (!currentCamera) return;

  if (videoRef.current) {
    try {
      play(currentCamera.id, videoRef.current);
      console.log("✅ play() called for camera:", currentCamera.id);
    } catch (err) {
      console.error("Video play failed:", err);
    }
  }
}, [currentIndex, play]);

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? cameras.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === cameras.length - 1 ? 0 : prev + 1));

  const currentCamera = cameras[currentIndex];

  return (
    <Card className="border border-border/80 shadow-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-bgprimary pt-4 rounded-t border-b pb-4">
        <CardTitle className="font-roboto font-medium uppercase tracking-wide text-textgray">
          LIVE MONITOR
        </CardTitle>
        <button className="text-gray-600 hover:text-gray-600 transition-colors pt-0">
          <ExternalLink className="w-4 h-4" />
        </button>
      </CardHeader>

      <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
          {/* Video */}
          {currentCamera ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              controls={false}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600">
              <Cctv className="w-10 h-10 mb-2 text-white/80" />
              <span className="text-white/80 text-sm">No Camera Assigned</span>
            </div>
          )}

          {/* Top Info */}
          <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
            <div>
              <h4 className="text-white font-medium text-sm">{currentCamera?.name}</h4>
              <p className="text-white/70 text-xs">{currentCamera?.location}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-xs">{new Date().toLocaleTimeString()}</span>
              <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">Live</span>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
            <button className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <Camera className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handlePrev} className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={handleNext} className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white transition-colors">
                <Minimize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}