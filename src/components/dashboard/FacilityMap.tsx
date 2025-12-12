import { useState } from "react";
import { ExternalLink, ChevronDown, Camera, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import facilityFloorPlan from "@/assets/facility-floor-plan.png";

export function FacilityMap() {
  const [zoom, setZoom] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Multiple floor plans
  const floorPlans = [
    { id: 1, name: "Floor 1", image: facilityFloorPlan },
    { id: 2, name: "Floor 2", image: facilityFloorPlan },
    { id: 3, name: "Floor 3", image: facilityFloorPlan },
  ];

  // Camera positions for each floor
  const camerasByFloor = [
    // Floor 1
    [
      { x: 12, y: 8, status: "normal" },
      { x: 8, y: 32, status: "normal" },
      { x: 8, y: 48, status: "normal" },
      { x: 8, y: 62, status: "alert", message: "Camera connection lost" },
      { x: 12, y: 78, status: "normal" },
      { x: 22, y: 88, status: "normal" },
    ],
    // Floor 2
    [
      { x: 32, y: 58, status: "normal" },
      { x: 48, y: 12, status: "normal" },
      { x: 52, y: 38, status: "alert", message: "Motion detected" },
      { x: 58, y: 52, status: "normal" },
      { x: 52, y: 72, status: "normal" },
    ],
    // Floor 3
    [
      { x: 62, y: 88, status: "normal" },
      { x: 72, y: 38, status: "normal" },
      { x: 78, y: 58, status: "normal" },
      { x: 88, y: 72, status: "alert", message: "Camera offline" },
      { x: 92, y: 88, status: "normal" },
    ],
  ];

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? floorPlans.length - 1 : prev - 1));
    setZoom(1);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === floorPlans.length - 1 ? 0 : prev + 1));
    setZoom(1);
  };

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
          <span>{floorPlans[currentSlide].name}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">11:57:36 AM</span>
          <span className="bg-red-500 text-white text-[10px] font-medium px-2 py-0.5 rounded">Live</span>
        </div>
      </div>

      {/* Map Carousel */}
      <div className="relative rounded-lg overflow-hidden bg-gray-50 aspect-[4/3]">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {floorPlans.map((floor, floorIndex) => (
            <div 
              key={floor.id} 
              className="min-w-full h-full relative"
              style={{
                transform: `scale(${currentSlide === floorIndex ? zoom : 1})`,
                transition: "transform 0.3s ease-out",
              }}
            >
              <img 
                src={floor.image} 
                alt={floor.name} 
                className="w-full h-full object-contain"
              />

              {/* Camera markers for this floor */}
              {camerasByFloor[floorIndex]?.map((cam, index) => (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
                >
                  {/* Tooltip for alert cameras - shows on hover */}
                  {cam.status === "alert" && cam.message && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-lg text-xs text-gray-700 whitespace-nowrap border border-gray-200 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      {cam.message}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
                    </div>
                  )}
                  
                  {/* Pulse ring for alert cameras */}
                  {cam.status === "alert" && (
                    <div className="absolute inset-0 w-6 h-6 -m-0.5 rounded-full bg-red-500 animate-ping opacity-75" />
                  )}
                  
                  <div 
                    className={`relative w-5 h-5 rounded-full flex items-center justify-center ${
                      cam.status === "alert" 
                        ? "bg-red-500" 
                        : "bg-blue-500"
                    }`}
                  >
                    <Camera className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
          {floorPlans.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentSlide(index); setZoom(1); }}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Bottom Navigation Controls */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <button 
            onClick={handleZoomOut}
            className="w-7 h-7 bg-white rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Minus className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button 
            onClick={handleZoomIn}
            className="w-7 h-7 bg-white rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <button 
            onClick={handlePrevSlide}
            className="w-7 h-7 bg-white rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button 
            onClick={handleNextSlide}
            className="w-7 h-7 bg-white rounded border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
