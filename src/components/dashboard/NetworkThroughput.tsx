import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { time: '10:00', inbound: 450, outbound: 120 },
  { time: '10:05', inbound: 480, outbound: 130 },
  { time: '10:10', inbound: 520, outbound: 140 },
  { time: '10:15', inbound: 850, outbound: 140 },
  { time: '10:20', inbound: 460, outbound: 130 },
  { time: '10:25', inbound: 470, outbound: 125 },
  { time: '10:30', inbound: 480, outbound: 120 },
  { time: '10:35', inbound: 465, outbound: 115 },
  { time: '10:40', inbound: 455, outbound: 110 },
  { time: '10:45', inbound: 450, outbound: 105 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-border/50 px-4 py-3">
        <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
        <p className="text-sm text-primary">
          inbound : <span className="font-medium">{payload[0]?.value}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          outbound : <span className="font-medium">{payload[1]?.value}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface NetworkThroughputChartProps {
  title?: string;
  threshold?: number;
  onExpand?: () => void;
}

export const NetworkThroughput  = ({ 
  title = "NETWORK THROUGHPUT",
  threshold = 800,
  onExpand 
}: NetworkThroughputChartProps) => {
  return (
        <Card className="border-border/80 shadow-none">
           <CardHeader className="flex flex-row items-center justify-between pb-2 bg-bgprimary pt-4 rounded-t border-b pb-4">
              <CardTitle className="text-sm font-roboto font-medium uppercase tracking-wide text-textgray">
                    {title}
              </CardTitle>
                 
                <button 
                  onClick={onExpand}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
           </CardHeader>

       <CardContent>
        <div className="h-[260px] w-full px-3 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="0" 
                vertical={false} 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.5}
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                ticks={[0, 250, 500, 750, 1000]}
                domain={[0, 1000]}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={threshold} 
                stroke="hsl(var(--destructive))" 
                strokeDasharray="8 4" 
                strokeOpacity={0.6}
              />
              <Line 
                type="monotone" 
                dataKey="inbound" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="outbound" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: 'hsl(var(--muted-foreground))' }}
                strokeOpacity={0.6}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
         </CardContent>
    </Card>
  );
};
