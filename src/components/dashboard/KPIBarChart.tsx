import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from "recharts";
import { KPI_DEFINITIONS, lyonData } from "@/data/kpiData";

export default function KPIBarChart() {
  const latestData = lyonData[lyonData.length - 1];

  const chartData = KPI_DEFINITIONS.map((kpi) => {
    const value = kpi.getValue(latestData);
    const target = kpi.target;
    const atTarget = target !== undefined && value >= target;
    return {
      name: kpi.label,
      value,
      target,
      atTarget,
      unit: kpi.unit,
      format: kpi.format,
    };
  });

  // Split into two groups: percentage-based and value-based
  const pctKPIs = chartData.filter((d) => d.unit === "%");
  const valKPIs = chartData.filter((d) => d.unit !== "%");

  return (
    <div className="space-y-6">
      {/* Percentage KPIs */}
      <div className="glass-card p-5">
        <h4 className="font-display font-semibold text-sm mb-4 text-muted-foreground">
          Indicateurs en pourcentage (%)
        </h4>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pctKPIs} layout="vertical" margin={{ left: 140, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "hsl(210 40% 90%)", fontSize: 12 }}
                width={130}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 10%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: 8,
                  color: "hsl(210 40% 95%)",
                  fontSize: 13,
                }}
                formatter={(value: number, _name: string, props: any) => {
                  const item = props.payload;
                  const label = item.format ? item.format(value) : `${value}%`;
                  return [label, "Valeur"];
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                {pctKPIs.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.atTarget ? "hsl(142 76% 46%)" : "hsl(210 100% 56%)"}
                  />
                ))}
              </Bar>
              {/* Reference lines for each target */}
              {pctKPIs.map((entry, i) =>
                entry.target !== undefined ? (
                  <ReferenceLine
                    key={`ref-${i}`}
                    x={entry.target}
                    stroke="hsl(32 95% 55%)"
                    strokeDasharray="6 3"
                    strokeWidth={2}
                  />
                ) : null
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(210 100% 56%)" }} />
            <span>En cours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(142 76% 46%)" }} />
            <span>Objectif atteint</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: "hsl(32 95% 55%)" }} />
            <span>Objectif cible</span>
          </div>
        </div>
      </div>

      {/* Value-based KPIs */}
      <div className="glass-card p-5">
        <h4 className="font-display font-semibold text-sm mb-4 text-muted-foreground">
          Indicateurs de valeur (€ / unités)
        </h4>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valKPIs} margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(210 40% 90%)", fontSize: 11 }}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 40% 10%)",
                  border: "1px solid hsl(222 30% 18%)",
                  borderRadius: 8,
                  color: "hsl(210 40% 95%)",
                  fontSize: 13,
                }}
                formatter={(value: number, _name: string, props: any) => {
                  const item = props.payload;
                  const label = item.format ? item.format(value) : String(value);
                  return [label, "Valeur"];
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {valKPIs.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.atTarget ? "hsl(142 76% 46%)" : "hsl(210 100% 56%)"}
                  />
                ))}
              </Bar>
              {valKPIs.map((entry, i) =>
                entry.target !== undefined ? (
                  <ReferenceLine
                    key={`ref-val-${i}`}
                    y={entry.target}
                    stroke="hsl(32 95% 55%)"
                    strokeDasharray="6 3"
                    strokeWidth={2}
                    label={{
                      value: `Obj: ${entry.format ? entry.format(entry.target) : entry.target}`,
                      fill: "hsl(32 95% 55%)",
                      fontSize: 11,
                      position: "right",
                    }}
                  />
                ) : null
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(210 100% 56%)" }} />
            <span>En cours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(142 76% 46%)" }} />
            <span>Objectif atteint</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: "hsl(32 95% 55%)" }} />
            <span>Objectif cible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
