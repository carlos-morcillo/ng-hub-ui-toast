# Breaking Changes — ng-hub-ui-toast

## [22.11.0] - 2026-09-08

### The four exported classes are renamed with the `Hub` prefix

- **Change**: `ToastService` is now `HubToastService`, `ToastConfigService` is
  `HubToastConfigService`, `ToastComponent` is `HubToastComponent` and `ToastContainerComponent`
  is `HubToastContainerComponent`. Only the exported names move: the classes are the same
  objects, the selectors are unchanged, and `provideToast()`, `HUB_TOAST_CONFIG`,
  `HUB_TOAST_DEFAULT_CONFIG` and every type keep the names they had.

- **Why**: `ToastService` is the single most predictable name an application can give its own
  notification wrapper, and a library that claims it takes a name that was never the library's to
  take. The moment a consumer writes one, the file importing both has two bindings on one
  identifier and has to alias its way out of a collision it did not create. This is not
  hypothetical for a package whose whole surface was unprefixed while the rest of the family —
  `HubToastConfig`, `HubToastRef`, `HubToastPosition` — already carried the prefix, so the types
  and the classes they belong to were spelled by two different conventions in the same import
  list.

- **What happens if you do nothing**: today, nothing. All four old names are still exported as
  `@deprecated` aliases resolving to the very same classes, so imports keep compiling, injection
  keeps resolving — `inject(ToastService)` and `inject(HubToastService)` name one class, and the
  same singleton — and a provider written as `{ provide: ToastService, useClass: … }` still
  overrides it. They are removed in **23.0.0**, the release that moves this family to Angular 23,
  and that is the version where the import stops compiling.

- **Migration**: rename the imports and the injections.

    ```ts
    // Before
    import { ToastService } from 'ng-hub-ui-toast';

    export class OrdersComponent {
    	private readonly toastr = inject(ToastService);
    }

    // After
    import { HubToastService } from 'ng-hub-ui-toast';

    export class OrdersComponent {
    	private readonly toastr = inject(HubToastService);
    }
    ```

    A test double or a wrapper that provides its own implementation must move to the new class as
    its token in the same edit, since a provider keyed on the alias and an `inject(HubToastService)`
    in library code still meet — they are the same class — but a codebase left half-renamed reads
    as though they might not.

## [22.10.0] - 2026-09-07

### `HubToastRef` requires a `dropped` boolean

- **Change**: `HubToastRef` gained `dropped: boolean`, which says whether the call opened a
  notification or was refused because the stack was already at `maxOpened` with `autoDismiss`
  off. Every handle `ToastService` returns carries it.
- **Impact**: only code that constructs a `HubToastRef` itself — a test double, a fake
  `ToastService`, a wrapper that returns its own handle — stops compiling for the missing
  property. Code that merely receives the handle is unaffected, and so is every existing use of
  `toastId`, the three observables and the two methods.
- **Migration**: add `dropped: false` to any hand-built handle that stands for a toast which
  really opened, and `dropped: true` to one that stands for a refused call.

### A dropped handle now closes its lifecycle immediately

- **Change**: the handle returned when a call is dropped at `maxOpened` used to expose three
  observables that never emitted and never completed. Now `onHidden` emits once and completes,
  `onShown` and `onTap` complete without emitting, and `manualClose()` and `resetTimeout()` do
  nothing.
- **Impact**: a `subscribe()` on such a handle now receives its `complete` notification, and an
  `onHidden` subscriber receives one value. Code that counted on nothing ever arriving — a
  cleanup routine written to run only for toasts that were really shown — now runs at once for
  a dropped notification too. It is the same thing that already happened for a toast removed by
  `clear()`.
- **Migration**: guard on `dropped` where the difference matters: `if (ref.dropped) { return; }`
  before subscribing, or before treating the notification as having been seen.

### The overlay is one container per position, not a single container

- **Change**: `ToastService` used to mount exactly one `hub-toast-container` on `document.body`
  and swap its position class as toasts arrived. It now mounts one container per position class
  actually used — created the first time a toast asks for that corner, and kept for the rest of
  the session — and each renders only the toasts configured for its own position. Toasts opened
  in different corners no longer share an element, which is what stopped a new notification from
  dragging the ones already on screen to its own corner.
- **Impact**: the markup changed, so anyone styling or querying the overlay is affected.
    - CSS that assumed a single container — `body > hub-toast-container:only-of-type`,
      `:last-child`, or a rule that reached the toasts through one specific corner class — now
      matches a subset of the containers, or none.
    - Tests or scripts that read `document.querySelector('hub-toast-container')` get the container
      of the first position mounted, not "the" container; count and query per position instead.
    - Every container is now created with its corner and keeps it, so a stylesheet keyed on a class
      that used to change at runtime is now keyed on a class that never does.
    - `hub-toast` elements carry an inline `z-index` so a toast that has just opened paints above
      the ones already there. An override needs `!important`, or a rule on the container.
- **Migration**: style `hub-toast-container` itself, optionally narrowed by its position class
  (`hub-toast-container.toast-top-right`), and drop any selector that depended on there being one
  of them. In tests, query all of them and pick by position class.

### `ToastContainerComponent` renders only its own position

- **Change**: the component gained a `position` input — the position class it owns, defaulting to
  `'toast-top-right'` — and renders only the toasts whose `positionClass` matches it.
- **Impact**: declaring `<hub-toast-container />` in a template was never supported, but code that
  did it now shows only the top-right toasts unless it passes `[position]`. Nothing that goes
  through `ToastService` is affected: the service sets the input on every container it mounts.
- **Migration**: pass the position you want — `<hub-toast-container position="toast-bottom-left" />`
  — or, better, let `ToastService` do the mounting.

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
