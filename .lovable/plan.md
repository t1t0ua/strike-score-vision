

# Passage en mode jour (Light Theme)

## Contexte
Le dashboard utilise actuellement un theme sombre (dark mode) avec des couleurs de fond tres foncees (HSL 222 47% 6%) qui ne convient pas a l'usage souhaite. L'objectif est de basculer vers un theme clair, lumineux et professionnel.

## Modifications prevues

### 1. Variables CSS racine (`src/index.css`)
Remplacement de toutes les variables de couleur dans `:root` pour passer en mode clair :

- **Fond principal** : blanc / gris tres clair (ex: `0 0% 100%` ou `210 20% 98%`)
- **Texte principal** : gris fonce / quasi-noir (ex: `222 47% 11%`)
- **Cartes** : blanc pur avec bordures subtiles grises
- **Couleurs secondaires / muted** : gris clair
- **Bordures** : gris clair (ex: `214 20% 90%`)
- **Sidebar** : fond clair adapte
- Conservation des couleurs d'accent (bleu primaire, orange accent, vert succes, rouge destructive) qui fonctionnent aussi bien en mode clair

### 2. Utilitaires glass-card (`src/index.css`)
Adaptation de la classe `.glass-card` pour un rendu clair :
- Fond blanc semi-transparent avec leger backdrop-blur
- Bordure gris clair
- Ombre legere (box-shadow) pour donner de la profondeur

### 3. Ombres glow
Reduction de l'intensite des effets "glow" pour un rendu plus subtil adapte au fond clair.

### 4. Texte des titres et corps
Les textes resteront lisibles avec un contraste fort sur fond clair (texte fonce sur fond blanc).

## Ce qui ne change pas
- La structure des composants (KPICard, OKRCard, SummaryCards, etc.)
- Les couleurs fonctionnelles (succes vert, warning orange, destructive rouge)
- La couleur primaire bleue et l'accent orange
- La navigation et les interactions

## Resultat attendu
Un dashboard lumineux, professionnel, avec un fond blanc/gris clair, des cartes blanches avec ombres legeres, et un excellent contraste pour la lisibilite.

