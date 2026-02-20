import { useState } from "react";
import { Server } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function FailoverRedundancy() {
  const [enabled, setEnabled] = useState(true);
  const [server, setServer] = useState("fs-01");

  return (
    <div className="space-y-4">

      <div className="mt-4">
          <h2 className="text-lg text-black sm:text-lg font-roboto font-medium">
              Failover & Redundancy Configuration
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground  mt-1">
            Configure high-availability settings to prevent data loss during hardware failures.
          </p>
      </div>

      <div className="border border-border rounded-xl bg-card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-sm bg-blue-50 shrink-0">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg text-black sm:text-lg font-roboto font-medium">
                Failover Recording Server
              </h3>
              <p className="text-sm sm:text-sm text-slate-500  mt-1 max-w-lg">
                Automatically redirects camera streams to a standby server if the primary
                server is unreachable for more than 30 seconds.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-muted-foreground">Enabled</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>

    <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5 border border-border rounded-lg p-4 bg-slate-100">
                  <p className="text-xs font-roboto font-medium text-slate-600 uppercase tracking-wider mb-1">
                     Target Failover Server
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Select
                      value={server}
                      onValueChange={setServer}
                      disabled={!enabled}
                    >
                      <SelectTrigger
                      className="
                        w-full sm:w-64
                        bg-white text-foreground
                        border border-border
                        focus:ring-2 focus:ring-ring
                        disabled:bg-muted
                        dark:bg-background
                        rounded-lg
                      "
                    >
                        <SelectValue placeholder="Select server" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fs-01">FS-01 (Standby - US West)</SelectItem>
                        <SelectItem value="fs-02">FS-02 (Standby - US East)</SelectItem>
                        <SelectItem value="fs-03">FS-03 (Standby - EU)</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Status Badge */}
                    {enabled && (
                      <Badge
                        variant="outline"
                        className="inline-flex items-center gap-1.5 text-sm font-medium
                          text-emerald-700 border-green-200 bg-emerald-50
                          dark:bg-green-500/10 dark:border-emerald-700 px-4 py-1.5 rounded-lg"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-700" />
                           Target online
                      </Badge>
                    )}
                  </div>
          </div>
      </div>

        {/* Footer Action */}
        {/* <div className="flex justify-end">
          <Button disabled={!enabled}>Save Configuration</Button>
        </div> */}
      </div>
    </div>
  );
}
