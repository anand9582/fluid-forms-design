import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DynamicTable } from "@/components/ui/dynamic-table";
import { ConfirmDialog } from "@/components/Dialogs/ConfirmDialog";
import { MoveDeviceDialogContent } from "@/components/settings/Storage/DialogStorage/MoveDeviceContent"
import { ForceStopRecordingDialog } from "@/components/settings/Storage/DialogStorage/ForceStopRecordingDialog"
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  AlertTriangle,
  StopCircle,
} from "lucide-react";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/* ===================== TYPES ===================== */

interface StorageUnit {
  id: string;
  name: string;
  type: string;
  devices: number;
  used: number;
  total: number;
}

interface ManageStorageViewProps {
  unit: StorageUnit;
}

interface MappedDevice {
  id: string;
  name: string;
  status: "Recording" | "Idle" | "Offline";
  bitrate: string;
  location: string;
}

/* ===================== MOCK DATA ===================== */

function generateDevices(unit: StorageUnit): MappedDevice[] {
  if (unit.devices === 0) return [];

  const statuses: MappedDevice["status"][] = [
    "Recording",
    "Recording",
    "Idle",
    "Offline",
  ];

  const locations = [
    "Main Hall",
    "Lobby",
    "Parking",
    "Entrance",
    "Server Room",
    "Roof",
  ];

  return Array.from({ length: Math.min(unit.devices * 10, 100) }).map(
    (_, i) => ({
      id: `dev-${i}`,
      name: `Cam-A -${100 + i}`,
      status: statuses[i % statuses.length],
      bitrate: `${Math.floor(Math.random() * 8 + 2)} Mbps`,
      location: locations[i % locations.length],
    })
  );
}

/* ===================== STATUS BADGE ===================== */

const StatusBadge = ({ status }: { status: MappedDevice["status"] }) => {
  if (status === "Recording") {
    return (
      <span className="inline-flex items-center font-roboto font-medium gap-1.5 text-sm text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        Recording
      </span>
    );
  }

  if (status === "Idle") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-yellow-600">
        <AlertTriangle className="h-4 w-4" />
        Idle
      </span>
    );
  }

  return <span className="text-sm text-muted-foreground">Offline</span>;
};

/* ===================== MAIN COMPONENT ===================== */
export function ManageStorageView({ unit}: ManageStorageViewProps) {
  const devices = useMemo(() => generateDevices(unit), [unit]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
   const [moveDeviceName, setMoveDeviceName] = useState("");
   const [moveOption, setMoveOption] = useState("move-everything");
    const [moveDestination, setMoveDestination] = useState("");
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<MappedDevice | null>(null);
    const [stopDialogOpen, setStopDialogOpen] = useState(false);
    const [stopDevice, setStopDevice] = useState<MappedDevice | null>(null);

   const handleMoveClick = (device: MappedDevice, destination: string) => {
      setSelectedDevice(device);      
      setMoveDeviceName(device.name);  
      setMoveDestination(destination);
      setMoveOption("move-everything");
      setConfirmDialogOpen(true);  
    };
const handleStopClick = (device: MappedDevice) => {
  setStopDevice(device);
  setStopDialogOpen(true);
};

  const columns = useMemo<ColumnDef<MappedDevice>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          variant="soft"
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          variant="soft"
          onCheckedChange={(v) => row.toggleSelected(!!v)}
        />
      ),
      size:40,
      minSize:40,
      maxSize: 40,
    },
    {
      accessorKey: "name",
      header: "Device Name",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2 truncate">
          <div className="flex items-center gap-3 cursor-pointer max-w-[180px] truncate">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-gray-200">
              <Camera className="h-4 w-4 text-gray-600" />
            </div>
            <div className="truncate">
              <p className="text-md font-medium text-foreground truncate">
                {getValue() as string}
              </p>
            </div>
          </div>
        </div>
      ),
      size: 216,
      minSize: 216,
      maxSize: 216,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <StatusBadge status={getValue() as MappedDevice["status"]} />
      ),
      size: 100,
      minSize: 224,
      maxSize: 224,
    },
    {
      accessorKey: "bitrate",
      header: "Bitrate",
      size: 190,
      minSize: 190,
      maxSize: 190,
    },
    {
      accessorKey: "location",
      header: "Location",
      size: 120,
      minSize: 120,
      maxSize: 120,
    },
    {
      id: "action",
      header: () => (
        <div >Action</div> 
      ),
    cell: ({ row }) => {
  const device = row.original;
    return (
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Move <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-52 p-1.5">
            <p className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">Move to...</p>
            <button
               onClick={() => handleMoveClick(device, "Primary NAS Cluster")}
              className="w-full text-left px-2.5 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              Primary NAS Cluster
            </button>
            <button
              className="w-full text-left px-2.5 py-2 text-sm rounded-md hover:bg-muted transition-colors"
            >
              Cloud Archive Tier
            </button>
          </PopoverContent>
        </Popover>

        <button
          onClick={() => handleStopClick(device)}
          className="inline-flex items-center gap-1 text-sm font-medium text-destructive hover:underline"
        >
          Stop <StopCircle className="h-3.5 w-3.5" />
        </button>

      </div>
    );
  },
      size: 120,
      minSize: 100,
      maxSize: 150,
    },
  ], []);

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Managing {unit.name}</h2>
          <p className="text-sm text-muted-foreground">
            {devices.length} devices · {unit.type} · {unit.used}/{unit.total} TB
          </p>
        </div>
      </div>

      {/* Table */}
      <DynamicTable<MappedDevice>
        data={devices}
        columns={columns}
        showSearch={false}
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pageSize={10}
        pageSizeOptions={[10, 20, 50]}
        headerBgClass="bg-slate-100 dark:bg-slate-800"
        tableClassName="min-w-full table-fixed"
        emptyMessage="No devices mapped to this storage unit."
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={
          selectedDevice
            ? `Move device: ${selectedDevice.name}`
            : "Confirm Action"
        }
        description="Choose how to handle this device."
        confirmLabel="Move"
        size="lg"
        onConfirm={() => {
          console.log({
            deviceId: selectedDevice?.id,
            destination: moveDestination,
            option: moveOption,
          });

          setConfirmDialogOpen(false);
        }}
      >
        <MoveDeviceDialogContent
          value={moveOption}
          onChange={setMoveOption}
        />
  </ConfirmDialog>

      <ForceStopRecordingDialog
        open={stopDialogOpen}
        onOpenChange={setStopDialogOpen}
        deviceName={stopDevice?.name ?? ""}
        fullWidthActions={true} 
            onConfirm={() => {
              console.log("Force stop recording API call");
              setStopDialogOpen(false);
            }}
          />

     {/* Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className=" bottom-0 left-0 right-0 rounded-md z-50 bg-slate-200 border-t border-border px-6 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 text-sm font-roboto font-medium text-gray-600">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {selectedCount}
            </span>
             Device selected for bulk processing.
          </div>
          <div className="flex items-center gap-3">
           
           {/* Stop Recording button */}
            <Button
              variant="destructive"
              className="bg-red-50 font-roboto font-medium text-red-500 hover:bg-red-200 gap-2"
            >
              <StopCircle className="h-3.5 w-3.5" />
              Stop Recording
            </Button>
             <Button
              variant="outline"
              className="bg-blue-600 text-white font-roboto font-medium hover:bg-blue-600 hover:text-white border-blue-600 gap-2"
            >
              Move <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
