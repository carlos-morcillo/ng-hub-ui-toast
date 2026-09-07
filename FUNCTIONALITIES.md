# Functionalities of Toast Library

This table details the functionalities of the `ng-hub-ui-toast` library and indicates which ones are covered by interactive examples.

"Example Covered" means something a reader of the documentation page can actually operate demonstrates it: an example **registered on the page**, a **playground control**, or the live demo in the **Mixins** tab. A source file that exists but is not reachable from the page does not count, and neither does a code snippet in the README.

## Service (`ToastService`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Shorthands** | `success(message, title?, config?)` | ✅ |
| | `error(message, title?, config?)` | ✅ |
| | `warning(message, title?, config?)` | ✅ |
| | `info(message, title?, config?)` | ✅ |
| **Generic** | `show(message, title?, config?, type?)` with a custom type | ✅ |
| **Stack control** | `remove(toastId)` | ❌ |
| | `clear()` | ✅ |
| **State** | `toasts` signal of the active stack | ❌ |
| **Mounting** | One container per position, mounted lazily on `document.body` the first time that corner is used | ✅ |
| | A container is reused for every later toast of its position | ✅ |
| | Mount skipped when the application is already destroyed | ❌ |

## Toast handle (`HubToastRef`)

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Identity** | `toastId` | ✅ |
| | `dropped` — the notification never opened, because the stack was at `maxOpened` with `autoDismiss` off | ❌ |
| **Lifecycle** | `onShown` observable | ✅ |
| | `onHidden` observable | ✅ |
| | `onTap` observable | ✅ |
| **Imperative** | `manualClose()` | ✅ |
| | `resetTimeout()` | ✅ |

## Configuration

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Providers** | `provideToast(config?)` global defaults | ❌ |
| | `HUB_TOAST_CONFIG` token provided directly | ❌ |
| | `HUB_TOAST_DEFAULT_CONFIG` export | ❌ |
| | `ToastConfigService.defaults` | ✅ |
| | `ToastConfigService.resolve()` | ❌ |
| **Timing** | `timeOut` (`0` = persistent) | ✅ |
| | `extendedTimeOut` on hover | ❌ |
| | `disableTimeOut` (`true` / `'timeOut'` / `'extendedTimeOut'`) | ❌ |
| **Dismiss controls** | `closeButton` | ✅ |
| | `closeButtonAriaLabel` | ✅ |
| | `progressBar` | ✅ |
| | `tapToDismiss` | ✅ |
| **Stack** | `newestOnTop` | ❌ |
| | A toast that has just opened is painted above the ones already on screen | ❌ |
| | `maxOpened` cap, counted across every position rather than per corner | ✅ |
| | `autoDismiss` (drop the oldest toast on screen, wherever it is) | ✅ |
| | `preventDuplicates` | ✅ |
| **Placement** | `positionClass` per call | ✅ |

## Positions

Each position owns a `hub-toast-container` of its own, so toasts in different corners never share
an element and a new one cannot relocate those already on screen.

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Container** | Two corners open at once keep independent stacks (`ToastContainerComponent.position`) | ✅ |
| **Top** | `toast-top-right` (default) | ✅ |
| | `toast-top-left` | ✅ |
| | `toast-top-center` | ✅ |
| **Bottom** | `toast-bottom-right` | ✅ |
| | `toast-bottom-left` | ✅ |
| | `toast-bottom-center` | ✅ |

## Semantic types and accent

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Built-in** | `success` / `warning` / `info` → `--hub-sys-color-<type>` | ✅ |
| | `error` → the DS `danger` family | ✅ |
| **Open set** | `primary` / `secondary` / `neutral` / `light` / `dark` | ❌ |
| **Custom** | Any bareword type resolved through `resolveHubAccent` | ✅ |
| | A literal colour as the type (`#hex`, `rgb()`, `oklch()`) | ❌ |
| **Derived roles** | `-subtle` / `-emphasis` / `-on` recomputed from the accent slot | ❌ |

## Accessibility

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **Live region** | `role="alert"` + `aria-live="assertive"` for `error` / `warning` | ✅ |
| | `role="status"` + `aria-live="polite"` for the rest | ✅ |
| | `aria-atomic="true"` on the toast host | ✅ |
| **Controls** | Close button with an accessible name, translatable via `closeButtonAriaLabel` | ✅ |
| | Progress bar exposed as `role="progressbar"` with its bounds | ✅ |
| **Motion** | Enter animation dropped under `prefers-reduced-motion` | ❌ |

## Styling

| Category | Functionality | Example Covered |
| :--- | :--- | :---: |
| **CSS Variables** | `--hub-toast-bg` | ✅ |
| | `--hub-toast-color` | ✅ |
| | `--hub-toast-accent` | ✅ |
| | `--hub-toast-accent-subtle` | ❌ |
| | `--hub-toast-accent-emphasis` | ❌ |
| | `--hub-toast-accent-on` | ❌ |
| | `--hub-toast-border` | ❌ |
| | `--hub-toast-border-width` | ❌ |
| | `--hub-toast-border-radius` | ✅ |
| | `--hub-toast-shadow` | ✅ |
| | `--hub-toast-min-width` | ❌ |
| | `--hub-toast-max-width` | ✅ |
| | `--hub-toast-padding-x` | ✅ |
| | `--hub-toast-padding-y` | ✅ |
| | `--hub-toast-gap` | ❌ |
| | `--hub-toast-font-size` | ✅ |
| | `--hub-toast-title-font-size` | ❌ |
| | `--hub-toast-title-font-weight` | ❌ |
| | `--hub-toast-progress-bg` | ✅ |
| | `--hub-toast-progress-height` | ✅ |
| | `--hub-toast-close-opacity` | ❌ |
| | `--hub-toast-close-opacity-hover` | ❌ |
| | `--hub-toast-container-gap` | ❌ |
| | `--hub-toast-container-offset` | ❌ |
| | `--hub-toast-container-zindex` | ❌ |
| **Sass** | `hub-toast-theme()` one-call mixin | ✅ |
| | `@use 'ng-hub-ui-toast/styles'` root entry | ✅ |
| **Structure** | BEM classes (`hub-toast__body`, `__title`, `__message`, `__close`, `__progress`) | ❌ |

---

_Note: ✅ indicates an active interactive example or playground control is available in the documentation. ❌ indicates functionality exists but is only shown as a code snippet, or not shown at all._
