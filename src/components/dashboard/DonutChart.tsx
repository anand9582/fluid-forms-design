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

  const activeData = [];
  if (online > 0) activeData.push({ name: "Online", value: online, color: theme.cpu });
  if (offline > 0) activeData.push({ name: "Offline", value: offline, color: theme.offline });

  const data = total > 0 ? activeData : [{ name: "Empty", value: 1, color: isAltTheme ? "#334155" : "#E2E8F0" }];

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
            paddingAngle={activeData.length > 1 ? 3 : 0}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        {total > 0 ? (
          <>
            <span className="text-2xl font-semibold text-foreground">
              {total}
            </span>
            <span className="text-xs uppercase font-semibold text-muted-foreground">
              {label}
            </span>
          </>
        ) : (
          <span className="text-[10px] font-medium text-slate-400 leading-tight">
            No device data available
          </span>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
