# Graph Report - solvit-web  (2026-11-10)

## Corpus Check
- 75 files · ~38,701 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 2)

## Summary
- 440 nodes · 920 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c8e6e0a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- isotype-scene.tsx
- system.tsx
- react
- services-3d.tsx
- app/page.tsx
- stage.tsx
- layout.tsx
- package.json
- compilerOptions
- appIcon
- hero.tsx
- opengraph-image.tsx
- Design System: SEN Software · Ing. & Soluciones
- motion
- SEN Software · Sitio web
- contacto/route.ts
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 30 edges
2. `ServicePage()` - 23 edges
3. `Home()` - 16 edges
4. `compilerOptions` - 16 edges
5. `@phosphor-icons/react` - 14 edges
6. `motion` - 14 edges
7. `SplitText()` - 13 edges
8. `LogoMark()` - 12 edges
9. `tap()` - 12 edges
10. `next` - 11 edges

## Surprising Connections (you probably didn't know these)
- `AgentObject()` --calls--> `LogoMark()`  [EXTRACTED]
  src/components/services-3d.tsx → src/components/logo.tsx
- `RootLayout()` --calls--> `JsonLd()`  [EXTRACTED]
  src/app/layout.tsx → src/components/json-ld.tsx
- `RootLayout()` --calls--> `LogoMark()`  [EXTRACTED]
  src/app/layout.tsx → src/components/logo.tsx
- `Home()` --calls--> `About()`  [EXTRACTED]
  src/app/page.tsx → src/components/site/about.tsx
- `Home()` --calls--> `Finale()`  [EXTRACTED]
  src/app/page.tsx → src/components/site/finale.tsx

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "isotype-scene.tsx"
Cohesion: 0.06
Nodes (53): @react-three/fiber@^9.8.1, three@^0.186.1, @react-three/fiber, three, createShadowMaterial(), projectShadow(), ShadowCaster, tmp (+45 more)

### Community 1 - "system.tsx"
Cohesion: 0.19
Nodes (16): Attend(), Attract(), BODIES, Bubble(), Close(), EASE, FEED, Head() (+8 more)

### Community 2 - "react"
Cohesion: 0.13
Nodes (25): react, AppIcon(), BRAND_FULL, BRAND_NAME, BRAND_TAGLINE, Logo(), LogoMark(), About() (+17 more)

### Community 3 - "services-3d.tsx"
Cohesion: 0.11
Nodes (22): AgentObject(), BoardTop(), BUBBLES, CORE_LAYERS, DROPS, dropStyle(), FUNNEL_LABELS, FunnelLabels() (+14 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.08
Nodes (45): Home(), metadata, Page(), metadata, Page(), metadata, Page(), metadata (+37 more)

### Community 5 - "stage.tsx"
Cohesion: 0.11
Nodes (24): SafeBoundary, base, m(), OFF, p(), PoseDef, PoseKey, POSES (+16 more)

### Community 6 - "layout.tsx"
Cohesion: 0.07
Nodes (32): nextConfig, next@16.4.0, next, geistMono, manrope, metadata, RootLayout(), viewport (+24 more)

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

### Community 11 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): alt, contentType, size

### Community 13 - "Design System: SEN Software · Ing. & Soluciones"
Cohesion: 0.20
Nodes (9): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Motion & Interaction, 7. Anti-Patterns (Banned), Design System: SEN Software · Ing. & Soluciones (+1 more)

### Community 15 - "motion"
Cohesion: 0.16
Nodes (24): motion, @phosphor-icons/react, Avatar(), Card, COLUMNS, CrmDemo(), SPRING, STATIC (+16 more)

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

- **Why does `react` connect `react` to `isotype-scene.tsx`, `system.tsx`, `services-3d.tsx`, `app/page.tsx`, `stage.tsx`, `layout.tsx`, `package.json`, `hero.tsx`, `motion`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Should `isotype-scene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06393442622950819 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `app/page.tsx`, `stage.tsx`, `package.json`, `appIcon`, `opengraph-image.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.12802275960170698 - nodes in this community are weakly interconnected._
- **Why does `@phosphor-icons/react` connect `motion` to `system.tsx`, `react`, `services-3d.tsx`, `app/page.tsx`, `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Should `services-3d.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11462450592885376 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08022598870056497 - nodes in this community are weakly interconnected._