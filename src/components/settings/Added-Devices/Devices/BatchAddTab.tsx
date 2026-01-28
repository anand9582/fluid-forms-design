import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

interface BatchDeviceRow {
  id: string;
  name: string;
  ip: string;
  port: string;
  make: string;
  model: string;
  type: string;
  group: string;
}

export function BatchAddTab() {
  const [data, setData] = useState<BatchDeviceRow[]>([
    { id: "1", name: "", ip: "", port: "", make: "", model: "", type: "", group: "" }
  ]);

  const addRow = () => {
    setData([...data, {
      id: String(Date.now()),
      name: "",
      ip: "",
      port: "",
      make: "",
      model: "",
      type: "",
      group: ""
    }]);
  };

  const updateRow = (id: string, field: keyof BatchDeviceRow, value: string) => {
    setData(data.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const applyToAll = (field: keyof BatchDeviceRow) => {
    const firstValue = data.find(r => r[field])?.[ field];
    if (firstValue) {
      setData(data.map(row => ({ ...row, [field]: firstValue })));
    }
  };

  const columns: ColumnDef<BatchDeviceRow>[] = [
    {
      accessorKey: "name",
      header: "Device Name",
      cell: ({ row }) => (
        <Input 
          placeholder="Name" 
          value={row.original.name}
          onChange={(e) => updateRow(row.original.id, "name", e.target.value)}
          className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      ),
    },
    {
      accessorKey: "ip",
      header: "IP Address",
      cell: ({ row }) => (
        <Input 
          placeholder="IP" 
          value={row.original.ip}
          onChange={(e) => updateRow(row.original.id, "ip", e.target.value)}
          className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      ),
    },
    {
      accessorKey: "port",
      header: "Port",
      cell: ({ row }) => (
        <Input 
          placeholder="Port" 
          value={row.original.port}
          onChange={(e) => updateRow(row.original.id, "port", e.target.value)}
          className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      ),
    },
    {
      accessorKey: "make",
      header: () => (
        <div className="flex items-center gap-1">
          Make
          <button 
            onClick={() => applyToAll("make")}
            className="text-muted-foreground hover:text-foreground"
            title="Apply to all rows"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <Select value={row.original.make} onValueChange={(value) => updateRow(row.original.id, "make", value)}>
          <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-0 w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hikvision">Hikvision</SelectItem>
            <SelectItem value="dahua">Dahua</SelectItem>
            <SelectItem value="axis">Axis</SelectItem>
            <SelectItem value="hanwha">Hanwha</SelectItem>
            <SelectItem value="bosch">Bosch</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "model",
      header: "Model",
      cell: ({ row }) => (
        <Input 
          placeholder="Model" 
          value={row.original.model}
          onChange={(e) => updateRow(row.original.id, "model", e.target.value)}
          className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        />
      ),
    },
    {
      accessorKey: "type",
      header: () => (
        <div className="flex items-center gap-1">
          Type
          <button 
            onClick={() => applyToAll("type")}
            className="text-muted-foreground hover:text-foreground"
            title="Apply to all rows"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <Select value={row.original.type} onValueChange={(value) => updateRow(row.original.id, "type", value)}>
          <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-0 w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="camera">Camera</SelectItem>
            <SelectItem value="nvr">NVR</SelectItem>
            <SelectItem value="router">Router</SelectItem>
            <SelectItem value="access-control">Access Control</SelectItem>
            <SelectItem value="iot-center">IOT Center</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "group",
      header: () => (
        <div className="flex items-center gap-1">
          Group
          <button 
            onClick={() => applyToAll("group")}
            className="text-muted-foreground hover:text-foreground"
            title="Apply to all rows"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <Select value={row.original.group} onValueChange={(value) => updateRow(row.original.id, "group", value)}>
          <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-0 w-full">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lobby">Lobby</SelectItem>
            <SelectItem value="main-hall">Main Hall</SelectItem>
            <SelectItem value="server-room">Server Room</SelectItem>
            <SelectItem value="front-roof">Front roof</SelectItem>
            <SelectItem value="first-floor">First floor</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Header with instruction and Add Row button */}
        <Card className="border-border border-[#BFDEFFB2] bg-blue-50/50 rounded-sm bg-[#EFF6FF] mt-5">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                      <p className="text-primary text-md font-roboto font-normal">
                        Fill out the table below. Use the header icons to apply a value to all rows.
                      </p>
                  </div>
                  <Button onClick={addRow} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                        <Plus className="h-4 w-4" />
                      Add Row
                  </Button>
                  </CardContent>
                </Card>

      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-primary text-sm">
          Fill out the table below. Use the header icons to apply a value to all rows.
        </p>
        <Button onClick={addRow} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Row
        </Button>
      </div> */}

      {/* Table */}
      <div className="rounded-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-border bg-muted/30 hover:bg-muted/30 bg-bgprimary">
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id} 
                          className="text-textpar font-roboto font-medium text-xs sm:text-sm whitespace-nowrap "
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-border bg-white hover:bg-muted/50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-xs sm:text-sm py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                    No rows added. Click "Add Row" to begin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add all devices button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <CheckCircle className="h-4 w-4" />
          Add all devices
        </Button>
      </div>
    </div>
  );
}
