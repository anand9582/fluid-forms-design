import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AlertsTable({ alerts = [], setAlerts, channels }) {
  if (!Array.isArray(alerts)) return null;

  const toggleEnabled = (id, checked) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, enabled: checked } : a
      )
    );
  };

  const toggleChannel = (id, key) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id
          ? {
              ...a,
              channels: {
                ...a.channels,
                [key]: !a.channels?.[key],
              },
            }
          : a
      )
    );
  };

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
          <span className="text-sm font-medium">
            {alert.name}
          </span>

          <div className="flex justify-center">
            <Switch
              checked={alert.enabled}
              onCheckedChange={(checked) =>
                toggleEnabled(alert.id, checked)
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            {channels.map(({ key, icon: Icon }) => {
              const active = alert.channels?.[key];

              return (
                <Button
                  key={key}
                  size="icon"
                  variant="outline"
                  disabled={!alert.enabled}
                  onClick={() =>
                    toggleChannel(alert.id, key)
                  }
                  className={cn(
                    "h-8 w-8",
                    alert.enabled && active &&
                      "bg-primary/10 text-primary border-primary/40",
                    alert.enabled && !active &&
                      "text-muted-foreground",
                    !alert.enabled &&
                      "opacity-40 cursor-not-allowed"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
