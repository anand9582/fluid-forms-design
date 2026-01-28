import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettingsStore } from "@/Store/SettingsStore";
import { Heading } from "@/components/ui/heading";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  Download,
  Pencil,
  Trash2,
  Eye,
  Camera,
  MonitorSpeaker,
  Router,
  Shield,
  Cpu,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";


// Device type
interface Device {
  id: number;
  name: string;
  status: "online" | "offline" | "maintenance";
  ipAddress: string;
  port: number;
  make: string;
  model: string;
  type: string;
  username: string;
  password: string;
  group: string;
}

// Mock device data
const devicesData: Device[] = [
  {
    id: 1,
    name: "Cam-A-100",
    status: "online",
    ipAddress: "192.168.1.100:80",
    port: 80,
    make: "Axis",
    model: "Model-XO",
    type: "Camera",
    username: "Admin",
    password: "********",
    group: "Main Hall",
  },
  {
    id: 2,
    name: "Cam-A-100",
    status: "maintenance",
    ipAddress: "192.168.1.101:80",
    port: 8080,
    make: "Axis",
    model: "Model-XO",
    type: "NVR",
    username: "Operator",
    password: "********",
    group: "Server Room",
  },
  {
    id: 3,
    name: "Cam-A-100",
    status: "offline",
    ipAddress: "192.168.1.102:80",
    port: 80,
    make: "Axis",
    model: "Model-XO",
    type: "Router",
    username: "Admin",
    password: "********",
    group: "Lobby",
  },
  {
    id: 4,
    name: "Cam-A-100",
    status: "online",
    ipAddress: "192.168.1.103:80",
    port: 443,
    make: "Axis",
    model: "Model-XO",
    type: "Access Control",
    username: "Admin",
    password: "********",
    group: "Front roof",
  },
  {
    id: 5,
    name: "Cam-A-100",
    status: "online",
    ipAddress: "192.168.1.104:80",
    port: 78,
    make: "Axis",
    model: "Model-XO",
    type: "IOT Center",
    username: "Operator",
    password: "********",
    group: "First floor",
  },
  // Additional devices for pagination demo
  ...Array.from({ length: 15 }, (_, i) => ({
    id: 6 + i,
    name: `Cam-B-${100 + i}`,
    status: (["online", "offline", "maintenance"] as const)[i % 3],
    ipAddress: `192.168.2.${100 + i}:80`,
    port: [80, 443, 8080][i % 3],
    make: ["Axis", "Hikvision", "Dahua"][i % 3],
    model: `Model-${["XO", "Pro", "Elite"][i % 3]}`,
    type: ["Camera", "NVR", "Router", "Access Control", "IOT Center"][i % 5],
    username: ["Admin", "Operator", "User"][i % 3],
    password: "********",
    group: ["Main Hall", "Server Room", "Lobby", "Front roof", "First floor"][i % 5],
  })),
];

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  online: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  offline: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  maintenance: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
};

const columnHelper = createColumnHelper<Device>();

export function AddDevicesPage() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
const { setActiveRoute, setActiveItem } = useSettingsStore();
  const [rowSelection, setRowSelection] = useState({});

  // Stats
  const totalDevices = devicesData.length;
  const onlineDevices = devicesData.filter((d) => d.status === "online").length;
  const offlineDevices = devicesData.filter((d) => d.status === "offline").length;
  const issueDevices = devicesData.filter((d) => d.status === "maintenance").length;
    const openAddDevicePage = () => {
      setActiveItem("add-devices"); 
    setActiveRoute("/settings/devices/adddevices");
    };

  // Columns definition
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
          />
        ),
      }),
      columnHelper.accessor("name", {
        header: ({ column }) => (
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Username
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
        cell: (info) => {
          const status = info.row.original.status;
          const statusStyle = statusStyles[status];
          return (
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Camera className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{info.getValue()}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-normal mt-1 border-0",
                    statusStyle.bg,
                    statusStyle.text
                  )}
                >
                  <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", statusStyle.dot)} />
                  {status === "maintenance" ? (
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Maintenance
                    </span>
                  ) : (
                    <span className="capitalize">{status}</span>
                  )}
                </Badge>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("ipAddress", {
        header: "IP Address",
        cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("port", {
        header: "Port",
        cell: (info) => <span className="text-primary font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("make", {
        header: "Make/ Model",
        cell: (info) => (
          <div className="text-foreground">
            {info.getValue()}
            <span className="block text-xs text-muted-foreground">{info.row.original.model}</span>
          </div>
        ),
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => (
          <span className="font-medium text-primary">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("username", {
        header: "Username",
        cell: (info) => <span className="text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.accessor("password", {
        header: "Password",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{info.getValue()}</span>
            <Eye className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground" />
          </div>
        ),
      }),
      columnHelper.accessor("group", {
        header: "Group",
        cell: (info) => <span className="text-foreground">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  // Filtered data
  const filteredData = useMemo(() => {
    let data = devicesData;
    if (typeFilter !== "all") {
      data = data.filter((device) => device.type === typeFilter);
    }
    if (statusFilter !== "all") {
      data = data.filter((device) => device.status === statusFilter);
    }
    return data;
  }, [typeFilter, statusFilter]);

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const deviceTypes = [...new Set(devicesData.map((d) => d.type))];

  return (
    <div className="animate-fade-in flex-1 flex flex-col overflow-hidden pl-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading weight="medium" className="text-fontSize20px">Added Devices</Heading>
          <p className="font-roboto font-normal text-sm text-muted-foreground mt-1">
            Manage connected hardware, status, and system configuration.
          </p>
        </div>
        <Button  className="gap-2" onClick={openAddDevicePage}>
          <Plus className="h-4 w-4" />
          Add Device
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <Cpu className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{totalDevices}</p>
            <p className="text-sm text-muted-foreground">Total Devices</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-50">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{onlineDevices}</p>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-50">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{offlineDevices}</p>
            <p className="text-sm text-muted-foreground">Offline</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-foreground">{issueDevices}</p>
            <p className="text-sm text-muted-foreground">Issues</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, IP or model..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] h-10 bg-card border-border">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Type: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Type: All</SelectItem>
                {deviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10 bg-card border-border">
                <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status: All</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50 border-b border-border">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-sm font-medium text-muted-foreground h-12">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Showing {table.getRowModel().rows.length} of {totalRows} results.
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            {pageCount > 0 && (
              <>
                {[1, 2, 3].filter((p) => p <= pageCount).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => table.setPageIndex(page - 1)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}

                {pageCount > 5 && <span className="px-2 text-muted-foreground">...</span>}

                {pageCount > 3 &&
                  [pageCount - 1, pageCount]
                    .filter((p) => p > 3)
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        size="sm"
                        onClick={() => table.setPageIndex(page - 1)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {Object.keys(rowSelection).length > 0 && (
        <div className=" bottom-0 left-0 right-0 bg-slate-800 text-white px-6 py-3 flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              {Object.keys(rowSelection).length}
            </span>
            <span className="text-sm">Device selected for bulk processing</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="sm" className="bg-slate-700 hover:bg-slate-600 text-white border-0">
              Reboot Selected
            </Button>
            <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-slate-800 border-0">
              Assign to Group
            </Button>
            <Button variant="destructive" size="sm">
              Delete Selected
            </Button> 
          </div>
        </div>
      )}

    </div>
  );
}
