# CLPS Explorer: Data Quality & Scientific Integrity Audit
**Project:** CLPS Explorer | NASA Challenge 2026  
**Document:** Data Quality Audit, Scientific Uncertainties & Resolution Register  
**Version:** 1.0.0 (Phase 3)  
**Author:** Lead Fact-Checking Analyst & Frontend Architecture Team  

---

## 1. Executive Summary

During Phase 3 engineering implementation, all four research datasets (`missions.json`, `payloads.json`, `providers.json`, `landing_sites.json`) were subjected to automated schema validation, cross-reference audits, coordinate boundary checks, and syntax parsing. 

This document records the exact findings, syntax fixes, and scientific boundary definitions established to preserve complete academic defensibility.

---

## 2. Syntax & Parsing Anomalies Identified and Resolved

### Anomaly 1: Invalid Backslash Escape in `payloads.json`
* **File:** `docs/research/data/payloads.json` (Line 326)
* **Payload:** `TRIDENT` (The Regolith and Ice Drill for Exploring New Terrains)
* **Issue:** The description text contained an unescaped LaTeX-style degree token: `"$-180^\circ C$"`. Standard JSON RFC 8259 specifications strictly forbid unescaped backslashes, throwing a `JSONDecodeError: Invalid \escape` in strict JSON parsers.
* **Resolution:** Replaced `"$-180^\circ C$"` with valid UTF-8 degree symbol: `"-180°C"`.
* **Verification:** Validated by Python `json.load()` and TypeScript `tsc --noEmit` bundler import; zero syntax warnings remain.

---

## 3. Relational Mapping & Manifest Cataloging Audit

### Finding 2: Discrete Instruments vs. Composite Mission Suites
* **Context:** In `missions.json`, each delivery task order specifies a `payloadIds` array and a `nasaPayloadCount`.
* **Audit Result:**
  * For flown missions (`TO2-AB`, `TO2-IM`, `TO19D`), all 21 NASA instruments map 1:1 to discrete records in `payloads.json` with named Principal Investigators, institutions, and operational results.
  * For certain future missions (`TO20A`, `CT-3`, `CS-6`, `CT-4`, `CP-22`), NASA has competitively awarded the delivery task order and established the payload count, but individual instruments represent **technology demonstration packages** or **multi-instrument PRISM suites**:
    * `TO20A`: Uses `"griffin-test-suite"` (rover mass simulator and flight sensor package following NASA's July 2024 VIPER rover cancellation).
    * `CT-3`: Uses `"cfm-tech-demo"` and `"precision-landing-suite"` (Space Technology Mission Directorate cryogenic fluid management demos).
    * `CP-22`: Uses `"prism2-suite"` (PRISM-2 call selections for Mons Mouton).
    * `CS-6`: Uses `"cs6-polar-suite"` (SMD polar environmental suite).
    * `CT-4`: Uses `"stmd-nova-d-suite"` (Nova-D medium-heavy logistics demonstrations).
* **Architecture Handling:**  
  The data layer gracefully handles both discrete payload lookups (`getPayloadsForMission()`) and suite manifests, displaying the exact status and explaining that individual instrument assignments remain subject to NASA announcement. No synthetic or invented instrument names were added.

---

## 4. Selenographic Coordinate Precision & Ground Truth

### Finding 3: Confirmed Orbiter Touchdown Points vs. Regional Target Zones
* **Audit Result:**
  * **Confirmed Touchdown Coordinates:**  
    * **IM-1 Odysseus (TO2-IM):** Confirmed by NASA’s Lunar Reconnaissance Orbiter Camera (LROC) at **80.1221° S, 1.4395° E** (within 1.5 km of target at an elevation of -3,607 meters).
    * **Blue Ghost 1 (TO19D):** Delivered to Mare Crisium basaltic plain (**18.5° N, 61.8° E**).
  * **Target Landing Zones (Planned Missions):**  
    * Coordinates for `PRIME-1` (~89.9° S Shackleton Ridge), `CP-11` (7.5° N, 59.0° W Reiner Gamma), and `CP-12` (75.0° S, 132.5° E Schrödinger Basin) represent **NASA target landing zones**, not touchdown points.
* **Architecture Handling:**  
  The UI explicitly distinguishes `Confirmed Touchdown` (with orbiter verification sources) from `Target Landing Zone`. Coordinate uncertainties and dispersion ellipses are preserved.

---

## 5. Temporal Uncertainties & Launch Date Windows

### Finding 4: Synodic Lighting Windows & Launch Slippages
* **Audit Result:**  
  All future launch dates in NASA press releases are **target launch windows, not locked calendar appointments**. Polar landing sites (e.g. Shackleton Ridge and Mons Mouton) have brief, specific solar illumination windows per month. Any launch hold can slip a flight by ~28 days.
* **Architecture Handling:**  
  The `StatusBadge` and `MissionDetailModal` components explicitly display future dates under the banner *"Planned (Target Window)"* and never present future dates as confirmed historical milestones.

---

## 6. Summary of Data Integrity Verification

| Test Criterion | Expected Standard | Actual Measured Result | Status |
| :--- | :---: | :---: | :---: |
| **JSON Syntax Validity** | 100% RFC 8259 Compliant | 4 of 4 datasets valid JSON | **PASSED** |
| **Mission Provider FKs** | 100% Resolve to `providers.json` | 13 of 13 resolve cleanly | **PASSED** |
| **Payload Mission FKs** | 100% Resolve to `missions.json` | 28 of 28 resolve cleanly | **PASSED** |
| **Landing Site FKs** | 100% Resolve to `missions.json` | 8 of 8 resolve cleanly | **PASSED** |
| **Latitude Bounds** | $-90.0 \le \text{Lat} \le +90.0$ | All coordinates within bounds | **PASSED** |
| **Longitude Bounds** | $-180.0 \le \text{Lon} \le +180.0$ | All coordinates within bounds | **PASSED** |
| **Program Metric Integrity**| 17 orders, 5 awarded, 60+ payloads | Exactly matches NASA metrics | **PASSED** |

---

## 7. Phase 4 Selenographic & Interactive Integrity Audit

In Phase 4, the data-quality rules were embedded into interactive projections:
1. **Projection Visibility Auditing:**  
   - Nearside orthographic projection restricts pins to $|\text{lon}| \le 90^\circ$ and $\cos(\text{lat})\cos(\text{lon}) \ge -0.05$.  
   - Far side orthographic projection restricts pins to $|\text{lon} \pm 180^\circ| \le 90^\circ$.  
   - South Polar azimuthal projection restricts pins to $\text{lat} \le -60.0^\circ$.
   Every site in `landing_sites.json` was audited and confirmed to project onto the correct lunar quadrant with accurate mathematical colatitude and longitude orientation.
2. **Composite Suite Visual Guardrails:**  
   All non-discrete payload packages (e.g. `griffin-test-suite`, `cfm-tech-demo`, `precision-landing-suite`, `prism2-suite`, `cs6-polar-suite`, `stmd-nova-d-suite`) now render an explicit `"Integrated Science Package"` badge to prevent users or judges from mistaking a composite flight payload suite for an unmanifested single instrument.
3. **URL Search Parameter Round-Trip Testing:**  
   Deep links (`?tab=missions&status=landed_anomaly&search=im-1`, `?tab=map&site=malapert-a`, `?tab=payloads&category=VG`) were tested against direct browser landing, history push/replace, and `popstate` back/forward events to verify zero data loss or desynchronization.
