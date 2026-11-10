# Graph Report - solvit-web  (2026-11-10)

## Corpus Check
- 67 files · ~35,518 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 2)

## Summary
- 410 nodes · 825 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24b382b7`
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
- dependencies
- tile-rain.tsx
- Design System: SEN Software · Ing. & Soluciones
- eslint.config.mjs
- motion
- SEN Software · Sitio web
- scripts
- contacto/route.ts
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 35 edges
2. `motion` - 19 edges
3. `compilerOptions` - 16 edges
4. `@phosphor-icons/react` - 15 edges
5. `tap()` - 14 edges
6. `Home()` - 14 edges
7. `LogoMark()` - 12 edges
8. `WebDemo()` - 10 edges
9. `Stage()` - 10 edges
10. `appIcon()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `LogoMark()`  [EXTRACTED]
  src/app/layout.tsx → src/components/logo.tsx
- `AgentObject()` --calls--> `LogoMark()`  [EXTRACTED]
  src/components/services-3d.tsx → src/components/logo.tsx
- `HardwareObject()` --calls--> `LogoMark()`  [EXTRACTED]
  src/components/services-3d.tsx → src/components/logo.tsx
- `Stage()` --calls--> `LogoMark()`  [EXTRACTED]
  src/components/three/stage.tsx → src/components/logo.tsx
- `Card()` --calls--> `ServiceScene()`  [EXTRACTED]
  src/components/site/services.tsx → src/components/services-3d.tsx

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "isotype-scene.tsx"
Cohesion: 0.07
Nodes (52): @react-three/fiber@^9.8.1, three@^0.186.1, @react-three/fiber, three, createShadowMaterial(), projectShadow(), ShadowCaster, tmp (+44 more)

### Community 1 - "system.tsx"
Cohesion: 0.11
Nodes (26): @phosphor-icons/react, AgentPreview(), FIELDS, MESSAGES, Msg, TIMELINE, CHANNEL, CrmPreview() (+18 more)

### Community 2 - "react"
Cohesion: 0.11
Nodes (34): react, Home(), AppIcon(), BRAND_FULL, BRAND_NAME, BRAND_TAGLINE, Logo(), LogoMark() (+26 more)

### Community 3 - "services-3d.tsx"
Cohesion: 0.12
Nodes (21): BoardTop(), BUBBLES, CORE_LAYERS, DROPS, dropStyle(), FUNNEL_LABELS, FunnelLabels(), HardwareObject() (+13 more)

### Community 4 - "page.tsx"
Cohesion: 0.16
Nodes (20): CountUp(), Column(), Fact, FACTS, Facts(), initials(), PER_PROJECT, TINTS (+12 more)

### Community 5 - "stage.tsx"
Cohesion: 0.11
Nodes (24): SafeBoundary, base, m(), OFF, p(), PoseDef, PoseKey, POSES (+16 more)

### Community 6 - "layout.tsx"
Cohesion: 0.09
Nodes (19): nextConfig, next@16.4.0, next, geistMono, manrope, metadata, RootLayout(), viewport (+11 more)

### Community 7 - "package.json"
Cohesion: 0.15
Nodes (18): devDependencies, tailwindcss@^4, @tailwindcss/turbopack@^4, @types/node@^20, @types/react@^19, @types/react-dom@^19, @types/three@^0.186.0, typescript@^5 (+10 more)

### Community 8 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 9 - "appIcon"
Cohesion: 0.22
Nodes (10): AppleIcon(), contentType, size, GET(), GET(), appIcon(), IconCut, iconSvg() (+2 more)

### Community 10 - "hero.tsx"
Cohesion: 0.21
Nodes (12): Dot, Globe(), HOME, landDots(), CLIENTS, Hero(), RotatingWord(), VOICES (+4 more)

### Community 11 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, gsap@^3.15.0, lenis@^1.3.26, motion@^14.0.0, @phosphor-icons/react@^2.1.10, react@19.3.0, react-dom@19.3.0, sonner@^2.0.8 (+8 more)

### Community 12 - "tile-rain.tsx"
Cohesion: 0.22
Nodes (8): matter-js@^0.20.0, simple-icons@^16.34.0, matter-js, simple-icons, ICONS, SKINS, TileRain(), TILES

### Community 13 - "Design System: SEN Software · Ing. & Soluciones"
Cohesion: 0.22
Nodes (8): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Motion & Interaction, 7. Anti-Patterns (Banned), Design System: SEN Software · Ing. & Soluciones

### Community 14 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.0, eslint, eslint-config-next

### Community 15 - "motion"
Cohesion: 0.14
Nodes (26): motion, Avatar(), Card, COLUMNS, CrmDemo(), SPRING, STATIC, StaticCard() (+18 more)

### Community 16 - "SEN Software · Sitio web"
Cohesion: 0.33
Nodes (5): Desarrollo, Estructura, Pendientes, SEN Software · Sitio web, Stack

### Community 17 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 18 - "contacto/route.ts"
Cohesion: 0.60
Nodes (3): isEmail(), POST(), text()

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `isotype-scene.tsx`, `system.tsx`, `services-3d.tsx`, `page.tsx`, `stage.tsx`, `layout.tsx`, `package.json`, `hero.tsx`, `dependencies`, `tile-rain.tsx`, `motion`?**
  _High betweenness centrality (0.297) - this node is a cross-community bridge._
- **Should `isotype-scene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06662770309760374 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `appIcon`, `stage.tsx`, `package.json`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `system.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10752688172043011 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `motion` to `system.tsx`, `react`, `services-3d.tsx`, `page.tsx`, `stage.tsx`, `package.json`, `hero.tsx`, `dependencies`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.10509803921568628 - nodes in this community are weakly interconnected._
- **Should `services-3d.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._