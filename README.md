# 🌙 CLPS Explorer
### Commercial Lunar Payload Services — Scientific Intelligence & Mission Catalog

**An independent student-developed platform for exploring NASA's Commercial Lunar Payload Services (CLPS) initiative.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20Visualization-black?logo=threedotjs)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Project Overview

**CLPS Explorer** is a research-oriented web platform and interactive lunar cartography interface dedicated to NASA's **Commercial Lunar Payload Services (CLPS)** initiative.

NASA's CLPS program awards firm-fixed-price task orders to American commercial aerospace vendors to deliver scientific instruments, technology demonstrations, and resource prospectors to the lunar surface in support of the Artemis campaign.

CLPS Explorer brings fragmented mission information into a unified, interactive platform designed for students, researchers, aerospace engineers, educators, and space enthusiasts.

### What the platform offers

- **Mission Intelligence:** Explore commercial lunar delivery missions, task orders, flight manifests, and mission outcomes.
- **Scientific Payload Catalog:** Investigate NASA instruments, principal investigators, science domains, and research objectives.
- **Interactive Lunar Cartography:** Explore lunar landing regions through mathematical 2D projections and a Three.js-powered 3D Moon.
- **Provider Directory:** Discover commercial lunar delivery contractors, lander architectures, and associated missions.
- **Mission Timeline:** Follow historical milestones, ongoing operations, and planned future deliveries.
- **Scientific Data Provenance:** Trace records to NASA publications, LROC imagery, and other publicly available primary sources.

---

## 🎯 Problem Statement & Mission Need

NASA's CLPS initiative represents an important part of commercial lunar exploration. However, information about task order awards, spacecraft, launch manifests, payload instruments, landing locations, and mission outcomes is distributed across multiple sources.

This creates challenges for anyone trying to understand the program as a connected scientific and commercial ecosystem.

CLPS Explorer addresses this fragmentation through a centralized research interface.

### Core objectives

1. **Data Provenance:** Maintain traceable references and distinguish confirmed historical milestones from planned target windows.
2. **Mission Accuracy:** Never represent a planned landing as a successful touchdown.
3. **Payload Classification:** Distinguish individual scientific instruments from integrated PRISM and STMD payload packages.
4. **Scientific Cartography:** Provide interactive lunar visualizations with coordinate-aware landing-site information.
5. **Research Accessibility:** Present complex aerospace information through an accessible and structured interface.

---

## 👥 Target Users

| Audience | Use Cases |
|---|---|
| Aerospace Engineering Students | Compare lander capabilities, propulsion architectures, and mission configurations. |
| Planetary Scientists | Explore scientific instruments, landing regions, and research objectives. |
| Mission Analysts | Examine mission manifests, contractor participation, and delivery histories. |
| Educators & Science Communicators | Explore lunar exploration milestones and publicly available scientific information. |
| Space Enthusiasts | Discover commercial lunar missions and the broader Artemis exploration ecosystem. |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI Framework | React 18.3 | Component-based application architecture |
| Programming Language | TypeScript 5.6 | Static typing and maintainable application logic |
| Build Tool | Vite 5.4 | Development server and optimized production builds |
| Styling | Tailwind CSS 3.4 | Responsive styling and custom design system |
| 3D Visualization | Three.js 0.186 | Interactive 3D lunar globe and spatial visualization |
| 2D Cartography | Custom SVG Projections | Mathematical lunar map projections |
| Navigation | HTML5 History API | URL-synchronized navigation and filters |
| Testing | Vitest 2.1 | Automated testing |
| Component Testing | React Testing Library | UI and component verification |
| Test Environment | JSDOM | Browser-like testing environment |

---

## 🌕 Core Features

### 1. Mission Intelligence

Explore commercial lunar delivery missions through a structured mission catalog.

Features include:
- Mission identification and task order references.
- Commercial contractor information.
- Flight schedules and target dates.
- Mission status classification.
- Landing destinations.
- Associated payload manifests.
- Detailed mission dossiers.

Historical mission outcomes and future target windows are distinguished to avoid misleading representations.

### 2. Scientific Payload Catalog

Explore NASA scientific instruments and technology demonstrations associated with CLPS missions.

The catalog includes:
- Instrument identification.
- Scientific disciplines.
- Principal investigators.
- Associated missions.
- Research questions.
- Instrument capabilities.
- Scientific objectives.
- Technical documentation and references.

### 3. Interactive Lunar Cartography

Explore lunar regions through interactive 2D and 3D visualizations.

**2D map projections:**
- Nearside Orthographic Projection.
- Far Side Orthographic Projection.
- South Polar Azimuthal Stereographic Projection.

**3D lunar visualization:**
- Interactive Three.js lunar globe.
- Surface texture and normal mapping.
- Orbit controls.
- Raycast-based marker interaction.
- Landing-site selection.
- Coordinate inspection.

The platform distinguishes verified touchdown locations from planned target regions.

### 4. Commercial Provider Directory

Explore participating commercial lunar delivery providers.

Provider information includes:
- Organization profiles.
- Headquarters and company information.
- Commercial lander vehicles.
- Propulsion architectures.
- Payload capacities.
- Associated task orders and missions.
- Official references.

### 5. Chronological Mission Timeline

Explore the historical and planned progression of CLPS deliveries.

Features include:
- Chronological mission records.
- Historical flight milestones.
- Mission outcome indicators.
- Planned target windows.
- Contractor information.
- Landing destinations.
- Detailed mission navigation.

### 6. Scientific Sources & Data Provenance

Scientific information is presented with an emphasis on traceability.

The platform references publicly available information from NASA Science Mission Directorate resources, the Planetary Data System, Lunar Reconnaissance Orbiter Camera archives, and commercial contractor publications.

---

## 🏗️ Application Architecture

CLPS Explorer uses a client-side architecture built around typed and structured scientific datasets.

### Technology architecture

```text
CLPS Explorer
│
├── React + TypeScript
│   ├── Shared UI Components
│   ├── Mission Explorer
│   ├── Payload Catalog
│   ├── Provider Directory
│   ├── Lunar Cartography
│   └── Mission Timeline
│
├── Data Layer
│   ├── missions.json
│   ├── payloads.json
│   ├── providers.json
│   └── landing_sites.json
│
├── Visualization Layer
│   ├── Three.js 3D Globe
│   └── Custom SVG Projections
│
├── Navigation
│   └── URL-Synchronized Application State
│
└── Quality Assurance
    ├── Vitest
    ├── React Testing Library
    └── Data Integrity Validation
```

### Data validation

Scientific records use structured data models and runtime validation.

An example provenance interface:

```typescript
export interface DataProvenance {
  verifiedDate: string;
  sourceAgency: string;
  primaryCitation: string;
  outcomeConfidence:
    | 'confirmed_historical'
    | 'scheduled_target_window'
    | 'development_target';
}
```

The validation layer checks:
- Coordinate ranges.
- Mission and payload relationships.
- Required record fields.
- Status classifications.
- Data consistency.

---

## 📊 Dataset Structure & Provenance

Research datasets are maintained under:

```text
docs/
└── research/
    └── data/
        ├── missions.json
        ├── payloads.json
        ├── providers.json
        └── landing_sites.json
```

### Catalog overview

| Dataset | Catalogued Records |
|---|---:|
| Mission Delivery Manifests | 13 |
| Awarded Task Orders | 17 |
| Scientific Payloads & Demonstrations | 28+ |
| Commercial Providers | 13 |
| Lunar Target Regions & Sites | 8 |

### Counting methodology

The platform distinguishes between different program-level counts:

- **17 Awarded Task Orders:** Cumulative firm-fixed-price task orders under the CLPS IDIQ contract vehicle.
- **13 Catalogued Flight Expeditions:** Discrete delivery manifests represented in the current project dataset.
- **5 Prime Awarded Contractors:** Intuitive Machines, Firefly Aerospace, Astrobotic Technology, Team Draper, and Blue Origin.
- **12 Eligible Vendor Pool Members:** Companies included in the project's representation of the master IDIQ vendor pool, subject to the stated counting methodology.

These figures describe different categories and should not be treated as interchangeable mission counts.

---

## 🔬 Data Limitations & Scientific Integrity

Scientific accuracy is a central design consideration.

### 1. Launch Windows vs. Firm Calendar Dates

Future mission dates represent target windows rather than guaranteed launch or landing dates.

Launch schedules can change due to technical, operational, and environmental constraints.

### 2. Planned Target Regions vs. Verified Touchdown Locations

The application distinguishes between planned landing regions and confirmed historical landing locations.

For example:

- **IM-1 Odysseus:** Landed near Malapert A in the lunar south polar region. Its tilted landing orientation is represented in the mission outcome.
- **Blue Ghost Mission 1:** Successfully landed in Mare Crisium.

Coordinates are associated with their relevant source and verification context rather than automatically treating every target coordinate as a confirmed touchdown coordinate.

### 3. Individual Instruments vs. Integrated Packages

Where instrument selection or final payload composition is not established, records are represented as integrated science or technology packages rather than invented individual instruments.

### 4. Data Currency

Mission schedules, payload manifests, contractor information, and program statistics may change.

The catalog should be interpreted according to its documented verification dates and cited sources.

---

## ♿ Accessibility & Performance

The application incorporates accessibility and engineering quality considerations aligned with WCAG 2.2 AA objectives.

Implemented considerations include:

- Keyboard navigation and logical focus order.
- Visible keyboard focus indicators.
- Skip-to-content navigation.
- `Cmd + K` / `Ctrl + K` search shortcut.
- Screen-reader announcements through `aria-live`.
- Text-based mission status indicators.
- Reduced-motion support.
- React error boundaries for isolated rendering failures.

---

## 💻 Getting Started

### Prerequisites

- Node.js 18 or higher (Node.js 20+ recommended).
- npm 9+ or pnpm.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/clps-explorer.git
```

### 2. Navigate to the project

```bash
cd clps-explorer
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local development URL:

```text
http://localhost:5173
```

---

## 🧪 Testing & Production Build

Run the following commands to verify the application.

### TypeScript type checking

```bash
npm run typecheck
```

### Automated test suite

```bash
npm run test
```

### Production build

```bash
npm run build
```

The optimized production files are generated in the `dist/` directory.

**Reported project verification:** 83 tests across 8 suites.

---

## 🧠 Technical Design Decisions

### Why a client-side architecture?

The current catalog consists of bounded, structured research records.

A validated client-side data layer provides:
- Fast filtering and searching.
- Reduced infrastructure complexity.
- No requirement for a dedicated application server.
- Shareable URL-based application state.
- Efficient access to locally bundled scientific records.

### Why both Three.js and custom SVG projections?

Three.js provides an interactive three-dimensional representation of the Moon.

However, scientific cartography also requires flat coordinate-aware representations.

The combination of 3D visualization and mathematical 2D projections supports both spatial exploration and more analytical inspection.

### How does URL synchronization work?

The application synchronizes navigation and filter states with URL query parameters.

For example:

```text
?tab=missions&search=odysseus&status=landed
```

The HTML5 History API and `popstate` handling support browser back and forward navigation while preserving application state.

### How is scientific data integrity maintained?

The validation layer checks:
- Geographic coordinate ranges.
- Foreign-key relationships.
- Required data fields.
- Mission status enums.
- Record consistency.

Automated tests help detect inconsistencies before production builds.

---

## 🎬 Five-Minute Demonstration Walkthrough

The following walkthrough demonstrates the major capabilities of CLPS Explorer.

| Time | Section | Demonstration |
|---|---|---|
| 0:00–1:00 | Mission Control | Introduce the platform, mission overview, program statistics, and lunar visualization. |
| 1:00–2:15 | Missions | Demonstrate searching, filtering, mission statuses, and the IM-1 Odysseus dossier. |
| 2:15–3:15 | Payloads | Explore scientific disciplines, instrument records, and associated missions. |
| 3:15–4:15 | Lunar Map | Switch between 2D projections and the interactive Three.js lunar globe. |
| 4:15–5:00 | Timeline & Analytics | Explore chronological delivery records and program analytics. |

---

## 📚 Research References

The platform uses publicly available scientific and program information.

Primary reference portals include:

- [NASA Commercial Lunar Payload Services](https://www.nasa.gov/commercial-lunar-payload-services/)
- [NASA CLPS Deliveries](https://science.nasa.gov/lunar-science/clps-deliveries/)
- [NASA Lunar Discovery & Exploration Program](https://science.nasa.gov/lunar-science/programs/lunar-discovery-exploration-program/)
- [NASA Planetary Data System](https://pds.nasa.gov/)
- [Lunar Reconnaissance Orbiter Camera](https://www.lroc.asu.edu/)
- [NASA Artemis Program](https://www.nasa.gov/humans-in-space/artemis/)

---

## 👨‍💻 Project Background

CLPS Explorer was developed independently by a third-year Computer Science student as a project for the **NASA 2026 Challenge**.

The project explores how modern web technologies, interactive cartography, structured scientific datasets, and data provenance methodologies can improve access to commercial lunar exploration information.

It represents an effort to combine software engineering with an interest in aerospace exploration and planetary science.

---

## ⚖️ Disclaimer

CLPS Explorer is an independent student-developed educational and research project created in connection with the NASA 2026 Challenge.

It is **not an official NASA website, application, product, or agency publication**. It is not affiliated with, endorsed by, sponsored by, or operated by NASA.

NASA and the Commercial Lunar Payload Services (CLPS) program are referenced for informational and educational purposes.

Scientific records, mission information, imagery, and third-party materials remain subject to their respective sources, licenses, and attribution requirements.

---

## 📄 License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for details.

**Built with curiosity, code, and a passion for lunar exploration. 🌙**
