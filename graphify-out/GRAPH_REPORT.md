# Graph Report - solvit-web  (2026-11-10)

## Corpus Check
- 61 files · ~32,197 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 3, (none) 2)

## Summary
- 385 nodes · 748 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c7ecc5e`
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
- smooth-scroll.tsx
- SEN Software · Sitio web
- scripts
- contacto/route.ts
- AGENTS.md
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `react` - 30 edges
2. `compilerOptions` - 16 edges
3. `Home()` - 14 edges
4. `motion` - 14 edges
5. `@phosphor-icons/react` - 13 edges
6. `tap()` - 12 edges
7. `SplitText()` - 11 edges
8. `LogoMark()` - 10 edges
9. `Stage()` - 10 edges
10. `appIcon()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --calls--> `About()`  [EXTRACTED]
  src/app/page.tsx → src/components/site/about.tsx
- `Finale()` --calls--> `Logo()`  [EXTRACTED]
  src/components/site/finale.tsx → src/components/logo.tsx
- `Finale()` --calls--> `LeadForm()`  [EXTRACTED]
  src/components/site/finale.tsx → src/components/site/lead-form.tsx
- `Finale()` --calls--> `TileRain()`  [EXTRACTED]
  src/components/site/finale.tsx → src/components/site/tile-rain.tsx
- `Home()` --calls--> `Header()`  [EXTRACTED]
  src/app/page.tsx → src/components/site/header.tsx

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

### Community 0 - "isotype-scene.tsx"
Cohesion: 0.06
Nodes (52): @react-three/fiber@^9.8.1, three@^0.186.1, @react-three/fiber, three, createShadowMaterial(), projectShadow(), ShadowCaster, tmp (+44 more)

### Community 1 - "system.tsx"
Cohesion: 0.11
Nodes (29): motion, @phosphor-icons/react, AgentPreview(), FIELDS, MESSAGES, Msg, TIMELINE, CHANNEL (+21 more)

### Community 2 - "react"
Cohesion: 0.13
Nodes (24): react, AppIcon(), BRAND_FULL, BRAND_NAME, BRAND_TAGLINE, Logo(), LogoMark(), Wordmark() (+16 more)

### Community 3 - "services-3d.tsx"
Cohesion: 0.09
Nodes (32): BoardTop(), BUBBLES, CORE_LAYERS, DROPS, dropStyle(), FUNNEL_LABELS, FunnelLabels(), HardwareObject() (+24 more)

### Community 4 - "page.tsx"
Cohesion: 0.14
Nodes (24): Home(), Cursor(), Column(), Fact, FACTS, Facts(), initials(), PER_PROJECT (+16 more)

### Community 5 - "stage.tsx"
Cohesion: 0.10
Nodes (25): SafeBoundary, base, m(), OFF, p(), PoseDef, PoseKey, POSES (+17 more)

### Community 6 - "layout.tsx"
Cohesion: 0.10
Nodes (17): nextConfig, next@16.4.0, next, geistMono, manrope, metadata, RootLayout(), viewport (+9 more)

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
Cohesion: 0.17
Nodes (12): dependencies, motion@^14.0.0, @phosphor-icons/react@^2.1.10, react@19.3.0, react-dom@19.3.0, sonner@^2.0.8, tw-animate-css@^1.4.0, @types/matter-js@^0.20.2 (+4 more)

### Community 12 - "tile-rain.tsx"
Cohesion: 0.22
Nodes (8): matter-js@^0.20.0, simple-icons@^16.34.0, matter-js, simple-icons, ICONS, SKINS, TileRain(), TILES

### Community 13 - "Design System: SEN Software · Ing. & Soluciones"
Cohesion: 0.22
Nodes (8): 1. Visual Theme & Atmosphere, 2. Color Palette & Roles, 3. Typography Rules, 4. Component Stylings, 5. Layout Principles, 6. Motion & Interaction, 7. Anti-Patterns (Banned), Design System: SEN Software · Ing. & Soluciones

### Community 14 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.0, eslint, eslint-config-next

### Community 15 - "smooth-scroll.tsx"
Cohesion: 0.33
Nodes (4): gsap@^3.15.0, lenis@^1.3.26, gsap, lenis

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

- **Why does `react` connect `react` to `isotype-scene.tsx`, `system.tsx`, `services-3d.tsx`, `page.tsx`, `stage.tsx`, `layout.tsx`, `package.json`, `hero.tsx`, `dependencies`, `tile-rain.tsx`, `smooth-scroll.tsx`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **Should `isotype-scene.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06497175141242938 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `appIcon`, `stage.tsx`, `package.json`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `system.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10756302521008404 - nodes in this community are weakly interconnected._
- **Why does `motion` connect `system.tsx` to `react`, `services-3d.tsx`, `page.tsx`, `stage.tsx`, `package.json`, `hero.tsx`, `dependencies`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.13277310924369748 - nodes in this community are weakly interconnected._
- **Should `services-3d.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09411764705882353 - nodes in this community are weakly interconnected._