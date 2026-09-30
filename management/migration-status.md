# Migration Status

## Policy

- GitHub: source of truth for authoring, QA, specifications, and history
- Google Drive: Published / learner-facing delivery surface

## Current migration

### Management data

- E001–E180: imported into `management/material-manifest.csv`
- Published URLs, titles, phases, QA state, bundle keys are included

### Lesson bodies

- B030–B032 / E175–E192: present in Markdown
- B001–B029 / E001–E174: metadata imported, body backfill pending

### New authoring

- B031 onward: **GitHub-first**（B031–B032 published）
- Draft lesson source should be created in `bundles/B031/` etc.
- After QA Pass, publish to Drive and update the manifest/index

## Planned sequence

1. Build B031–B034 in GitHub first
2. Publish each passed Bundle to Drive
3. Complete P3 at E204前後
4. Build B035–B039 as P4 Tsukuba 30-day program
5. Backfill B001–B029 bodies progressively without blocking new authoring

## Historical preservation

Drive Published files remain frozen unless a versioned repair is explicitly required.
GitHub history is used for future changes instead of silent overwrites.
