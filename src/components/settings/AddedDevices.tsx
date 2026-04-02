import { useState, useMemo, useEffect } from "react";
import axios from "axios";
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
import { DynamicFilterDrawer } from "@/components/ui/dynamic-filter-drawer";
import { DeviceFilterContent } from "@/components/settings/Added-Devices/DeviceFilterContent";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus, Search, Filter, Download, Trash2, Eye, Camera,
  ArrowUpDown, AlertCircle, CheckCircle2, XCircle, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TotalDeviceIcons } from "@/components/Icons/Svg/AddedDevicesIcons";
import { API_BASE_URL2, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { useNavigate } from "react-router-dom";

interface Device {
  id: number;
  name: string;
  ipAddress: string;
  username: string;
  password: string;
  make: string;
  model: string;
  status: "online" | "offline" | "maintenance";
  type: string;
  group: string;
  authType: string;
}

const statusStyles: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  online: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  offline: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", border: "border-red-200" },
  maintenance: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
};

const columnHelper = createColumnHelper<Device>();
export function AddDevicesPage() {
  const [devicesData, setDevicesData] = useState<Device[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const { setActiveRoute, setActiveItem } = useSettingsStore();
  const navigate = useNavigate();

  // Fetch devices from API
  useEffect(() => {
    axios.get(`${API_BASE_URL2}${API_URLS.GetAllDevice}`, {
    })
      .then((res) => {
        if (res.data.success && res.data.data) {
          const mappedData = res.data.data.map((d: any, i: number) => ({
            id: d.id,
            name: d.name,
            ipAddress: d.ipAddress,
            username: d.username,
            password: d.password,
            make: d.make,
            model: d.model,
            status: ["online", "offline", "maintenance"][i % 3],
            type: d.model,
            group: "Default",
            authType: d.authType,
          }));
          setDevicesData(mappedData);
        }
      })
      .catch((err) => console.error("Error fetching devices:", err));
  }, []);

  const deleteDevice = async (deviceId: number) => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;

    try {
      const res = await axios.delete(`${API_BASE_URL2}${API_URLS.DeleteDeviceById}/${deviceId}`, {
        headers: getAuthHeaders(),
      });

      if ((res.status >= 200 && res.status < 300) || res.data?.success) {
        // Remove device from table state instantly
        setDevicesData((prev) => prev.filter((d) => d.id !== deviceId));
        // Clear any selection that might include this device
        setRowSelection({});
        console.log("Device deleted successfully");
      } else {
        console.error("Failed to delete device:", res?.data?.message || "Unknown error");
      }
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    if (!window.confirm(`Are you sure you want to delete ${selectedRows.length} selected devices?`)) return;

    const idsToDelete = selectedRows.map((row) => row.original.id);
    let successCount = 0;

    try {
      const deletePromises = idsToDelete.map(id =>
        axios.delete(`${API_BASE_URL2}${API_URLS.DeleteDeviceById}/${id}`, {
          headers: getAuthHeaders(),
        })
      );

      const results = await Promise.allSettled(deletePromises);
      const successfulIds = new Set<number>();

      results.forEach((res, index) => {
        if (res.status === 'fulfilled' && ((res.value.status >= 200 && res.value.status < 300) || res.value.data?.success)) {
          successfulIds.add(idsToDelete[index]);
          successCount++;
        }
      });

      if (successCount > 0) {
        setDevicesData((prev) => prev.filter((d) => !successfulIds.has(d.id)));
        setRowSelection({});
        console.log(`Successfully deleted ${successCount} devices`);
      } else {
        console.error("Failed to delete any selected devices");
      }
    } catch (err) {
      console.error("Error bulk deleting devices:", err);
    }
  };



  // Stats
  const totalDevices = devicesData.length;
  const onlineDevices = devicesData.filter((d) => d.status === "online").length;
  const offlineDevices = devicesData.filter((d) => d.status === "offline").length;
  const issueDevices = devicesData.filter((d) => d.status === "maintenance").length;

  const openAddDevicePage = () => {
    setActiveItem("add-devices");
    navigate("/settings/devices/adddevices");
  };

  const applyFilters = () => {
    console.log("Apply filters");
    setFilterOpen(false);
  };

  const resetFilters = () => {
    console.log("Reset filters");
  };

  const exportToCSV = () => {
    if (!devicesData.length) return;

    // Define CSV headers
    const headers = ["Name", "IP Address", "Make", "Model", "Username", "Password", "Status", "Type", "Group"];

    // Map device data to CSV rows
    const rows = devicesData.map(d => [
      d.name,
      d.ipAddress,
      d.make,
      d.model,
      d.username,
      d.password,
      d.status,
      d.type,
      d.group
    ]);

    // Combine headers and rows
    const csvContent =
      [headers, ...rows]
        .map(e => e.map(a => `"${a}"`).join(",")) // quote every cell
        .join("\n");

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "devices_export.csv");
    link.click();
  };

  function PasswordCell({ password }: { password: string }) {
    const [show, setShow] = useState(false);
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{show ? password : "••••••••"}</span>
        <Eye
          className="h-4 w-4 cursor-pointer text-gray-600"
          onClick={() => setShow(!show)}
        />
      </div>
    );
  }



  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            className="h-4 w-4 rounded border border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            className="h-4 w-4 rounded border border-muted-foreground/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
            Device Name
            <ArrowUpDown className="h-3 w-3" />
          </div>
        ),
        cell: (info) => {
          const status = info.row.original.status;
          const statusStyle = statusStyles[status];

          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer max-w-[180px]">
                  <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-gray-200">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="w-1/3">
                    <p className="text-md font-medium text-foreground max-w-[180px]">{info.getValue()}</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white text-xs p-2 rounded shadow-md">
                <div>Status: <span className="capitalize">{status}</span></div>
                <div>IP: {info.row.original.ipAddress}</div>
                <div>Type: {info.row.original.type}</div>
              </TooltipContent>
            </Tooltip>
          );
        },
      }),
      columnHelper.accessor("ipAddress", { header: "IP Address", cell: (info) => <span>{info.getValue()}</span> }),
      columnHelper.accessor("make", {
        header: "Make/Model",
        cell: (info) => (
          <div>
            <div className="font-roboto font-medium mb-1">{info.getValue()}</div>
            <div>{info.row.original.model}</div>
          </div>
        ),
      }),
      columnHelper.accessor("username", {
        header: "Username", cell: (info) =>
          <div >
            {info.getValue()}
          </div>
      }),
      columnHelper.accessor("password", {
        header: "Password",
        cell: (info) => <PasswordCell password={info.getValue()} />,
      }),
      columnHelper.accessor("authType", {
        header: "Auth Type",
        cell: (info) => {
          const value = info.getValue();

          return (
            <div className="text-sm font-medium text-foreground">
              {formatLabel(value)}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-center gap-1">
            {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                <EditIcons className="h-4 w-4" />
              </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-destructive"
              onClick={() => deleteDevice(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: devicesData,
    columns,
    state: { globalFilter, sorting, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    initialState: { pagination: { pageSize: 5 } },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const formatLabel = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

  return (
    <>
      <div className="animate-fade-in flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <div>
            <Heading weight="medium" className="text-fontSize20px text-black">Added Devices</Heading>
            <p className="font-roboto font-normal text-sm text-muted-foreground">
              Manage connected hardware, status, and system configuration.
            </p>
          </div>
          <Button className="gap-2" onClick={openAddDevicePage}>
            <Plus className="h-4 w-4" /> Add Device
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-card shadow-added rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/5">
              <TotalDeviceIcons className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-foreground">{totalDevices}</p>
              <p className="text-sm font-roboto font-medium">Total Devices</p>
            </div>
          </div>
          <div className="bg-card shadow-added rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-50">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-foreground">{onlineDevices}</p>
              <p className="text-sm font-roboto font-medium">Online</p>
            </div>
          </div>
          <div className="bg-card shadow-added rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-50">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-foreground">{offlineDevices}</p>
              <p className="text-sm font-roboto font-medium">Offline</p>
            </div>
          </div>
          <div className="bg-card shadow-added rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-amber-50">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-foreground">{issueDevices}</p>
              <p className="text-sm font-roboto font-medium">Issues</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-card shadow-sm rounded-b-none rounded-md border border-b-0 p-4 ">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, IP or model..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-3/4 shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 shadow-md bg-transparent px-2.5" onClick={() => setFilterOpen(true)}>
                <Filter />
              </Button>
              <Button variant="outline" className="gap-2" onClick={exportToCSV}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-xl rounded-t-none overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent bg-[#F1F5F9]">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-textpar font-roboto font-medium text-xs sm:text-sm whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id} className="py-4 ">
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
              <Button variant="ghost" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="gap-1">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {[...Array(pageCount)].map((_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;
                return (
                  <Button key={page} variant="ghost" size="sm" onClick={() => table.setPageIndex(page - 1)}
                    className={cn("w-8 h-8 p-0", isActive && "border border-gray shadow-sm bg-transparent text-black font-medium")}>
                    {page}
                  </Button>
                );
              })}
              <Button variant="ghost" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>


        </div>

        {/* Bulk Action Bar */}
        {Object.keys(rowSelection).length > 0 && (
          <div className="bottom-0 left-0 right-0 bg-bgprimarylight rounded-md mt-4 text-white px-6 py-3 flex items-center justify-between z-50">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                {Object.keys(rowSelection).length}
              </span>
              <span className="text-sm font-roboto font-medium text-gray-600">Device selected for bulk processing</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-100 text-slate-800 border shadow-sm">
                Assign to Group
              </Button>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                Remove Selected
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters Drawer */}
      <DynamicFilterDrawer open={filterOpen} onOpenChange={setFilterOpen} title="Advanced Filters" onApply={applyFilters} onReset={resetFilters} width="w-[460px]">
        <DeviceFilterContent />
      </DynamicFilterDrawer>
    </>
  );
}
