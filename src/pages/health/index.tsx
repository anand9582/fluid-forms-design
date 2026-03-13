import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Search,
    ChevronDown,
    Calendar,
    Filter,
    Download,
    Activity,
    Server,
    Cpu,
    Database,
    ShieldCheck,
    Zap,
    Clock,
    Wifi,
    AlertTriangle,
    Info,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    RefreshCcw,
    Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from "recharts";

const throughputData = [
    { time: "10:00", inbound: 450, outbound: 150 },
    { time: "10:05", inbound: 460, outbound: 160 },
    { time: "10:10", inbound: 455, outbound: 155 },
    { time: "10:15", inbound: 850, outbound: 140 },
    { time: "10:20", inbound: 480, outbound: 170 },
    { time: "10:25", inbound: 460, outbound: 165 },
    { time: "10:30", inbound: 455, outbound: 160 },
    { time: "10:45", inbound: 460, outbound: 165 },
];

const deviceStatusData = [
    { name: "Online", value: 138, color: "#2563EB" },
    { name: "Offline", value: 4, color: "#F87171" },
    { name: "Warnings", value: 135, color: "#FBBF24" },
];

import { SiteFilter } from "@/components/health/SiteFilter";

export default function HealthPage() {
    const [viewMode, setViewMode] = useState<"standard" | "tabular">("standard");

    return (
        <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F8FAFC]">
            {/* Top Filter Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#E2E8F0] shrink-0">
                <div className="flex items-center gap-4">
                    <Select
                        value={viewMode}
                        onValueChange={(v: "standard" | "tabular") => setViewMode(v)}
                    >
                        <SelectTrigger className="w-[160px] h-9 bg-white border-none shadow-sm font-medium font-roboto text-sm">
                            <SelectValue placeholder="Select View" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard" className="font-roboto text-sm">Standard View</SelectItem>
                            <SelectItem value="tabular" className="font-roboto text-sm">Tabular View</SelectItem>
                        </SelectContent>
                    </Select>

                    {viewMode === "tabular" && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                placeholder="Search Name, ID"
                                className="pl-9 w-[280px] h-9 bg-white border-none shadow-sm rounded-md focus:outline-none placeholder:text-sm placeholder:font-roboto placeholder:font-normal placeholder:text-[#737373] text-sm"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 font-normal text-[#020618]">
                    <SiteFilter />

                    <Select defaultValue="all-type">
                        <SelectTrigger className="min-w-[120px] h-9 bg-white border-none shadow-sm font-roboto text-sm">
                            <SelectValue placeholder="All Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-type" className="font-roboto text-sm">All Type</SelectItem>
                            <SelectItem value="cameras" className="font-roboto text-sm">Cameras</SelectItem>
                            <SelectItem value="servers" className="font-roboto text-sm">Servers</SelectItem>
                            <SelectItem value="sessions" className="font-roboto text-sm">Sessions</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all-status">
                        <SelectTrigger className="min-w-[120px] h-9 bg-white border-none shadow-sm font-roboto text-sm">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-status" className="font-roboto text-sm">All Status</SelectItem>
                            <SelectItem value="offline" className="font-roboto text-sm">Offline</SelectItem>
                            <SelectItem value="warning" className="font-roboto text-sm">Warning</SelectItem>
                            <SelectItem value="online" className="font-roboto text-sm">Online</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button variant="ghost" size="sm" className="bg-white h-9 px-3 gap-2 shadow-sm text-sm font-medium font-roboto">
                        <Calendar className="h-4 w-4" />
                        Last 24 Hours
                    </Button>

                    {viewMode === "tabular" && (
                        <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-9 px-4 gap-2 shadow-sm font-roboto font-bold text-sm">
                            Export
                            <Download className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {viewMode === "standard" ? (
                        <StandardView />
                    ) : (
                        <TabularView />
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function StandardView() {
    return (
        <div className="flex flex-col gap-4">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HealthStatCard
                    icon={<Database className="h-5 w-5 text-blue-600" />}
                    label="Cluster Memory"
                    value="50%"
                    subValue={<span className="text-blue-600">127TB / 256TB</span>}
                    suffix="used"
                    bgColor="bg-blue-50"
                />
                <HealthStatCard
                    icon={<Zap className="h-5 w-5 text-[#9333EA]" />}
                    label="GPU Load"
                    value="37%"
                    subValue="Hardware Acceleration"
                    bgColor="bg-[#F5F3FF]"
                />
                <HealthStatCard
                    icon={<Activity className="h-5 w-5 text-emerald-600" />}
                    label="Render Performance"
                    value="20ms"
                    subValue="Avg. Frame Latency"
                    bgColor="bg-emerald-50"
                />
                <HealthStatCard
                    icon={<Wifi className="h-5 w-5 text-amber-600" />}
                    label="Network Health"
                    value="Degraded"
                    valueColor="text-[#0F172A]"
                    subValue="16 Devices reporting issues"
                    bgColor="bg-amber-50"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8">
                    <Card className="p-4 h-[440px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-[#475569] font-roboto tracking-tight uppercase">Network Throughput</h3>
                                <RefreshCcw className="h-3.5 w-3.5 text-slate-400 rotate-90" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-[#64748B] uppercase">Inbound</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                    <span className="text-[10px] font-bold text-[#64748B] uppercase">Latency</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={throughputData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="time"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 border rounded shadow-lg">
                                                        <p className="text-[10px] font-bold text-slate-500 mb-1">{payload[0].payload.time}</p>
                                                        <p className="text-xs font-bold text-blue-600">inbound: {payload[0].value}</p>
                                                        <p className="text-xs font-bold text-slate-400">outbound: {payload[1].value}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area type="monotone" dataKey="inbound" stroke="#2563EB" strokeWidth={2} fill="transparent" />
                                    <Area type="monotone" dataKey="outbound" stroke="#64748B" strokeWidth={2} fill="transparent" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-4">
                    <Card className="p-4 h-[440px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xs font-bold text-[#475569] font-roboto tracking-tight uppercase">Device Status</h3>
                                <RefreshCcw className="h-3.5 w-3.5 text-slate-400 rotate-90" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] font-bold uppercase rounded p-1 border-slate-200">Server</Badge>
                                <Badge variant="outline" className="text-[10px] font-bold uppercase rounded p-1 border-slate-200 bg-slate-100">Camera Type</Badge>
                            </div>
                        </div>

                        <div className="flex-1 relative flex items-center justify-center">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-[#0F172A]">260</span>
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Total Devices</span>
                            </div>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={deviceStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {deviceStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            <div className="bg-[#F8FAFC] p-3 rounded-lg flex flex-col items-center border border-slate-100">
                                <Wifi className="h-4 w-4 text-slate-400 mb-1" />
                                <span className="text-lg font-bold text-[#0F172A]">138</span>
                                <span className="text-[10px] font-bold text-[#64748B] uppercase">Online</span>
                            </div>
                            <div className="bg-[#FEF2F2] p-3 rounded-lg flex flex-col items-center border border-red-50">
                                <Zap className="h-4 w-4 text-slate-400 mb-1 rotate-180" />
                                <span className="text-lg font-bold text-[#0F172A]">04</span>
                                <span className="text-[10px] font-bold text-[#64748B] uppercase text-red-400">Offline</span>
                            </div>
                            <div className="bg-[#FFFBEB] p-3 rounded-lg flex flex-col items-center border border-amber-50">
                                <AlertTriangle className="h-4 w-4 text-slate-400 mb-1" />
                                <span className="text-lg font-bold text-[#0F172A]">135</span>
                                <span className="text-[10px] font-bold text-[#64748B] uppercase text-amber-500">Warnings</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
                    <ServerStatusCard name="SRV-BR-NYC" latency="12 ms" cpu={35} gpu={23} mem={21} uptime="45d" />
                    <ServerStatusCard name="SRV-BR-NYC" latency="12 ms" cpu={35} gpu={23} mem={21} uptime="45d" />
                    <ServerStatusCard name="SRV-BR-NYC" latency="12 ms" cpu={35} gpu={23} mem={21} uptime="45d" />
                    <ServerStatusCard name="SRV-BR-NYC" latency="12 ms" cpu={35} gpu={23} mem={21} uptime="45d" />
                </div>
                <div className="lg:col-span-4">
                    <Card className="h-full flex flex-col">
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xs font-bold text-[#475569] font-roboto tracking-tight uppercase">System Alerts</h3>
                                    <div className="flex items-center gap-4 ml-2">
                                        <RefreshCcw className="h-4 w-4 text-slate-400 rotate-90" />
                                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-200 text-xs font-bold font-roboto px-2">
                                    <Calendar className="h-3.5 w-3.5" />
                                    Last 24 Hours
                                </Button>
                            </div>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1.5 cursor-pointer">
                                    <Checkbox id="crit" checked className="h-3.5 w-3.5 border-red-500 data-[state=checked]:bg-red-500" />
                                    <label htmlFor="crit" className="text-[10px] font-bold text-[#64748B] uppercase cursor-pointer">Critical</label>
                                </div>
                                <div className="flex items-center gap-1.5 cursor-pointer">
                                    <Checkbox id="warn" checked className="h-3.5 w-3.5 border-amber-500 data-[state=checked]:bg-amber-500" />
                                    <label htmlFor="warn" className="text-[10px] font-bold text-[#64748B] uppercase cursor-pointer">Warning</label>
                                </div>
                                <div className="flex items-center gap-1.5 cursor-pointer">
                                    <Checkbox id="inf" checked className="h-3.5 w-3.5 border-blue-500 data-[state=checked]:bg-blue-500" />
                                    <label htmlFor="inf" className="text-[10px] font-bold text-[#64748B] uppercase cursor-pointer">Info</label>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <SystemAlertItem
                                type="WARNING"
                                title="Storage capacity reaching 90% threshold"
                                time="11:57:36 AM"
                                server="SRV-BR-CHI"
                                location="Lobby Entrance"
                            />
                            <SystemAlertItem
                                type="CRITICAL"
                                title="Critical GPU overheating detected. Shutdown imminent."
                                time="11:57:36 AM"
                                server="SRV-BR-MIA"
                                location="Parking Garage B"
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function HealthStatCard({ icon, label, value, subValue, bgColor, valueColor, suffix }: any) {
    return (
        <Card className="p-4 flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm border", bgColor, label === "GPU Load" ? "rotate-45" : "")}>
                <div className={cn(label === "GPU Load" ? "-rotate-45" : "")}>{icon}</div>
            </div>
            <div>
                <div className="flex items-baseline gap-1.5">
                    <span className={cn("text-2xl font-bold font-roboto leading-none", valueColor || "text-[#0F172A]")}>{value}</span>
                    <span className="text-[10px] font-bold text-[#64748B] font-roboto uppercase tracking-tight">{label}</span>
                </div>
                <div className="text-[10px] font-bold text-[#94A3B8] font-roboto mt-0.5 uppercase tracking-wide">
                    {subValue} {suffix && <span className="font-medium lowercase">{suffix}</span>}
                </div>
            </div>
        </Card>
    );
}

function ServerStatusCard({ name, latency, cpu, gpu, mem, uptime }: any) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-slate-400" />
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold font-roboto text-[#0F172A]">{name}</span>
                    <RefreshCcw className="h-3.5 w-3.5 text-slate-400 rotate-90" />
                </div>
                <span className="text-[10px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] uppercase">{latency}</span>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-[#64748B] uppercase">
                            <span>CPU</span>
                            <span className="text-[#94A3B8] capitalize font-medium ml-auto mr-1">{cpu}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${cpu}%` }} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-[#64748B] uppercase">
                            <span>GPU</span>
                            <span className="text-[#94A3B8] capitalize font-medium ml-auto mr-1">{gpu}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${gpu}%` }} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-[#64748B] uppercase">
                            <span>MEMORY</span>
                            <span className="text-[#94A3B8] capitalize font-medium ml-auto mr-1">{mem}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500" style={{ width: `${mem}%` }} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div>
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase mb-0.5">Uptime</p>
                        <p className="text-sm font-bold text-[#0F172A] font-roboto">{uptime}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="link" className="text-blue-600 text-[11px] font-bold font-roboto h-auto p-0 flex items-center gap-1 hover:no-underline">
                            View Diagnostics
                            <Maximize2 className="h-3 w-3 rotate-90" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function SystemAlertItem({ type, title, time, server, location }: any) {
    const isCritical = type === "CRITICAL";
    return (
        <Card className="p-3 border-slate-200 shadow-none">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {isCritical ? <div className="h-2 w-2 rounded-full bg-red-500" /> : <AlertTriangle className="h-3 w-3 text-amber-500" />}
                    <span className={cn("text-[10px] font-bold uppercase", isCritical ? "text-red-500" : "text-amber-500")}>{type}</span>
                </div>
                <span className="text-[10px] font-bold text-[#94A3B8]">{time}</span>
            </div>
            <h4 className="text-xs font-bold text-[#334155] font-roboto mb-3 leading-tight leading-[1.4]">{title}</h4>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5 text-[#64748B]">
                    <Server className="h-3.5 w-3.5 opacity-60" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{server}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B]">
                    <Activity className="h-3.5 w-3.5 opacity-60" />
                    <span className="text-[10px] font-bold capitalize tracking-tight">{location}</span>
                </div>
            </div>
        </Card>
    );
}

function TabularView() {
    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <ScrollArea className="h-[calc(100vh-220px)] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#F1F5F9] z-10 border-b">
                        <tr className="text-[11px] font-bold text-slate-500 uppercase font-roboto">
                            <th className="px-4 py-3 font-bold">Status</th>
                            <th className="px-4 py-3 font-bold">Camera Name</th>
                            <th className="px-4 py-3 font-bold">IP Address</th>
                            <th className="px-4 py-3 font-bold">Throughput</th>
                            <th className="px-4 py-3 font-bold">Latency</th>
                            <th className="px-4 py-3 font-bold">Packet Loss</th>
                            <th className="px-4 py-3 font-bold">Uptime</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y border-b border-slate-200">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        {i === 1 ? (
                                            <div className="h-4 w-4 rounded-full border border-red-200 bg-red-50 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-red-600">×</span>
                                            </div>
                                        ) : (
                                            <div className="h-4 w-4 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-emerald-600">✓</span>
                                            </div>
                                        )}
                                        <span className={cn("text-xs font-bold font-roboto", i === 1 ? "text-[#0F172A]" : "text-[#0F172A]")}>
                                            {i === 1 ? "Offline" : "Online"}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-slate-400 opacity-60" />
                                        <span className="text-sm font-bold font-roboto text-[#0F172A]">Delhi Branch - Cam {i}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-bold font-roboto text-slate-600">192.168.1.100:80</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <Wifi className="h-4 w-4 text-slate-400 opacity-60" />
                                        <span className="text-sm font-bold font-roboto text-slate-600">{1.5 + i * 0.3} Mbps</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-bold font-roboto text-slate-600">
                                    <span className={cn(i === 1 ? "text-red-400" : "text-blue-400")}>{30 + i * 10}ms</span>
                                </td>
                                <td className="px-4 py-4 text-sm font-bold font-roboto text-slate-600">
                                    <span className={cn(i === 1 ? "text-blue-400" : "text-blue-400")}>{i === 1 ? "10%" : "0%"}</span>
                                </td>
                                <td className="px-4 py-4 text-sm font-bold font-roboto text-[#0F172A]">12d 4h</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
            <div className="p-4 flex items-center justify-between bg-white rounded-b-lg">
                <div className="flex items-center gap-4">
                    <span className="text-[13px] font-medium text-[#64748B] font-roboto">Showing 5 of 20 results.</span>
                    <Select defaultValue="5">
                        <SelectTrigger className="w-16 h-8 text-xs font-bold font-roboto border-slate-200 shadow-none">
                            <SelectValue placeholder="5" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-[#64748B] gap-1 font-bold font-roboto text-[13px] hover:bg-transparent">
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-8 w-8 bg-white border-slate-200 text-[#0F172A] font-bold text-xs shadow-sm">1</Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 text-[#64748B] font-bold text-xs hover:bg-white transition-all">2</Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 text-[#64748B] font-bold text-xs hover:bg-white transition-all">3</Button>
                        <div className="h-8 w-4 flex items-center justify-center text-[#64748B]"><MoreHorizontal className="h-4 w-4" /></div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 text-[#64748B] font-bold text-xs hover:bg-white transition-all">9</Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 text-[#64748B] font-bold text-xs hover:bg-white transition-all">10</Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[#0F172A] gap-1 font-bold font-roboto text-[13px] hover:bg-transparent">
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
