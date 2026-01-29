import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
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

import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================= TYPES ================= */

type AuditLog = {
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
};

/* ================= DATA ================= */

const auditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2023-10-25 14:32:01",
    user: { name: "Kate Russell DD", email: "kate.russell@campulse.com" },
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
    target: "Cam-01 Entrance",
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
];

/* ================= COLUMNS ================= */

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
  const [date, time] = row.original.timestamp.split(" ");

  return (
    <div className="text-sm">
      <span className="text-black font-medium">{date}</span>{" "}
      <span className="text-muted-foreground">{time}</span>
    </div>
  );
},

  },
  {
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.user.avatar} />
          <AvatarFallback>
            {row.original.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.original.user.name}</div>
          <div className="text-xs text-muted-foreground">
            {row.original.user.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.target}
      </span>
    ),
  },
  {
    accessorKey: "ipAddress",
    header: "IP Address",
  },
  {
    accessorKey: "result",
    header: "Result",
    cell: ({ row }) => (
      <Badge
        className={cn(
          "rounded-full px-3",
          row.original.result === "Success"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        )}
      >
        {row.original.result}
      </Badge>
    ),
  },
];


/* ================= COMPONENT ================= */

export default function AuditLogsTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const events = useMemo(
    () => [...new Set(auditLogs.map((log) => log.action))],
    []
  );

  const filteredData = useMemo(() => {
    return auditLogs.filter((log) => {
      const eventMatch =
        eventFilter === "all" || log.action === eventFilter;
      const resultMatch =
        resultFilter === "all" || log.result === resultFilter;

      return eventMatch && resultMatch;
    });
  }, [eventFilter, resultFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  });

  return (
    <div className="rounded-lg border bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search user, action, time..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

    <div className="flex items-center gap-2">
      {/* Event Type */}
      <Select value={eventFilter} onValueChange={setEventFilter}>
        <SelectTrigger
          className="
            w-[150px]
            bg-transparent
            border-border
            shadow-none
            hover:bg-muted/10
            focus:bg-transparent
          "
        >
          <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {events.map((e) => (
            <SelectItem key={e} value={e}>
              {e}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Result / Date */}
      <Select value={resultFilter} onValueChange={setResultFilter}>
        <SelectTrigger
          className="
            w-[150px]
            bg-transparent
            border-border
            shadow-none
            hover:bg-muted/10
            focus:bg-transparent
          "
        >
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <SelectValue placeholder="Last 7 Days" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Last 7 Days</SelectItem>
          <SelectItem value="Success">Success</SelectItem>
          <SelectItem value="Failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/* Export */}
      <Button
        variant="outline"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>

      </div>

      {/* Table */}
      <Table>
<TableHeader>
  {table.getHeaderGroups().map((hg) => (
    <TableRow
      key={hg.id}
      className="border-b border-border hover:bg-transparent bg-[#F1F5F9]"
    >
      {hg.headers.map((header) => (
        <TableHead
          key={header.id}
          className="text-sm font-roboto font-medium text-textpar h-12"
        >
          {flexRender(
            header.column.columnDef.header,
            header.getContext()
          )}
        </TableHead>
      ))}
    </TableRow>
  ))}
</TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4">
        <span className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} results
        </span>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
