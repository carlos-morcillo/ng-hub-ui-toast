# ng-hub-ui-toast Changelog

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
