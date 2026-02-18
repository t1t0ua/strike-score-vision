import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { KPIDefinition, MonthlyData } from "@/data/kpiData";
import { getCATotal } from "@/data/kpiData";
import PeriodSelector, { type Period, sliceByPeriod } from "./PeriodSelector";

interface KPIDetailModalProps {
  kpi: KPIDefinition | null;
  open: boolean;
  onClose: () => void;
  data: MonthlyData[];
}

export default function KPIDetailModal({ kpi, open, onClose, data }: KPIDetailModalProps) {
  const [period, setPeriod] = useState<Period>("1A");

  if (!kpi) return null;

  const filtered = sliceByPeriod(data, period);

  const chartData = filtered.map((d) => ({
    mois: d.mois.substring(0, 3),
    valeur: kpi.getValue(d),
    target: kpi.target,
  }));

  const isCA = kpi.id === "ca-jour";
  const caBreakdown = isCA
    ? filtered.map((d) => ({
        mois: d.mois.substring(0, 3),
        Bowling: d.caBowling,
        Consommations: d.caConso,
        Arcade: d.caArcade,
        Billard: d.caBillard,
      }))
    : [];

  const latest = filtered[filtered.length - 1];
  const previous = filtered.length > 1 ? filtered[filtered.length - 2] : undefined;
  const currentVal = kpi.getValue(latest);
  const prevVal = previous ? kpi.getValue(previous) : undefined;
  const trend = prevVal !== undefined ? ((currentVal - prevVal) / prevVal) * 100 : undefined;

  const values = filtered.map((d) => kpi.getValue(d));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const maxMonth = filtered[values.indexOf(max)].mois;
  const minMonth = filtered[values.indexOf(min)].mois;
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    color: "hsl(var(--foreground))",
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display text-xl">{kpi.label}</DialogTitle>
            <PeriodSelector value={period} onChange={setPeriod} />
          </div>
          <p className="text-sm text-muted-foreground">{kpi.description}</p>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 my-4">
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Actuel</p>
            <p className="text-xl font-bold font-display">{kpi.format ? kpi.format(currentVal) : currentVal}</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Tendance</p>
            <p className={`text-xl font-bold font-display ${trend !== undefined && trend >= 0 ? "text-success" : "text-destructive"}`}>
              {trend !== undefined ? `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}%` : "—"}
            </p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-xs text-muted-foreground">Moyenne période</p>
            <p className="text-xl font-bold font-display">{kpi.format ? kpi.format(avg) : avg}</p>
          </div>
        </div>

        {chartData.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {isCA ? (
                <BarChart data={caBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="Bowling" fill="hsl(var(--chart-bowling))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Consommations" fill="hsl(var(--chart-conso))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Arcade" fill="hsl(var(--chart-arcade))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Billard" fill="hsl(var(--chart-billard))" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mois" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="valeur" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                  {kpi.target && (
                    <Line type="monotone" dataKey="target" stroke="hsl(var(--accent))" strokeDasharray="5 5" strokeWidth={1.5} dot={false} />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
            Sélectionnez une période plus longue pour afficher le graphique
          </div>
        )}

        <div className="glass-card p-4 mt-2">
          <h4 className="font-display font-semibold text-sm mb-2">📊 Insights automatiques</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {filtered.length > 1 && (
              <>
                <li>• Meilleur mois : <span className="text-success font-medium">{maxMonth}</span> ({kpi.format ? kpi.format(max) : max})</li>
                <li>• Mois le plus faible : <span className="text-destructive font-medium">{minMonth}</span> ({kpi.format ? kpi.format(min) : min})</li>
              </>
            )}
            {kpi.target && (
              <li>• {currentVal >= kpi.target ? "✅ Objectif atteint" : `⚠️ ${kpi.format ? kpi.format(kpi.target - currentVal) : kpi.target - currentVal} restant pour atteindre l'objectif`}</li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
