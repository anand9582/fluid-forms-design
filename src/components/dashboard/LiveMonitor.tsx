import { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cctv,
  Camera,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useGridController } from "@/hooks/useGridController";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import { Minimize } from "@/components/ui/icons";

export function LiveMonitor() {
  const { cameras, fetchCameras, loading } = SidebarCameraStore();

  const [currentIndex, setCurrentIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { play, handleSnapshot } = useGridController();

  const lastCameraRef = useRef<string | null>(null);

  // Fetch cameras
  useEffect(() => {
    fetchCameras();
  }, []);

  // Play camera stream
  useEffect(() => {
    const currentCamera = cameras[currentIndex];
    if (!currentCamera || !videoRef.current) return;

    if (lastCameraRef.current === currentCamera.cameraId) return;

    lastCameraRef.current = currentCamera.cameraId;

    try {
      play(currentCamera.cameraId, videoRef.current, "main");
    } catch (err) {
      console.error("Video play failed:", err);
    }
  }, [currentIndex, cameras]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => { });
    }
  };

  const handlePrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? cameras.length - 1 : prev - 1
    );

  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === cameras.length - 1 ? 0 : prev + 1
    );

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

      <div className="bg-white rounded-xl p-4 shadow-sm animate-fade-in">
        <div
          ref={containerRef}
          className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video"
        >
          {/* Loading */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-200">
              <div className="flex flex-col items-center gap-1.5">
                <div className="relative h-8 w-8">
                  <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                </div>

                <span className="text-[10px] text-white/80 font-medium tracking-wide">
                  Connecting...
                </span>
              </div>
            </div>
          )}

          {/* Video */}
          {currentCamera ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
              <Cctv className="w-10 h-10 mb-2 text-white/80" />
              <span className="text-white/80 text-sm">
                No Camera Available
              </span>
            </div>
          )}

          {/* Top Info */}
          {currentCamera && (
            <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium text-sm">
                  {currentCamera.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white/80 text-xs">
                  {new Date().toLocaleTimeString()}
                </span>

                <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                  Live
                </span>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
            {/* Snapshot */}
            <button
              onClick={() =>
                videoRef.current && handleSnapshot(videoRef.current)
              }
              className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white"
            >
              <Camera className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-sm bg-black hover:bg-white/30 flex items-center justify-center text-white"
              >
                <Minimize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
