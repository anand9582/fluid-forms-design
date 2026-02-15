import { Server, Camera, ShieldCheck, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const cards = [
  { icon: Server, label: "Total Storage", value: "78 TB", sub: "Capacity" },
  { icon: Camera, label: "Active Cameras", value: "20", sub: "/ 24 Total" },
  { icon: ShieldCheck, label: "System Status", value: "Healthy" },
  { icon: Activity, label: "Storage Health", value: "94%", bar: 94 },
];

export function StorageOverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="border rounded-xl p-4 bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <c.icon className="h-4 w-4" />
            {c.label}
          </div>
          <div className="text-2xl font-bold mt-1">{c.value}</div>
          {c.sub && <div className="text-xs text-muted-foreground">{c.sub}</div>}
          {c.bar && <Progress value={c.bar} className="h-2 mt-2" />}
        </div>
      ))}
    </div>
  );
}
