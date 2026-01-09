import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { themeColors } from "@/theme/themeColors";

interface DonutChartProps {
  total: number;
  online: number;
  offline: number;
  label: string;
}

const DonutChart = ({ total, online, offline, label }: DonutChartProps) => {
  const { isAltTheme } = useTheme();
  const theme = isAltTheme ? themeColors.dark : themeColors.light;

  const data = [
    { name: "Online", value: online },
    { name: "Offline", value: offline },
  ];

  return (
    <div
      className="relative flex items-center justify-center">
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
            <Cell fill={theme.cpu} />  
            <Cell fill={theme.offline} />  
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-foreground">
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
