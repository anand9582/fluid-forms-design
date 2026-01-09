import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";  
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

// Types
interface AuditLog {
  id: string;
  timestamp: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  action: string;
  target: string;
  ipAddress: string;
  result: "Success" | "Failed";
}

// Sample data
const auditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2023-10-25 14:32:01",
    user: { name: "Kate Russell", email: "kate.russell@campulse.com" },
    action: "Login",
    target: "System",
    ipAddress: "192.168.1.45",
    result: "Success",
  },
  {
    id: "2",
    timestamp: "2023-10-25 14:35:12",
    user: { name: "James Wilson", email: "j.wilson@campulse.com" },
    action: "PTZ Control",
    target: "1 hr ago",
    ipAddress: "192.168.1.22",
    result: "Failed",
  },
  {
    id: "3",
    timestamp: "2023-10-25 14:40:00",
    user: { name: "Elena Rodriguez", email: "elena.r@campulse.com" },
    action: "Export Video",
    target: "Cam-04 Lobby",
    ipAddress: "10.0.0.15",
    result: "Success",
  },
  {
    id: "4",
    timestamp: "2023-10-25 15:10:22",
    user: { name: "Marcus Chen", email: "m.chen@campulse.com" },
    action: "User Update",
    target: "Cam-02 Parking",
    ipAddress: "192.168.1.45",
    result: "Failed",
  },
  {
    id: "5",
    timestamp: "2023-10-25 15:15:05",
    user: { name: "Sarah Miller", email: "s.miller@campulse.com" },
    action: "Auto Backup",
    target: "Database",
    ipAddress: "192.168.2.10",
    result: "Success",
  },
  {
    id: "6",
    timestamp: "2023-10-25 15:20:33",
    user: { name: "David Park", email: "d.park@campulse.com" },
    action: "Login",
    target: "System",
    ipAddress: "192.168.1.88",
    result: "Success",
  },
  {
    id: "7",
    timestamp: "2023-10-25 15:25:18",
    user: { name: "Anna White", email: "a.white@campulse.com" },
    action: "Settings Change",
    target: "Network Config",
    ipAddress: "192.168.1.12",
    result: "Success",
  },
  {
    id: "8",
    timestamp: "2023-10-25 15:30:45",
    user: { name: "Michael Brown", email: "m.brown@campulse.com" },
    action: "PTZ Control",
    target: "Cam-01 Entrance",
    ipAddress: "10.0.0.22",
    result: "Success",
  },
  {
    id: "9",
    timestamp: "2023-10-25 15:35:22",
    user: { name: "Lisa Johnson", email: "l.johnson@campulse.com" },
    action: "Export Video",
    target: "Cam-05 Storage",
    ipAddress: "192.168.1.67",
    result: "Failed",
  },
  {
    id: "10",
    timestamp: "2023-10-25 15:40:11",
    user: { name: "Robert Davis", email: "r.davis@campulse.com" },
    action: "Login",
    target: "System",
    ipAddress: "192.168.1.99",
    result: "Success",
  },
  {
    id: "11",
    timestamp: "2023-10-25 15:45:30",
    user: { name: "Kate Russell", email: "kate.russell@campulse.com" },
    action: "User Create",
    target: "Admin Panel",
    ipAddress: "192.168.1.45",
    result: "Success",
  },
  {
    id: "12",
    timestamp: "2023-10-25 15:50:15",
    user: { name: "James Wilson", email: "j.wilson@campulse.com" },
    action: "Logout",
    target: "System",
    ipAddress: "192.168.1.22",
    result: "Success",
  },
  {
    id: "13",
    timestamp: "2023-10-25 15:55:42",
    user: { name: "Elena Rodriguez", email: "elena.r@campulse.com" },
    action: "View Recording",
    target: "Cam-03 Office",
    ipAddress: "10.0.0.15",
    result: "Success",
  },
  {
    id: "14",
    timestamp: "2023-10-25 16:00:08",
    user: { name: "Marcus Chen", email: "m.chen@campulse.com" },
    action: "Delete User",
    target: "Admin Panel",
    ipAddress: "192.168.1.45",
    result: "Failed",
  },
  {
    id: "15",
    timestamp: "2023-10-25 16:05:55",
    user: { name: "Sarah Miller", email: "s.miller@campulse.com" },
    action: "Backup Complete",
    target: "Database",
    ipAddress: "192.168.2.10",
    result: "Success",
  },
  {
    id: "16",
    timestamp: "2023-10-25 16:10:22",
    user: { name: "David Park", email: "d.park@campulse.com" },
    action: "PTZ Control",
    target: "Cam-06 Garage",
    ipAddress: "192.168.1.88",
    result: "Success",
  },
  {
    id: "17",
    timestamp: "2023-10-25 16:15:33",
    user: { name: "Anna White", email: "a.white@campulse.com" },
    action: "Login",
    target: "System",
    ipAddress: "192.168.1.12",
    result: "Success",
  },
  {
    id: "18",
    timestamp: "2023-10-25 16:20:18",
    user: { name: "Michael Brown", email: "m.brown@campulse.com" },
    action: "Export Video",
    target: "Cam-02 Parking",
    ipAddress: "10.0.0.22",
    result: "Success",
  },
  {
    id: "19",
    timestamp: "2023-10-25 16:25:45",
    user: { name: "Lisa Johnson", email: "l.johnson@campulse.com" },
    action: "Settings Change",
    target: "Alert Rules",
    ipAddress: "192.168.1.67",
    result: "Success",
  },
  {
    id: "20",
    timestamp: "2023-10-25 16:30:00",
    user: { name: "Robert Davis", email: "r.davis@campulse.com" },
    action: "Auto Backup",
    target: "Database",
    ipAddress: "192.168.1.99",
    result: "Success",
  },
];

const columnHelper = createColumnHelper<AuditLog>();

const columns = [
  columnHelper.accessor("timestamp", {
    header: "Timestamp",
    cell: (info) => {
      const [date, time] = info.getValue().split(" ");
      return (
        <div className="text-sm">
          <span className="text-foreground">{date}</span>{" "}
          <span className="text-muted-foreground">{time}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("user", {
    header: "User",
    cell: (info) => {
      const user = info.getValue();
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs bg-muted">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-foreground">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("action", {
    header: "Action",
    cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("target", {
    header: "Target",
    cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("ipAddress", {
    header: "IP Address",
    cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("result", {
    header: "Result",
    cell: (info) => {
      const result = info.getValue();
      return (
        <Badge
          variant="outline"
          className={
            result === "Success"
              ? "border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400"
          }
        >
          {result}
        </Badge>
      );
    },
  }),
];

export default function AuditLogsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("7days");

  const table = useReactTable({
    data: auditLogs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", pageCount - 1, pageCount);
      } else if (currentPage >= pageCount - 2) {
        pages.push(1, 2, "...", pageCount - 2, pageCount - 1, pageCount);
      } else {
        pages.push(1, 2, 3, "...", pageCount - 1, pageCount);
      }
    }
    return pages;
  };

  return (
    <div className="py-3 border bg-white rounded-lg">
      {/* Filters */}
      <div className="flex items-center justify-between gap-4 mb-6 px-4 gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user, action, time..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-muted/50 border-border h-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-[140px] h-10 bg-background border-border">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Event Type</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="ptz">PTZ Control</SelectItem>
              <SelectItem value="export">Export Video</SelectItem>
              <SelectItem value="backup">Backup</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
            <SelectTrigger className="w-[140px] h-10 bg-background border-border">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-10 gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border  overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-11"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
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
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Showing {table.getRowModel().rows.length} of {auditLogs.length} results.</span>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8 bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "outline" : "ghost"}
                size="sm"
                onClick={() => table.setPageIndex(Number(page) - 1)}
                className={`h-8 w-8 p-0 ${
                  currentPage === page
                    ? "border-border bg-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 text-muted-foreground hover:text-foreground"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
