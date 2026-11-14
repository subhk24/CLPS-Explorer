# CLPS Explorer: Data Quality & Scientific Integrity Audit

**Project:** CLPS Explorer  
**Document:** Data Quality Audit and Validation Specification  
**Version:** 1.1.0  
**Audit snapshot:** November 14, 2026

---

## 1. Purpose and Scope

This document describes the data validation rules implemented by CLPS Explorer.

The application uses four research datasets:

- `missions.json`
- `payloads.json`
- `providers.json`
- `landing_sites.json`

The data layer performs runtime validation of mission and payload records, builds lookup indexes, and checks relationships between datasets.

**Important limitation:** Passing application-level validation does not establish that every scientific claim, mission schedule, payload assignment, or coordinate has been independently verified by NASA. Source records must be reviewed against their cited references.

## 2. Validation Performed During Data Loading

### Mission records

The mission validator checks:

- Presence of a mission ID.
- Valid mission status.
- Presence of numeric latitude and longitude.
- Latitude within -90° to +90°.
- Longitude within -180° to +180°.
- Normalization of optional launch and landing dates.
- Normalization of payload ID arrays.

### Payload records

The payload validator checks:

- Presence of a payload ID.
- Valid science-domain category.
- Normalization of mission references and descriptive fields.

### Provenance

Mission records retain their source URL as their primary citation.

The application-level provenance date represents the data snapshot date. It must not be interpreted as proof that NASA independently verified every field on that date.

## 3. Cross-Dataset Integrity Checks

The `validateDataIntegrity()` function checks the following relationships:

| Check | Validation rule |
|---|---|
| Mission → Provider | Every mission provider ID must exist in `providers.json`. |
| Payload → Mission | Every payload mission ID must exist in `missions.json`. |
| Landing site → Mission | Every mission ID referenced by a landing site must exist. |
| Mission → Payload | Payload IDs listed by a mission are checked against `payloads.json`; missing detailed catalog entries are review warnings because a manifest ID may identify a composite package. |
| Mission IDs | Duplicate mission IDs are reported. |
| Payload IDs | Duplicate payload IDs are reported. |
| Provider IDs | Duplicate provider IDs are reported. |
| Landing site IDs | Duplicate landing site IDs are reported. |
| Mission coordinates | Latitude and longitude must be finite and within valid bounds. |
| Landing site coordinates | Latitude and longitude must be finite and within valid bounds. |
| Manifest count | Declared mission payload count is compared with the number of payload IDs in its manifest; differences are review warnings. |

The report returns individual issue arrays so that data issues can be investigated rather than hidden behind a single pass/fail result. Missing detailed payload catalog entries and manifest count differences are non-blocking review warnings; unresolved mission/provider/site references, duplicate IDs, and invalid coordinates block the integrity check.

## 4. Payload Count Interpretation

A mission's `nasaPayloadCount` and its `payloadIds` array may represent different levels of detail.

For example, a single payload ID may identify a composite science or technology package containing multiple instruments.

Therefore, a count mismatch is a review warning requiring investigation. It should not be resolved by inventing payload records or changing an authoritative NASA payload count merely to satisfy an automated check.

Before a mission is considered fully reconciled, its payload count, package structure, and individual payload records should be checked against the relevant mission documentation.

## 5. Coordinate Interpretation

Coordinates in the application should be classified as either:

- **Confirmed touchdown coordinates:** Coordinates associated with an actual landing and supported by an authoritative source.
- **Target landing zones:** Planned or proposed landing regions, not confirmed touchdown locations.

The application should not present target-region coordinates as verified landing points.

Coordinate range validation only checks numerical validity. It does not establish scientific accuracy or confirm that a location matches a mission's actual landing site.

## 6. Schedule and Mission Status

Mission schedules are subject to change.

The application distinguishes historical mission outcomes from future planning information using mission status values such as:

- `landed_nominal`
- `landed_anomaly`
- `transit_loss`
- `delivered`
- `planned`
- `testing`

A future launch date should be treated as a planning target unless an authoritative source confirms otherwise.

When a schedule is uncertain, a null launch date is preferable to an unsupported exact calendar date.

Historical outcomes should be checked against mission reports and NASA mission documentation.

## 7. Program Metrics and Contract Values

Program metrics displayed by the application are calculated from the loaded catalog wherever possible.

The following distinctions must be maintained:

- Number of mission records in CLPS Explorer is not necessarily the total number of NASA CLPS task orders.
- Number of payload records is not necessarily the total number of instruments awarded across the entire program.
- Number of providers in the local dataset is not necessarily the full eligible provider pool.
- CLPS 1.0 and CLPS 2.0 contract values must not be combined or presented as the same contract.

NASA's CLPS 1.0 contract value was increased to $4.2 billion. The separate CLPS 2.0 framework has a maximum value of up to $10 billion.

These figures describe contract frameworks, not the amount already spent or awarded to individual missions.

## 8. Validation Execution

Run the following commands from the project root:

```bash
npm run typecheck
npm run test
npm run build
```

The integrity report can also be inspected from application code:

```ts
import { validateDataIntegrity } from './data';

const report = validateDataIntegrity();

console.log('Data integrity valid:', report.isValid);
console.table(report);
```

A successful build confirms that the application compiles. It does not independently verify the scientific accuracy of the research datasets.

Do not mark the following checks as passed until they have actually been executed:

- JSON syntax validation for all four datasets.
- Mission/provider foreign-key validation.
- Payload/mission foreign-key validation.
- Mission-manifest/payload-ID validation.
- Landing-site/mission foreign-key validation.
- Duplicate ID checks.
- Coordinate range checks.
- Payload count reconciliation.
- Source-by-source scientific fact-checking.

## 9. Known Limitations and Future Work

The current validator does not independently establish:

1. Whether a cited NASA source supports every field in a record.
2. Whether a future mission schedule is still current.
3. Whether a target coordinate is scientifically appropriate for a landing.
4. Whether a composite payload package contains the declared number of instruments.
5. Whether all NASA CLPS task orders are represented in the application.

Future improvements should include source-specific verification dates, per-field provenance, schema validation for every dataset, and automated regression tests for mission and payload relationships.

---

**Scientific integrity statement**

CLPS Explorer is an independent research and visualization project. Its validation system is designed to identify structural inconsistencies and broken references. It does not replace NASA's official mission documentation or constitute NASA certification of the information presented.
