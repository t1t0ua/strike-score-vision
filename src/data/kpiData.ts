export const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export interface MonthlyData {
  mois: string;
  caBowling: number;
  caConso: number;
  caArcade: number;
  caBillard: number;
  tauxOccupation: number;
  panierMoyen: number;
  partClubs: number;
}

export const lyonData: MonthlyData[] = [
  { mois: "Janvier",   caBowling: 3200, caConso: 1800, caArcade: 650,  caBillard: 400, tauxOccupation: 58, panierMoyen: 24, partClubs: 22 },
  { mois: "Février",   caBowling: 3400, caConso: 1900, caArcade: 700,  caBillard: 420, tauxOccupation: 62, panierMoyen: 25, partClubs: 23 },
  { mois: "Mars",      caBowling: 3600, caConso: 2100, caArcade: 750,  caBillard: 450, tauxOccupation: 65, panierMoyen: 26, partClubs: 24 },
  { mois: "Avril",     caBowling: 3800, caConso: 2200, caArcade: 800,  caBillard: 480, tauxOccupation: 68, panierMoyen: 27, partClubs: 25 },
  { mois: "Mai",       caBowling: 4000, caConso: 2400, caArcade: 850,  caBillard: 500, tauxOccupation: 72, panierMoyen: 28, partClubs: 26 },
  { mois: "Juin",      caBowling: 4200, caConso: 2600, caArcade: 900,  caBillard: 520, tauxOccupation: 75, panierMoyen: 29, partClubs: 27 },
  { mois: "Juillet",   caBowling: 4500, caConso: 2800, caArcade: 1000, caBillard: 600, tauxOccupation: 80, panierMoyen: 22, partClubs: 20 },
  { mois: "Août",      caBowling: 4400, caConso: 2700, caArcade: 950,  caBillard: 580, tauxOccupation: 78, panierMoyen: 21, partClubs: 19 },
  { mois: "Septembre", caBowling: 3900, caConso: 2300, caArcade: 820,  caBillard: 490, tauxOccupation: 70, panierMoyen: 30, partClubs: 28 },
  { mois: "Octobre",   caBowling: 4100, caConso: 2500, caArcade: 880,  caBillard: 510, tauxOccupation: 74, panierMoyen: 31, partClubs: 29 },
  { mois: "Novembre",  caBowling: 3700, caConso: 2200, caArcade: 780,  caBillard: 460, tauxOccupation: 67, panierMoyen: 32, partClubs: 30 },
  { mois: "Décembre",  caBowling: 4800, caConso: 3000, caArcade: 1100, caBillard: 650, tauxOccupation: 85, panierMoyen: 34, partClubs: 32 },
];

// Derived KPIs
export function getLatestMonth() {
  return lyonData[lyonData.length - 1];
}

export function getCATotal(d: MonthlyData) {
  return d.caBowling + d.caConso + d.caArcade + d.caBillard;
}

export function getAvg(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// KPI definitions
export interface KPIDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  unit: string;
  getValue: (d: MonthlyData) => number;
  target?: number;
  format?: (v: number) => string;
}

const euroFormat = (v: number) => `${v.toLocaleString("fr-FR")} €`;
const pctFormat = (v: number) => `${v}%`;

export const KPI_DEFINITIONS: KPIDefinition[] = [
  {
    id: "ca-jour",
    label: "CA par jour",
    description: "Chiffre d'affaires quotidien toutes activités confondues",
    icon: "TrendingUp",
    unit: "€",
    getValue: (d) => getCATotal(d),
    target: 10000,
    format: euroFormat,
  },
  {
    id: "taux-occupation",
    label: "Taux d'occupation pistes",
    description: "Pourcentage d'utilisation des pistes de bowling",
    icon: "Target",
    unit: "%",
    getValue: (d) => d.tauxOccupation,
    target: 70,
    format: pctFormat,
  },
  {
    id: "taux-annexes",
    label: "Taux utilisation annexes",
    description: "Taux d'utilisation des espaces arcade et billard",
    icon: "Gamepad2",
    unit: "%",
    getValue: (d) => Math.round(((d.caArcade + d.caBillard) / (1500 + 800)) * 100),
    target: 60,
    format: pctFormat,
  },
  {
    id: "parties-piste",
    label: "Parties moy. / piste / jour",
    description: "Nombre moyen de parties jouées par piste et par jour",
    icon: "Repeat",
    unit: "",
    getValue: (d) => Math.round((d.caBowling / 8) * 10) / 10, // 8 pistes simulées
    format: (v) => v.toFixed(1),
  },
  {
    id: "panier-moyen",
    label: "Panier moyen / client",
    description: "Dépense moyenne par client lors d'une visite",
    icon: "ShoppingCart",
    unit: "€",
    getValue: (d) => d.panierMoyen,
    target: 24,
    format: euroFormat,
  },
  {
    id: "taux-bar",
    label: "Clients consommant au bar",
    description: "Pourcentage de clients effectuant une consommation au bar",
    icon: "Wine",
    unit: "%",
    getValue: (d) => Math.round((d.caConso / getCATotal(d)) * 100),
    target: 65,
    format: pctFormat,
  },
  {
    id: "ca-annexes",
    label: "CA moyen annexes / visite",
    description: "Revenus moyens des activités annexes par visite client",
    icon: "Zap",
    unit: "€",
    getValue: (d) => Math.round(((d.caArcade + d.caBillard) / 150) * 100) / 100,
    format: euroFormat,
  },
  {
    id: "part-clubs",
    label: "Part revenus clubs / ligues",
    description: "Proportion du CA généré par les clubs et ligues de bowling",
    icon: "Users",
    unit: "%",
    getValue: (d) => d.partClubs,
    target: 30,
    format: pctFormat,
  },
  {
    id: "recurrence",
    label: "Taux de récurrence clients",
    description: "Pourcentage de clients revenant dans les 30 jours",
    icon: "RefreshCw",
    unit: "%",
    getValue: (d) => Math.round(d.partClubs * 1.2 + 10),
    target: 40,
    format: pctFormat,
  },
];

// OKR definitions
export interface KeyResult {
  id: string;
  label: string;
  current: number;
  target: number;
  unit: string;
  actions: string[];
}

export interface OKRDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
  keyResults: KeyResult[];
}

export const OKR_DEFINITIONS: OKRDefinition[] = [
  {
    id: "obj-1",
    emoji: "🎯",
    title: "Identifier et consolider le cœur de business",
    description: "Comprendre la contribution de chaque activité et prioriser les investissements",
    keyResults: [
      {
        id: "kr-1-1",
        label: "Mesurer la contribution de chaque activité au CA sous 3 mois",
        current: 85,
        target: 100,
        unit: "%",
        actions: [
          "Mise en place du suivi par activité ✅",
          "Dashboard de répartition CA en cours",
          "Rapport mensuel automatisé à finaliser",
        ],
      },
      {
        id: "kr-1-2",
        label: "Identifier l'activité avec la meilleure marge nette",
        current: 60,
        target: 100,
        unit: "%",
        actions: [
          "Collecte des coûts par activité en cours",
          "Analyse des charges variables à compléter",
          "Calcul de la marge nette par activité à finaliser",
        ],
      },
      {
        id: "kr-1-3",
        label: "Définir un plan d'investissement prioritaire",
        current: 30,
        target: 100,
        unit: "%",
        actions: [
          "Identification des axes d'investissement",
          "Chiffrage des investissements nécessaires",
          "Validation du plan avec la direction",
        ],
      },
    ],
  },
  {
    id: "obj-2",
    emoji: "🏗️",
    title: "Optimiser la rentabilité des infrastructures",
    description: "Maximiser l'utilisation des pistes et réduire les périodes creuses",
    keyResults: [
      {
        id: "kr-2-1",
        label: "Atteindre un taux d'occupation moyen des pistes de 70%",
        current: 71,
        target: 70,
        unit: "%",
        actions: [
          "Tarifs dynamiques en heures creuses ✅",
          "Partenariats CE entreprises ✅",
          "Offres étudiants semaine lancées",
        ],
      },
      {
        id: "kr-2-2",
        label: "Augmenter le CA par piste de 15%",
        current: 10,
        target: 15,
        unit: "%",
        actions: [
          "Upsell boissons pendant les parties",
          "Formules premium avec chaussures incluses",
          "Événements thématiques le week-end",
        ],
      },
      {
        id: "kr-2-3",
        label: "Réduire les plages horaires creuses de 20%",
        current: 12,
        target: 20,
        unit: "%",
        actions: [
          "Cartographie des créneaux sous-occupés ✅",
          "Happy hours bowling 14h-17h",
          "Bowling nocturne les vendredis",
        ],
      },
    ],
  },
  {
    id: "obj-3",
    emoji: "💰",
    title: "Augmenter la consommation par client",
    description: "Accroître le panier moyen et le taux de consommation au bar",
    keyResults: [
      {
        id: "kr-3-1",
        label: "Augmenter le panier moyen de 18€ à 24€",
        current: 27,
        target: 24,
        unit: "€",
        actions: [
          "Nouvelle carte snacking ✅",
          "Suggestions personnalisées en caisse",
          "Formules duo et famille lancées",
        ],
      },
      {
        id: "kr-3-2",
        label: "Atteindre 65% de clients consommant au bar",
        current: 58,
        target: 65,
        unit: "%",
        actions: [
          "Affichage digital des promotions ✅",
          "Service en piste à tester",
          "Cocktails signatures à développer",
        ],
      },
      {
        id: "kr-3-3",
        label: "Créer 3 offres packagées (Bowling + Boisson + Arcade)",
        current: 2,
        target: 3,
        unit: "offres",
        actions: [
          "Pack Famille (2h bowling + 4 boissons + 10 jetons) ✅",
          "Pack Soirée (1h bowling + cocktail + arcade illimitée) ✅",
          "Pack Étudiant à concevoir",
        ],
      },
    ],
  },
  {
    id: "obj-4",
    emoji: "🔄",
    title: "Développer l'activité clubs et récurrence",
    description: "Fidéliser la clientèle et augmenter la part des revenus récurrents",
    keyResults: [
      {
        id: "kr-4-1",
        label: "Augmenter de 25% le nombre de licenciés",
        current: 15,
        target: 25,
        unit: "%",
        actions: [
          "Journées portes ouvertes mensuelles",
          "Tarifs préférentiels licenciés ✅",
          "Communication réseaux sociaux",
        ],
      },
      {
        id: "kr-4-2",
        label: "Générer 30% du CA via clientèle récurrente",
        current: 22,
        target: 30,
        unit: "%",
        actions: [
          "Identification des clients récurrents ✅",
          "Offres de fidélisation en cours",
          "Abonnements mensuels à lancer",
        ],
      },
      {
        id: "kr-4-3",
        label: "Mettre en place un programme fidélité",
        current: 40,
        target: 100,
        unit: "%",
        actions: [
          "Benchmark programmes concurrents ✅",
          "Cahier des charges rédigé ✅",
          "Développement de l'app en cours",
        ],
      },
    ],
  },
];

// Hourly heatmap data (simulated)
export const HOURS = Array.from({ length: 14 }, (_, i) => `${i + 10}h`);
export const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function generateHeatmapData() {
  return DAYS.map((day) =>
    HOURS.map((hour) => {
      const h = parseInt(hour);
      const isWeekend = day === "Sam" || day === "Dim";
      const base = isWeekend ? 60 : 30;
      const peak = h >= 18 && h <= 21 ? 30 : h >= 14 && h <= 16 ? 15 : 0;
      const lunch = h >= 12 && h <= 13 ? 10 : 0;
      return Math.min(100, base + peak + lunch + Math.floor(Math.random() * 15));
    })
  );
}
