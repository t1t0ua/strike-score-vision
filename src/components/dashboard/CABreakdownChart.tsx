import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { MonthlyData } from "@/data/kpiData";

const COLORS = [
  "hsl(210 100% 56%)",
  "hsl(32 95% 55%)",
  "hsl(280 80% 60%)",
  "hsl(142 76% 46%)",
];

interface CABreakdownChartProps {
  data: MonthlyData[];
}

export default function CABreakdownChart({ data }: CABreakdownChartProps) {
  const totals = data.reduce(
    (acc, d) => ({
      bowling: acc.bowling + d.caBowling,
      conso: acc.conso + d.caConso,
      arcade: acc.arcade + d.caArcade,
      billard: acc.billard + d.caBillard,
    }),
    { bowling: 0, conso: 0, arcade: 0, billard: 0 }
  );

  const pieData = [
    { name: "Bowling", value: totals.bowling },
    { name: "Consommations", value: totals.conso },
    { name: "Arcade", value: totals.arcade },
    { name: "Billard", value: totals.billard },
  ];

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold text-sm mb-4">Répartition du CA annuel</h3>
      <div className="flex items-center gap-4">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 10%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: 8,
                  color: "hsl(210 40% 95%)",
                }}
                formatter={(value: number) => [`${value.toLocaleString("fr-FR")} €`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-medium">{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
