import { storageUnitsMock } from "@/components/settings/Storage/StorageVolume/StorageUnits";

export async function getStorageUnits() {
  // Future:
  // return axios.get("/api/storage").then(res => res.data);

  return Promise.resolve(storageUnitsMock);
}
