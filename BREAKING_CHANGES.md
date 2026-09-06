# Breaking Changes — ng-hub-ui-toast

## [22.8.0] - 2026-09-06
### `HubToastConfig` requires a `closeButtonAriaLabel` string

- **Change**: `HubToastConfig` gained `closeButtonAriaLabel: string`, the accessible name given to
  the close button, defaulting to `'Close'` in `HUB_TOAST_DEFAULT_CONFIG`.
- **Impact**: code that builds a full `HubToastConfig` literal by hand — a custom defaults object, a
  test double — no longer compiles. `provideToast()` and per-call overrides take a `Partial`, so they
  are unaffected.
- **Migration**: add `closeButtonAriaLabel: 'Close'` to the literal, or spread
  `HUB_TOAST_DEFAULT_CONFIG` into it. Applications that are not in English should pass their own
  translation through `provideToast({ closeButtonAriaLabel: '…' })`.

### `HubToastData` requires a `restartToken` signal

- **Change**: `HubToastData` gained `restartToken: WritableSignal<number>`, the channel
  `HubToastRef.resetTimeout()` uses to order a toast that is already on screen to restart its
  auto-dismiss countdown.
- **Impact**: code that builds a `HubToastData` literal by hand — rendering `<hub-toast [data]="…">`
  outside `ToastService`, or a test double — no longer compiles. Everything that goes through
  `ToastService` is unaffected: the service fills the field.
- **Migration**: add `restartToken: signal(0)` to the literal.

## [22.5.0] — 2026-07-07

### SCSS ships at `ng-hub-ui-toast/styles` (packaging path)

- **Change**: the `hub-toast-theme` mixin now builds to `dist/toast/styles/...` instead of `dist/toast/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-toast/styles' as *;` (or `.../styles/mixins/toast-theme`).

## [22.3.0] — 2026-06-26

### `--hub-toast-container-z-index` renamed to `--hub-toast-container-zindex`

- **Change**: the container's stacking token dropped the hyphen, to match the
  `--hub-sys-zindex-*` naming the rest of the design system uses.
- **Impact**: silent. A CSS custom property nobody reads is not an error, so an override
  still written as `--hub-toast-container-z-index` simply stops doing anything and the
  container falls back to `var(--hub-sys-zindex-toast, 1090)` — a toast that used to sit
  above (or below) a neighbouring overlay may now land on the other side of it.
- **Migration**: rename the override to `--hub-toast-container-zindex`.

## [22.2.0] — 2026-06-24

### Removed

- **`--hub-toast-accent-width` CSS custom property removed.** This token sized the old left accent stripe, which no longer exists. There is no replacement for the stripe width; if you need to control the overall border thickness, use `--hub-toast-border-width` instead.

### Changed (visual)

- **The left accent stripe is replaced by a full 1px semantic border.** The thick `border-inline-start` accent stripe is gone; every `data-type` toast now renders a plain `1px solid` border in its accent colour, while keeping the tinted background and emphasis text.
- **Built-in-type borders are now more saturated.** `success` / `error` / `warning` / `info` no longer use the muted `--hub-sys-color-*-border-subtle` token for their border; they now take the full-strength `--hub-sys-color-*` accent.
- These are purely visual changes, but anyone relying on **pixel-snapshot tests** of toasts should regenerate their baselines.

## [22.0.0] — Initial release

No breaking changes. This is the first published version of the library.
