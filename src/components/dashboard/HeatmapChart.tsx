import { useMemo } from "react";
import { generateHeatmapData, HOURS, DAYS } from "@/data/kpiData";

export default function HeatmapChart() {
  const data = useMemo(() => generateHeatmapData(), []);

  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold text-sm mb-4">Carte de chaleur — Occupation des pistes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-xs text-muted-foreground p-1 w-10"></th>
              {HOURS.map((h) => (
                <th key={h} className="text-xs text-muted-foreground p-1 text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, di) => (
              <tr key={day}>
                <td className="text-xs text-muted-foreground p-1 font-medium">{day}</td>
                {data[di].map((val, hi) => {
                  const opacity = val / 100;
                  const bg = val >= 75
                    ? `rgba(34, 197, 94, ${opacity})`
                    : val >= 50
                    ? `rgba(234, 179, 8, ${opacity})`
                    : `rgba(239, 68, 68, ${opacity * 0.8 + 0.2})`;
                  return (
                    <td key={hi} className="p-0.5">
                      <div
                        className="w-full h-7 rounded-sm flex items-center justify-center text-xs font-medium transition-transform hover:scale-110"
                        style={{ backgroundColor: bg, color: val > 60 ? "hsl(222 47% 6%)" : "hsl(210 40% 90%)" }}
                        title={`${day} ${HOURS[hi]} — ${val}%`}
                      >
                        {val}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-destructive/60" /> &lt;50%
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-warning/60" /> 50-75%
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-success/70" /> &gt;75%
        </div>
      </div>
    </div>
  );
}
