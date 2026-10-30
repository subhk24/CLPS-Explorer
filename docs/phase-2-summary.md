# CLPS Explorer: Phase 2 Strategy & UX Summary
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Executive Synthesis of Product Strategy, UX Architecture & Design System  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead Product Strategist & Systems Architect  

---

## 1. Chosen Product Direction
* **Positioning:** An authoritative, source-grounded interactive mission-to-science digital knowledge engine.
* **Tagline:** *"Every Payload Has a Purpose. Every Mission Moves Us Forward."*
* **Core Value:** Replaces fragmented government procurement notices, technical white papers, and press releases with a unified, explorable digital instrument that maps every commercial lunar delivery to its host lander, landing site, manifested NASA instruments, and flight outcomes.

---

## 2. Primary Audience & Signature User Journey
* **Primary Audience:** Curious science learners, educators, and space enthusiasts seeking a clear entry point, alongside aerospace journalists and NASA Challenge evaluators seeking verifiable facts.
* **Signature Journey:** The user enters the homepage, grasps the CLPS commercial delivery model in under 15 seconds, explores verified programmatic metrics, navigates into the Mission Explorer, filters by status or science domain (e.g. searching for polar ice drilling), inspects the specific instruments (e.g., `TRIDENT` + `MSolo`), and verifies claims directly via primary NASA citations.

---

## 3. The Signature Experience: The Mission-to-Science Explorer
Rather than a generic space landing page or an unstable 3D WebGL globe, CLPS Explorer builds a **coherent, tightly integrated relational data experience**:
1. **Verified Program Dashboard:** Grounded metrics with interactive counting definitions.
2. **Searchable Mission Directory:** Instant multi-tag faceted filtering across all 13 verified task orders.
3. **Deep-Dive Mission & Payload Dossiers:** Two-tiered descriptions pairing plain-language explanations with rigorous technical specifications and PI details.
4. **2D Selenographic Map:** Lightweight vector orthographic map illustrating real landing coordinates vs. future target zones.
5. **Flight Continuum Timeline:** Chronological vertical timeline cleanly separating completed historical flights from future planned milestones.

---

## 4. Key Design Decisions (Anti-Template Philosophy)
* **Adherence to `web-design-quality.md`:** Strictly prohibits generic AI card grids, uniform padding, stock hero gradients, and excessive neon styling.
* **Aesthetic Principle:** *Editorial lunar science meets mission control*—obsidian space canvas (`#05070B`), regolith surface graphite (`#111624`), high-contrast starlight typography (`#F8FAFC`), and restrained NASA-inspired cerulean and solar amber accents.
* **Accessible Semantic Statuses:** Every status badge enforces a **Color + Icon + Text rule** (e.g., Emerald CheckCircle for Nominal Landed, Amber AlertTriangle for Anomaly Landed, Rose XCircle for Transit Loss, Clock for Planned). Color alone is never used to convey state.
* **Typographic Hierarchy:** Geometric technical display headings (`Space Grotesk`) paired with highly readable interface body text (`Inter`) and tabular monospace data (`JetBrains Mono`).

---

## 5. Scope Boundaries: MVP vs. Deferred Features
* **Included in MVP:** Program dashboard, searchable mission directory, mission detail modal, payload catalog by 8 science domains, 2D vector lunar map, chronological timeline, sources and methodology view.
* **Deferred Post-MVP:** Heavy Three.js 3D globe (saves ~800KB bundle weight and prevents mobile lag), real-time live telemetry feeds (no open commercial APIs exist), user authentication/bookmarking (preserves privacy and eliminates backend complexity).

---

## 6. Data Limitations Affecting the Design
1. **Target Zones vs. Confirmed Coordinates:** Only landed missions (e.g. IM-1 at Malapert A confirmed by LROC at -80.1221° S, 1.4395° E) have pinpoint coordinates. Planned missions display region centroids labeled as *"Target Zones"*.
2. **Launch Dates as Windows:** All future mission dates are displayed as *"Target Windows"* with disclaimer badges explaining synodic lighting constraints.
3. **"60+ Payloads" Scope:** Explicitly defined as cumulative NASA-provided science and technology payloads awarded across task orders, excluding commercial co-manifests.

---

## 7. Technical Direction
* **Core Stack:** React 18 + TypeScript (strict mode) + Vite + Tailwind CSS v3.
* **Zero Backend / Zero API Keys:** Operates 100% from pre-validated local JSON datasets (`missions.json`, `payloads.json`, `providers.json`, `landing_sites.json`).
* **Performance Budget:** Bundle size under 150 KB (gzip), sub-second first paint, 0.00 CLS, and 95+ across all Lighthouse categories.
* **Security:** Zero external unvetted scripts, strict CSP headers, and secure external link handling (`rel="noopener noreferrer"`).

---

## 8. Summary of Acceptance Criteria
* [x] Every factual statistic has an interactive definition and verified NASA source.
* [x] Future missions are strictly distinct from flown missions.
* [x] Unknown/unconfirmed data is never silently guessed.
* [x] Touch targets exceed $44 \times 44\text{ px}$ with visible high-contrast focus rings.
* [x] Full keyboard navigation and screen reader semantics.
* [x] Responsive layout without horizontal overflow from 375px to 2560px.
* [x] Zero build errors, zero type errors, zero console warnings.

---

## 9. Recommended Next Step
Proceed to **Phase 3: Architecture & Foundation Setup**:
1. Initialize the Vite + React + TypeScript + Tailwind CSS project scaffolding in the workspace.
2. Configure custom lunar design tokens, typography, and SVG assets.
3. Establish the typed data store layer importing our validated JSON datasets.
4. Prepare reusable UI component primitives (`Badge`, `Button`, `Modal`, `Card`, `Container`).
