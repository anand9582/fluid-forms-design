import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Unplug,
  ArrowRightLeft,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  StopCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";

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
  onBack: () => void;
}

interface MappedDevice {
  id: string;
  name: string;
  status: "Recording" | "Idle" | "Offline";
  bitrate: string;
  location: string;
}

// Generate mock devices based on unit
function generateDevices(unit: StorageUnit): MappedDevice[] {
  if (unit.devices === 0) return [];
  const statuses: MappedDevice["status"][] = ["Recording", "Recording", "Idle", "Recording", "Recording", "Recording"];
  const locations = ["Main Hall", "Perimeter", "Lobby", "Backyard", "Front Lawn", "Main Hall", "Parking Lot", "Entrance", "Server Room", "Corridor", "Roof", "Gate"];
  const devices: MappedDevice[] = [];
  for (let i = 0; i < Math.min(unit.devices * 10, 100); i++) {
    devices.push({
      id: `dev-${i}`,
      name: `Cam-A-${100 + i}`,
      status: statuses[i % statuses.length],
      bitrate: `${(Math.floor(Math.random() * 8) + 2)} Mbps`,
      location: locations[i % locations.length],
    });
  }
  return devices;
}

const StatusBadge = ({ status }: { status: MappedDevice["status"] }) => {
  if (status === "Recording") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
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
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      Offline
    </span>
  );
};

const columnHelper = createColumnHelper<MappedDevice>();

export function ManageStorageView({ unit, onBack }: ManageStorageViewProps) {
  const devices = useMemo(() => generateDevices(unit), [unit]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const columns = useMemo<ColumnDef<MappedDevice, any>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="h-4 w-4"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="h-4 w-4"
          />
        ),
        size: 40,
        enableSorting: false,
      },
      columnHelper.accessor("name", {
        header: "Device Name",
        cell: ({ getValue }) => (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-muted">
              <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">{getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      }),
      columnHelper.accessor("bitrate", {
        header: "Bitrate",
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue()}</span>
        ),
      }),
      columnHelper.accessor("location", {
        header: "Location",
        cell: ({ getValue }) => (
          <span className="text-sm text-foreground">{getValue()}</span>
        ),
      }),
      {
        id: "action",
        header: "Action",
        cell: () => (
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Move <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button className="inline-flex items-center gap-1 text-sm font-medium text-destructive hover:underline">
              Stop <StopCircle className="h-3.5 w-3.5" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: devices,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
    getRowId: (row) => row.id,
  });

  const selectedCount = Object.keys(rowSelection).length;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (pageCount <= 5) {
      for (let i = 0; i < pageCount; i++) pages.push(i);
    } else {
      pages.push(0, 1, 2);
      if (currentPage > 3) pages.push("ellipsis");
      if (currentPage > 2 && currentPage < pageCount - 3) pages.push(currentPage);
      if (currentPage < pageCount - 4) pages.push("ellipsis");
      pages.push(pageCount - 2, pageCount - 1);
    }
    // Deduplicate
    const unique: (number | "ellipsis")[] = [];
    for (const p of pages) {
      if (unique[unique.length - 1] !== p) unique.push(p);
    }
    return unique;
  };

  const isEmpty = devices.length === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-base sm:text-lg font-semibold text-foreground">
            Managing {unit.name}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{devices.length} devices</strong> mapped
          </span>
          <span className="text-border">·</span>
          <span>{unit.type}</span>
          <span className="text-border">·</span>
          <span>{unit.used} TB / {unit.total} TB used</span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-xl bg-card overflow-hidden">
        {isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
            <div className="p-3 rounded-full bg-muted mb-4">
              <Unplug className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
              No Devices Mapped
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-sm mb-6">
              This storage unit is currently idle. Pull devices from other volumes to distribute system load.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive">
                Remove Storage
              </Button>
              <Button className="gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Move Devices Here
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="border-b border-border bg-muted/30">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 sm:px-5 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground"
                          style={{ width: header.column.getSize() !== 150 ? header.column.getSize() : undefined }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "border-b border-border last:border-0 transition-colors",
                        row.getIsSelected() ? "bg-primary/5" : "hover:bg-muted/20"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 sm:px-5 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-5 py-3 border-t border-border gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing {table.getRowModel().rows.length} of {devices.length} results.</span>
                <Select
                  value={String(table.getState().pagination.pageSize)}
                  onValueChange={(val) => table.setPageSize(Number(val))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <span key={`e-${idx}`} className="px-1.5 text-muted-foreground">…</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => table.setPageIndex(page)}
                      className={cn(
                        "h-8 w-8 rounded-md text-sm font-medium transition-colors",
                        currentPage === page
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {page + 1}
                    </button>
                  )
                )}

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-6 py-3 flex items-center justify-between animate-fade-in shadow-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {selectedCount}
            </span>
            Device selected for bulk processing.
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              Move <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="destructive" className="gap-2">
              Stop Recording
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
