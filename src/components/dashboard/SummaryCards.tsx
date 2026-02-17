import { motion } from "framer-motion";
import { TrendingUp, Users, Target, Coins } from "lucide-react";
import { getCATotal } from "@/data/kpiData";
import type { MonthlyData } from "@/data/kpiData";

interface SummaryCardsProps {
  data: MonthlyData[];
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const latest = data[data.length - 1];
  const caTotal = getCATotal(latest);
  const caAnnuel = data.reduce((s, d) => s + getCATotal(d), 0);

  const cards = [
    {
      label: "CA Jour (Déc.)",
      value: `${caTotal.toLocaleString("fr-FR")} €`,
      icon: Coins,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "CA Annuel cumulé",
      value: `${(caAnnuel / 1000).toFixed(0)}k €`,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      label: "Taux d'occupation",
      value: `${latest.tauxOccupation}%`,
      icon: Target,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Panier moyen",
      value: `${latest.panierMoyen} €`,
      icon: Users,
      color: "text-chart-arcade",
      bg: "bg-chart-arcade/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="glass-card p-5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl ${card.bg}`}>
            <card.icon size={22} className={card.color} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className="text-xl font-bold font-display">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
