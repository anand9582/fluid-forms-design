import { Database, Camera, ShieldCheck, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const cards = [
  {
    icon: Database,
    label: "Total Storage",
    value: "78 TB",
    sub: "Capacity",
    hint: { value: "43.3%", label: "used" },
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Camera,
    label: "Active Cameras",
    value: "20",
    sub: "/ 24 Total",
    hintText: "Recording live",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: ShieldCheck,
    label: "System Status",
    value: "Healthy",
    hintText: "All systems normal",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Activity,
    label: "Storage Health",
    value: "44%",
    sub: "Score",
    bar: 44,
    color: "bg-yellow-50 text-yellow-600",
  },
];

export function StorageOverviewCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl shadow-sm bg-card px-4 py-3"
        >
          <div className="flex gap-3 items-center">
            {/* ICON */}
            <div
              className={cn(
                "h-9 w-9 rounded-sm flex items-center justify-center shrink-0",
                c.color
              )}
            >
              <c.icon className="h-4 w-4" strokeWidth={1.9} />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1">
              <h2 className="text-[14px] font-roboto font-semibold text-neutral-700">
                {c.label}
              </h2>

              <div className="flex items-end gap-1 mt-1">
                <span className="text-xl font-bold font-roboto text-neutral-800">
                  {c.value}
                </span>
                {c.sub && (
                  <span className="text-xs font-roboto font-medium text-neutral-500">
                    {c.sub}
                  </span>
                )}
              </div>

              {/* Hint */}
              {c.hint && (
                <p className="text-sm mt-0.5">
                  <span className="text-primary font-medium">
                    {c.hint.value}
                  </span>{" "}
                  <span className="font-roboto text-neutral-400">
                    {c.hint.label}
                  </span>
                </p>
              )}

              {c.hintText && (
                <p className="text-sm font-roboto text-neutral-400 mt-0.5">
                  {c.hintText}
                </p>
              )}

                {c.bar !== undefined && (
                    <Progress
                      value={c.bar}
                      className="h-1.5 mt-3 bg-muted"
                      indicatorClassName="bg-yellow-400"
                    />
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
