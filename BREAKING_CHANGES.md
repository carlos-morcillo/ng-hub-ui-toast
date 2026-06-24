# Breaking Changes — ng-hub-ui-toast

## [22.2.0] — 2026-06-24

### Removed

- **`--hub-toast-accent-width` CSS custom property removed.** This token sized the old left accent stripe, which no longer exists. There is no replacement for the stripe width; if you need to control the overall border thickness, use `--hub-toast-border-width` instead.

### Changed (visual)

- **The left accent stripe is replaced by a full 1px semantic border.** The thick `border-inline-start` accent stripe is gone; every `data-type` toast now renders a plain `1px solid` border in its accent colour, while keeping the tinted background and emphasis text.
- **Built-in-type borders are now more saturated.** `success` / `error` / `warning` / `info` no longer use the muted `--hub-sys-color-*-border-subtle` token for their border; they now take the full-strength `--hub-sys-color-*` accent.
- These are purely visual changes, but anyone relying on **pixel-snapshot tests** of toasts should regenerate their baselines.

## [22.0.0] — Initial release

No breaking changes. This is the first published version of the library.
