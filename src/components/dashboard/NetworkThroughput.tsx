import { ExternalLink } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { time: "10:00", inbound: 400, outbound: 100 },
  { time: "10:05", inbound: 500, outbound: 120 },
  { time: "10:10", inbound: 450, outbound: 110 },
  { time: "10:15", inbound: 600, outbound: 130 },
  { time: "10:20", inbound: 550, outbound: 125 },
  { time: "10:25", inbound: 700, outbound: 140 },
  { time: "10:30", inbound: 750, outbound: 145 },
  { time: "10:35", inbound: 800, outbound: 150 },
  { time: "10:40", inbound: 850, outbound: 140 },
  { time: "10:45", inbound: 850, outbound: 140 },
];

export function NetworkThroughput() {
  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">NETWORK THROUGHPUT</h3>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              width={35}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="inbound"
              stroke="hsl(var(--chart-green))"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="outbound"
              stroke="hsl(var(--chart-blue))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-green rounded" />
          <span className="text-xs text-muted-foreground">Inbound : 850</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-chart-blue rounded" />
          <span className="text-xs text-muted-foreground">Outbound : 140</span>
        </div>
      </div>
    </div>
  );
}
