// sampleStorageData.ts
import { StorageItem } from "./StorageVolumes";

export const storageData: StorageItem[] = [
  { id: "c1", name: "CAMPulse Cloud", percentage: 54 },
  { id: "n1", name: "NAS-01 (Pri)", percentage: 90 },
  {
    id: "n2",
    name: "NAS-02 (Pri)",
    percentage: 54,
    children: [
      { id: "n2-b1", name: "Bay 1 (HDD)", percentage: 53, total: "32/60TB" },
      { id: "n2-b2", name: "Bay 2 (HDD)", percentage: 53, total: "32/60TB" },
    ],
  },
  { id: "l1", name: "Local HDD Array", percentage: 95 },
];
