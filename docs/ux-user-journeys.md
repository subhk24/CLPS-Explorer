# CLPS Explorer: UX User Journeys & Interaction Specifications
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Persona Scenarios, Step-by-Step Journeys & Interaction Specs  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead UX Designer & Accessibility Specialist  

---

## 1. Primary User Personas

```
┌────────────────────────────────┐  ┌────────────────────────────────┐  ┌────────────────────────────────┐
│  Persona A: Alex (Enthusiast)  │  │  Persona B: Dr. Maya (Analyst) │  │  Persona C: Dr. Marcus (Judge) │
├────────────────────────────────┤  ├────────────────────────────────┤  ├────────────────────────────────┤
│ • High school science student  │  │ • Aerospace journalist & writer│  │ • NASA Challenge Evaluator     │
│ • Wants quick understanding    │  │ • Needs exact technical specs  │  │ • Audits research defensibility│
│ • Browses primarily on mobile  │  │ • Investigates ice drill tech  │  │ • Tests accessibility & polish │
│ • Easily overwhelmed by jargon │  │ • Demands primary citations    │  │ • 60-second rigorous review    │
└────────────────────────────────┘  └────────────────────────────────┘  └────────────────────────────────┘
```

---

## 2. Step-by-Step User Journeys

### Journey A: The 60-Second Curious Visitor ("What is CLPS?")
* **User Goal:** Quickly understand what CLPS is, see which mission made history, and leave with a clear mental model of commercial lunar delivery.
* **Entry Point:** Homepage (`/`) via social link or search engine.
* **Step-by-Step Flow:**
  1. **Land on Hero Section (0–5s):** Reads the headline *"Every Payload Has a Purpose. Every Mission Moves Us Forward."* and the 2-sentence explanation of NASA buying commercial delivery services.
  2. **Scan the Verified Metric Ribbon (5–15s):** Sees the 4 high-contrast metric cards: `17 Deliveries Awarded`, `5 Commercial Providers`, `60+ NASA Payloads`, `$2.6B IDIQ Ceiling`. Taps the `60+ Payloads` tooltip to see the plain-language definition.
  3. **Engage with Latest Milestone Spotlight (15–30s):** Clicks on the featured card for **IM-1 (Odysseus)**.
  4. **Inspect the Mission Modal (30–50s):** Reads that IM-1 was the first commercial lunar landing and first US moon landing in 52 years. Sees that it landed with a tilt at Malapert A but all active payloads operated. Notices NASA's **NDL** payload was patched in real-time to save the descent navigation.
  5. **Exit / Share (50–60s):** Closes modal with `Esc` or tap outside; feels enlightened and shares the link.
* **Friction Mitigation:**
  * *Risk:* User gets confused by whether Odysseus crashed or succeeded.
  * *Solution:* Explicit badge: `"Landed (Partial Tilt / Succeeded)"` with a direct explanatory note on the landing dynamics.

---

### Journey B: The Aerospace Researcher / Journalist ("Ice Prospecting at the South Pole")
* **User Goal:** Identify every NASA instrument designed to drill for water ice at the lunar South Pole, determine which mission carries it, and verify the primary source.
* **Entry Point:** Mission Explorer (`/missions`) or Payloads Directory (`/payloads`).
* **Step-by-Step Flow:**
  1. **Navigate to Payloads Directory (`/payloads`):** Clicks "Payloads" in top navigation or presses `⌘K` / `/` to open search.
  2. **Filter by Science Domain:** Clicks the `"ISRU & Drilling"` and `"Volatiles"` capability filter pills. The list instantly filters to 6 instruments.
  3. **Locate Key Instrument:** Identifies **TRIDENT** (The Regolith and Ice Drill for Exploring New Terrains).
  4. **Inspect Payload Dossier:** Clicks the TRIDENT card. A detailed side drawer opens displaying:
     * Full Name and Acronym (`TRIDENT`)
     * Host Mission: `PRIME-1 (IM-2)` targeting Shackleton Connecting Ridge.
     * Lead Organization: Honeybee Robotics / NASA KSC (PI: Kris Zacny).
     * Operating Mechanism: 1-meter rotary percussive drill extracting cuttings in 10-cm bites.
     * Paired Instrument: **MSolo** (Mass Spectrometer Observing Lunar Operations) to sniff evaporating volatile gases.
     * Status: Planned (Target Window 2025).
  5. **Verify Source:** Clicks the clickable NASA primary link: `https://science.nasa.gov/lunar-science/clps-deliveries/prime-1-im/`. The page opens in a secure new tab.
* **Friction Mitigation:**
  * *Risk:* User doesn't know the acronym `TRIDENT`.
  * *Solution:* Full-text search matches plain queries like `"drill"`, `"ice"`, `"water"`, or `"Honeybee"`.

---

### Journey C: The NASA Challenge Judge ("Evaluating Rigor & Polish")
* **User Goal:** Audit the factual defensibility of the project, verify accessibility and responsive design, test data governance, and evaluate code execution.
* **Entry Point:** Homepage (`/`) with inspection tools open.
* **Step-by-Step Flow:**
  1. **Inspect First Viewport:** Evaluates visual hierarchy, contrast ratios, and anti-template adherence. Confirms no generic template aesthetic.
  2. **Audit Data Governance (`/sources`):** Navigates to Sources & Methodology. Checks how the "60+ payloads across 17 deliveries" statistic was derived. Verifies that the distinction between NASA payloads and commercial co-manifests is clearly documented.
  3. **Test Landing Site Selenography (`/map`):** Opens the 2D Lunar Map. Verifies that Malapert A is marked as a *confirmed landing coordinate* (-80.1221° S, 1.4395° E verified by LROC), while Reiner Gamma and Schrödinger are clearly labeled as *target zones*.
  4. **Test Keyboard & Accessibility:** Presses `Tab` through the entire interface. Confirms visible high-contrast focus rings, logical tab order, and screen-reader accessible ARIA labels.
  5. **Test Responsive Resizing:** Shrinks browser viewport down to 375px (mobile). Confirms zero horizontal overflow, seamless drawer interactions, and legible typography.
* **Friction Mitigation:**
  * *Risk:* Judge questions unverified future dates.
  * *Solution:* Every future flight date explicitly includes the word `"Target"` or `"Planned Window"` with verification timestamps.

---

## 3. Interaction Design Specifications

### Search & Filtering Logic
* **Search Execution:** Full-text search input with a debounced 150ms trigger across:
  * Mission Name (e.g., "Odysseus", "Blue Ghost", "Peregrine")
  * Task Order ID (e.g., "TO2-IM", "CP-11", "TO19D")
  * Provider Name (e.g., "Intuitive Machines", "Firefly", "Draper")
  * Payload Acronym & Name (e.g., "TRIDENT", "NDL", "CADRE")
  * Target Destination (e.g., "Mare Crisium", "Schrödinger", "Reiner Gamma")
* **Filter Combinations:** Multi-facet boolean filtering (`Status` AND `Provider` AND `Science Domain`).
* **Active Filter Pills:** Visible beneath search bar with quick-dismiss (`×`) buttons and a "Clear All" action.
* **URL Sync:** Filter state is reflected in URL search params (e.g., `/missions?status=landed&provider=firefly`) for seamless bookmarking and sharing.

### Modal & Drawer Behavior
* **Trigger:** Clicking any mission or payload card opens a focused view.
* **Backdrop:** Deep tinted overlay (`bg-space-950/80 backdrop-blur-sm`).
* **Focus Trap:** Focus is strictly trapped within the active dialog; pressing `Tab` cycles only through dialog controls.
* **Dismissal:**
  * Pressing `Esc` closes the dialog immediately.
  * Clicking the backdrop overlay closes the dialog.
  * Clicking the persistent top-right close icon (`×`) closes the dialog.
  * Focus returns to the triggering card element upon closing.
* **Scroll Lock:** Background document scroll is locked (`overflow: hidden` on body) while dialog is open.

### Keyboard Shortcuts
* `⌘K` or `/`: Immediately focuses the global search input.
* `Esc`: Closes any open dialog, drawer, or search overlay.
* `Tab` / `Shift+Tab`: Predictable forward/backward navigation across all interactive elements.
* `Enter` / `Space`: Activates buttons, toggles filters, and opens detail views.

### Screen Reader & ARIA Standards
* Dialogs have `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="dialog-title"`.
* Status badges include explicit screen-reader text (e.g., `<span class="sr-only">Mission Status: </span><span>Landed (Anomaly)</span>`).
* External links include `target="_blank"`, `rel="noopener noreferrer"`, and an audible label: `<span class="sr-only">(opens in new tab)</span>`.
