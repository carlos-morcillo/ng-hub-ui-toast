# ng-hub-ui-toast Changelog

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
