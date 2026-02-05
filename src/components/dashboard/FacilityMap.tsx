import { useState } from "react";
import { ExternalLink, ChevronDown, Camera,ChevronLeft, ChevronRight,ZoomOut,ZoomIn  } from "lucide-react";
import facilityFloorPlan from "@/assets/img/facility-floor-plan.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Plus,
  Minus,
} from "@/components/ui/icons";

export function FacilityMap() {
  const [zoom, setZoom] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Multiple floor plans
  const floorPlans = [
    { id: 1, name: "All Location", image: facilityFloorPlan },
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
      <Card className=" border-border/80 shadow-none"  style={{ animationDelay: "0.35s" }}>
          
           <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary pt-4 rounded-t border-b pb-4">
              <CardTitle className="text-fontSize14px font-roboto font-semibold uppercase tracking-wide text-textgray">
                FACILITY MAP
              </CardTitle>
                <button className="text-gray-600 hover:text-gray-600  transition-colors pt-0">
                    <ExternalLink className="w-4 h-4" />
                </button>
           </CardHeader>

          {/* Controls */}
        

           

          {/* Map Carousel */}
          <div className="relative rounded-lg overflow-hidden bg-gray-50">
 <div className="flex items-center justify-between mb-3 absolute z-20 p-4 w-full">
           <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="
      flex items-center justify-between
      bg-white shadow-md border border-gray-200
      px-4 py-2 rounded-md
      text-sm font-medium text-gray-700
      hover:bg-gray-50 transition
      w-40
    ">
      {floorPlans[currentSlide].name}
      <ChevronDown className="w-3 h-3 ml-2" />
    </button>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="w-40 bg-white border border-gray-200">
    {floorPlans.map((floor, index) => (
      <DropdownMenuItem
        key={floor.id}
        onSelect={() => {
          setCurrentSlide(index);
          setZoom(1);
        }}
      >
        {floor.name}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>

          <div className="flex items-center gap-2 text-xs">
              <span className="text-white">11:57:36 AM</span>
              <span className="bg-red-500 text-white text-[12px] font-medium px-2 py-1 rounded-sm">Live</span>
          </div>  

 </div>

            {/* Slides Container */}
            <div 
              className="flex transition-transform duration-500 ease-out   rounded"
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
                  className="w-full h-full object-contain rounded-xl p-2"
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
                   {/* Bottom Navigation Controls */}
              
              </div>
                
              ))}
              
            </div>
<div className="absolute bottom-3 left-3 flex items-center gap-1">
                <button 
                  onClick={handleZoomOut}
                  className="w-7 h-7 bg-[#171717] border-1 rounded border border-gray-200 flex items-center justify-center hover:bg-gray-500 transition-colors shadow-sm"
                >
                  <ZoomOut className="w-4 h-4 text-white" />
                </button>
                <button 
                  onClick={handleZoomIn}
                  className="w-7 h-7 bg-[#171717] rounded border border-gray-200 flex items-center justify-center hover:bg-gray-500 transition-colors shadow-sm"
                >
                  <ZoomIn   className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1">
                <button 
                  onClick={handlePrevSlide}
                  className="w-7 h-7 bg-[#171717] rounded border border-gray-200 flex items-center justify-center hover:bg-gray-500 transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
                <button 
                  onClick={handleNextSlide}
                  className="w-7 h-7 bg-[#171717] rounded border border-gray-200 flex items-center justify-center hover:bg-gray-500 transition-colors shadow-sm"
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            {/* Slide Indicators */}
            {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5">
              {floorPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentSlide(index); setZoom(1); }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentSlide === index ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div> */}

           

            
          </div>
      </Card>
  );
}
