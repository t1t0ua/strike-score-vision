import { motion } from "framer-motion";
import { TrendingUp, Target, Gamepad2, Repeat, ShoppingCart, Wine, Zap, Users, RefreshCw, LucideIcon } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import type { KPIDefinition, MonthlyData } from "@/data/kpiData";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp, Target, Gamepad2, Repeat, ShoppingCart, Wine, Zap, Users, RefreshCw,
};

interface KPICardProps {
  kpi: KPIDefinition;
  data: MonthlyData;
  previousData?: MonthlyData;
  onClick: () => void;
  index: number;
  sparklineData?: MonthlyData[];
}

export default function KPICard({ kpi, data, previousData, onClick, index, sparklineData }: KPICardProps) {
  const Icon = ICON_MAP[kpi.icon] || TrendingUp;
  const value = kpi.getValue(data);
  const prevValue = previousData ? kpi.getValue(previousData) : undefined;
  const trend = prevValue !== undefined ? ((value - prevValue) / prevValue) * 100 : undefined;
  const formatted = kpi.format ? kpi.format(value) : String(value);

  const targetMet = kpi.target !== undefined && value >= kpi.target;

  // Build sparkline chart data
  const chartPoints = sparklineData
    ? sparklineData.map((d) => ({ v: kpi.getValue(d), m: d.mois.substring(0, 3) }))
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="glass-card p-5 cursor-pointer group hover:border-primary/40 transition-all duration-300 hover:glow-primary"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}>
            {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{kpi.label}</p>
      <p className="text-2xl font-bold font-display tracking-tight">{formatted}</p>

      {/* Mini sparkline chart */}
      {chartPoints && chartPoints.length > 1 && (
        <div className="mt-3 h-12 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartPoints}>
              <defs>
                <linearGradient id={`spark-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Area
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill={`url(#spark-${kpi.id})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Target progress bar - only when no sparkline */}
      {kpi.target !== undefined && (!chartPoints || chartPoints.length <= 1) && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Objectif: {kpi.format ? kpi.format(kpi.target) : kpi.target}</span>
            <span className={targetMet ? "text-success" : "text-warning"}>
              {targetMet ? "✓ Atteint" : "En cours"}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (value / kpi.target) * 100)}%` }}
              transition={{ delay: index * 0.05 + 0.3, duration: 0.6 }}
              className={`h-full rounded-full ${targetMet ? "bg-success" : "bg-primary"}`}
            />
          </div>
        </div>
      )}

      {/* Target status when sparkline is shown */}
      {kpi.target !== undefined && chartPoints && chartPoints.length > 1 && (
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Obj: {kpi.format ? kpi.format(kpi.target) : kpi.target}</span>
          <span className={targetMet ? "text-success font-medium" : "text-warning font-medium"}>
            {targetMet ? "✓ Atteint" : "En cours"}
          </span>
        </div>
      )}
    </motion.div>
  );
}
