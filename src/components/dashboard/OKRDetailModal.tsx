import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { OKRDefinition } from "@/data/kpiData";

interface OKRDetailModalProps {
  okr: OKRDefinition | null;
  open: boolean;
  onClose: () => void;
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

export default function OKRDetailModal({ okr, open, onClose }: OKRDetailModalProps) {
  if (!okr) return null;

  const avgProgress = Math.round(
    okr.keyResults.reduce((sum, kr) => sum + Math.min(100, (kr.current / kr.target) * 100), 0) / okr.keyResults.length
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <span className="text-2xl">{okr.emoji}</span> {okr.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{okr.description}</p>
        </DialogHeader>

        {/* Global progress */}
        <div className="glass-card p-4 my-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression globale</span>
            <span className={`text-2xl font-bold font-display ${getProgressTextColor(avgProgress)}`}>{avgProgress}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgProgress}%` }}
              transition={{ duration: 0.8 }}
              className={`h-full rounded-full ${getProgressColor(avgProgress)}`}
            />
          </div>
        </div>

        {/* Key Results detail */}
        <div className="space-y-4 mt-2">
          {okr.keyResults.map((kr, i) => {
            const pct = Math.min(100, Math.round((kr.current / kr.target) * 100));
            return (
              <motion.div
                key={kr.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{kr.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {kr.current} / {kr.target} {kr.unit}
                    </p>
                  </div>
                  <span className={`text-lg font-bold font-display ${getProgressTextColor(pct)}`}>{pct}%</span>
                </div>

                <div className="h-2 rounded-full bg-secondary overflow-hidden mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                    className={`h-full rounded-full ${getProgressColor(pct)}`}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-1.5">
                  {kr.actions.map((action, j) => {
                    const done = action.includes("✅");
                    return (
                      <div key={j} className="flex items-center gap-2 text-xs">
                        {done ? (
                          <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                        ) : (
                          <Circle size={14} className="text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={done ? "text-muted-foreground line-through" : "text-foreground"}>
                          {action.replace(" ✅", "")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
