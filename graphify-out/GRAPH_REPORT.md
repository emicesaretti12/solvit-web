# Graph Report - solvit-web  (2026-11-18)

## Corpus Check
- 75 files · ~39,422 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 2)

## Summary
- 441 nodes · 924 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `238b5b8d`
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
- Design System: SEN Software · Ing. & Soluciones
- crm-demo.tsx
- SEN Software · Sitio web
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
- `onSubmit()` --calls--> `tap()`  [EXTRACTED]
  src/components/site/lead-form.tsx → src/lib/haptics.ts
- `AppleIcon()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/apple-icon.tsx → src/app/icons/art.tsx
- `GET()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/icons/any-192/route.ts → src/app/icons/art.tsx
- `GET()` --calls--> `appIcon()`  [EXTRACTED]
  src/app/icons/any-512/route.ts → src/app/icons/art.tsx

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "isotype-scene.tsx"
Cohesion: 0.06
Nodes (53): @react-three/fiber@^9.8.1, three@^0.186.1, @react-three/fiber, three, createShadowMaterial(), projectShadow(), ShadowCaster, tmp (+45 more)

### Community 1 - "system.tsx"
Cohesion: 0.19
Nodes (16): Attend(), Attract(), BODIES, Bubble(), Close(), EASE, FEED, Head() (+8 more)

### Community 2 - "react"
Cohesion: 0.08
Nodes (36): matter-js@^0.20.0, matter-js, react, escapeHtml(), isEmail(), ORIGENES, POST(), text() (+28 more)

### Community 3 - "services-3d.tsx"
Cohesion: 0.11
Nodes (22): AgentObject(), BoardTop(), BUBBLES, CORE_LAYERS, DROPS, dropStyle(), FUNNEL_LABELS, FunnelLabels() (+14 more)

### Community 4 - "app/page.tsx"
Cohesion: 0.07
Nodes (51): Home(), metadata, Page(), metadata, Page(), metadata, Page(), metadata (+43 more)

### Community 5 - "stage.tsx"
Cohesion: 0.11
Nodes (24): SafeBoundary, base, m(), OFF, p(), PoseDef, PoseKey, POSES (+16 more)

### Community 6 - "layout.tsx"
Cohesion: 0.06
Nodes (29): nextConfig, next@16.4.0, next, geistMono, manrope, metadata, viewport, alt (+21 more)

### Community 7 - "package.json"
Cohesion: 0.06
Nodes (42): eslintConfig, dependencies, lenis@^1.3.26, react@19.3.0, react-dom@19.3.0, simple-icons@^16.34.0, sonner@^2.0.8, tw-animate-css@^1.4.0 (+34 more)

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

### Community 15 - "crm-demo.tsx"
Cohesion: 0.14
Nodes (25): motion@^14.0.0, @phosphor-icons/react@^2.1.10, motion, @phosphor-icons/react, Avatar(), Card, COLUMNS, CrmDemo() (+17 more)

### Community 16 - "SEN Software · Sitio web"
Cohesion: 0.33
Nodes (5): Desarrollo, Estructura, Pendientes, SEN Software · Sitio web, Stack

## Knowledge Gaps
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `isotype-scene.tsx`, `system.tsx`, `services-3d.tsx`, `app/page.tsx`, `stage.tsx`, `layout.tsx`, `package.json`, `hero.tsx`, `crm-demo.tsx`?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._
- **Should `isotype-scene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0633879781420765 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `appIcon`, `app/page.tsx`, `stage.tsx`, `package.json`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.08408163265306122 - nodes in this community are weakly interconnected._
- **Why does `@phosphor-icons/react` connect `crm-demo.tsx` to `system.tsx`, `react`, `services-3d.tsx`, `app/page.tsx`, `package.json`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Should `services-3d.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11462450592885376 - nodes in this community are weakly interconnected._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07023705004389816 - nodes in this community are weakly interconnected._