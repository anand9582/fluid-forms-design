import { useState } from "react";
import { Plus, Copy, CheckCircle } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

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
  const [rows, setRows] = useState<BatchDeviceRow[]>([
    { id: "1", name: "", ip: "", port: "", make: "", model: "", type: "", group: "" }
  ]);

  const addRow = () => {
    setRows([...rows, {
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
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const applyToAll = (field: keyof BatchDeviceRow, value: string) => {
    if (value) {
      setRows(rows.map(row => ({ ...row, [field]: value })));
    }
  };

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

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[140px]">
                  Device Name
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[120px]">
                  IP Address
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[80px]">
                  Port
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[120px]">
                  <div className="flex items-center gap-1">
                    Make
                    <button 
                      onClick={() => {
                        const firstMake = rows.find(r => r.make)?.make;
                        if (firstMake) applyToAll("make", firstMake);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      title="Apply to all rows"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[100px]">
                  Model
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[120px]">
                  <div className="flex items-center gap-1">
                    Type
                    <button 
                      onClick={() => {
                        const firstType = rows.find(r => r.type)?.type;
                        if (firstType) applyToAll("type", firstType);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      title="Apply to all rows"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableHead>
                <TableHead className="text-muted-foreground font-medium text-xs sm:text-sm whitespace-nowrap min-w-[120px]">
                  <div className="flex items-center gap-1">
                    Group
                    <button 
                      onClick={() => {
                        const firstGroup = rows.find(r => r.group)?.group;
                        if (firstGroup) applyToAll("group", firstGroup);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                      title="Apply to all rows"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/50">
                  <TableCell className="py-2">
                    <Input 
                      placeholder="Name" 
                      value={row.name}
                      onChange={(e) => updateRow(row.id, "name", e.target.value)}
                      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input 
                      placeholder="IP" 
                      value={row.ip}
                      onChange={(e) => updateRow(row.id, "ip", e.target.value)}
                      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input 
                      placeholder="Port" 
                      value={row.port}
                      onChange={(e) => updateRow(row.id, "port", e.target.value)}
                      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Select value={row.make} onValueChange={(value) => updateRow(row.id, "make", value)}>
                      <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-0">
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
                  </TableCell>
                  <TableCell className="py-2">
                    <Input 
                      placeholder="Model" 
                      value={row.model}
                      onChange={(e) => updateRow(row.id, "model", e.target.value)}
                      className="h-8 text-sm border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Select value={row.type} onValueChange={(value) => updateRow(row.id, "type", value)}>
                      <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-0">
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
                  </TableCell>
                  <TableCell className="py-2">
                    <Select value={row.group} onValueChange={(value) => updateRow(row.id, "group", value)}>
                      <SelectTrigger className="h-8 text-sm border-0 bg-transparent focus:ring-0 focus:ring-offset-0 px-0">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add all devices button */}
      <div className="flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          <CheckCircle className="h-4 w-4 mr-2" />
          Add all devices
        </Button>
      </div>
    </div>
  );
}
