# CLPS Explorer: Comprehensive Wireframe Specifications
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Structural Layouts, Component Wireframes & Responsive Viewports  
**Version:** 1.0.0 (Phase 2)  
**Author:** Lead UX Architect & UI Wireframe Specialist  

---

## 1. Homepage Wireframe (Above-the-Fold First Viewport)

### Desktop First Viewport (1440px × 900px)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  [NASA 2026 CHALLENGE]  CLPS EXPLORER              Missions   Payloads   Lunar Map   Timeline  Sources │ [ ⌘K Search ]
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                        │
│  [ PROGRAM INITIATIVE ]  COMMERCIAL LUNAR PAYLOAD SERVICES                                             │
│                                                                                                        │
│  EVERY PAYLOAD HAS A PURPOSE.                                  ┌────────────────────────────────────┐  │
│  EVERY MISSION MOVES US FORWARD.                               │    [ LUNAR ORTHOGRAPHIC PREVIEW ]  │  │
│                                                                │                                    │  │
│  NASA has partnered with American commercial providers to       │       ● Mare Crisium (Blue Ghost 1)│  │
│  rapidly acquire end-to-end lunar surface deliveries.          │       ● Reiner Gamma (CP-11)       │  │
│  Explore verified missions, scientific payloads, and           │       ▲ Malapert A (IM-1 Odysseus) │  │
│  landing sites powering the Artemis campaign.                  │       ◎ Shackleton Ridge (PRIME-1) │  │
│                                                                │                                    │  │
│  ┌───────────────────────┐   ┌─────────────────────────────┐   │  [ Interactive Vector Projection ] │  │
│  │ Launch Mission Explorer│   │ Explore 2D Lunar Map (Map)  │   └────────────────────────────────────┘  │
│  └───────────────────────┘   └─────────────────────────────┘                                           │
│                                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  VERIFIED PROGRAM METRICS (Official NASA SMD Metrics, July 2026):                                      │
│                                                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │        17        │  │        05        │  │        13        │  │       60+        │  │   $2.6B   │ │
│  │ LUNAR DELIVERIES │  │ AWARDED VENDORS  │  │  ELIGIBLE POOL   │  │  NASA PAYLOADS   │  │  CEILING  │ │
│  │ On FFP Contract  │  │ Active Providers │  │ Vetted Companies │  │ Science & Tech   │  │ Thru 2028 │ │
│  │  [ⓘ Methodology] │  │  [ⓘ Directory]   │  │   [ⓘ Roster]     │  │  [ⓘ Definition]  │  │  [ⓘ IDIQ] │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘  └───────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile First Viewport (375px × 812px)
```
┌───────────────────────────────────────┐
│ [NASA] CLPS EXPLORER            [ ☰ ] │
├───────────────────────────────────────┤
│ [ PROGRAM INITIATIVE ]                │
│                                       │
│ EVERY PAYLOAD HAS                     │
│ A PURPOSE.                            │
│                                       │
│ NASA's commercial delivery service    │
│ to the Moon. Explore missions,        │
│ payloads, and landing sites.          │
│                                       │
│ ┌───────────────────────────────────┐ │
│ │ Launch Mission Explorer           │ │
│ └───────────────────────────────────┘ │
│ ┌───────────────────────────────────┐ │
│ │ Explore 2D Lunar Map              │ │
│ └───────────────────────────────────┘ │
│                                       │
│ ── PROGRAM METRICS ────────────────── │
│ ┌─────────────────┐ ┌───────────────┐ │
│ │       17        │ │      05       │ │
│ │ LUNAR DELIVERIES│ │AWARDED VENDORS│ │
│ └─────────────────┘ └───────────────┘ │
│ ┌─────────────────┐ ┌───────────────┐ │
│ │       60+       │ │     $2.6B     │ │
│ │  NASA PAYLOADS  │ │  IDIQ CEILING │ │
│ └─────────────────┘ └───────────────┘ │
└───────────────────────────────────────┘
```

---

## 2. Mission Explorer Wireframe (`/missions`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Missions Directory                      Showing 13 verified deliveries                      [ ⌘K Search ] │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  [ 🔍 Search missions, landers, destinations, or payload acronyms...                                 ] │
│                                                                                                        │
│  Status:   [ All (13) ]  [ Landed (2) ]  [ Delivered (1) ]  [ Planned (9) ]  [ Transit Loss (1) ]       │
│  Provider: [ All Providers ▾ ]   Year: [ All Years ▾ ]   Destination: [ All Destinations ▾ ]           │
│                                                                                                        │
│  Active Filters: [ Status: Landed × ] [ Clear All ]                                                   │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                        │
│  ┌──────────────────────────────────────────────────┐  ┌─────────────────────────────────────────────┐ │
│  │ TO2-IM • Odysseus             [ ▲ LANDED (TILT) ]│  │ TO19D • Blue Ghost 1       [ ◉ DELIVERED ]  │ │
│  │ Intuitive Machines • Nova-C                      │  │ Firefly Aerospace • Blue Ghost 1            │ │
│  │                                                  │  │                                             │ │
│  │ Destination: Malapert A Crater (80.12° S)        │  │ Destination: Mare Crisium (18.5° N)         │ │
│  │ Touchdown: Feb 22, 2024 (LROC Confirmed)         │  │ Landed: Jan 2025                            │ │
│  │ Launch Vehicle: SpaceX Falcon 9                  │  │ Launch Vehicle: SpaceX Falcon 9             │ │
│  │                                                  │  │                                             │ │
│  │ Carried 6 NASA Payloads:                         │  │ Carried 10 NASA Payloads:                   │ │
│  │ [ NDL ] [ SCALPSS ] [ ROLSES ] [ LN-1 ] +2 more  │  │ [ NGLR ] [ LISTER ] [ LEXI ] [ EDS ] +6 more│ │
│  │                                                  │  │                                             │ │
│  │ [ Inspect Mission Dossier → ]   [ NASA Source ↗ ]│  │ [ Inspect Mission Dossier → ] [NASA Source↗]│ │
│  └──────────────────────────────────────────────────┘  └─────────────────────────────────────────────┘ │
│                                                                                                        │
│  ┌──────────────────────────────────────────────────┐  ┌─────────────────────────────────────────────┐ │
│  │ PRIME-1 (IM-2)                   [ ◷ PLANNED ]   │  │ CP-11 (IM-3)                 [ ◷ PLANNED ]  │ │
│  │ Intuitive Machines • Nova-C                      │  │ Intuitive Machines • Nova-C                 │ │
│  │ Destination: Shackleton Ridge (89.9° S)          │  │ Destination: Reiner Gamma Swirl (7.5° N)    │ │
│  │ Target Launch: 2025                              │  │ Target Launch: 2026                         │ │
│  │                                                  │  │                                             │ │
│  │ Signature Payloads:                              │  │ Signature Payloads:                         │ │
│  │ [ TRIDENT 1m Ice Drill ] [ MSolo Mass Spec ]     │  │ [ Lunar Vertex ] [ CADRE 3-Rover Swarm ]    │ │
│  │                                                  │  │                                             │ │
│  │ [ Inspect Mission Dossier → ]   [ NASA Source ↗ ]│  │ [ Inspect Mission Dossier → ] [NASA Source↗]│ │
│  └──────────────────────────────────────────────────┘  └─────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mission Detail Modal Wireframe (`/missions/:id`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  TASK ORDER: TO2-IM                                                           [ Close × ]  │
│  IM-1 "Odysseus"                                                   [ ▲ LANDED (ANOMALY) ]  │
│  Provider: Intuitive Machines • Lander: Nova-C                                             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│  FLIGHT TELEMETRY & PROFILE                                                                │
│  • Launch: Feb 15, 2024 (SpaceX Falcon 9, LC-39A)                                          │
│  • Touchdown: Feb 22, 2024 (18:23 EST)                                                     │
│  • Landing Site: Malapert A (-80.1221° S, 1.4395° E)                                       │
│  • Elevation: -3,607 meters (Confirmed by NASA Lunar Reconnaissance Orbiter Camera - LROC)│
├────────────────────────────────────────────────────────────────────────────────────────────┤
│  HISTORICAL OUTCOME & ENGINEERING SIGNIFICANCE                                             │
│  Historic flight: the first commercial spacecraft to soft land on the Moon and the first  │
│  American lunar landing since Apollo 17 (1972).                                            │
│                                                                                            │
│  Prior to descent, the lander's primary laser rangefinders failed to activate. In a        │
│  historic real-time patch, NASA's Navigation Doppler Lidar (NDL) payload was routed into   │
│  guidance software to guide the landing. At touchdown, lateral velocity caused a strut     │
│  fracture, leaving Odysseus at a ~30° tilt. All active NASA payloads operated.             │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│  MANIFESTED NASA PAYLOADS (6 Instruments)                                                  │
│                                                                                            │
│  ┌─────────────────────────────────────┐  ┌──────────────────────────────────────────────┐ │
│  │ NDL • Navigation Doppler Lidar      │  │ SCALPSS • Plume-Surface Stereo Cameras        │ │
│  │ Category: Precision Navigation (PNT)│  │ Category: Plume-Surface Interaction (PSI)     │ │
│  │ Lead: NASA Langley (PI: Amzajerdian)│  │ Lead: NASA Langley (PI: Michelle Munk)        │ │
│  │ Saved descent guidance navigation.  │  │ Photogrammetry of engine exhaust scouring.   │ │
│  └─────────────────────────────────────┘  └──────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────┐  ┌──────────────────────────────────────────────┐ │
│  │ ROLSES • Radio Photoelectron Sheath │  │ LN-1 • Lunar Node-1 Navigation Beacon        │ │
│  │ Category: Space Weather / Astronomy │  │ Category: Autonomous Positioning (PNT)       │ │
│  │ Lead: NASA Goddard (PI: Gopalswamy) │  │ Lead: NASA Marshall (PI: Evan Anzalone)      │ │
│  └─────────────────────────────────────┘  └──────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│  PRIMARY CITATIONS & PROVENANCE                                                            │
│  • NASA Science TO2-IM Portal: https://science.nasa.gov/lunar-science/clps-deliveries/to2-im/│
│  • LROC Landing Site Confirmation: https://www.lroc.asu.edu/posts/1359                     │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Lunar Destination Map Wireframe (`/map`)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Selenographic Destination Map           Projection: [ Nearside ]  [ Far Side ]  [ South Pole ]        │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  ┌────────────────────────────────────┐ │
│  │                                                           │  │ SELECTED LANDING SITE              │ │
│  │               [ 2D VECTOR MOON PROJECTION ]               │  │                                    │ │
│  │                                                           │  │ Site: Malapert A                   │ │
│  │       (Sinus Viscositatis)                                │  │ Coordinates: -80.1221° S, 1.4395° E│ │
│  │                ●                                          │  │ Region: South Polar Highlands      │ │
│  │                                     (Mare Crisium)        │  │ Elevation: -3,607m (LROC LOLA)     │ │
│  │      (Reiner Gamma)                       ●               │  │ Status: Confirmed Touchdown        │ │
│  │             ●                                             │  ├────────────────────────────────────┤ │
│  │                                                           │  │ Missions at this site:             │ │
│  │                                                           │  │ • IM-1 Odysseus (TO2-IM) - Landed  │ │
│  │                                                           │  ├────────────────────────────────────┤ │
│  │                                                           │  │ Geological Significance:           │ │
│  │                                                           │  │ Ancient anorthositic crust with    │ │
│  │                            ▲ (Malapert A)                 │  │ high solar illumination on ridges  │ │
│  │                           ◎ (Shackleton Ridge)            │  │ and cold traps in craters.         │ │
│  │                                                           │  │                                    │ │
│  │  Legend:                                                  │  │ [ View Mission Manifest → ]        │ │
│  │  ● Landed / Delivered   ▲ Landed (Anomaly)   ◎ Planned    │  │ [ LROC Imagery Source ↗ ]          │ │
│  └───────────────────────────────────────────────────────────┘  └────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```
