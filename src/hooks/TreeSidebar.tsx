import { useState } from "react";
import { CameraTreeData } from "@/components/LiveView/CameraTreeTypes";

export function useCameraTree(data: CameraTreeData) {
  const [expandedBuildings, setExpandedBuildings] = useState<string[]>([]);
  const [expandedFloors, setExpandedFloors] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleBuilding = (building: string) => {
    setExpandedBuildings(prev =>
      prev.includes(building) ? prev.filter(b => b !== building) : [...prev, building]
    );
  };

  const toggleFloor = (floor: string) => {
    setExpandedFloors(prev =>
      prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor]
    );
  };

  const filteredData = (): CameraTreeData => {
    if (!searchTerm) return data;

    const filteredBuildings = data.buildings.map(building => {
      const filteredFloors = building.floors?.map(floor => ({
        ...floor,
        cameras: floor.cameras.filter(c =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(floor => floor.cameras.length > 0);

      const filteredBuildingCameras = building.cameras?.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if ((filteredFloors && filteredFloors.length > 0) || (filteredBuildingCameras && filteredBuildingCameras.length > 0)) {
        return {
          ...building,
          floors: filteredFloors,
          cameras: filteredBuildingCameras
        };
      }

      return null;
    }).filter(b => b !== null) as typeof data.buildings;

    return { ...data, buildings: filteredBuildings };
  };

  return {
    expandedBuildings,
    expandedFloors,
    toggleBuilding,
    toggleFloor,
    searchTerm,
    setSearchTerm,
    filteredData: filteredData(),
  };
}
