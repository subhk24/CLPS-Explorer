# CLPS Explorer — NASA 2026 Challenge Submission
### Commercial Lunar Payload Services Scientific Intelligence & Mission Catalog

> **Disclaimer:** *CLPS Explorer is an independent third-year university Computer Science challenge submission for the NASA 2026 Challenge. It is not an official NASA product and does not represent an official agency endorsement. All scientific datasets, lunar coordinates, and mission parameters are curated from publicly available NASA Science Mission Directorate, Planetary Data System, and contractor public domain records.*

---

## 1. Project Overview

**CLPS Explorer** is a high-reliability, research-grade web platform and interactive lunar cartography interface dedicated to NASA’s **Commercial Lunar Payload Services (CLPS)** initiative. 

Under the CLPS framework, NASA awards competitive, firm-fixed-price task orders to American commercial aerospace vendors to deliver science instruments, technology demonstrators, and resource prospectors directly to the Moon in support of the Artemis campaign.

CLPS Explorer provides scientists, aerospace engineers, educators, and space advocates with an authoritative, unified interface to:
- Trace every awarded commercial delivery from contract baseline through lunar surface operations.
- Interactively explore manifested NASA payloads, principal investigators, science domains, and research questions.
- Visualize landing sites on 2D mathematical projections (Nearside orthographic, Far Side orthographic, South Polar azimuthal) and an interactive 3D WebGL selenography globe.
- Review verifiable data provenance, orbiter confirmation citations (e.g. LROC imaging), and primary source bulletins.

---

## 2. Problem Statement & Mission Need

NASA's CLPS initiative is one of the most dynamic public-private exploration partnerships in aerospace history. However, information regarding task order awards, lander flight models, changing launch vehicle manifests, manifested instrument suites, and verified surface coordinates is often fragmented across separate press releases, procurement bulletins (SAM.gov), technical reports, and contractor announcements.

Furthermore, following events like the cancellation of the VIPER rover in July 2024 and landing telemetry realities (such as Intuitive Machines' IM-1 tilted rest orientation), public information can easily become conflated with outdated assumptions or unverified social media claims.

**CLPS Explorer solves this by:**
1. Enforcing strict, verifiable data provenance with explicit separation between **confirmed historical milestones** and **planned target windows**.
2. Never presenting a planned landing as a successful touchdown.
3. Distinguishing discrete flight instruments from composite PRISM/STMD multi-instrument packages.
4. Providing a restrained, authentic NASA scientific platform aesthetic without decorative visual noise or mock live telemetry.

---

## 3. Target Users & Use Cases

- **Aerospace Engineering Students & Researchers:** Cross-referencing lander mass capacities, propulsion architectures, and launch vehicle heritage.
- **Planetary Scientists & Instrument Teams:** Tracking where specific instrument classes (e.g., volatiles drills, neutron spectrometers, magnetometers) are manifested across lunar terrains.
- **Challenge Judges & Mission Analysts:** Reviewing program metrics with documented counting methodology (17 FFP task orders awarded under the master IDIQ vehicle, 13 catalogued delivery expeditions, 5 prime contractors, 12 active pool vendors).
- **Public Science Communicators:** Accessing authentic NASA photography, LROC orbiter coordinates, and decadal survey objectives.

---

## 4. Architecture & Technology Stack

| Tier | Technology | Rationale |
| :--- | :--- | :--- |
| **Runtime & UI** | React 18.3 + TypeScript 5.6 | Strict type-safety, component modularity, and high-performance virtual DOM reconciliation. |
| **Build & Tooling** | Vite 5.4 + Rollup | Instant hot module replacement, optimized manual vendor code-splitting (`three`, `react`, `lucide`). |
| **Styling & Theme** | Tailwind CSS 3.4 | Custom deep-space design tokens (`#000000`, `#0e0e11`, `#161619`) with NASA Blue (`#38BDF8`) and Red (`#E03C31`) accents. |
| **3D Selenography** | Three.js 0.186 | Procedurally generated lunar sphere with normal bump textures, orbit controls, raycast hit detection, and custom billboard sprites. |
| **2D Cartography** | Custom SVG Projections | Exact mathematical projection matrices for Nearside ($0^\circ$), Far Side ($180^\circ$), and South Polar azimuthal stereographic ($85^\circ\text{S}$). |
| **State & Navigation** | URL-Synchronized State + HTML5 History | Shareable, bookmarkable deep links (`?tab=missions&search=odysseus&status=landed`) with bidirectional popstate support. |
| **Quality & Tests** | Vitest 2.1 + React Testing Library + JSDOM | Comprehensive unit, data-integrity, accessibility, and integration test coverage (83 tests across 8 suites). |

---

## 5. Getting Started & Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **Package Manager:** npm (v9+) or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/clps-explorer.git
cd clps-explorer

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 6. Verification, Testing & Production Build

CLPS Explorer adheres to strict engineering verification pipelines:

```bash
# 1. Run TypeScript strict typecheck
npm run typecheck
# Output: tsc --noEmit (0 errors)

# 2. Run full Vitest automated test suite
npm run test
# Output: 83 tests passed across 8 test suites

# 3. Build optimized production bundle
npm run build
# Output: Distributable bundle in dist/ with manual vendor chunking
```

---

## 7. Dataset Structure & Provenance Methodology

All research datasets are located in `docs/research/data/` and loaded via typed, runtime-validated loaders in `src/data/index.ts`:

- `missions.json` (13 catalogued delivery manifests, 17 awarded task orders)
- `payloads.json` (28+ NASA instruments and technology demonstrations)
- `providers.json` (13 American commercial aerospace contractors)
- `landing_sites.json` (8 verified selenographic target regions and touchdown sites)

### Provenance Attributes
Every mission, payload, and site record carries a `DataProvenance` structure:
```typescript
export interface DataProvenance {
  verifiedDate: string;        // ISO YYYY-MM-DD date of record verification
  sourceAgency: string;        // e.g. "NASA SMD / CLPS Program Office"
  primaryCitation: string;     // Document, press release, or bulletin title
  outcomeConfidence: 'confirmed_historical' | 'scheduled_target_window' | 'development_target';
}
```

### Counting Methodology Reconciliation
- **Total Deliveries Awarded (17):** The cumulative number of Firm-Fixed-Price task orders competitively awarded by NASA under the IDIQ contract vehicle.
- **Catalogued Flight Expeditions (13):** The discrete mission delivery manifests currently catalogued with designated landers, target coordinates, and flight schedules.
- **Prime Awarded Contractors (5):** Intuitive Machines, Firefly Aerospace, Astrobotic Technology, Team Draper, and Blue Origin.
- **Eligible Vendor Pool (12):** Active aerospace companies on the master IDIQ contract eligible to bid on upcoming task orders (plus Masten Space Systems, acquired by Astrobotic).

---

## 8. Data Limitations & Ground Truth Constraints

1. **Launch Windows vs. Firm Calendar Dates:** All future launch dates (2025–2028) represent **target flight windows**, not immovable calendar appointments. High-latitude lunar polar landing sites possess limited monthly synodic illumination windows; any launch hold can slip a flight by approximately 28 days.
2. **Planned Target Zones vs. Orbiter Touchdowns:** Only missions that have successfully touched down (`IM-1 Odysseus` confirmed by NASA Lunar Reconnaissance Orbiter Camera Image M1463385732R at $80.1221^\circ\text{S}, 1.4395^\circ\text{E}$, and `Blue Ghost 1` at Mare Crisium) display verified coordinates. All planned missions display regional target zones.
3. **Discrete Instruments vs. Integrated Packages:** For future task orders where NASA has established the delivery order but instrument selection is in progress, records are explicitly labeled as an `Integrated Science Package` (e.g. PRISM-2 call selections, STMD cryogenic fluid management packages).

---

## 9. Accessibility & Performance (WCAG 2.2 AA)

- **Keyboard Navigation:** Full interactive support with logical tab order, visible focus rings (`focus-visible:ring-2 focus-visible:ring-white`), and a dedicated skip-to-content anchor.
- **Global Shortcuts:** `Cmd+K` / `Ctrl+K` immediately focuses the mission search input from any page.
- **Screen Reader Announcements:** Dynamic result counters utilize `aria-live="polite"` to notify assistive technology of filtered search changes.
- **Non-Color Status Indicators:** Mission statuses feature text labels and geometric badge shapes to ensure readability for color-blind users.
- **Reduced Motion:** Respects `prefers-reduced-motion` CSS media queries.
- **Error Boundaries:** Isolated React `ErrorBoundary` wrappers prevent 3D WebGL or rendering faults from unmounting the global application shell.

---

## 10. Technical Decisions to Explain in a Project Review

When presenting this project during challenge review or technical interviews:

1. **Why Pure Client-Side Architecture over a Heavy Backend?**  
   NASA mission manifests for the current decadal horizon are bounded, highly structured scientific records. Embedding a validated, typed in-memory data layer with runtime schema checking ensures zero latency, offline capability, instantaneous multi-filter evaluation, and zero server maintenance cost or attack surface.
2. **Why Custom SVG Projections alongside Three.js?**  
   While Three.js provides intuitive 3D spatial context, scientific cartography frequently demands orthographic and polar stereographic flat projections for accurate lunar coordinate reading without perspective distortion. Providing both ensures both cinematic exploration and rigorous analytical utility.
3. **How Does URL State Synchronization Prevent Desynchronization?**  
   The application uses a unidirectional state flow where filter and navigation events push synchronized query parameters (`?tab=missions&search=...&status=...`) to `window.history`. The `popstate` listener guarantees that browser back and forward actions restore identical search states.
4. **How Is Scientific Integrity Enforced in Code?**  
   `validateDataIntegrity()` runs on initialization and unit tests, checking foreign keys, coordinate ranges ($-90 \le \text{lat} \le 90$, $-180 \le \text{lon} \le 180$), and status enums, failing fast if an unverified orphan record is detected.

---

## 11. Demonstration Walkthrough (5-Minute Script)

1. **Homepage (0:00 - 1:00):**  
   Highlight the cinematic lunar descent video, the NASA Artemis delivery manifest, verified metric ribbon (explain the 17 task orders vs 13 catalogued missions methodology), and interactive 3D Moon preview.
2. **Missions Explorer (1:00 - 2:15):**  
   Demonstrate instantaneous multi-criteria search (`Cmd+K`), status filters (Landed vs Planned), provider dropdowns, and sorting (by Launch Date, Name, Payloads). Open the `IM-1 Odysseus` dossier to showcase authentic NASA photography, telemetry ribbons, manifested payloads, and LROC verification provenance.
3. **Payloads Catalog (2:15 - 3:15):**  
   Filter by scientific discipline (e.g. `Volatiles & Geochemistry` or `Extreme Environment Technology`). Inspect the `TRIDENT` cryogenic permafrost drill and review its research question and host mission link.
4. **Interactive Lunar Map (3:15 - 4:15):**  
   Toggle between Nearside, Far Side, and South Polar projections. Switch to the Three.js 3D Selenography globe to demonstrate live rotation, marker raycasting, and coordinate readouts.
5. **Timeline & Analytics (4:15 - 5:00):**  
   Expand the Flight Analytics panel to display deliveries by year (2024–2028), contractor distribution, and payload domains. Walk down the chronological continuum to demonstrate program progression toward sustainable Artemis base camp logistics.

---

## License

MIT License. Designed and engineered for the NASA 2026 Challenge.
