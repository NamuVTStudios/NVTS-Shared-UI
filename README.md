# NVTS-Shared-UI

Reusable, framework-neutral interface foundations and visual resources for the NVTS application ecosystem.

## Current implementation status

The repository now provides a first shared design-system layer:

- Semantic light and dark theme tokens, with a `ThemeController` that supports `light`, `dark`, and `system` preferences, persistence, and operating-system theme changes.
- Reusable DOM primitives for buttons, panels, toolbars, menus, dialogs, focus trapping, and accessible live announcements.
- Tool palettes with selected-tool state and consumer callbacks.
- A command registry and keyboard shortcut manager.
- A workspace panel-order controller and accessible panel reordering view.
- A history list component and a framework-neutral timeline model/view.
- A minimal application shell used by the web blueprints for identity, theme selection, toolbar, workspace frame, and responsive layout.
- Existing SVG interface, tool, and brand assets with manifests.

These are shared foundations and contracts, not complete product interfaces. The workspace controller currently manages panel registration/order/persistence; it does not yet provide a full drag-resize docking engine. The timeline module manages state and subscriptions; it does not yet render a finished timeline editor. Each product remains responsible for its domain-specific workflow and rendering.

## Architecture

`@nvts/shared-ui` exposes a small public API and explicit CSS subpaths. Consumers should import only the modules and styles they need. Product-specific accent colors are supplied by each application's token override, while theme surfaces, typography, borders, focus behavior, and component structure remain centralized here.

NVTS-Shared-UI is independent from NVTS-Shared-Core: UI components consume application data and callbacks but must not own domain algorithms, file codecs, renderer engines, or physics implementations. Those responsibilities remain in the appropriate application/domain package or NVTS-Shared-Core.

## Package layout

- `packages/ui-core/src/theme`: theme preference controller and system-theme observation.
- `packages/ui-core/src/components`: accessible DOM primitives.
- `packages/ui-core/src/commands`: commands and keyboard shortcuts.
- `packages/ui-core/src/workspace`: workspace panel order and persistence contract.
- `packages/ui-core/src/timeline`: timeline state model.
- `packages/ui-core/src/shell`: minimal shared application shell.
- `packages/ui-core/styles`: semantic theme tokens and reusable component styles.
- `packages/icons`: SVG interface, tool, and brand assets with manifests.

## Theme contract

The controller accepts `light`, `dark`, and `system`. The resolved theme is written to `document.documentElement.dataset.theme`; the selected preference is written to `dataset.themePreference`. `system` follows `prefers-color-scheme` and is persisted independently from the resolved light/dark value. Each application should define its own `--nvts-accent` and `--nvts-accent-hover` tokens using its official logo palette.

## Consumption

Consumers should use a compatible, pinned package version and public exports only. Do not copy the shared implementation into individual applications. Product-specific visual behavior belongs in the product; reusable behavior belongs here.

## Validation

Run `node --test tests/*.test.mjs` from this repository. Current tests cover theme preference changes, persistence, menus, tool palettes, workspace panel reordering, history selection, timeline updates, command registration, and timeline state notifications. Browser end-to-end and platform-native builds require their respective toolchains and are not implied by these unit tests.

## License and repository

Shared assets and code are distributed under the MIT License; see `LICENSE`. Third-party assets and dependencies must retain their original license notices.

## NVTS development principles

- Apply SOLID and DRY where they improve clarity and maintainability; avoid unnecessary abstractions.
- Keep functions and methods small, with clear responsibilities.
- Avoid deeply nested control flow; prefer guard clauses and focused helper functions.
- Work incrementally, with tests and regression review after each meaningful change.
- Do not describe a feature as implemented until verifiable code and tests support the claim.
