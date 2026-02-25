import { useState, useEffect,useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Camera , Eye, EyeOff,ChevronLeft, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";


export interface DiscoveredDevice {
  id: string;
  name: string;
  ip: string;
  port: string;
  make: string;
  model: string;
  type: string;
  username: string;
  password: string;
  group: string;
}

interface DevicesDataTableProps {
  data: DiscoveredDevice[];
  onSelectionChange: (count: number) => void;
  onSelectedDevicesChange: (devices: DiscoveredDevice[]) => void;
  onDataChange: (data: DiscoveredDevice[]) => void;
}
/* ---------------- EDITABLE CELL ---------------- */
function EditableCell({
  value,
  onChange,
  className,
}: {
  value: string | number;
  onChange: (val: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    setEditing(false);
    if (draft !== String(value)) {
      onChange(draft);
    } else {
      setDraft(String(value));
    }
  };

  return (
    <div className="relative min-h-[28px] flex items-center">
      {/* READ MODE */}
      <span
        onDoubleClick={() => setEditing(true)}
        className={cn(
          "cursor-pointer text-sm px-1.5 py-0.5 rounded hover:bg-muted/40 transition-colors",
          editing && "invisible",
          className
        )}
      >
        {value}
      </span>

      {/* EDIT MODE (overlay) */}
      {editing && (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(String(value));
              setEditing(false);
            }
          }}
          className="absolute inset-0 h-full w-full text-sm px-2 border border-primary rounded focus:outline-none"
        />
      )}
    </div>
  );
}


export function DevicesDataTable({
  data,
  selectedCount,
  onSelectionChange,
  onSelectedDevicesChange, 
}: DevicesDataTableProps) {
   const [rowSelection, setRowSelection] = useState({});
   const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
   const [tableData, setTableData] = useState<DiscoveredDevice[]>(data);

    useEffect(() => {
      setTableData(data);
  }, [data]);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };


  
  const columns: ColumnDef<DiscoveredDevice>[] = [
    {
      id: "select",
      header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => {
          table.toggleAllPageRowsSelected(!!value);

         const selectedRows = value
          ? table.getRowModel().rows.map(r =>
              tableData.find(td => td.id === r.original.id)!
            )
          : [];

          onSelectedDevicesChange(selectedRows); 

          onSelectionChange(value ? table.getRowCount() : 0);
        }}
        aria-label="Select all"
        variant="soft"
      />
      ),
      cell: ({ row }) => (
          <Checkbox
        variant="soft"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);

          const selectedRows = table
          .getSelectedRowModel()
          .rows.map(r =>
            tableData.find(td => td.id === r.original.id)!
          );


          onSelectedDevicesChange(selectedRows); 

          const newCount = value ? selectedCount + 1 : selectedCount - 1;
          onSelectionChange(Math.max(0, newCount));
        }}
        aria-label="Select row"
      />

      ),
      enableSorting: false,
      enableHiding: false,
    },
   {
  accessorKey: "name",
  header: "Device Name",
  cell: ({ row }) => {
    const deviceName = row.getValue("name") as string;

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 max-w-[180px] text-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-gray-200">
               <Camera className="h-4 w-4 text-gray-600" />
            </div>

            <EditableCell
              value={deviceName}
                onChange={(val) =>
                  setTableData((prev) =>
                    prev.map((r) =>
                      r.id === row.original.id ? { ...r, name: val } : r
                    )
                  )
                }
              />
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <span>{deviceName}</span>
        </TooltipContent>
      </Tooltip>
    );
  },
},
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.ip}
          onChange={(val) =>
            setTableData((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, ip: val } : r
              )
            )
          }
        />
      ),
    },
    {
      accessorKey: "port",
      header: "Port",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.port}
          onChange={(val) =>
            setTableData((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, port: val } : r
              )
            )
          }
        />
      ),
    },
{
  accessorKey: "makeModel",
  header: "Make / Model",
  cell: ({ row }) => (
    <div className="leading-tight">
      {/* MAKE */}
      <div className="font-roboto font-semibold">
        <EditableCell
          value={row.original.make}
          onChange={(val) =>
            setTableData((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, make: val } : r
              )
            )
          }
        />
      </div>

      {/* MODEL */}
      <div>
        <EditableCell
          value={row.original.model}
          onChange={(val) =>
            setTableData((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, model: val } : r
              )
            )
          }
        />
      </div>
    </div>
  ),
},    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-primary cursor-pointer text-sm">{row.getValue("type")}</span>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <EditableCell
          value={row.original.username}
          onChange={(val) =>
            setTableData((prev) =>
              prev.map((r) =>
                r.id === row.original.id ? { ...r, username: val } : r
              )
            )
          }
        />
      ),
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }) => {
        const id = row.original.id;
        const isVisible = visiblePasswords.has(id);
        return (
          <div className="flex items-center gap-2">
            <EditableCell
              value={isVisible ? row.original.password : "••••••••"}
              onChange={(val) =>
                setTableData((prev) =>
                  prev.map((r) =>
                    r.id === id ? { ...r, password: val } : r
                  )
                )
              }
            />
            <button onClick={() => togglePasswordVisibility(id)}>
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "group",
      header: "Group",
      cell: ({ row }) => <span className="text-tablecolor">{row.getValue("group")}</span>,
    },
  ];

  const table = useReactTable({
      data: tableData, 
      columns,
      getRowId: (row) => row.id,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: { rowSelection },
      onRowSelectionChange: setRowSelection,
      initialState: { pagination: { pageSize: 5 } },
      autoResetPageIndex: false,
  });

  useEffect(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        onSelectionChange(selectedRows.length);
        onSelectedDevicesChange(selectedRows.map((r) => r.original));
  }, [rowSelection]); 

  const totalRows = data.length;
  const pageSize = table.getState().pagination.pageSize;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className="space-y-4">
      {/* table card */}
       <div className="bg-card border border-border overflow-hidden ">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent bg-[#F1F5F9]">
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-textpar font-roboto font-medium text-xs sm:text-sm whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-xs sm:text-sm py-2 sm:py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm font-roboto font-medium text-slate-500">
                     No devices discovered. Click "Start scan" to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
       </div>

       {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm px-4 pb-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Showing {Math.min(pageSize, totalRows)} of {totalRows}</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-14 sm:w-16 h-7 sm:h-8 border-border text-xs sm:text-sm">
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
              className="text-pagination-text hover:text-pagination-hover disabled:text-pagination-disabled text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "outline" : "ghost"}
                size="sm"
                className={`h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs sm:text-sm ${currentPage === page ? "border-border bg-card" : ""}`}
                onClick={() => table.setPageIndex(page - 1)}
              >
                {page}
              </Button>
            ))}
            {totalPages > 5 && (
              <>
                <span className="px-1 sm:px-2 text-muted-foreground">...</span>
                {[totalPages - 1, totalPages].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "outline" : "ghost"}
                    size="sm"
                    className="h-7 sm:h-8 w-7 sm:w-8 p-0 text-xs sm:text-sm"
                    onClick={() => table.setPageIndex(page - 1)}
                  >
                    {page}
                  </Button>
                ))}
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-pagination-text hover:text-pagination-hover disabled:text-pagination-disabled h-7 sm:h-8 px-2 sm:px-3"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next 
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div> 
    </div>
   
  );
}

