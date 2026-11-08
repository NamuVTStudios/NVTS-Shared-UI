# TDD — NVTS-Shared-UI

## 1. Technical purpose

Provide reusable visual components, design tokens, interaction contracts, and UI state models shared by NVTS applications. This document distinguishes implemented foundations from future production-grade UI capabilities.

## 2. Architecture and boundaries

- **Design tokens:** semantic light/dark tokens for surfaces, text, borders, controls, focus, typography, radii, and elevation. Each product supplies its own logo-derived accent tokens.
- **Theme controller:** explicit `light`, `dark`, and `system` preferences; storage persistence; `prefers-color-scheme` observation; resolved theme on the document root.
- **Components:** framework-neutral DOM primitives for buttons, panels, toolbars, menus, dialogs, focus trapping, live announcements, and a reusable `createTemplateGallery` selector; tool-palette selection is also shared.
- **Commands:** command registry and keyboard shortcut mapping.
- **Workspace:** panel registration/order and serializable layout contract plus an accessible panel view with order controls. Dragging/resizing and advanced docking interactions remain future work.
- **History and timeline:** history list component, timeline state model, and a basic timeline view with subscriptions. Product-specific timeline rendering and editing remain in the consuming product.
- **Shell:** minimal responsive product shell for application blueprints; it is not a substitute for domain-specific product UI.
- **Assets:** original SVG resources and brand assets with stable names and semantic manifests.
- **Package boundaries:** public exports and explicit CSS subpaths; avoid importing private implementation details.

## 3. Domain modules

- Theme preference and system-theme controller
- Accessible buttons, panels, toolbars, menus, dialogs, focus utilities, and live announcements
- Tool palette and selected-tool state
- Command registry and keyboard shortcut manager
- Workspace panel ordering, accessible reorder controls, and serialization contract
- History list and timeline state/view components
- Shared product shell and semantic CSS
- SVG interface, tool, and brand assets

## 4. Contracts and ecosystem integration

- Consumers use `@nvts/shared-ui` public exports and stylesheet subpaths.
- Product accent colors are provided through `--nvts-accent` and `--nvts-accent-hover`; neutral theme tokens are shared.
- UI components accept data and callbacks; they do not own domain algorithms or file-format implementations.
- Consume `NVTS-Shared-Core` only through its documented public APIs where an application needs the corresponding core capability.
- Do not depend on private implementation details of another application.
- Keep product-specific workflows and specialized UI in their owning program.

## 5. Data and file formats

- Persist only serializable UI preferences and workspace layout state.
- Keep transient interaction state separate from project/document domain data.
- Validate restored panel identifiers and ignore unknown panels.
- Keep timeline model updates immutable from the public consumer perspective.
- Avoid persisting resolved light/dark state for the `system` preference; persist the user's selected preference instead.

## 6. Performance and resource management

- Import UI modules and SVG resources on demand where practical.
- Avoid bundling duplicate shared dependencies into application builds.
- Keep DOM primitives small and avoid forced layout reads in repeated event paths.
- Use virtualization for large lists/timelines when real product workloads require it.

## 7. Security and accessibility

- Use textContent for untrusted labels rather than injecting HTML.
- Provide accessible names, roles, focus states, and keyboard behavior.
- Avoid trapping focus outside a modal lifecycle; always release listeners on teardown.
- Respect reduced-motion preferences in animated components as they are introduced.

## 8. Testing strategy

- Unit tests for light/dark/system selection, persistence, and system preference changes.
- Unit tests for command/shortcut registration and dispatch.
- Unit tests for workspace serialization and deterministic restoration.
- Unit tests for timeline snapshots and subscriptions.
- Browser tests for focus management, theme controls, responsive shell behavior, and accessibility.
- Integration tests for package exports and all consumer package links.

## 9. Code quality and development workflow

- Apply SOLID and DRY without overengineering.
- Keep each function and method focused on a small number of responsibilities.
- Prefer guard clauses, pure functions, and small helpers over deeply nested control flow.
- Separate UI state, domain logic, application orchestration, and platform adapters.
- Format CSS with four-space indentation and sections ordered as essential/base styles, reusable/product components and states, then responsive rules.

## 10. Build and release

- Install dependencies from the committed lockfile/workspace configuration.
- Run formatting, linting, type checking, tests, and production builds in CI.
- Publish versioned artifacts with checksums and documented compatibility.
- Do not release production artifacts from unprotected branches.

## Template Selection UI

- `createTemplateGallery` accepts immutable template-like definitions from Shared Core or a product-specific registry.
- It owns category filtering, accessible selection cards, selected-state updates, and selection callbacks.
- It does not create or mutate documents; the consuming application applies the selected template through its own domain/controller layer.
- Keep product-specific template definitions out of Shared UI. Shared UI renders the supplied catalogue without depending on NVTS-Shared-Core.
