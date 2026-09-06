# ng-hub-ui-toast Changelog

## [22.8.0] - 2026-09-06

### Added

- **The close button's accessible name is now a config option, `closeButtonAriaLabel`.** The `×`
  glyph is decorative, so that name was the only thing a screen reader had to announce the toast's
  single control — and it was the English literal `Close`, frozen in the template, unreachable from
  `provideToast()` or a per-call config. A library shipped to applications that are not in English
  cannot hardcode a user-facing string.

- **`FUNCTIONALITIES.md`.** Nine sibling libraries carry one and the repository's own checklist
  asks for it on every change; toast had none, so nothing recorded which parts of the API a
  reader of the docs can actually operate and which are only prose.

### Changed

- **`HubToastConfig` now carries a required `closeButtonAriaLabel`.** Only code that builds a full
  `HubToastConfig` literal by hand is affected — everything that goes through `provideToast()` or a
  per-call override keeps compiling. See `BREAKING_CHANGES.md`.

- **`HubToastData` now carries a required `restartToken` signal.** The data object keeps its
  identity for the whole life of a toast, so nothing in it could tell the rendered component to
  start its countdown over; this signal is that channel. Only code that builds a `HubToastData`
  literal by hand is affected — see `BREAKING_CHANGES.md`.

### Fixed

- **A closing toast now completes its three lifecycle observables, not just `onHidden`.** `onShown`
  and `onTap` were left open on a toast that no longer existed, so a consumer who subscribed without
  a `takeUntil` kept the subscription — and the toast data behind it — alive for the rest of the
  session, with no completion to hang a teardown on. Both `remove()` and `clear()` now close the
  whole lifecycle.

- **The documentation no longer describes a library that does not exist.** `README.md` and
  `README.es.md` sold the package as having zero external dependencies and listed only the two
  Angular peers, so anyone installing by hand — rather than through `ng add ng-hub-ui` — got a
  module-not-found on `resolveHubAccent` the first time a toast fired. They also gave
  `--hub-toast-title-font-weight` as a bare `600` when the code routes it through
  `--hub-ref-font-weight-semibold`, typed `positionClass` as `HubToastPosition` when it accepts
  any string, named four semantic types where the stylesheet maps nine, omitted the three derived
  accent roles, and documented two of the eight public exports. `BREAKING_CHANGES.md` was missing
  the 22.3.0 `--hub-toast-container-z-index` → `--hub-toast-container-zindex` rename, which is the
  one kind of change this file exists to announce — a renamed custom property fails silently.
- **`HubToastRef.resetTimeout()` restarts the auto-dismiss countdown, as its documentation always
  promised.** It used to re-emit `onShown$` and touch no timer state at all, so a caller who wanted
  to keep a toast on screen a while longer had no way to do it — the toast still vanished on its
  original schedule, and the spurious emission also broke the "fires once" contract of `onShown`.
  A toast configured with `disableTimeOut` stays persistent, as before.

## [22.7.2] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.7.1] - 2026-08-17

### Fixed

- **The published package declared no licence.** An absent `license` field is not neutral — a registry reports it as unlicensed, which legally reads as all rights reserved, the most restrictive state possible rather than the most open. The intent was always MIT; it is now stated in `package.json` and carried in a `LICENSE` file that ships with the package.

## [22.7.0] - 2026-08-14

### Changed

- Replaced the deprecated Angular animation trigger with a native CSS enter animation that respects reduced-motion preferences.

### Removed

- **Removed the `@angular/animations` peer dependency.** The package is deprecated upstream and the library no longer needs it. Applications that installed it only for `ng-hub-ui-toast` can drop it; those using it elsewhere are unaffected.

## [22.6.1] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.6.0] - 2026-07-28

### Changed

- **Accent resolution now imports the canonical `resolveHubAccent` from `ng-hub-ui-utils`.** The private copy under `src/lib/shared/resolve-hub-accent.ts` (used to resolve custom toast `type` accents) has been deleted in favour of the single, tested implementation shared family-wide. Behaviour is identical (the copy had not diverged): a bareword resolves to `var(--hub-sys-color-<name>, <name>)`, a literal colour passes through unchanged, an empty value yields `null`.

### Added

- **NEW peer dependency: `ng-hub-ui-utils` `>=22.7.0`.** Consumers must have `ng-hub-ui-utils` installed alongside this library (it is where `resolveHubAccent` lives). Users installing via `ng add ng-hub-ui` get it automatically; manual installs need `npm i ng-hub-ui-utils`.

## [22.5.2] - 2026-07-28

### Fixed

- **Toasts are announced to screen readers.** Each toast host is now a live region: `role="alert"` + `aria-live="assertive"` for `error`/`warning`, `role="status"` + `aria-live="polite"` for everything else, with `aria-atomic="true"`. Previously no live region existed anywhere, so notifications were invisible to assistive technology. Keyboard dismissal was already available through the close button (`config.closeButton`); the host tap remains a pointer convenience.

## [22.5.1] - 2026-07-09

### Fixed

- **`NG0205: Injector has already been destroyed` when a toast is raised just before teardown.** The toast container is mounted from the `.then()` of a dynamic `import()`, which resolves on a later microtask; if the application was destroyed in the meantime (a route teardown, an HMR reload, a finished test), `createComponent()` reached into a dead environment injector and threw. The mount now bails out when `ApplicationRef.destroyed` is set.

## [22.5.0] - 2026-07-07

### Added

- **Toast `type` accepts ANY colour.** A custom `type` (anything beyond the built-ins `success` / `error` / `warning` / `info`) now accepts a **registered accent name** _or_ a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour). A bareword resolves to its `--hub-sys-color-*` token with the word as raw fallback; a literal is used as-is. The full accent family (`-subtle` / `-emphasis` / `-on`) still re-derives from it via `color-mix`. Built-in types (and the `error`→`danger` mapping) are unchanged.
- **`ng-hub-ui-toast/styles` root entry.** A `styles/index.scss` now forwards `hub-toast-theme`, so `@use 'ng-hub-ui-toast/styles' as *;` exposes the mixin from the package root.

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-toast/styles`.** The theming mixin now builds to `dist/toast/styles/...` (was `dist/toast/src/lib/styles/...`), so `@use 'ng-hub-ui-toast/styles'` (and `.../styles/mixins/toast-theme`) resolves. Update any `@use` that reached into `src/lib/styles`.

## [22.4.0] - 2026-07-02

### Changed

- **One derivation strategy — canonical accent slot.** The built-in `data-type`s (`success` / `warning` / `info` / `primary` / `secondary` / `neutral` / `light` / `dark`, plus `error`→danger) now re-base ONLY the single `--hub-toast-accent` slot; the derived role family (`-subtle` / `-emphasis` / `-on`) always recomputes locally from it, so **custom accents now re-derive the full role family at runtime** (previously the built-in types pinned the pre-computed `--hub-sys-color-<type>-*` tints, freezing the family against a runtime accent override).
- The local derivations were unified to the canonical design-system formulas — `--hub-toast-accent-subtle: color-mix(in oklch, accent 12%, --hub-sys-surface-page)` (was a `14%` mix) and `--hub-toast-accent-emphasis: color-mix(in oklch, accent 80%, --hub-sys-color-ink)` (was `72%` over `--hub-sys-text-primary`) — in the component and in the `hub-toast-theme()` mixin. These produce the same tints the ds families ship, so the built-in types render as before; custom-type tints shift very slightly to match them.

### Fixed

- `--hub-toast-shadow` inline fallback aligned with the actual ds value of `--hub-sys-shadow-md`: `0 0.5rem 1rem rgba(0, 0, 0, 0.15)` (was `0 0.25rem 0.75rem rgba(0, 0, 0, 0.1)`). No change when the ds tokens are loaded.

### Docs

- Added `docs/css-variables-reference.md` — the complete CSS custom-property reference (now covered by the repo `tokens-parity` check F).
- Realigned the README CSS-variable tables with the code: `--hub-toast-shadow` fallback, `--hub-toast-progress-bg` (`srgb` → `oklch`) and `--hub-toast-container-zindex` (`var(--hub-sys-zindex-toast, 1090)`).

## [22.3.0] - 2026-06-26

### Added

- **Open-set accent types.** The built-in `data-type` map now also covers the full open accent set — `primary`, `secondary`, `neutral`, `light`, `dark` join the classic `success` / `warning` / `info` (and `error`→danger), each pulling its exact `--hub-sys-color-<type>` family. Any other `data-type` keeps working at runtime with no recompile: define a single `--hub-sys-color-<name>` and `data-type="<name>"` derives its surface/border/progress from the open-set `[data-type]` default.
- New derived accent roles `--hub-toast-accent-subtle`, `--hub-toast-accent-emphasis` and `--hub-toast-accent-on`, mixed locally from the single `--hub-toast-accent` slot. The toast background and text now resolve through `-subtle` / `-emphasis`; `-on` is available for accent-filled affordances.
- The `hub-toast-theme()` mixin now re-derives the accent role family whenever its `$accent` parameter is passed, so a brand accent applied on a custom selector recomputes `-subtle` / `-emphasis` / `-on` (the slot stays the single source of truth — no duplication).

### Changed

- Canonical `zindex` token name (BREAKING): `--hub-toast-container-z-index` → `--hub-toast-container-zindex` (no hyphen, matching the `--hub-sys-zindex-*` convention).
- The accent role family and the progress-bar tint are now mixed in the **OKLCH** colour space (`color-mix(in oklch, …)`) instead of sRGB, for perceptually even tints across every accent. No token API change; tints shift very slightly.

## [22.2.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.
- Toasts now stack at the correct elevation: the container `z-index` resolves through `--hub-sys-zindex-toast` (1090) instead of a hardcoded `1050` (the modal-backdrop layer), so a toast can no longer be occluded by a modal backdrop.

## [22.2.0] - 2026-06-24

### Added

- New **`hub-toast-theme()` Sass mixin** (`styles/mixins/toast-theme`) — re-skin a toast in one call: accent (1px semantic border + progress colour), surfaces, border/radius/shadow, spacing, typography, progress bar, close button and container (stack) tokens. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-toast-*` overrides; the rest keep their defaults. Apply it to `hub-toast` for all toasts, or to `hub-toast[data-type='<custom>']` to brand a custom semantic type. Token-based, no Bootstrap dependency. (The built-in `success` / `error` / `warning` / `info` tints are unchanged and still applied automatically.)
- `ng-package.json` now ships the `styles/` directory as a package asset (`assets` + `styleIncludePaths`) so the new mixin is importable from consumers via `@use 'ng-hub-ui-toast/styles/mixins/toast-theme'`.

### Changed

- **Toast accent is now a full 1px border in the semantic colour** instead of a thick left stripe. The toast keeps its tinted background and emphasis text, but the `border-inline-start` accent stripe was replaced by a plain `1px solid` border in the type's accent colour (`--hub-toast-border` now resolves to `--hub-toast-accent` for every `data-type`). The built-in types (`success` / `error` / `warning` / `info`) no longer use the muted `--hub-sys-color-*-border-subtle` token for their border; they now take the full-strength `--hub-sys-color-*` accent, so their borders are noticeably more saturated. Purely visual.

### Removed

- Removed the `--hub-toast-accent-width` token (the left accent stripe it sized no longer exists). The accent colour now drives the border and the progress bar through `--hub-toast-accent`.

## [22.1.0] - 2026-06-19

### Changed

- Lowered the Angular peer dependency floor from `>=22.0.0` to `>=21.0.0` (`@angular/core`, `@angular/common`, `@angular/animations`). The library uses only APIs available since Angular 21 (signal `input`/`output`, `effect`, `createComponent`, classic `@angular/animations` triggers), so it now installs and runs in Angular 21 applications. No source or API changes.

## [22.0.0] - 2026-06-17

### Added

- Initial release: `ToastService` with `success()`, `error()`, `warning()`, `info()`, `show()`, `remove()`, `clear()`
- `HubToastRef` with `onShown`, `onHidden`, `onTap` observables and `manualClose()` / `resetTimeout()`
- `ToastComponent` with signal-based auto-dismiss timer, progress bar, and close button
- `ToastContainerComponent` with six position classes
- Accent system: `@each` loop for built-in types; `color-mix` open default for custom types
- `provideToast()` standalone provider function
- Angular animations: slide-in from edge, fade-out on dismiss

### Fixed

- `ToastContainerComponent` and `ToastComponent` SCSS rewritten to use `:host` selectors instead of class selectors (`.hub-toast`, `.hub-toast-container`). Class selectors compile to `[_ngcontent]` attribute selectors under Angular `ViewEncapsulation.Emulated`, which do not match when components are dynamically mounted via `createComponent` + `attachView` (host element has `[_nghost]` but not `[_ngcontent]`). Using `:host` compiles to `[_nghost]` and matches correctly in all rendering contexts.
- Change detection for the dynamically-mounted container: views created with `createComponent` + `attachView` are not reachable by Angular's signal-based "mark ancestors dirty" traversal (no parent view to traverse to). Fixed by storing the `ComponentRef` and calling `changeDetectorRef.detectChanges()` explicitly after each signal mutation.
- Error toast transparent background: the `error` type now correctly resolves to the `--hub-sys-color-danger-*` Design System token family. The DS uses `danger` (not `error`) for this semantic, so the `@each` SCSS loop was updated to handle the mapping explicitly.
