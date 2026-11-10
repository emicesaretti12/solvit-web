# Graph Report - solvit-web  (2026-11-10)

## Corpus Check
- 62 files · ~35,306 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 2)

## Summary
- 392 nodes · 775 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2c820581`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- isotype-scene.tsx
- system.tsx
- react
- services-3d.tsx
- page.tsx
- stage.tsx
- layout.tsx
- package.json
- compilerOptions
- appIcon
- hero.tsx
- Design System: SEN Software · Ing. & Soluciones
- motion
- SEN Software · Sitio web
- contacto/route.ts
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 30 edges
2. `compilerOptions` - 16 edges
3. `motion` - 14 edges
4. `Home()` - 13 edges
5. `@phosphor-icons/react` - 12 edges
6. `LogoMark()` - 12 edges
7. `tap()` - 12 edges
8. `appIcon()` - 10 edges
9. `WebDemo()` - 10 edges
10. `Works()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AppleIcon()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/apple-icon.tsx → src/app/icons/art.tsx
- `GET()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/icons/any-192/route.ts → src/app/icons/art.tsx
- `GET()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/icons/any-512/route.ts → src/app/icons/art.tsx
- `GET()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/icons/maskable-512/route.ts → src/app/icons/art.tsx
- `RootLayout()` --calls--> `SmoothScroll()`  [EXTRACTED]
  src/app/layout.tsx → src/components/smooth-scroll.tsx

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "isotype-scene.tsx"
Cohesion: 0.06
Nodes (53): @react-three/fiber@^9.8.1, three@^0.186.1, @react-three/fiber, three, createShadowMaterial(), projectShadow(), ShadowCaster, tmp (+45 more)

### Community 1 - "system.tsx"
Cohesion: 0.19
Nodes (16): Attend(), Attract(), BODIES, Bubble(), Close(), EASE, FEED, Head() (+8 more)

### Community 2 - "react"
Cohesion: 0.10
Nodes (33): @phosphor-icons/react, RootLayout(), Home(), AppIcon(), BRAND_FULL, BRAND_NAME, BRAND_TAGLINE, Logo() (+25 more)

### Community 3 - "services-3d.tsx"
Cohesion: 0.12
Nodes (21): BoardTop(), BUBBLES, CORE_LAYERS, DROPS, dropStyle(), FUNNEL_LABELS, FunnelLabels(), HardwareObject() (+13 more)

### Community 4 - "page.tsx"
Cohesion: 0.12
Nodes (27): motion, react, CountUp(), Column(), Fact, FACTS, Facts(), initials() (+19 more)

### Community 5 - "stage.tsx"
Cohesion: 0.11
Nodes (24): SafeBoundary, base, m(), OFF, p(), PoseDef, PoseKey, POSES (+16 more)

### Community 6 - "layout.tsx"
Cohesion: 0.09
Nodes (17): nextConfig, next@16.4.0, next, geistMono, manrope, metadata, viewport, SmoothScroll() (+9 more)

### Community 7 - "package.json"
Cohesion: 0.05
Nodes (49): eslintConfig, dependencies, lenis@^1.3.26, matter-js@^0.20.0, motion@^14.0.0, @phosphor-icons/react@^2.1.10, react@19.3.0, react-dom@19.3.0 (+41 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "appIcon"
Cohesion: 0.22
Nodes (10): AppleIcon(), contentType, size, GET(), GET(), appIcon(), IconCut, iconSvg() (+2 more)

### Community 10 - "hero.tsx"
Cohesion: 0.21
Nodes (12): Dot, Globe(), HOME, landDots(), CLIENTS, Hero(), RotatingWord(), VOICES (+4 more)

### Community 13 - "Design System: SEN Software · Ing. & Soluciones"
Cohesion: 0.20
Nodes (9): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Motion & Interaction, 7. Anti-Patterns (Banned), Design System: SEN Software · Ing. & Soluciones (+1 more)

### Community 15 - "motion"
Cohesion: 0.18
Nodes (21): Avatar(), Card, COLUMNS, CrmDemo(), SPRING, STATIC, StaticCard(), STEPS (+13 more)

### Community 16 - "SEN Software · Sitio web"
Cohesion: 0.33
Nodes (5): Desarrollo, Estructura, Pendientes, SEN Software · Sitio web, Stack

### Community 18 - "contacto/route.ts"
Cohesion: 0.60
Nodes (3): isEmail(), POST(), text()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `page.tsx` to `isotype-scene.tsx`, `system.tsx`, `react`, `services-3d.tsx`, `stage.tsx`, `layout.tsx`, `package.json`, `hero.tsx`, `motion`?**
  _High betweenness centrality (0.281) - this node is a cross-community bridge._
- **Should `isotype-scene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0633879781420765 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `appIcon`, `stage.tsx`, `package.json`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10283687943262411 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `page.tsx` to `system.tsx`, `react`, `services-3d.tsx`, `stage.tsx`, `package.json`, `hero.tsx`, `motion`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Should `services-3d.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._