# CLPS Explorer: Product Brief & Strategy Document
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Product Strategy, Positioning, Audience & Value Proposition  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead Product Strategist & Aerospace Fact-Checking Team  

---

## 1. Executive Summary & Core Product Definition

* **Product Name:** **CLPS Explorer**
* **Primary Tagline:** **Every Payload Has a Purpose. Every Mission Moves Us Forward.**
* **Short Description:** A research-grade, source-backed interactive digital experience that unifies NASA’s Commercial Lunar Payload Services initiative into an explorable scientific journey.

### The Strategic Problem
NASA's transition to commercial lunar delivery is one of the most consequential policy and engineering shifts in modern space exploration. However, public and academic understanding is severely hampered by fragmented information:
1. **Scattered Data:** Information is distributed across dozens of disparate NASA press releases, SMD program pages, Federal procurement portals (SAM.gov), contractor SEC filings, and scientific white papers.
2. **Technical Obfuscation:** Critical science investigations are hidden behind dense acronyms (e.g., `LEXI`, `LISTER`, `SCALPSS`, `NGLR`, `FSS`) without plain-language explanations of why the science matters.
3. **Outcome Confusion:** Observers struggle to distinguish between a mission failure (Astrobotic Peregrine 1), a successful landing with an orientation anomaly (Intuitive Machines IM-1 Odysseus), and future planned missions.
4. **The "Generic Space Site" Trap:** Most space-themed web projects are decorative, superficial landing pages featuring stock NASA photos, generic cards, and vague generalities without real, grounded data.

### The CLPS Explorer Solution
CLPS Explorer serves as the **definitive, source-grounded mission-to-science knowledge engine**. It connects every commercial delivery contract to its specific lunar landing site, host lander, and manifested NASA instruments, translating complex planetary geology and aerospace contracts into an intuitive, accessible interface.

---

## 2. Product Positioning & Value Proposition

| Element | Specification |
| :--- | :--- |
| **Category** | Interactive Scientific Data Explorer & Aerospace Educational Platform |
| **Primary Question Answered** | *"What is NASA sending to the Moon, who is delivering it, where is it going, and why does each investigation matter for Artemis and lunar science?"* |
| **Unique Value Proposition (UVP)** | The only unified, source-backed explorer that maps all **60+ NASA payloads across 17 commercial task orders** to their specific scientific questions, selenographic coordinates, and verified flight outcomes. |
| **The 60-Second Judge Takeaway** | A deeply researched, visually cinematic, and technically defensible tool that proves a solo developer can synthesize complex government aerospace data into an accessible, high-performance product without compromising scientific rigor. |

---

## 3. Target Audiences & Needs Matrix

```
                      ┌───────────────────────────────────────┐
                      │             CLPS Explorer             │
                      └───────────────────┬───────────────────┘
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         ▼                                ▼                                ▼
┌──────────────────┐             ┌──────────────────┐             ┌──────────────────┐
│ Primary: Public  │             │Secondary: Student│             │Tertiary: Judge / │
│   & Enthusiast   │             │   & Journalist   │             │ Aerospace Expert │
├──────────────────┤             ├──────────────────┤             ├──────────────────┤
│• High-level 'why'│             │• Deep instrument │             │• Data provenance │
│• Clear status    │             │  specifications  │             │• Methodology     │
│• Visual timeline │             │• Filter by domain│             │• Accessibility   │
│• Plain language  │             │• Primary sources │             │• Defensibility   │
└──────────────────┘             └──────────────────┘             └──────────────────┘
```

### 1. Primary Audience: Curious Learners & Space Enthusiasts
* **Need:** Wants to understand what CLPS is in under two minutes without drowning in government procurement jargon.
* **Pain Point:** Confused by conflicting headlines regarding Moon landings and vehicle tilts.
* **Feature Response:** High-level dashboard, visual status badges with plain-language definitions, and interactive timeline.

### 2. Secondary Audience: Students, Educators & Science Journalists
* **Need:** Needs authoritative, citable facts on specific instruments (e.g., "Which mission carries the TRIDENT ice drill?" or "What does LuSEE-Night investigate?").
* **Pain Point:** Hard to find which instruments flew on which missions and what their scientific goals are.
* **Feature Response:** Multi-faceted search and filter by science domain (Volatiles, Geophysics, Plume Dynamics, Dust, etc.), lead institution, and landing site.

### 3. Tertiary Audience: NASA Challenge Judges & Aerospace Specialists
* **Need:** Evaluating scientific accuracy, data integrity, user experience, and technical execution.
* **Pain Point:** Evaluates dozens of superficial submissions with unverified statistics or broken links.
* **Feature Response:** Direct clickable primary NASA citations for every claim, a dedicated Sources & Methodology view, zero fake metrics, and WCAG 2.2 AA accessibility.

---

## 4. Minimum Viable Product (MVP) vs. Deferred Scope

To guarantee an exceptional, polished execution as a solo developer, the feature scope is strictly prioritized:

### Core MVP Scope (The Foundation)
1. **Verified Program Dashboard:** Grounded metrics displaying 17 awarded deliveries, 5 awarded vendors, 13 eligible contractors, and 60+ NASA payloads with explicit definitions and source context.
2. **Searchable Mission Directory:** Instant search and multi-tag filtering across all 13 verified task orders by year, provider, status, destination, and launch vehicle.
3. **Mission Detail Modal/Drawer:** Complete breakdown of each mission's flight profile, landing site, lander specs, manifest list, verified outcome narrative, and primary NASA links.
4. **Payload Directory:** Interactive catalog of 30+ core instruments filterable by 8 scientific capability domains, showing plain-language scientific questions and lead NASA centers.
5. **Interactive 2D Selenographic Explorer:** Vector-based 2D lunar map showing verified landing coordinates vs. future target zones across Nearside, Farside, and the South Pole.
6. **Chronological Flight Timeline:** Interactive vertical timeline distinguishing past flown missions from future target windows through 2028.
7. **Sources & Data Governance View:** Transparent disclosure of all primary NASA sources, counting methodology, status taxonomy, and independent challenge disclaimer.

### Deferred Scope (Post-MVP Enhancements)
* *Live Real-Time Telemetry Feeds:* Deferred because commercial providers do not currently publish open real-time telemetry APIs.
* *Heavy 3D WebGL Globe (Three.js):* Deferred to eliminate performance lag, high battery drain, and mobile accessibility issues in favor of a fast, sharp 2D vector map.
* *User Account / Bookmarking System:* Deferred to eliminate unnecessary backend infrastructure and protect user privacy.

---

## 5. Risk Assessment & Mitigation Matrix

| Risk | Impact | Probability | Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **Launch Schedule Shifts** | High | High | Display all future flight dates as "Target Windows" with explicit status badges; include last-verified timestamps. |
| **Over-simplifying Science** | Medium | Medium | Use a two-tiered description model: a one-sentence plain-language summary followed by technical measurement specifications. |
| **Confusion over "60+ Payloads"** | High | Low | Provide an interactive modal on every metric card explaining exactly what the number counts and how NASA defines it. |
| **Mobile Layout Overflow** | Medium | Low | Design mobile-first with flexible flex/grid layouts, horizontal scroll tabs, and collapsible drawers. |
