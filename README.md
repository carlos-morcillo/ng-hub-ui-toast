# ng-hub-ui-toast

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-toast.svg)](https://www.npmjs.com/package/ng-hub-ui-toast)
[![Angular](https://img.shields.io/badge/Angular-22-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-toast.svg)](LICENSE)

Signal-driven Angular 22 toast notification service — imperative API, lifecycle observables, progress bar, six positions, and full CSS-variable theming. Built as a standalone Angular service with zero external dependencies.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/toast/overview/
- Live examples: https://hubui.dev/toast/examples/
- Hub UI: https://hubui.dev/

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) _(deprecated → use panels)_
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast) ← You are here
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 🚀 Quick Start

### 1. Install

```bash
npm install ng-hub-ui-toast
```

> **Theming (recommended):** install the shared design tokens so toasts —
> and every other ng-hub-ui library — read the same palette and dark-mode colours:
>
> ```bash
> npm install ng-hub-ui-ds
> ```
> ```css
> @import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
> ```
>
> It is an **optional** peer dependency: the service ships sensible CSS fallbacks
> and works without it.

### 2. Register the provider

```typescript
// app.config.ts
import { provideToast } from 'ng-hub-ui-toast';

export const appConfig: ApplicationConfig = {
    providers: [
        provideToast({ progressBar: true, timeOut: 4000 })
    ]
};
```

### 3. Inject and call

```typescript
import { ToastService } from 'ng-hub-ui-toast';

@Component({ ... })
export class SaveComponent {
    private toast = inject(ToastService);

    save() {
        this.toast.success('Record saved.', 'Success');
    }
}
```

---

## 📦 Description

`ng-hub-ui-toast` is a zero-dependency notification service for Angular 22+ standalone apps. Call `ToastService.success()`, `.error()`, `.warning()` or `.info()` from any component or service; the overlay container is lazily mounted the first time a notification fires. Each call returns a `HubToastRef` with `onShown`, `onHidden` and `onTap` observables plus `manualClose()` / `resetTimeout()`.

## 🎯 Features

- **Signal-driven stack** — the active-toast list is a `signal<HubToastData[]>`; works with `OnPush` and zoneless apps.
- **Lazy container mounting** — `ToastContainerComponent` is appended to `document.body` only on the first call; nothing runs at startup.
- **`HubToastRef`** — lifecycle observables (`onShown`, `onHidden`, `onTap`) and imperative control (`manualClose()`, `resetTimeout()`).
- **Per-call config overrides** — set defaults globally with `provideToast()` and override any option individually per call.
- **Six positions** — top/bottom × right/left/center.
- **Progress bar & close button** — built-in configurable dismiss controls.
- **CSS variable theming** — every colour, radius, shadow and dimension is a `--hub-toast-*` token.
- **Built-in semantic types** — `success`, `error`, `warning`, `info` each resolve the matching `--hub-sys-color-*` DS accent family automatically.
- **Custom types** — pass any string to `show()` and drive the accent with your own `--hub-toast-accent` override.
- **Capacity & deduplication** — `maxOpened` caps the stack; `autoDismiss` removes the oldest; `preventDuplicates` silences repeats.

---

## ⚙️ Configuration

### `provideToast(config?)`

All options are optional and merge over the built-in defaults.

| Option | Type | Default | Description |
|---|---|---|---|
| `timeOut` | `number` | `5000` | Auto-dismiss delay (ms). `0` = persistent. |
| `extendedTimeOut` | `number` | `2500` | Extra ms added while the user hovers. |
| `closeButton` | `boolean` | `true` | Show a × close button. |
| `progressBar` | `boolean` | `false` | Show a countdown progress bar. |
| `tapToDismiss` | `boolean` | `true` | Dismiss on click. |
| `disableTimeOut` | `boolean \| 'timeOut' \| 'extendedTimeOut'` | `false` | Disable the auto-dismiss timer. |
| `newestOnTop` | `boolean` | `true` | Stack newest toasts at the top. |
| `positionClass` | `HubToastPosition` | `'toast-top-right'` | Container position on screen. |
| `maxOpened` | `number` | `0` | Max simultaneous toasts (`0` = unlimited). |
| `autoDismiss` | `boolean` | `false` | Auto-remove oldest when `maxOpened` is reached. |
| `preventDuplicates` | `boolean` | `false` | Drop new toasts with a matching visible message. |

---

## 🪄 API Reference

### `ToastService`

| Method | Signature | Description |
|---|---|---|
| `success` | `(message, title?, config?) → HubToastRef` | Show a success toast. |
| `error` | `(message, title?, config?) → HubToastRef` | Show an error toast. |
| `warning` | `(message, title?, config?) → HubToastRef` | Show a warning toast. |
| `info` | `(message, title?, config?) → HubToastRef` | Show an info toast. |
| `show` | `(message, title?, config?, type?) → HubToastRef` | Show a toast with any type (including custom strings). |
| `remove` | `(toastId: number) → void` | Remove one toast by id. |
| `clear` | `() → void` | Remove all active toasts. |
| `toasts` | `Signal<HubToastData[]>` | Read-only signal of the current active stack. |

### `HubToastRef`

```typescript
interface HubToastRef {
    readonly toastId: number;
    readonly onShown:  Observable<void>;   // fires once when the toast enters the DOM
    readonly onHidden: Observable<void>;   // fires once when the toast leaves the DOM
    readonly onTap:    Observable<void>;   // fires each time the user clicks the toast body
    manualClose(): void;                   // removes the toast immediately
    resetTimeout(): void;                  // restarts the auto-dismiss timer from zero
}
```

### Lifecycle example

```typescript
const ref = this.toast.success('Upload complete', 'Done', { timeOut: 0 });

ref.onTap.subscribe(() => this.router.navigate(['/uploads']));
ref.onHidden.subscribe(() => console.log('toast dismissed'));

// close programmatically later
closeBtn.addEventListener('click', () => ref.manualClose());
```

### Positions

| Class | Location |
|---|---|
| `toast-top-right` | Top-right corner (default) |
| `toast-top-left` | Top-left corner |
| `toast-top-center` | Top-center |
| `toast-bottom-right` | Bottom-right corner |
| `toast-bottom-left` | Bottom-left corner |
| `toast-bottom-center` | Bottom-center |

```typescript
// per-call override
this.toast.info('Message', '', { positionClass: 'toast-bottom-center' });
```

---

## 🎨 Styling

Every visual detail is controlled by `--hub-toast-*` CSS custom properties.

### Toast element

| Variable | Default | Description |
|---|---|---|
| `--hub-toast-bg` | `var(--hub-sys-surface-page, #fff)` | Background colour. |
| `--hub-toast-color` | `var(--hub-sys-text-primary, #212529)` | Text colour. |
| `--hub-toast-border` | `var(--hub-sys-border-color-default, #dee2e6)` | Border colour. |
| `--hub-toast-accent` | `var(--hub-sys-border-color-default, #dee2e6)` | Left accent border colour. |
| `--hub-toast-accent-width` | `0.25rem` | Left accent border thickness. |
| `--hub-toast-min-width` | `18rem` | Minimum width. |
| `--hub-toast-max-width` | `26rem` | Maximum width. |
| `--hub-toast-padding-x` | `var(--hub-ref-space-3, 1rem)` | Horizontal padding. |
| `--hub-toast-padding-y` | `var(--hub-ref-space-3, 1rem)` | Vertical padding. |
| `--hub-toast-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` | Border radius. |
| `--hub-toast-border-width` | `var(--hub-ref-border-width, 1px)` | Border width. |
| `--hub-toast-shadow` | `var(--hub-sys-shadow-md, 0 0.25rem 0.75rem rgba(0,0,0,.1))` | Box shadow. |
| `--hub-toast-gap` | `var(--hub-ref-space-1, 0.25rem)` | Gap between title and message. |
| `--hub-toast-font-size` | `var(--hub-ref-font-size-base, 1rem)` | Message font size. |
| `--hub-toast-title-font-size` | `var(--hub-ref-font-size-base, 1rem)` | Title font size. |
| `--hub-toast-title-font-weight` | `600` | Title font weight. |
| `--hub-toast-progress-height` | `0.25rem` | Progress bar height. |
| `--hub-toast-progress-bg` | `color-mix(in srgb, var(--hub-toast-accent) 30%, transparent)` | Progress bar colour. |
| `--hub-toast-close-opacity` | `0.5` | Close button opacity. |
| `--hub-toast-close-opacity-hover` | `1` | Close button hover opacity. |

### Container

| Variable | Default | Description |
|---|---|---|
| `--hub-toast-container-gap` | `var(--hub-ref-space-2, 0.5rem)` | Gap between stacked toasts. |
| `--hub-toast-container-offset` | `var(--hub-ref-space-3, 1rem)` | Distance from screen edges. |
| `--hub-toast-container-z-index` | `1050` | Stack order. |

### Theming example

```css
:root {
    --hub-toast-border-radius: 0.5rem;
    --hub-toast-container-offset: 1.5rem;
}
```

### Custom toast types

Pass any string as the `type` argument to `show()`. Set `--hub-toast-accent` on the host element to drive the automatic colour derivation:

```typescript
this.toast.show('Sync queued.', 'Offline', { timeOut: 0 }, 'offline');
```

```css
hub-toast[data-type='offline'] {
    --hub-toast-accent: #6c757d;
}
```

---

## 📦 Peer Dependencies

```json
{
    "@angular/animations": ">=22.0.0",
    "@angular/common": ">=22.0.0",
    "@angular/core": ">=22.0.0"
}
```

---

## 📊 Changelog

See [CHANGELOG.md](./CHANGELOG.md).

---

## 📄 License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
