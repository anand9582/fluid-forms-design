import React, { createContext, useEffect, useState, ReactNode } from "react";
import { API_URLS } from "@/components/Config/api";

export interface CameraDevice {
  id: string;
  name: string;
  location: string;
  groupName: string;
  streams?: any[];
}

export interface CameraContextType {
  groupedDevices: Record<string, CameraDevice[]>;
  reloadDevices: () => Promise<void>;
  addDevice: (device: CameraDevice) => void;
  removeDevice: (cameraId: string, groupName: string) => void;
  isLoading: boolean;
}

export const CameraContext = createContext<CameraContextType>({
  groupedDevices: {},
  reloadDevices: async () => {},
  addDevice: () => {},
  removeDevice: () => {},
  isLoading: false,
});

export const CameraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groupedDevices, setGroupedDevices] = useState<Record<string, CameraDevice[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const groupDevices = (devices: CameraDevice[]) => {
    return devices.reduce((acc, device) => {
      const group = device.groupName || "Default";
      if (!acc[group]) acc[group] = [];
      acc[group].push(device);
      return acc;
    }, {} as Record<string, CameraDevice[]>);
  };

  const reloadDevices = async () => {
    setIsLoading(true);
    try {
       const res = await fetch(`http://192.168.10.190:8081${API_URLS.get_all_devices}`);
      const json = await res.json();
      if (json.data) {
        setGroupedDevices(groupDevices(json.data));
      }
    } catch (err) {
      console.error("Failed to load devices:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addDevice = (device: CameraDevice) => {
    setGroupedDevices((prev) => {
      const newState = { ...prev };
      const group = device.groupName || "Default";
      if (!newState[group]) newState[group] = [];
      newState[group].push(device);
      return newState;
    });
  };

  const removeDevice = (cameraId: string, groupName: string) => {
    setGroupedDevices((prev) => {
      const newState = { ...prev };
      if (newState[groupName]) {
        newState[groupName] = newState[groupName].filter((d) => d.id !== cameraId);
      }
      return newState;
    });
  };

  useEffect(() => {
    reloadDevices();
  }, []);

  return (
    <CameraContext.Provider value={{ groupedDevices, reloadDevices, addDevice, removeDevice, isLoading }}>
      {children}
    </CameraContext.Provider>
  );
};
