import React, { useState } from "react";
import {
  Search,
  ChevronDown,
  Calendar,
  Filter,
  AlertCircle,
  Clock,
  User,
  ShieldAlert,
  Camera,
  PlayCircle,
  Paperclip,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  X,
  Maximize2,
  Download,
  Terminal,
  FileText,
  TriangleAlert,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  RefershIcons,
  VioceIcons,
  Minimize,
} from "@/components/Icons/Svg/liveViewIcons";

// Mock data for alerts
const alerts = [
  {
    id: 1,
    title: "Unattended Baggage Detected",
    location: "Cam-lobby-04 ",
    date: "First floor desk 25 Dec 2025 12:21AM",
    severity: "High",
    type: "Security Alert",
    match: "10%",
    status: "New",
    by: "Anand H",
    initials: "AH",
    image: "/camera-thumb.jpg"
  },
  {
    id: 2,
    title: "VIP Guest Arrival: Mr. Varun Gupta",
    location: "Cam-lobby-04",
    date: "26 Dec 2025, 01:45 PM",
    severity: "Medium",
    type: "Jerome Bell",
    match: "20%",
    status: "AcknowledgedBy",
    by: "Bina K",
    initials: "BK"
  },
  {
    id: 3,
    title: "Loitering in guest corridor",
    location: "Cam-lobby-04",
    date: "27 Dec 2025, 03:30 PM",
    severity: "Low",
    type: "System Alert",
    match: "50%",
    status: "ResolvedBy",
    by: "Carlos R",
    initials: "CR"
  },
  {
    id: 4,
    title: "Watchlist Vehicle: Unregistered Taxi",
    location: "Cam-lobby-04",
    date: "First floor desk 25 Dec 2025 12:21AM",
    severity: "Info",
    type: "Loitering",
    match: "99%",
    status: "FalseAlarmBy",
    by: "Anand H",
    initials: "AH"
  }
];

export default function AlertPage() {
  const [selectedAlertId, setSelectedAlertId] = useState(1);
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
            <SelectTrigger className="w-[160px] h-9 bg-white border-none shadow-sm font-medium">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard View</SelectItem>
              <SelectItem value="tabular">Tabular View</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search camera, ID"
              className="pl-9 w-[280px] h-9 bg-white border-none shadow-sm rounded-md focus:outline-none placeholder:text-sm placeholder:font-roboto placeholder:font-normal placeholder:text-[#737373]"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 font-normal text-[#020618]">
          <Select defaultValue="all-sites">
            <SelectTrigger className="w-[120px] h-9 bg-white border-none shadow-sm ">
              <SelectValue placeholder="All Sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-sites">All Sites</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-type">
            <SelectTrigger className="w-[120px] h-9 bg-white border-none shadow-sm ">
              <SelectValue placeholder="All Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-type">All Type</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-status">
            <SelectTrigger className="w-[120px] h-9 bg-white border-none shadow-sm ">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="bg-white h-9 px-3 gap-2 shadow-sm text-sm font-medium">
            <Calendar className="h-4 w-4" />
            Last 24 Hours
          </Button>
          <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-9 px-4 gap-2 shadow-sm font-roboto font-bold text-sm">
            Export
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {viewMode === "standard" ? (
          <>
            {/* Left Column - Security Protocol Feed (65%) */}
            <div className={cn("flex flex-col p-4 bg-[#F1F5F9]", viewMode === "standard" ? "w-[57%]" : "w-full overflow-hidden")}>
              <div className="-mx-4 -my-4 px-4 py-3 mb-4 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-roboto font-medium tracking-tight text-[#000]">Security Protocol Feed</h2>
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <Badge className="bg-[#FEF2F2] text-[#DC2626] border-none font-roboto font-medium text-xs px-2 py-0.5">
                    4 Active Incidents
                  </Badge>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox id="critical" checked className="border-[#EF4444] data-[state=checked]:bg-[#EF4444] rounded" />
                    <label htmlFor="critical" className="text-sm font-roboto font-medium text-[#475569]">Critical</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="high" checked className="border-[#F59E0B] data-[state=checked]:bg-[#F59E0B] rounded" />
                    <label htmlFor="high" className="text-sm font-roboto font-medium text-[#475569]">High</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="medium" checked className="border-[#EAB308] data-[state=checked]:bg-[#EAB308] rounded" />
                    <label htmlFor="medium" className="text-sm font-roboto font-medium text-[#475569]">Medium</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="info" className="border-[#CBD5E1] rounded" />
                    <label htmlFor="info" className="text-sm font-roboto font-medium text-[#94A3B8]">Info</label>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 pr-2">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <Card
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      className={cn(
                        "relative p-3 cursor-pointer border-l-0 transition-all hover:shadow-md",
                        // selectedAlertId === alert.id ? "bg-[#EFF6FF] border-[#2563EB]" : "bg-white border-transparent",
                        // alert.severity === "High" && "border-l-[#EF4444]",
                        // alert.severity === "Medium" && "border-l-[#F59E0B]",
                        // alert.severity === "Low" && "border-l-[#EAB308]",
                        // alert.severity === "Info" && "border-l-[#3B82F6]"
                      )}
                    >
                      <div className="flex gap-3">
                        {/* Icon/Avatar */}
                        <div className={cn(
                          "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border",
                          alert.severity === "High" ? "bg-[#FEF2F2] border-[#FEE2E2]" :
                            alert.severity === "Medium" ? "bg-[#FFFBEB] border-[#FEF3C7]" :
                              "bg-[#F8FAFC] border-[#E2E8F0]"
                        )}>
                          {alert.severity === "High" ? <ShieldAlert className="h-5 w-5 text-[#EF4444]" /> :
                            alert.severity === "Medium" ? <AlertCircle className="h-5 w-5 text-[#F59E0B]" /> :
                              alert.severity === "Low" ? <TriangleAlert className="h-5 w-5 text-[#EAB308]" /> :
                                alert.severity === "Info" ? <Info className="h-5 w-5 text-[#3B82F6]" /> :
                                  <Activity className="h-5 w-5 text-muted-foreground" />}
                        </div>

                        {/* Image Thumb */}
                        <div className="h-10 w-16 bg-slate-200 rounded shrink-0 overflow-hidden border border-border">
                          <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                            <Camera className="h-4 w-4 text-slate-400" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-start justify-between">
                            <h3 className="text-fontSize14px font-medium font-roboto leading-[1.5] tracking-[0.07px] truncate pr-2">{alert.title}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                              {alert.status === "New" ? (
                                <Badge className="bg-[#DCFCE7] text-[#059669] hover:bg-[#DCFCE7] border-none text-xs font-medium font-roboto">New</Badge>
                              ) : (
                                <span className="text-xs text-[#475569] font-roboto whitespace-nowrap shrink-0">AI {alert.match} Match</span>
                              )}
                              <div className="flex items-center gap-1 bg-[#475569] text-white px-2 py-1 rounded-sm text-xs font-roboto font-medium shrink-0">
                                {alert.type === 'Face Recognition' ? (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M0.75 8.45215C1.16396 8.45226 1.49974 8.78822 1.5 9.20215V10.4102C1.50012 10.5313 1.54819 10.6477 1.63379 10.7334C1.7196 10.8192 1.83666 10.8672 1.95801 10.8672H3.16504C3.57898 10.8673 3.91475 11.2033 3.91504 11.6172C3.91504 12.0313 3.57916 12.3671 3.16504 12.3672H1.95801C1.43883 12.3672 0.940353 12.1611 0.573242 11.7939C0.206343 11.427 0.000121931 10.9291 0 10.4102V9.20215C0.000258682 8.78815 0.335946 8.45215 0.75 8.45215ZM11.6172 8.45215C12.0312 8.45215 12.3669 8.78816 12.3672 9.20215V10.4102C12.3671 10.9292 12.1609 11.4269 11.7939 11.7939C11.4269 12.1609 10.9292 12.3671 10.4102 12.3672H9.20215C8.78816 12.3669 8.45215 12.0312 8.45215 11.6172C8.45244 11.2034 8.78833 10.8674 9.20215 10.8672H10.4102C10.5313 10.8671 10.6477 10.8191 10.7334 10.7334C10.8191 10.6477 10.8671 10.5313 10.8672 10.4102V9.20215C10.8674 8.78833 11.2034 8.45244 11.6172 8.45215ZM3.31836 6.79199C3.64963 6.54354 4.11957 6.61031 4.36816 6.94141L4.38477 6.96094C4.40293 6.98258 4.43387 7.018 4.47559 7.06152C4.55979 7.14935 4.68713 7.26909 4.85156 7.38867C5.18377 7.63023 5.63573 7.84957 6.18359 7.84961C6.73141 7.84961 7.1834 7.63019 7.51562 7.38867C7.68018 7.26899 7.80838 7.14936 7.89258 7.06152C7.93416 7.01812 7.96427 6.98257 7.98242 6.96094L7.99902 6.94141L8.04785 6.88281C8.30548 6.60319 8.73812 6.55896 9.04883 6.79199C9.37989 7.04056 9.44758 7.51054 9.19922 7.8418L8.59863 7.3916C9.15486 7.80877 9.19546 7.83936 9.19824 7.8418V7.84277L9.19727 7.84375C9.19672 7.84452 9.19595 7.84585 9.19531 7.84668C9.194 7.84837 9.1921 7.85037 9.19043 7.85254C9.18669 7.85739 9.18131 7.86411 9.17578 7.87109C9.16464 7.88516 9.15013 7.90398 9.13184 7.92578C9.09458 7.97016 9.04217 8.03013 8.97559 8.09961C8.84285 8.2381 8.64861 8.41959 8.39844 8.60156C7.90051 8.96364 7.14482 9.34961 6.18359 9.34961C5.22235 9.34957 4.46665 8.96365 3.96875 8.60156C3.7188 8.41975 3.52529 8.23805 3.39258 8.09961C3.32607 8.03021 3.27358 7.97015 3.23633 7.92578C3.2179 7.90383 3.20259 7.88521 3.19141 7.87109C3.18584 7.86406 3.1805 7.8574 3.17676 7.85254C3.17505 7.85032 3.1732 7.8484 3.17188 7.84668C3.17121 7.84581 3.17048 7.84453 3.16992 7.84375L3.16895 7.84277V7.8418C2.92055 7.5106 2.98744 7.04062 3.31836 6.79199ZM4.37793 3.62207C4.79202 3.62207 5.12773 3.95803 5.12793 4.37207C5.12793 4.78628 4.79214 5.12207 4.37793 5.12207H4.37207C3.95803 5.12187 3.62207 4.78616 3.62207 4.37207C3.62227 3.95815 3.95815 3.62227 4.37207 3.62207H4.37793ZM8.00098 3.62207C8.41505 3.62209 8.75078 3.95804 8.75098 4.37207C8.75098 4.78627 8.41517 5.12205 8.00098 5.12207H7.99512C7.5809 5.12207 7.24512 4.78628 7.24512 4.37207C7.24532 3.95803 7.58103 3.62207 7.99512 3.62207H8.00098ZM3.16504 0C3.57916 0.000109531 3.91504 0.335854 3.91504 0.75C3.91493 1.16405 3.57909 1.49989 3.16504 1.5H1.95801C1.83666 1.5 1.7196 1.54798 1.63379 1.63379C1.54798 1.7196 1.5 1.83666 1.5 1.95801V3.16504C1.49989 3.57909 1.16405 3.91493 0.75 3.91504C0.335854 3.91504 0.000109531 3.57916 0 3.16504V1.95801C0 1.43883 0.206131 0.940354 0.573242 0.573242C0.940354 0.206131 1.43883 0 1.95801 0H3.16504ZM10.4102 0C10.9291 0.000121931 11.427 0.206343 11.7939 0.573242C12.1611 0.940353 12.3672 1.43883 12.3672 1.95801V3.16504C12.3671 3.57916 12.0313 3.91504 11.6172 3.91504C11.2033 3.91475 10.8673 3.57898 10.8672 3.16504V1.95801C10.8672 1.83666 10.8192 1.7196 10.7334 1.63379C10.6477 1.54819 10.5313 1.50012 10.4102 1.5H9.20215C8.78822 1.49974 8.45226 1.16396 8.45215 0.75C8.45215 0.335946 8.78815 0.000258682 9.20215 0H10.4102Z" fill="#FAFAFA" />
                                </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M5.12109 0.0117188C5.26383 0.0350295 5.39976 0.0930373 5.5166 0.180664C5.6332 0.268241 5.72681 0.382394 5.78906 0.512695L5.8418 0.648438L5.84375 0.655273L8.59863 10.46L9.44043 7.46582C9.55599 7.05437 9.80373 6.69246 10.1445 6.43457C10.4852 6.17686 10.901 6.03752 11.3281 6.03809H12.8252C13.2392 6.03833 13.5752 6.37403 13.5752 6.78809C13.5748 7.20177 13.2389 7.53784 12.8252 7.53809H11.3262C11.2263 7.53795 11.1294 7.57064 11.0498 7.63086C10.9901 7.67605 10.9425 7.73458 10.9111 7.80176L10.8848 7.87207L9.46582 12.9199L9.46387 12.9268C9.40926 13.1137 9.29548 13.2786 9.13965 13.3955C8.98383 13.5123 8.79337 13.5751 8.59863 13.5752C8.40414 13.5751 8.2143 13.5121 8.05859 13.3955C7.9028 13.2787 7.78902 13.1137 7.73438 12.9268L7.73242 12.9199L4.97559 3.11426L4.13477 6.10938C4.01962 6.51923 3.77344 6.88096 3.43457 7.13867C3.09567 7.39628 2.68154 7.5367 2.25586 7.53809H0.75C0.336057 7.53809 0.000438015 7.20193 0 6.78809C0 6.37387 0.335786 6.03809 0.75 6.03809H2.25098C2.35041 6.0377 2.44819 6.00452 2.52734 5.94434C2.60633 5.88414 2.66355 5.79874 2.69043 5.70312L4.10938 0.655273L4.11133 0.648438C4.16588 0.461538 4.27986 0.29757 4.43555 0.180664C4.59148 0.0637373 4.78166 0 4.97656 0L5.12109 0.0117188Z" fill="#FAFAFA" />
                                </svg>)}

                                <span className="truncate max-w-[120px]">{alert.type}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between -mt-0.5">
                            <div className="flex items-center gap-1 text-fontSize12px text-muted-foreground font-roboto font-normal leading-[1.5] tracking-[0.18px]">
                              <Camera className="h-3 w-3" />
                              <span className="text-[#1E293B] font-roboto">{alert.location}</span>
                              <span className="mx-1 text-[#64748B]">•</span>
                              <span className="shrink-0 text-[#64748B]">{alert.date}</span>
                            </div>
                            {alert.status === "New" && (
                              <span className="text-xs text-[#475569] font-roboto shrink-0">AI {alert.match} Match</span>
                            )}
                          </div>

                          {/* Sub-status rows */}
                          {alert.status.includes("By") && (
                            <div className="flex items-center justify-end -mt-0.5">
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {alert.status === "AcknowledgedBy" && (
                                  <Badge variant="outline" className="h-6 px-2 bg-[#EFF6FF] !text-[#2563EB] border-none rounded-[8px] font-roboto text-fontSize12px font-medium leading-[1.5] tracking-[0.18px] justify-center shadow-none">
                                    Acknowledged
                                  </Badge>
                                )}
                                {alert.status === "ResolvedBy" && (
                                  <Badge variant="outline" className="h-6 px-2 bg-[#F7FEE7] !text-[#4D7C0F] border-none rounded-[8px] font-roboto text-fontSize12px font-medium leading-[1.5] tracking-[0.18px] justify-center shadow-none">
                                    Resolved
                                  </Badge>
                                )}
                                {alert.status === "FalseAlarmBy" && (
                                  <Badge variant="outline" className="h-6 px-2 bg-[#F5F5F5] !text-[#525252] border-none rounded-[8px] font-roboto text-fontSize12px font-medium leading-[1.5] tracking-[0.18px] justify-center shadow-none">
                                    False Alarm
                                  </Badge>
                                )}
                                <span className="text-fontSize12px text-muted-foreground font-roboto leading-[1.5] tracking-[0.18px]">By</span>
                                <div className="h-5 w-5 rounded-full bg-[#E2E8F0] flex items-center justify-center border border-white shrink-0">
                                  <span className="text-[8px] font-bold">{alert.initials}</span>
                                </div>
                                <span className="text-[10px] font-semibold truncate max-w-[80px]">{alert.by}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 py-2 mt-auto">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 px-1">
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 w-8 bg-white border-none shadow font-bold text-xs ring-1 ring-slate-200">1</Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 text-xs font-semibold">2</Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 text-xs font-semibold">3</Button>
                  <div className="h-8 w-8 flex items-center justify-center text-muted-foreground text-xs"><MoreHorizontal className="h-4 w-4" /></div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 px-1 font-roboto font-semibold">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right Column - Alert Detail (35%) */}
            <div className="w-[43%] flex flex-col p-4 border-l border-transparent">
              <ScrollArea className="flex-1">
                <div className="space-y-4">
                  {/* Detail Header */}
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#FEF2F2] text-[#DC2626] border-[#DC2626] font-roboto font-bold px-3 py-1 text-xs gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="#DC2626">
                        <path d="M5.58008 0C5.88353 0 6.17823 0.0949521 6.42383 0.269531L6.52637 0.348633L6.5332 0.354492L6.53223 0.355469C7.50592 1.20664 8.84137 1.8115 9.80664 1.81152C10.1656 1.81153 10.5098 1.95423 10.7637 2.20801C11.0174 2.46179 11.1601 2.80621 11.1602 3.16504V7.3916C11.16 9.09882 10.554 10.4186 9.57715 11.4209C8.62057 12.4022 7.34159 13.0475 6.03223 13.5039L6.02637 13.5059C5.73699 13.6039 5.42308 13.5999 5.13574 13.4971V13.498C5.13178 13.4967 5.12798 13.4945 5.12402 13.4932C5.12254 13.4926 5.12064 13.4927 5.11914 13.4922V13.4912C3.81234 13.0382 2.53849 12.3973 1.58496 11.4209C0.60681 10.4191 0.000109106 9.09887 0 7.3916V3.16504C8.6509e-05 2.80623 0.142841 2.46179 0.396484 2.20801L0.496094 2.11816C0.736883 1.92094 1.03954 1.8116 1.35352 1.81152C2.31827 1.81152 3.65951 1.20037 4.62793 0.354492L4.63379 0.348633C4.89746 0.123374 5.23329 3.94391e-05 5.58008 0ZM5.5791 1.5127C4.4853 2.45599 2.90073 3.25276 1.5 3.30566V7.3916C1.50011 8.70274 1.95049 9.64822 2.6582 10.373C3.3791 11.1111 4.40093 11.6531 5.58984 12.0674C6.7698 11.6508 7.78551 11.11 8.50293 10.374C9.21032 9.64822 9.66005 8.70266 9.66016 7.3916V3.30566C8.2598 3.25302 6.6791 2.46259 5.5791 1.5127ZM5.58594 8.45215C6.00008 8.45215 6.33582 8.78804 6.33594 9.20215C6.33594 9.61636 6.00015 9.95215 5.58594 9.95215H5.58008C5.16594 9.95206 4.83008 9.61631 4.83008 9.20215C4.8302 8.78809 5.16601 8.45224 5.58008 8.45215H5.58594ZM5.58008 3.62207C5.99425 3.62207 6.33002 3.95791 6.33008 4.37207V6.78711C6.33008 7.20132 5.99429 7.53711 5.58008 7.53711C5.16594 7.53702 4.83008 7.20127 4.83008 6.78711V4.37207C4.83014 3.95796 5.16598 3.62216 5.58008 3.62207Z" fill="#DC2626" />
                      </svg>
                      High
                    </Badge>
                    <h1 className="text-sm font-roboto text-[#1E293B] font-medium">Unattended Baggage Detected</h1>
                  </div>

                  {/* Video Player - Reference from CameraGrid */}
                  <div className="group relative aspect-video bg-black rounded-lg overflow-hidden border border-border transition-all hover:border-primary/60">
                    {/* Visual Elements from Figma */}
                    <div className="absolute inset-0 bg-[#334155]/20" />

                    {/* Header Info like CameraGrid */}
                    <div className="absolute top-2 left-3 text-white z-10">
                      <h3 className="text-xs font-bold font-roboto tracking-tight">Hall Entrance main</h3>
                      <div className="flex items-center gap-1 text-[10px] opacity-80 font-roboto font-medium">
                        <Camera className="h-2.5 w-2.5" />
                        Cam-lobby-04 First floor desk
                      </div>
                    </div>

                    <div className="absolute top-2 right-3 text-white text-[10px] font-roboto font-medium z-10">
                      12:21AM
                    </div>

                    {/* Center Detection Decoration */}
                    <div className="absolute top-[35%] left-[55%] w-20 h-20 border border-dashed border-white/40 rounded-sm" />

                    {/* Hover Controls - Patterns from CameraGrid */}
                    <div className={cn(
                      "absolute bottom-2 left-1/2 -translate-x-1/2 z-20",
                      "flex items-center gap-1",
                      "opacity-0 translate-y-4",
                      "group-hover:opacity-100 group-hover:translate-y-0",
                      "transition-all duration-300 ease-out"
                    )}>
                      <button className="p-1.5 bg-black/80 rounded text-white/90 hover:bg-black">
                        <RefershIcons size={14} />
                      </button>
                      <button className="p-1.5 bg-black/80 rounded text-white/90 hover:bg-black">
                        <VioceIcons size={14} />
                      </button>
                      <button className="p-1.5 bg-black/80 rounded text-white/90 hover:bg-black">
                        <Camera size={14} />
                      </button>
                      <button className="p-1.5 bg-black/80 rounded text-white/90 hover:bg-black">
                        <Minimize size={14} />
                      </button>
                    </div>

                    {/* Playback Button - Figma Style */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-2 z-10">
                      <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white gap-1.5 h-7 px-2.5 rounded text-[11px] font-roboto font-bold">
                        <PlayCircle className="h-3.5 w-3.5" />
                        View Playback
                      </Button>
                    </div>

                    {/* Status Indicator from CameraGrid patterns */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 bg-[#1E293B]/60 rounded-full flex items-center justify-center border border-white/20">
                      <span className="text-white font-bold text-lg opacity-80">N</span>
                    </div>
                  </div>

                  {/* Security Log Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-[#334155] font-roboto ">Security Log</h3>
                    <div className="relative min-h-[140px] flex flex-col">
                      <textarea
                        className="w-full flex-1 p-3 rounded-lg border border-slate-200 bg-[#F8FAFC] text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 placeholder:font-roboto placeholder:font-medium"
                        placeholder="Log specific information related to this video here"
                      />
                      <div className="flex items-center justify-end gap-3 mt-2">
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <Button size="sm" className="bg-[#93C5FD] text-white hover:bg-[#60A5FA] h-8 px-4 rounded-md font-roboto font-bold text-xs">
                          Post Entry
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white h-10 rounded-md font-roboto font-bold text-xs gap-1.5 shadow-sm">
                      <Activity className="h-4 w-4" />
                      Acknowledge
                    </Button>
                    <Button variant="outline" className="bg-white border-slate-200 text-slate-600 h-10 rounded-md font-roboto font-bold text-xs gap-1.5 shadow-sm">
                      <ShieldAlert className="h-4 w-4" />
                      False Alarm
                    </Button>
                    <Button variant="outline" className="col-span-2 bg-white border-slate-200 text-slate-600 h-10 rounded-md font-roboto font-bold text-xs gap-1.5 shadow-sm">
                      <User className="h-4 w-4" />
                      Escalate to duty manager
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          /* Tabular View */
          <div className="w-full h-full flex flex-col p-4 bg-[#F1F5F9] overflow-hidden">
            <div className="-mx-4 -my-4 px-4 py-3 mb-4 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-roboto font-medium tracking-tight text-[#000]">Security Protocol Feed</h2>
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <Badge className="bg-[#FEF2F2] text-[#DC2626] border-none font-roboto font-medium text-xs px-2 py-0.5">
                  4 Active Incidents
                </Badge>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox id="critical" checked className="border-[#EF4444] data-[state=checked]:bg-[#EF4444] rounded" />
                  <label htmlFor="critical" className="text-sm font-roboto font-medium text-[#475569]">Critical</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="high" checked className="border-[#F59E0B] data-[state=checked]:bg-[#F59E0B] rounded" />
                  <label htmlFor="high" className="text-sm font-roboto font-medium text-[#475569]">High</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="medium" checked className="border-[#EAB308] data-[state=checked]:bg-[#EAB308] rounded" />
                  <label htmlFor="medium" className="text-sm font-roboto font-medium text-[#475569]">Medium</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="info" className="border-[#CBD5E1] rounded" />
                  <label htmlFor="info" className="text-sm font-roboto font-medium text-[#94A3B8]">Info</label>
                </div>
              </div>
            </div>
            <ScrollArea className="flex-1 bg-white rounded-lg border border-border shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#F1F5F9] z-10 border-b border-border">
                  <tr className="text-sm font-roboto font-medium text-[#475569]">
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569]">Alert Type</th>
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569]">Description</th>
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569]">Camera / Location</th>
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569] whitespace-nowrap">Status</th>
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569] whitespace-nowrap">Date & Time</th>
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569] whitespace-nowrap">AI Match</th>
                    <th className="px-4 py-3 font-roboto font-medium text-[#475569] whitespace-nowrap">Actions By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#0A0A0A] font-normal font-roboto ">{alert.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 max-w-[300px]">
                        <div className="flex items-center gap-2 text-[#475569]">
                          <FileText className="h-4 w-4 opacity-40 shrink-0" />
                          <span className="text-sm text-[#0A0A0A] font-normal font-roboto ">{alert.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 bg-[#F1F5F9] px-3 py-1 rounded-full w-fit border border-[#E2E8F0]">
                          <span className="text-[13px] font-roboto text-[#0A0A0A] font-medium">{alert.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {alert.status === "New" ? (
                          <Badge className="bg-[#DCFCE7] text-[#059669] hover:bg-[#DCFCE7] border-none text-[11px] font-semibold rounded-[4px] px-2 py-0">New</Badge>
                        ) : alert.status === "AcknowledgedBy" ? (
                          <Badge className="bg-[#EFF6FF] text-[#2563EB] hover:bg-[#EFF6FF] border-none text-[11px] font-semibold rounded-[4px] px-2 py-0">Acknowledged</Badge>
                        ) : (
                          <Badge className="bg-[#F7FEE7] text-[#4D7C0F] hover:bg-[#F7FEE7] border-none text-[11px] font-semibold rounded-[4px] px-2 py-0">Resolved</Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[14px] font-roboto text-[#64748B]">{alert.date}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-[14px] font-roboto text-[#64748B]">{alert.match}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-[#E2E8F0] flex items-center justify-center border border-white shrink-0">
                            <span className="text-[10px] font-bold">{alert.initials || "AH"}</span>
                          </div>
                          <span className="text-[13px] font-semibold font-roboto text-[#0F172A]">{alert.by || "Anand H"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
