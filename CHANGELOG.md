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
