import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { KPIDefinition } from "@/data/kpiData";
import { lyonData, getCATotal } from "@/data/kpiData";

interface KPIDetailModalProps {
  kpi: KPIDefinition | null;
  open: boolean;
  onClose: () => void;
}

export default function KPIDetailModal({ kpi, open, onClose }: KPIDetailModalProps) {
  if (!kpi) return null;

  const chartData = lyonData.map((d) => ({
    mois: d.mois.substring(0, 3),
    valeur: kpi.getValue(d),
    target: kpi.target,
  }));

  // For CA, show breakdown
  const isCA = kpi.id === "ca-jour";
  const caBreakdown = isCA
    ? lyonData.map((d) => ({
        mois: d.mois.substring(0, 3),
        Bowling: d.caBowling,
        Consommations: d.caConso,
        Arcade: d.caArcade,
        Billard: d.caBillard,
      }))
    : [];

  const latest = lyonData[lyonData.length - 1];
  const previous = lyonData[lyonData.length - 2];
  const currentVal = kpi.getValue(latest);
  const prevVal = kpi.getValue(previous);
  const trend = ((currentVal - prevVal) / prevVal) * 100;

  // Insights
  const values = lyonData.map((d) => kpi.getValue(d));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const maxMonth = lyonData[values.indexOf(max)].mois;
  const minMonth = lyonData[values.indexOf(min)].mois;
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{kpi.label}</DialogTitle>
          <p className="text-sm text-muted-foreground">{kpi.description}</p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Actuel</p>
            <p className="text-xl font-bold font-display">{kpi.format ? kpi.format(currentVal) : currentVal}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Tendance</p>
            <p className={`text-xl font-bold font-display ${trend >= 0 ? "text-success" : "text-destructive"}`}>
              {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
            </p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Moyenne 12 mois</p>
            <p className="text-xl font-bold font-display">{kpi.format ? kpi.format(avg) : avg}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {isCA ? (
              <BarChart data={caBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="mois" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222 40% 10%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 95%)" }} />
                <Legend />
                <Bar dataKey="Bowling" fill="hsl(210 100% 56%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Consommations" fill="hsl(32 95% 55%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Arcade" fill="hsl(280 80% 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Billard" fill="hsl(142 76% 46%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="mois" tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222 40% 10%)", border: "1px solid hsl(222 30% 18%)", borderRadius: 8, color: "hsl(210 40% 95%)" }} />
                <Line type="monotone" dataKey="valeur" stroke="hsl(210 100% 56%)" strokeWidth={2.5} dot={{ fill: "hsl(210 100% 56%)", r: 4 }} />
                {kpi.target && (
                  <Line type="monotone" dataKey="target" stroke="hsl(32 95% 55%)" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="glass-card p-4 mt-2">
          <h4 className="font-display font-semibold text-sm mb-2">📊 Insights automatiques</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Meilleur mois : <span className="text-success font-medium">{maxMonth}</span> ({kpi.format ? kpi.format(max) : max})</li>
            <li>• Mois le plus faible : <span className="text-destructive font-medium">{minMonth}</span> ({kpi.format ? kpi.format(min) : min})</li>
            {kpi.target && (
              <li>• {currentVal >= kpi.target ? "✅ Objectif atteint" : `⚠️ ${kpi.format ? kpi.format(kpi.target - currentVal) : kpi.target - currentVal} restant pour atteindre l'objectif`}</li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
