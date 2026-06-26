# ng-hub-ui-toast Changelog

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
