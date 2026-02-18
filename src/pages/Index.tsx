import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Target, MapPin, Calendar, ChevronDown } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { KPI_DEFINITIONS, OKR_DEFINITIONS, SITES } from "@/data/kpiData";
import type { KPIDefinition, OKRDefinition, SiteId } from "@/data/kpiData";
import KPICard from "@/components/dashboard/KPICard";
import OKRCard from "@/components/dashboard/OKRCard";
import KPIDetailModal from "@/components/dashboard/KPIDetailModal";
import OKRDetailModal from "@/components/dashboard/OKRDetailModal";
import SummaryCards from "@/components/dashboard/SummaryCards";
import CABreakdownChart from "@/components/dashboard/CABreakdownChart";
import HeatmapChart from "@/components/dashboard/HeatmapChart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Section = "overview" | "kpis" | "okrs";

const NAV_ITEMS: { id: Section; label: string; icon: typeof BarChart3 }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "kpis", label: "KPIs", icon: Target },
  { id: "okrs", label: "OKRs", icon: Calendar },
];

const Index = () => {
  const [section, setSection] = useState<Section>("overview");
  const [selectedKPI, setSelectedKPI] = useState<KPIDefinition | null>(null);
  const [selectedOKR, setSelectedOKR] = useState<OKRDefinition | null>(null);
  const [siteId, setSiteId] = useState<SiteId>("lyon");
  const [siteMenuOpen, setSiteMenuOpen] = useState(false);

  const site = SITES.find((s) => s.id === siteId)!;
  const siteData = site.data;
  const latestData = siteData[siteData.length - 1];
  const previousData = siteData[siteData.length - 2];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">B</span>
            </div>
            <Popover open={siteMenuOpen} onOpenChange={setSiteMenuOpen}>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 group cursor-pointer text-left">
                  <div>
                    <h1 className="font-display font-bold text-lg leading-tight flex items-center gap-1.5">
                      {site.label}
                      <ChevronDown
                        size={16}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </h1>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin size={10} /> Tableau de Bord Stratégique
                    </p>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-56 p-1.5">
                {SITES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSiteId(s.id);
                      setSiteMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      siteId === s.id
                        ? "bg-primary/15 text-primary"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <MapPin size={14} className={siteId === s.id ? "text-primary" : "text-muted-foreground"} />
                    {s.label}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  section === item.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Overview Section */}
        {section === "overview" && (
          <motion.div
            key={`overview-${siteId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">Vue d'ensemble</h2>
              <p className="text-sm text-muted-foreground">Synthèse des indicateurs clés — {site.shortLabel} — Décembre (dernières données)</p>
            </div>

            <SummaryCards data={siteData} />

            <div className="grid lg:grid-cols-2 gap-6">
              <CABreakdownChart data={siteData} />
              <HeatmapChart />
            </div>

            {/* Quick KPIs */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Indicateurs de Performance Opérationnels</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {KPI_DEFINITIONS.slice(0, 6).map((kpi, i) => (
                  <KPICard
                    key={kpi.id}
                    kpi={kpi}
                    data={latestData}
                    previousData={previousData}
                    onClick={() => setSelectedKPI(kpi)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Quick OKRs */}
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">Objectifs Stratégiques</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {OKR_DEFINITIONS.slice(0, 2).map((okr, i) => (
                  <OKRCard key={okr.id} okr={okr} onClick={() => setSelectedOKR(okr)} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* KPIs Section */}
        {section === "kpis" && (
          <motion.div
            key={`kpis-${siteId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">Indicateurs de Performance Opérationnels</h2>
              <p className="text-sm text-muted-foreground">Cliquez sur un indicateur pour voir le détail et l'évolution</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {KPI_DEFINITIONS.map((kpi, i) => (
                <KPICard
                  key={kpi.id}
                  kpi={kpi}
                  data={latestData}
                  previousData={previousData}
                  onClick={() => setSelectedKPI(kpi)}
                  index={i}
                />
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <CABreakdownChart data={siteData} />
              <HeatmapChart />
            </div>
          </motion.div>
        )}

        {/* OKRs Section */}
        {section === "okrs" && (
          <motion.div
            key={`okrs-${siteId}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h2 className="font-display font-bold text-2xl mb-1">Objectifs et Résultats Clés Stratégiques</h2>
              <p className="text-sm text-muted-foreground">Cliquez sur un objectif pour voir le détail des Key Results et actions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {OKR_DEFINITIONS.map((okr, i) => (
                <OKRCard key={okr.id} okr={okr} onClick={() => setSelectedOKR(okr)} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Modals */}
      <KPIDetailModal kpi={selectedKPI} open={!!selectedKPI} onClose={() => setSelectedKPI(null)} data={siteData} />
      <OKRDetailModal okr={selectedOKR} open={!!selectedOKR} onClose={() => setSelectedOKR(null)} />
    </div>
  );
};

export default Index;
