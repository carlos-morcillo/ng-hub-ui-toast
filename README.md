# ng-hub-ui-toast

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-toast.svg)](https://www.npmjs.com/package/ng-hub-ui-toast)
[![Angular](https://img.shields.io/badge/Angular-22-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-toast.svg)](LICENSE)

> Angular 22 standalone toast notification service built on Signals — part of the [ng-hub-ui](https://hubui.dev/) ecosystem.

## Features

- **Signal-driven stack** — active toasts live in a `signal<HubToastData[]>`; works with `OnPush` and zoneless apps.
- **Lazy container mounting** — `ToastContainerComponent` is appended to `document.body` only on the first call; nothing runs at startup.
- **`HubToastRef`** — every call returns a ref with `onShown`, `onHidden`, `onTap` observables and `manualClose()` / `resetTimeout()`.
- **Per-call overrides** — set defaults globally with `provideToast()` and override any option individually.
- **Six positions** — `toast-top-right`, `toast-top-left`, `toast-top-center`, `toast-bottom-right`, `toast-bottom-left`, `toast-bottom-center`.
- **Progress bar & close button** — built-in configurable dismiss controls.
- **CSS variable theming** — every colour, radius, shadow, and dimension is a `--hub-toast-*` token.
- **Built-in semantic types** — `success`, `error`, `warning`, `info` each inherit the matching DS `--hub-sys-color-*` accent family.

## Installation

```bash
npm install ng-hub-ui-toast
```

## Quick start

```typescript
// app.config.ts
import { provideToast } from 'ng-hub-ui-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToast({ progressBar: true, timeOut: 4000 })
  ]
};
```

```typescript
// any component or service
import { ToastService } from 'ng-hub-ui-toast';

@Component({ ... })
export class SaveComponent {
  private toast = inject(ToastService);

  save() {
    this.toast.success('Record saved.', 'Success');
  }
}
```

## API

### `provideToast(config?)`

Call once in `ApplicationConfig.providers`. All options are optional.

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
| `toasts` | `Signal<HubToastData[]>` | Read-only signal of the current stack. |

### `HubToastRef`

```typescript
interface HubToastRef {
  readonly toastId: number;
  readonly onShown:  Observable<void>;   // fires once when toast enters DOM
  readonly onHidden: Observable<void>;   // fires once when toast leaves DOM
  readonly onTap:    Observable<void>;   // fires each time user clicks toast body
  manualClose(): void;                   // removes immediately
  resetTimeout(): void;                  // restarts the auto-dismiss timer
}
```

### Lifecycle example

```typescript
const ref = this.toast.success('Upload complete', 'Done', { timeOut: 0 });

ref.onTap.subscribe(() => this.router.navigate(['/uploads']));
ref.onHidden.subscribe(() => console.log('toast gone'));

// close it programmatically later
someButton.addEventListener('click', () => ref.manualClose());
```

## Positions

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

## CSS Variables

Override any token from your stylesheet — no component re-configuration needed.

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
/* global dark toast for all types */
:root {
  --hub-toast-bg: #1e1e1e;
  --hub-toast-color: #f5f5f5;
  --hub-toast-border-radius: 0.5rem;
  --hub-toast-container-offset: 1.5rem;
}
```

## Custom toast types

Pass any string as the `type` argument to `show()`. Set `--hub-toast-accent` on the calling element to drive the automatic colour derivation:

```typescript
this.toast.show('Sync queued.', 'Offline', { timeOut: 0 }, 'offline');
```

```css
/* set the accent for your custom type */
hub-toast[data-type='offline'] {
  --hub-toast-accent: #6c757d;
}
```

## Peer dependencies

| Package | Version |
|---|---|
| `@angular/core` | `>=22.0.0` |
| `@angular/common` | `>=22.0.0` |
| `@angular/animations` | `>=22.0.0` |

## License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
