# ng-hub-ui-toast — CSS Variables Reference

Complete reference of the CSS custom properties exposed by `ng-hub-ui-toast`.
Use these variables to customize the notification look without editing component
source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Toast Element](#toast-element)
- [Accent Roles](#accent-roles)
- [Container (stack)](#container-stack)
- [Theming Examples](#theming-examples)

---

## How it Works

Every token is declared once on the toast element (`:where(:host)`) with a fallback
chain:

```text
component token -> sys token -> ref token -> literal fallback
```

Colour is driven by a **single accent slot**. The semantic `data-type` (built-in
`success` / `error` / `warning` / `info` / `primary` / `secondary` / `neutral` /
`light` / `dark`, or any custom `--hub-sys-color-<type>`) re-bases only
`--hub-toast-accent`; the role family (`-subtle` / `-emphasis` / `-on`) always
**recomputes locally** from it, so a custom accent derives the full family at runtime.

> **Theme on the element or a `data-type` selector, not a bare ancestor.** The tokens
> are declared on the toast element itself, so a value set on the element wins over one
> inherited from an ancestor. Apply the `hub-toast-theme()` mixin on `hub-toast` (the
> shared shell) or on `hub-toast[data-type='<name>']` (a custom type) — which is where
> its `$accent` re-derivation is designed to run.

---

## Toast Element

| Variable | Default |
| --- | --- |
| `--hub-toast-bg` | `var(--hub-sys-surface-page, #fff)` |
| `--hub-toast-color` | `var(--hub-sys-text-primary, #212529)` |
| `--hub-toast-border` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-toast-accent` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-toast-min-width` | `18rem` |
| `--hub-toast-max-width` | `26rem` |
| `--hub-toast-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-toast-padding-y` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-toast-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` |
| `--hub-toast-border-width` | `var(--hub-ref-border-width, 1px)` |
| `--hub-toast-shadow` | `var(--hub-sys-shadow-md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15))` |
| `--hub-toast-gap` | `var(--hub-ref-space-1, 0.25rem)` |
| `--hub-toast-font-size` | `var(--hub-ref-font-size-base, 1rem)` |
| `--hub-toast-title-font-size` | `var(--hub-ref-font-size-base, 1rem)` |
| `--hub-toast-title-font-weight` | `var(--hub-ref-font-weight-semibold, 600)` |
| `--hub-toast-progress-height` | `0.25rem` |
| `--hub-toast-progress-bg` | `color-mix(in oklch, var(--hub-toast-accent) 30%, transparent)` |
| `--hub-toast-close-opacity` | `0.5` |
| `--hub-toast-close-opacity-hover` | `1` |

## Accent Roles

Derived from the single `--hub-toast-accent` slot — set `--hub-toast-accent` (or use a
`data-type`) and these recompute automatically.

| Variable | Default |
| --- | --- |
| `--hub-toast-accent-subtle` | `color-mix(in oklch, var(--hub-toast-accent) 12%, var(--hub-sys-surface-page, #ffffff))` |
| `--hub-toast-accent-emphasis` | `color-mix(in oklch, var(--hub-toast-accent) 80%, var(--hub-sys-color-ink, #212529))` |
| `--hub-toast-accent-on` | `oklch(from var(--hub-toast-accent) clamp(0, (0.62 - l) * 1000, 1) 0 h)` |

The toast background resolves through `-subtle` and the text through `-emphasis`; `-on`
is available for accent-filled affordances.

## Container (stack)

| Variable | Default |
| --- | --- |
| `--hub-toast-container-gap` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-toast-container-offset` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-toast-container-zindex` | `var(--hub-sys-zindex-toast, 1090)` |

---

## Theming Examples

```css
/* Global tweaks — the container is appended to <body>, so :root works. */
:root {
  --hub-toast-border-radius: 0.5rem;
  --hub-toast-container-offset: 1.5rem;
}
```

```scss
@use 'ng-hub-ui-toast/styles/mixins/toast-theme' as *;

/* Re-skin the shared shell. */
hub-toast {
  @include hub-toast-theme($border-radius: 0.75rem, $border-width: 2px);
}

/* Brand a custom semantic type (data-type="brand"). */
hub-toast[data-type='brand'] {
  @include hub-toast-theme($accent: #6f42c1);
}
```
