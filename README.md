# Program Cockpit

Static browser dashboard for tracking customer configuration program health across dated operational snapshots.

## Run Locally

Because the app loads JSON with `fetch()`, serve the repo from a local web server:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Test

```sh
node test/test_runner.js
```

There is also a browser-oriented test page at `test/browser_tests.html` when the repo is served locally.

## Data Model

Snapshot files live in `data/snapshots/` and are listed in `data/config/snapshots.json`.

Each snapshot should use stable `id` values and `relationships` objects for risks, dependencies, milestones, decisions, features, and OKRs. Relationship keys should match `data/config/ui.json`:

```json
{
    "risks": [],
    "dependencies": [],
    "milestones": [],
    "decisions": [],
    "okrs": [],
    "features": []
}
```

Status, severity, confidence, attention, queue, and mitigation values are validated against `data/config/ui.json`.

## Governance Warnings

The governance engine reports:

- schema and enum mismatches
- duplicate entity IDs or titles
- missing relationship and attention queue targets
- blocked dependencies
- unresolved risks aging without attention queue coverage
- delivery confidence trends and milestone drift
- operational contradictions between confidence and active risk count
