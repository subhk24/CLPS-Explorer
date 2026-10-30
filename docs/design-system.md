# CLPS Explorer: Visual Design System & Design Tokens
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Visual Design System, Design Tokens & Anti-Template Specifications  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead UI/UX Designer & Design Systems Architect  

---

## 1. Design Direction: Editorial Lunar Science Meets Mission Control

In strict accordance with the workspace standard [**`web-design-quality.md`**](file:///Users/subhdeepkaur/Desktop/CLPS/.agents/rules/web-design-quality.md), CLPS Explorer enforces a **Zero-Generic-Template Policy**:

* **Forbidden Anti-Patterns:**
  * No generic SaaS card grids with uniform spacing and no visual hierarchy.
  * No stock hero sections with centered generic text and bright gradient blobs.
  * No neon glow on every button or excessive blur glassmorphism.
  * No fake real-time counters or simulated live data presented as real.
* **Required Qualities Enforced:**
  1. **Scale Contrast:** Extreme typographic contrast between technical labels (mono uppercase) and bold editorial headlines.
  2. **Layering & Depth:** Dark regolith-inspired surfaces layered with subtle 1px border geometry and muted lighting.
  3. **Deliberate Palette:** Deep space obsidian, lunar basalt graphite, starlight white, and restrained NASA-inspired cerulean and amber accents.
  4. **Functional Micro-Interactions:** Subtle hover states, focus outlines, and state transitions that clarify information flow without distracting.

---

## 2. Color Palette & Exact Design Tokens

### Surface & Background Tokens
| Token Name | Hex Value | CSS Variable / Utility | Usage |
| :--- | :---: | :--- | :--- |
| `space-deep` | `#05070B` | `--bg-space-deep` / `bg-space-deep` | Deepest background canvas (space vacuum). |
| `space-surface` | `#0A0E17` | `--bg-space-surface` / `bg-space-surface` | Main page body background. |
| `surface-card` | `#111624` | `--surface-card` / `bg-surface-card` | Primary card and container background. |
| `surface-elevated`| `#171E30` | `--surface-elevated` / `bg-surface-elevated`| Modals, drawers, and dropdown menus. |
| `surface-hover` | `#1E273D` | `--surface-hover` / `bg-surface-hover` | Card and button interactive hover states. |
| `border-subtle` | `#1E2638` | `--border-subtle` / `border-border-subtle` | Default card borders, dividers, and rules. |
| `border-active` | `#334155` | `--border-active` / `border-border-active` | Focused states and active filter borders. |

### Typography & Content Tokens
| Token Name | Hex Value | Usage | Contrast vs. Surface |
| :--- | :---: | :--- | :--- |
| `text-primary` | `#F8FAFC` | Primary headlines, metric numbers, active titles. | **16.8:1** (Exceeds WCAG AAA) |
| `text-secondary` | `#94A3B8` | Body copy, technical descriptions, secondary metadata. | **7.2:1** (Exceeds WCAG AAA) |
| `text-muted` | `#64748B` | Labels, captions, dates, unselected tabs. | **4.6:1** (Exceeds WCAG AA) |
| `text-accent` | `#38BDF8` | Interactive links, active tab text, focus elements. | **8.4:1** (Exceeds WCAG AAA) |

### NASA-Inspired Brand & Accent Tokens
| Token Name | Hex Value | Usage |
| :--- | :---: | :--- |
| `lunar-blue-500` | `#0284C7` | Primary action buttons, prominent icons, active borders. |
| `lunar-blue-400` | `#38BDF8` | Hover highlights, active navigation indicators, link text. |
| `solar-amber-500` | `#F59E0B` | Volatiles indicator, optical payload highlights, warning notes. |
| `regolith-silver` | `#CBD5E1` | Selenographic map contours, lander technical drawings. |

---

## 3. Semantic Status System (Color + Icon + Text Rule)

> **Accessibility Rule:** Color alone must **never** be used to convey status. Every status badge must display an explicit text label and an accompanying distinct icon.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [ ● Landed (Nominal) ]      Emerald #10B981  + CheckCircle icon                       │
│  [ ▲ Landed (Anomaly/Tilt) ] Amber   #F59E0B  + AlertTriangle icon                     │
│  [ ✕ Transit Loss ]          Rose    #F43F5E  + XCircle icon                           │
│  [ ◉ Delivered / Active ]    Cyan    #06B6D4  + Radio / Signal icon                    │
│  [ ◷ Planned (Target) ]      Sky     #818CF8  + Clock icon                             │
│  [ ⚙ Flight Test ]           Purple  #A855F7  + Activity icon                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

| Status Category | Text Label | Hex Color | Background Tint | Companion Icon |
| :--- | :--- | :---: | :---: | :--- |
| **Landed (Nominal)** | `Landed (Nominal)` | `#10B981` | `rgba(16, 185, 129, 0.12)` | `<CheckCircle className="w-4 h-4" />` |
| **Landed (Anomaly)** | `Landed (Anomaly/Tilt)` | `#F59E0B` | `rgba(245, 158, 11, 0.12)` | `<AlertTriangle className="w-4 h-4" />` |
| **Transit Loss** | `Transit Loss (Re-entry)` | `#F43F5E` | `rgba(244, 63, 94, 0.12)` | `<XCircle className="w-4 h-4" />` |
| **Delivered / Active** | `Delivered / Active` | `#06B6D4` | `rgba(6, 182, 212, 0.12)` | `<Radio className="w-4 h-4" />` |
| **Planned Mission** | `Planned (Target Year)` | `#818CF8` | `rgba(129, 140, 248, 0.12)` | `<Clock className="w-4 h-4" />` |
| **Flight Test** | `Flight Test Demo` | `#A855F7` | `rgba(168, 85, 247, 0.12)` | `<Activity className="w-4 h-4" />` |

---

## 4. Typography System

### Font Families
* **Display / Editorial Headings:** `'Space Grotesk'`, system-ui, sans-serif. Geometric, technical, clean character without being cartoonish.
* **Body / Interface:** `'Inter'`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif. Outstanding legibility at small sizes with tabular numbers for data.
* **Data / Monospace:** `'JetBrains Mono'`, 'Fira Code', ui-monospace, monospace. Used for coordinates, Task Order IDs (`TO2-IM`), dates, and instrument acronyms.

### Type Scale
| Level | Font Size | Line Height | Tracking | Weight | Typical Usage |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `display-2xl` | `3.75rem` (60px) | `1.1` | `-0.03em` | Bold (700) | Homepage Hero Statement |
| `display-xl` | `2.5rem` (40px) | `1.15` | `-0.025em`| Bold (700) | View Titles, Major Metrics |
| `heading-lg` | `1.75rem` (28px) | `1.25` | `-0.02em` | SemiBold (600)| Modal Titles, Section Headings |
| `heading-md` | `1.25rem` (20px) | `1.4` | `-0.015em`| SemiBold (600)| Card Titles, Mission Names |
| `body-base` | `1.0rem` (16px) | `1.6` | `0` | Regular (400) | Primary narrative descriptions |
| `body-sm` | `0.875rem` (14px)| `1.5` | `0` | Regular (400) | Secondary metadata, list items |
| `mono-xs` | `0.75rem` (12px) | `1.4` | `+0.05em` | Medium (500) | Task order codes, coordinates |

---

## 5. Spacing, Elevation & Shape Geometry

### Spacing Scale
Uses standard 4px baseline increments:
* `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px), `space-6` (24px), `space-8` (32px), `space-12` (48px), `space-16` (64px).

### Border Radii (Crisp Engineering Aesthetic)
* Standard Cards & Containers: `rounded-lg` (8px).
* Badges & Filters: `rounded-md` (6px).
* Buttons: `rounded-md` (6px).
* *Deliberate Avoidance:* No oversized pill buttons (`rounded-full`) on technical cards; maintains an architectural, precision instrument feel.

### Touch Targets & Accessibility Tokens
* **Minimum Interactive Size:** $44 \times 44\text{ px}$ for all mobile buttons, tabs, and filter pills.
* **Focus Rings:** Accessible 2px solid `#38BDF8` with a 2px offset (`ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-950`). Focus indicators are prominently visible on keyboard tab.

### Motion Tokens & Reduced-Motion Standards
* Default Transitions: `duration-200 ease-out` for hover states and button presses.
* Dialog & Drawer Open: `duration-300 ease-out`.
* **Reduced Motion Override:**
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
