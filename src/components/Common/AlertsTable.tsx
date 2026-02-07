import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AlertsTable({ alerts, setAlerts, channels }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 px-4 py-3 bg-slate-100 text-sm font-medium">
        <span>Alert Trigger</span>
        <span className="text-center">Enabled</span>
        <span className="text-right">Channels</span>
      </div>

      {alerts.map((alert, index) => (
        <div
          key={alert.id}
          className={cn(
            "grid grid-cols-3 px-4 py-3 items-center",
            index !== alerts.length - 1 && "border-b"
          )}
        >
          <span>{alert.name}</span>

          <div className="flex justify-center">
            <Switch
              checked={alert.enabled}
              onCheckedChange={(checked) =>
                setAlerts((prev) =>
                  prev.map((a) =>
                    a.id === alert.id ? { ...a, enabled: checked } : a
                  )
                )
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            {channels.map(({ key, icon: Icon }) => (
              <Button
                key={key}
                size="icon"
                variant="outline"
                disabled={!alert.enabled}
                onClick={() =>
                  setAlerts((prev) =>
                    prev.map((a) =>
                      a.id === alert.id
                        ? {
                            ...a,
                            channels: {
                              ...a.channels,
                              [key]: !a.channels[key],
                            },
                          }
                        : a
                    )
                  )
                }
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
