import { useState, useMemo, ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  Table as TableInstance,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Filter configuration type
export interface FilterConfig {
  id: string;
  label: string;
  icon?: ReactNode;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

// Props for DynamicTable
export interface DynamicTableProps<TData> {
  // Data
  data: TData[];
  columns: ColumnDef<TData, any>[];

  // Search
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showSearch?: boolean;

  // Filters
  filters?: FilterConfig[];

  // Toolbar actions (right side buttons)
  toolbarActions?: ReactNode;

  // Pagination
  pageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;

  // Selection
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;

  // Sorting
  enableSorting?: boolean;

  // Empty state
  emptyMessage?: string;

  // Custom styles
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  headerBgClass?: string;
  // Expose table instance for external control
  disableColumnWidths?: boolean;
  onTableReady?: (table: TableInstance<TData>) => void;
}

export function DynamicTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchValue: externalSearchValue,
  onSearchChange: externalOnSearchChange,
  showSearch = true,
  filters = [],
  toolbarActions,
  pageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  showPagination = true,
  enableRowSelection = false,
  rowSelection: externalRowSelection,
  onRowSelectionChange: externalOnRowSelectionChange,
  enableSorting = false,
  emptyMessage = "No results found.",
  className,
  tableClassName,
  headerClassName,
  onTableReady,
  headerBgClass,
  disableColumnWidths = false,
}: DynamicTableProps<TData>) {
  // Internal state (used when external state not provided)
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Use external or internal state
  const globalFilter = externalSearchValue ?? internalGlobalFilter;
  const setGlobalFilter = externalOnSearchChange ?? setInternalGlobalFilter;
  const rowSelection = externalRowSelection ?? internalRowSelection;
  const setRowSelection = externalOnRowSelectionChange ?? setInternalRowSelection;

  // Table instance
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      globalFilter,
      columnFilters,
      sorting,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableRowSelection,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Expose table instance
  useMemo(() => {
    if (onTableReady) {
      onTableReady(table);
    }
  }, [table, onTableReady]);

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  // Generate page numbers for pagination
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
    <div className={cn("space-y-4", className)}>
      {/* Toolbar */}
      {(showSearch || filters.length > 0 || toolbarActions) && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 h-10 bg-card border-border"
              />
            </div>
          )}

          {/* Filters and Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((filter) => (
              <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="w-[140px] h-10 bg-card border-border">
                  {filter.icon && <span className="mr-2">{filter.icon}</span>}
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
            {toolbarActions}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={cn("bg-card border border-border rounded-lg overflow-hidden", tableClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
               className={cn(
                        "border-b border-border hover:bg-transparent",
                        headerBgClass ?? "bg-muted/40", 
                        headerClassName
                    )}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-md font-roboto font-medium text-slate-600 h-12"
                    style={disableColumnWidths ? undefined : { width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanResize() && (
                          <div
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className="absolute top-0 right-0 h-full w-1 cursor-col-resize"
                          />
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b  border-border last:border-b-0 hover:bg-muted/50"
                    >
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-4"  style={disableColumnWidths ? undefined : { width: cell.column.getSize() }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
              ))
                ) : (
                <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    {emptyMessage}
                    </TableCell>
                </TableRow>
                )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {showPagination && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Showing {table.getRowModel().rows.length} of {totalRows} results.
              <Select
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-16 h-8 bg-card border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
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
                className="h-8 gap-1 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
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
                    className={cn(
                      "h-8 w-8 p-0",
                      currentPage === page && "border-border bg-card"
                    )}
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
                className="h-8 gap-1 text-muted-foreground hover:text-foreground"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-export useful types and utilities from @tanstack/react-table
export { createColumnHelper, type ColumnDef, type SortingState, type RowSelectionState } from "@tanstack/react-table";
