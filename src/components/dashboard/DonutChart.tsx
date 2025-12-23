import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface DonutChartProps {
  total: number;
  online: number;
  offline: number;
  label: string;
}

const DonutChart = ({ total, online, offline, label }: DonutChartProps) => {
  const { isAltTheme } = useTheme(); 

  const data = [
    { name: "Online", value: online },
    { name: "Offline", value: offline },
  ];

  const COLORS = isAltTheme
    ? ["#22C55E", "rgba(251,113,133,1)"] 
    : ["#2B4DED", "rgba(251,113,133,1)"];

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold font-roboto text-foreground">
          {total}
        </span>
        <span className="text-xs uppercase font-semibold text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
};

export default DonutChart;
