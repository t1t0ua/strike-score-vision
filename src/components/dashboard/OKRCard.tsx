import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { OKRDefinition } from "@/data/kpiData";

interface OKRCardProps {
  okr: OKRDefinition;
  onClick: () => void;
  index: number;
}

function getProgressColor(pct: number) {
  if (pct >= 80) return "bg-success";
  if (pct >= 50) return "bg-warning";
  return "bg-destructive";
}

function getProgressTextColor(pct: number) {
  if (pct >= 80) return "text-success";
  if (pct >= 50) return "text-warning";
  return "text-destructive";
}

export default function OKRCard({ okr, onClick, index }: OKRCardProps) {
  const avgProgress = Math.round(
    okr.keyResults.reduce((sum, kr) => {
      const pct = Math.min(100, (kr.current / kr.target) * 100);
      return sum + pct;
    }, 0) / okr.keyResults.length
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      onClick={onClick}
      className="glass-card p-6 cursor-pointer group hover:border-accent/40 transition-all duration-300 hover:glow-accent"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{okr.emoji}</span>
          <div>
            <h3 className="font-display font-semibold text-base leading-tight">{okr.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{okr.description}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-muted-foreground group-hover:text-accent transition-colors mt-1" />
      </div>

      {/* Overall progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Progression globale</span>
          <span className={`font-semibold ${getProgressTextColor(avgProgress)}`}>{avgProgress}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${avgProgress}%` }}
            transition={{ delay: index * 0.08 + 0.3, duration: 0.6 }}
            className={`h-full rounded-full ${getProgressColor(avgProgress)}`}
          />
        </div>
      </div>

      {/* Key Results mini */}
      <div className="space-y-2">
        {okr.keyResults.map((kr) => {
          const pct = Math.min(100, Math.round((kr.current / kr.target) * 100));
          return (
            <div key={kr.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{kr.label}</p>
              </div>
              <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden flex-shrink-0">
                <div className={`h-full rounded-full ${getProgressColor(pct)}`} style={{ width: `${pct}%` }} />
              </div>
              <span className={`text-xs font-medium w-9 text-right ${getProgressTextColor(pct)}`}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
