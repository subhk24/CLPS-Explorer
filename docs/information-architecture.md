# CLPS Explorer: Information Architecture & Navigation Spec
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Information Architecture, Entity Relationships & Navigation Model  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead Information Architect & UX Systems Designer  

---

## 1. Global Navigation Architecture

The site uses a clean, persistent top navigation bar on desktop and an ergonomic bottom action bar / slide-out drawer on mobile devices.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [NASA 2026 CHALLENGE]  CLPS EXPLORER       Missions  Payloads  Lunar Map  Timeline  Sources │ [ ⌘K Search ]
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Route & View Mapping

| Path | View / Page Name | Primary Purpose | Key Entity |
| :--- | :--- | :--- | :--- |
| `/` | **Home / Mission Control** | Program overview, verified metrics, signature interactive preview. | All Entities (Aggregated) |
| `/missions` | **Mission Explorer** | Searchable, filterable directory of all 17 delivery task orders. | `missions.json` |
| `/missions/:id` | **Mission Detail** | Deep dive into flight profile, lander specs, manifest, and outcome. | Single Mission + Child Payloads |
| `/payloads` | **Payload Directory** | Catalog of 30+ core instruments filterable by scientific domain. | `payloads.json` |
| `/payloads/:id` | **Payload Detail** | Plain-language scientific purpose, PI, technical specs, host mission. | Single Payload + Host Mission |
| `/map` | **Lunar Destination Map** | Interactive 2D selenographic map showing landing sites & target zones. | `landing_sites.json` |
| `/timeline` | **Flight History & Schedule** | Chronological timeline distinguishing flown missions from future targets. | `missions.json` (Sorted by date) |
| `/providers` | **Commercial Providers** | Profiles of 5 awarded vendors + eligible contractor pool. | `providers.json` |
| `/sources` | **Sources & Methodology** | Transparent data governance, counting rules, and NASA bibliography. | `sources-and-methodology.md` |
| `/about` | **About the Project** | Solo project background, NASA Challenge disclaimer, architecture notes. | Meta Information |

---

## 2. Entity Relationship Model

The core product operates on a normalized, relational data graph built from our verified research datasets:

```
                  ┌──────────────────────┐
                  │      Provider        │
                  │ (e.g. Firefly, IM)   │
                  └──────────┬───────────┘
                             │ 1
                             │ operates
                             ▼ *
┌──────────────────┐  *      ┌──────────────────────┐  *      ┌──────────────────────┐
│   Landing Site   │◄────────┤       Mission        ├────────►│       Payload        │
│(e.g. Mare Crisium│ targets │ (e.g. Blue Ghost 1)  │ carries │ (e.g. LISTER, LEXI)  │
└──────────────────┘         └──────────┬───────────┘         └──────────┬───────────┘
                                        │ 1                              │ 1
                                        │ verified by                    │ verified by
                                        ▼ *                              ▼ *
                             ┌──────────────────────────────────────────────────┐
                             │                 Primary Source                   │
                             │        (NASA Science, LROC, Press Kits)          │
                             └──────────────────────────────────────────────────┘
```

1. **Mission to Provider:** Many-to-One. Each mission is operated by exactly one commercial prime vendor.
2. **Mission to Landing Site:** Many-to-One. Multiple missions can target the same lunar region (e.g., both Astrobotic Griffin `TO20A` and Intuitive Machines `CP-22` target Mons Mouton).
3. **Mission to Payloads:** One-to-Many. Each mission manifests a discrete set of NASA payloads.
4. **Payload to Science Domain:** Many-to-One. Each payload maps to one of 8 standardized scientific capability domains.
5. **Entity to Sources:** Many-to-Many. Every mission, payload, and coordinate links directly to verifiable NASA primary URLs.

---

## 3. Section-by-Section Structural Specifications

### 1. Home / Mission Control (`/`)
* **Purpose:** Introduce the CLPS initiative, establish immediate credibility via verified metrics, and guide visitors directly into the data.
* **Target User:** All audiences (First-time visitors, judges).
* **Main Content:**
  * Hero Section: Mission statement ("Every Payload Has a Purpose"), program definition, and primary CTA ("Launch Mission Explorer").
  * Program Metric Ribbon: 4 verified statistics (17 Deliveries Awarded, 5 Awarded Contractors, 13 Eligible Pool Vendors, 60+ NASA Payloads, $2.6B IDIQ Ceiling). Each metric includes an interactive tooltip defining the count and linking to the NASA citation.
  * Interactive Spotlight: Dynamic card featuring the latest mission milestone with direct links to its payload manifest.
  * Science Domains Grid: Visual cards representing the 8 science domains (Volatiles, Geophysics, Dust, etc.) with instrument counts.
* **Primary Action:** Click "Explore Missions" or click a science domain filter.
* **Mobile Behavior:** Metric cards collapse into a 2x2 grid; hero image scales responsively; single-column vertical layout.

### 2. Mission Explorer (`/missions`)
* **Purpose:** Provide a high-density, multi-faceted directory of all commercial lunar deliveries.
* **Target User:** Researchers, enthusiasts, judges.
* **Main Content:**
  * Search Bar: Full-text search across mission names, landers, target sites, and payload acronyms.
  * Multi-Tag Filter Bar: Status (`All`, `Landed`, `Delivered`, `Planned`, `Transit Loss`), Provider, Target Region, and Launch Year.
  * Active Filter Badges: Removable pills showing current search constraints with a "Clear All" button.
  * Results Counter: Shows exact match count (e.g., *"Showing 4 of 13 verified deliveries"*).
  * Mission Cards Grid / Table View: Responsive toggle between rich visual cards and compact data table.
* **Empty State:** High-contrast illustration with message: *"No missions found matching '[query]'. Try clearing filters or searching for 'Odysseus', 'Firefly', or 'Mare Crisium'."* with a single-click "Reset Filters" button.
* **Mobile Behavior:** Filters tuck into a slide-over modal drawer; cards display full-width with large touch targets.

### 3. Mission Detail Modal / View (`/missions/:id`)
* **Purpose:** Comprehensive technical and historical dossier for an individual delivery.
* **Target User:** Detailed researchers, fact-checkers, judges.
* **Main Content:**
  * Header Banner: Mission Name, Task Order ID, Provider Logo/Name, and prominent Status Badge with companion icon.
  * Quick Facts Panel: Launch Date, Launch Vehicle, Landing Date, Target Coordinates, and Landing Accuracy.
  * Mission Narrative & Flight Context: Verified summary of the launch, trajectory, landing event, and any operational anomalies.
  * Manifested NASA Payloads Grid: Clickable cards for each carried instrument, displaying payload acronym, full name, category, and lead NASA center.
  * Selenographic Mini-Map: Orthographic pin locating the landing site on the Moon.
  * Primary Sources Footer: Clickable external links with publication dates and archive tags.
* **Primary Action:** Explore an individual payload or view the landing site on the Lunar Map.
* **Mobile Behavior:** Full-screen slide-over modal with persistent sticky close button (`X`) and swipe-down-to-dismiss gesture.

### 4. Payloads & Instruments Directory (`/payloads`)
* **Purpose:** Deep-dive catalog of all NASA science investigations, categorizing *what* NASA is investigating and *why*.
* **Target User:** Science students, educators, planetary science enthusiasts.
* **Main Content:**
  * Capability Tabs: Filter by 8 science domains (Volatiles, Geophysics, Plume Dynamics, Dust, Astrophysics, Navigation, ISRU, Advanced Computing).
  * Instrument Search: Search by acronym (e.g., `TRIDENT`, `NDL`, `LEXI`), PI name, or institution.
  * Payload Cards: Show Acronym, Full Name, Host Mission badge, Category pill, and a one-sentence plain-language scientific purpose.
* **Primary Action:** Click a payload card to inspect full technical specs and scientific questions.
* **Mobile Behavior:** Horizontal scrolling capability pills; cards expand in-place or open detail bottom sheet.

### 5. Lunar Destination Map (`/map`)
* **Purpose:** Selenographic visualizer connecting mission deliveries to their actual geographic destinations on the lunar surface.
* **Target User:** Visual learners, cartography enthusiasts, educators.
* **Main Content:**
  * 2D Lunar Hemispheric Map: Vector-based interactive map displaying Nearside, Farside, and South Polar projections.
  * Documented Coordinate Pins: Color-coded markers distinguishing:
    * *Landed Points (Confirmed by Orbiter)* (e.g., Malapert A, Mare Crisium)
    * *Target Landing Zones (Planned)* (e.g., Reiner Gamma, Schrödinger Basin, Mons Mouton)
  * Location Detail Sidebar / Bottom Sheet: Displays site elevation, geological character, scientific rationale, and missions targeting the site.
* **Fallback Behavior:** If JavaScript or canvas is restricted, automatically renders an accessible, high-contrast selenographic data table with coordinates and descriptions.
* **Mobile Behavior:** Pinch-to-zoom / tap-to-focus controls; bottom sheet drawer displaying site facts upon pin selection.

### 6. Chronological Timeline (`/timeline`)
* **Purpose:** Communicate past flight history and future delivery schedules along an intuitive chronological continuum.
* **Target User:** Anyone wanting a quick temporal understanding of the program.
* **Main Content:**
  * Vertical Flight Axis: Ordered chronologically from Jan 2024 through 2028+.
  * Year Markers: Distinct visual dividers separating completed historical flights from future planned milestones.
  * Milestone Cards: Summary cards with lander silhouettes, provider badges, payload counts, and clear outcome labels.
* **Mobile Behavior:** Streamlined single-column layout with left-anchored vertical progress line.

### 7. Sources & Methodology (`/sources`)
* **Purpose:** Establish complete data transparency, academic rigor, and data provenance.
* **Target User:** NASA Challenge Judges, journalists, fact-checkers.
* **Main Content:**
  * Methodology & Counting Rules: Full explanation of the "60+ payloads across 17 deliveries" metric.
  * Status Taxonomy: Definitions for Landed, Anomaly, Transit Loss, Delivered, and Planned.
  * Authoritative Bibliography: Categorized list of primary NASA URLs, press kits, LROC papers, and SEC filings.
  * Independent Project Disclaimer: Clear statement that this is an independent NASA Challenge 2026 entry.
