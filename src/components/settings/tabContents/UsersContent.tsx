import { useState, useMemo } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Search,
  Filter,
  CheckCircle2,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Video,
  RefreshCcw,
  LogOut,
  Lock,
  Trash2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { UserStatus } from "../../../components/settings/UserStatus";
import { AddUserSheet } from "@/components/settings/AddUser/AddUserSheet";

// ====================
// Sample Data
// ====================
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  assignedCameras: number;
  lastActive: string;
  status: string;
  avatar?: string;
};

const userData: User[] = [
  { id: "1", name: "Kate Russell", email: "kate.russell@campulse.com", role: "Super Admin", assignedCameras: 142, lastActive: "2 mins ago", status: "Active" },
  { id: "2", name: "James Wilson", email: "j.wilson@campulse.com", role: "Operator L1", assignedCameras: 90, lastActive: "1 hr ago", status: "Locked" },
  { id: "3", name: "Elena Rodriguez", email: "elena.r@campulse.com", role: "Security guard", assignedCameras: 63, lastActive: "3 days ago", status: "Active" },
];

// ====================
// Column Helper
// ====================
const columnHelper = createColumnHelper<User>();

const UserNameCell = ({ name, email }: { name: string; email: string }) => (
  <div>
    <div className="font-roboto font-bold text-foreground">{name}</div>
    <div className="font-roboto text-sm text-muted-foreground">{email}</div>
  </div>
);

const AvatarCell = ({ name, avatar }: { name: string; avatar?: string }) => (
  <Avatar className="h-9 w-9">
    {avatar ? (
      <AvatarImage src={avatar} />
    ) : (
      <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
        {name.split(" ").filter(Boolean).map((n) => n[0]).join("")}
      </AvatarFallback>
    )}
  </Avatar>
);

export default function UserManagementTable() {
  // ====================
  // State
  // ====================
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);

  // ====================
  // Columns
  // ====================
  const columns = useMemo(() => [
    columnHelper.accessor("name", {
      header: "User",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <AvatarCell name={info.getValue()} avatar={info.row.original.avatar} />
          <UserNameCell name={info.getValue()} email={info.row.original.email} />
        </div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => <span className="font-roboto font-medium text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("assignedCameras", {
      header: "Assigned Cameras",
      cell: (info) => <span className="font-roboto font-medium text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("lastActive", {
      header: "Last Active",
      cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <UserStatus status={info.getValue()} />,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: () => (
        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <MoreVertical className="h-4 w-4 text-muted-foreground" />
    </Button>
  </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" /> Edit user
            </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <Video className="h-4 w-4" /> Assign cameras
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4" /> Reset password
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 text-orange-500">
                <LogOut className="h-4 w-4" /> Force logout
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 text-orange-600">
                <Lock className="h-4 w-4" /> Lock account
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-4 w-4" /> Remove user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      ),
    }),
  ], []);

  // ====================
  // Filtered Data
  // ====================
  const filteredData = useMemo(() => {
    let data = userData;
    if (roleFilter !== "all") data = data.filter((u) => u.role === roleFilter);
    if (statusFilter !== "all") data = data.filter((u) => u.status === statusFilter);
    return data;
  }, [roleFilter, statusFilter]);

  // ====================
  // React Table
  // ====================
  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex + 1;

  const roles = [...new Set(userData.map((u) => u.role))];

  // ====================
  // Pagination helper
  // ====================
  const getPageNumbers = () => {
    const totalPages = table.getPageCount();
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // ====================
  // Render
  // ====================
  return (
    <div className="py-3 border bg-white rounded-lg">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 px-4 gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 h-10 bg-card border-border"
          />  
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[130px] h-10 bg-card border-border">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Role : All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Role : All</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-10 bg-card border-border">
              <CheckCircle2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status : All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status : All</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Locked">Locked</SelectItem>
              <SelectItem value="Reset required">Reset required</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <Button variant="outline" className="h-10 gap-2 bg-background border-border hover:bg-muted/5">
            <Download className="h-4 w-4" />
            Export
          </Button>

          {/* Add User */}
          <Button className="h-10 gap-2" onClick={() => setAddDeviceOpen(true)}>
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent bg-[#F1F5F9]">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-sm font-roboto font-medium text-textpar h-12">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
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
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-2 px-4">
  {/* Page info + page size */}
  <div className="flex items-center gap-2 text-sm text-[#62748E]">
    Showing {table.getRowModel().rows.length} of{" "}
    {table.getFilteredRowModel().rows.length} results.
    
    <Select
      value={String(pageSize)}
      onValueChange={(value) => table.setPageSize(Number(value))}
    >
      <SelectTrigger className="w-[60px] h-8 bg-card border-border">
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

  {/* Pagination buttons */}
  <div className="flex items-center gap-1">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      className="h-8 gap-1 text-muted-foreground hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4" /> Previous
    </Button>

    {getPageNumbers().map((p, idx) =>
      p === "..." ? (
        <span
          key={idx}
          className="h-8 w-8 flex items-center justify-center text-muted-foreground"
        >
          ...
        </span>
      ) : (
        <Button
          key={p}
          variant={currentPage === p ? "outline" : "ghost"}
          size="sm"
          onClick={() => table.setPageIndex(Number(p) - 1)}
          className={cn(
            "h-8 w-8 p-0",
            currentPage === p && "border-border bg-card"
          )}
        >
          {p}
        </Button>
      )
    )}

    <Button
      variant="ghost"
      size="sm"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
      className="h-8 gap-1 text-muted-foreground hover:text-foreground"
    >
      Next <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</div>

   <AddUserSheet open={addDeviceOpen} onOpenChange={setAddDeviceOpen} />
    </div>
  );
}
