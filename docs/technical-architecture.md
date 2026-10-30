# CLPS Explorer: Technical Architecture & Implementation Spec
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** System Architecture, Tech Stack, Data Models & Engineering Standards  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead Frontend Architect & Systems Engineer  

---

## 1. Stack Evaluation & Technology Decisions

For a solo developer participating in the NASA Challenge, the architecture must prioritize **maintainability, zero-friction local execution, instant responsiveness, and rock-solid reliability**:

| Component | Selected Technology | Rationale & Trade-off Analysis |
| :--- | :--- | :--- |
| **Framework** | **React 18+ (SPA)** | Proven component model, declarative UI state, robust ecosystem, high community familiarity for judges. |
| **Language** | **TypeScript 5+ (Strict)** | Strict compile-time typing guarantees that missing payload IDs, null landing dates, or invalid coordinates are caught before runtime. |
| **Build Tool** | **Vite** | Sub-second Hot Module Replacement (HMR), zero configuration overhead, optimized Rollup production bundling. |
| **Styling** | **Tailwind CSS v3** | Rapid utility styling, zero runtime CSS overhead, built-in support for custom design tokens, dark mode, and `prefers-reduced-motion`. |
| **Icons** | **Lucide React** | Clean, accessible, lightweight SVG stroke icons with customizable stroke widths and colors. |
| **Map Engine** | **Custom Interactive SVG** | **Deliberate Decision over Three.js:** A 2D orthographic vector map loads in <50ms, works flawlessly on low-end mobile devices, consumes minimal battery, and provides razor-sharp selenographic markers without WebGL canvas overhead. |
| **Data Layer** | **Pre-Validated Local JSON** | Zero backend or database dependencies. All 13 missions, 30+ payloads, 13 providers, and 8 landing sites are bundled directly as static typed assets. Zero API key requirements. |
| **Routing** | **Lightweight Client-Side Router** | Supports bookmarkable deep links (`/missions?status=landed`) while compiling cleanly to static hosting (GitHub Pages / Vercel / Netlify). |

---

## 2. Target Directory & File Structure

```
CLPS/
├── docs/                               # Phase 1 & 2 Strategy, Research & Architecture
│   ├── research/                       # Research dossier, primary sources, interview Q&A
│   │   └── data/                       # Validated JSON datasets (missions, payloads, etc.)
│   ├── product-brief.md
│   ├── information-architecture.md
│   ├── ux-user-journeys.md
│   ├── design-system.md
│   ├── wireframes.md
│   ├── technical-architecture.md
│   └── acceptance-criteria.md
├── src/                                # Frontend Application Source (Phase 4 Build)
│   ├── assets/                         # Vector lunar maps, provider logos, icons
│   ├── components/                     # Reusable Atomic & Composite Components
│   │   ├── common/                     # Badge, Button, Modal, Tooltip, EmptyState
│   │   ├── layout/                     # Navbar, Footer, MobileNav, Container
│   │   ├── map/                        # LunarMapSvg, LandingSitePin, SiteDrawer
│   │   ├── missions/                   # MissionCard, MissionGrid, MissionFilters, MissionDetail
│   │   ├── payloads/                   # PayloadCard, PayloadSearch, ScienceCategoryTabs
│   │   └── timeline/                   # TimelineAxis, TimelineMilestoneCard
│   ├── data/                           # Typed Data Layer (imports validated JSON)
│   ├── hooks/                          # Custom Hooks (useSearch, useUrlParams, useKeyboard)
│   ├── types/                          # Strict TypeScript Interfaces
│   ├── utils/                          # Search, coordinate calculations, formatters
│   ├── views/                          # Route Views (Home, Missions, Payloads, Map, Timeline, Sources)
│   ├── App.tsx                         # Root Application Shell
│   └── main.tsx                        # Application Entry Point
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 3. Strict TypeScript Data Models

```typescript
// src/types/mission.ts

export type MissionStatus = 
  | 'landed_nominal'    // Soft touchdown upright, full surface duration
  | 'landed_anomaly'    // Soft touchdown, operational payloads, vehicle tilt
  | 'transit_loss'      // Anomaly in transit, Earth atmospheric re-entry
  | 'delivered'         // Active surface operations
  | 'planned'           // Future delivery on contract
  | 'testing';          // Lander flight test demonstration

export interface SelenographicCoordinate {
  latitude: number;           // Degrees (-90.0 to +90.0, negative is South)
  longitude: number;          // Degrees (-180.0 to +180.0, negative is West)
  elevationMeters?: number;   // LOLA elevation relative to lunar datum
  targetDescription: string;  // Plain language geological location
  confirmedByOrbiter?: boolean;
}

export interface Mission {
  id: string;                 // e.g. "to2-im"
  name: string;               // e.g. "IM-1 (Odysseus)"
  taskOrder: string;          // e.g. "TO2-IM"
  providerId: string;         // foreign key -> Provider.id
  landerModel: string;        // e.g. "Nova-C"
  targetRegion: string;       // e.g. "Malapert A (Lunar South Pole)"
  coordinates: SelenographicCoordinate;
  launchDate: string | null;  // ISO YYYY-MM-DD
  launchVehicle: string;      // e.g. "SpaceX Falcon 9"
  landingDate: string | null; // ISO YYYY-MM-DD or null if transit loss / planned
  status: MissionStatus;
  statusLabel: string;        // e.g. "Landed (Partial Tilt / Succeeded)"
  nasaPayloadCount: number;
  payloadIds: string[];       // foreign keys -> Payload.id
  summary: string;            // Plain-language narrative summary
  scientificObjectives: string;
  sourceUrl: string;          // Primary NASA URL
}

// src/types/payload.ts

export type ScienceDomain = 
  | 'VG'    // Volatiles & Geochemistry
  | 'GP'    // Geophysics & Interior Structure
  | 'PSI'   // Plume-Surface Interactions & Dust
  | 'SWP'   // Space Weather & Plasma Environment
  | 'AC'    // Astrophysics & Cosmology
  | 'PNT'   // Precision Navigation, Timing & Geodesy
  | 'ISRU'  // In-Situ Resource Utilization & Drilling
  | 'TECH'; // Extreme Environment Technology & Computing

export interface Payload {
  id: string;                 // e.g. "trident-drill"
  name: string;               // e.g. "The Regolith and Ice Drill for Exploring New Terrains"
  acronym: string;            // e.g. "TRIDENT"
  missionId: string;          // foreign key -> Mission.id
  category: ScienceDomain;
  categoryLabel: string;
  leadCenter: string;         // e.g. "Honeybee Robotics / NASA KSC"
  leadPi?: string;            // e.g. "Kris Zacny"
  description: string;        // Technical hardware architecture
  scientificQuestion: string; // Plain-language fundamental science question
  status: string;             // Operational status
  statusLabel: string;
  sourceUrl: string;
}
```

---

## 4. Performance & Quality Budgets

Following [**`web-performance.md`**](file:///Users/subhdeepkaur/Desktop/CLPS/.agents/rules/web-performance.md), the implementation targets strict performance thresholds:

| Metric | Target Budget | Enforcement Mechanism |
| :--- | :---: | :--- |
| **First Contentful Paint (FCP)** | `< 0.8s` | Minimal render-blocking CSS, preloaded fonts. |
| **Largest Contentful Paint (LCP)** | `< 1.2s` | Zero heavy remote imagery; optimized inline SVGs. |
| **Cumulative Layout Shift (CLS)** | `0.00` | Strict explicit aspect ratios on all cards and containers. |
| **Total Blocking Time (TBT)** | `< 50ms` | Zero heavy client compute loops; pre-indexed JSON. |
| **Production Bundle Size** | `< 150 KB gzip`| Lightweight dependencies; zero Three.js or heavy charting bloat. |
| **Lighthouse Score** | `> 95` across all 4 | Performance, Accessibility, Best Practices, and SEO. |

---

## 5. Security Architecture

Following [**`web-security.md`**](file:///Users/subhdeepkaur/Desktop/CLPS/.agents/rules/web-security.md):
1. **Zero External API Vulnerabilities:** The site runs entirely from static local data; no external server endpoints to breach.
2. **Safe Link Protocol:** Every external citation link is explicitly declared with `rel="noopener noreferrer"` and `target="_blank"`.
3. **Strict Content Security Policy (CSP):** `default-src 'self'; img-src 'self' data: https://*.nasa.gov; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;`.
4. **No Secrets / Credentials:** Zero API keys or tokens are stored in the repo.
