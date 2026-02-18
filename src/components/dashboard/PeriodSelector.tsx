import { motion } from "framer-motion";

export type Period = "1M" | "6M" | "1A";

const OPTIONS: { id: Period; label: string }[] = [
  { id: "1M", label: "1 mois" },
  { id: "6M", label: "6 mois" },
  { id: "1A", label: "1 an" },
];

interface PeriodSelectorProps {
  value: Period;
  onChange: (p: Period) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            value === opt.id
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {value === opt.id && (
            <motion.div
              layoutId="period-pill"
              className="absolute inset-0 bg-primary rounded-md"
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export function sliceByPeriod<T>(data: T[], period: Period): T[] {
  if (period === "1M") return data.slice(-1);
  if (period === "6M") return data.slice(-6);
  return data; // 1A = all 12 months
}
