# ng-hub-ui-toast

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-toast.svg)](https://www.npmjs.com/package/ng-hub-ui-toast)
[![Angular](https://img.shields.io/badge/Angular-22-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-toast.svg)](LICENSE)

> Servicio de notificaciones toast para Angular 22 standalone, construido sobre Signals — parte del ecosistema [ng-hub-ui](https://hubui.dev/).

## Características

- **Stack basado en signals** — los toasts activos viven en un `signal<HubToastData[]>`; compatible con `OnPush` y apps sin zones.
- **Montaje lazy del contenedor** — `ToastContainerComponent` se añade a `document.body` solo en la primera llamada; nada se ejecuta al arrancar.
- **`HubToastRef`** — cada llamada devuelve una referencia con observables `onShown`, `onHidden`, `onTap` y los métodos `manualClose()` / `resetTimeout()`.
- **Overrides por llamada** — define valores por defecto globales con `provideToast()` y sobreescríbelos individualmente en cada llamada.
- **Seis posiciones** — `toast-top-right`, `toast-top-left`, `toast-top-center`, `toast-bottom-right`, `toast-bottom-left`, `toast-bottom-center`.
- **Barra de progreso y botón de cierre** — controles de dismiss configurables.
- **Tematización con CSS variables** — cada color, radio, sombra y dimensión es un token `--hub-toast-*`.
- **Tipos semánticos integrados** — `success`, `error`, `warning`, `info` heredan cada uno la familia de acento `--hub-sys-color-*` correspondiente del Design System.

## Instalación

```bash
npm install ng-hub-ui-toast
```

## Inicio rápido

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
// cualquier componente o servicio
import { ToastService } from 'ng-hub-ui-toast';

@Component({ ... })
export class SaveComponent {
  private toast = inject(ToastService);

  save() {
    this.toast.success('Registro guardado.', 'Éxito');
  }
}
```

## API

### `provideToast(config?)`

Se llama una vez en `ApplicationConfig.providers`. Todas las opciones son opcionales.

| Opción | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `timeOut` | `number` | `5000` | Tiempo antes del auto-dismiss (ms). `0` = persistente. |
| `extendedTimeOut` | `number` | `2500` | Ms extra mientras el usuario tiene el cursor encima. |
| `closeButton` | `boolean` | `true` | Mostrar botón × de cierre. |
| `progressBar` | `boolean` | `false` | Mostrar barra de progreso de countdown. |
| `tapToDismiss` | `boolean` | `true` | Cerrar al hacer click. |
| `disableTimeOut` | `boolean \| 'timeOut' \| 'extendedTimeOut'` | `false` | Desactivar el temporizador de auto-dismiss. |
| `newestOnTop` | `boolean` | `true` | Los toasts más nuevos aparecen arriba del stack. |
| `positionClass` | `HubToastPosition` | `'toast-top-right'` | Posición del contenedor en pantalla. |
| `maxOpened` | `number` | `0` | Máximo de toasts simultáneos (`0` = ilimitado). |
| `autoDismiss` | `boolean` | `false` | Eliminar el más antiguo cuando se alcanza `maxOpened`. |
| `preventDuplicates` | `boolean` | `false` | Ignorar nuevos toasts con un mensaje ya visible. |

### `ToastService`

| Método | Firma | Descripción |
|---|---|---|
| `success` | `(message, title?, config?) → HubToastRef` | Mostrar toast de éxito. |
| `error` | `(message, title?, config?) → HubToastRef` | Mostrar toast de error. |
| `warning` | `(message, title?, config?) → HubToastRef` | Mostrar toast de advertencia. |
| `info` | `(message, title?, config?) → HubToastRef` | Mostrar toast informativo. |
| `show` | `(message, title?, config?, type?) → HubToastRef` | Mostrar toast con tipo personalizado. |
| `remove` | `(toastId: number) → void` | Eliminar un toast por id. |
| `clear` | `() → void` | Eliminar todos los toasts activos. |
| `toasts` | `Signal<HubToastData[]>` | Signal de solo lectura con el stack actual. |

### `HubToastRef`

```typescript
interface HubToastRef {
  readonly toastId: number;
  readonly onShown:  Observable<void>;   // emite una vez cuando el toast entra en el DOM
  readonly onHidden: Observable<void>;   // emite una vez cuando el toast sale del DOM
  readonly onTap:    Observable<void>;   // emite cada vez que el usuario hace click
  manualClose(): void;                   // elimina inmediatamente
  resetTimeout(): void;                  // reinicia el temporizador de auto-dismiss
}
```

### Ejemplo de ciclo de vida

```typescript
const ref = this.toast.success('Carga completada', 'Listo', { timeOut: 0 });

ref.onTap.subscribe(() => this.router.navigate(['/uploads']));
ref.onHidden.subscribe(() => console.log('toast cerrado'));

// cerrar programáticamente
someButton.addEventListener('click', () => ref.manualClose());
```

## Posiciones

| Clase | Ubicación |
|---|---|
| `toast-top-right` | Esquina superior derecha (por defecto) |
| `toast-top-left` | Esquina superior izquierda |
| `toast-top-center` | Centro superior |
| `toast-bottom-right` | Esquina inferior derecha |
| `toast-bottom-left` | Esquina inferior izquierda |
| `toast-bottom-center` | Centro inferior |

```typescript
// override por llamada
this.toast.info('Mensaje', '', { positionClass: 'toast-bottom-center' });
```

## CSS Variables

Sobreescribe cualquier token desde tu hoja de estilos, sin reconfigurar los componentes.

### Elemento toast

| Variable | Por defecto | Descripción |
|---|---|---|
| `--hub-toast-bg` | `var(--hub-sys-surface-page, #fff)` | Color de fondo. |
| `--hub-toast-color` | `var(--hub-sys-text-primary, #212529)` | Color del texto. |
| `--hub-toast-border` | `var(--hub-sys-border-color-default, #dee2e6)` | Color del borde. |
| `--hub-toast-accent` | `var(--hub-sys-border-color-default, #dee2e6)` | Color del borde de acento izquierdo. |
| `--hub-toast-accent-width` | `0.25rem` | Grosor del borde de acento. |
| `--hub-toast-min-width` | `18rem` | Ancho mínimo. |
| `--hub-toast-max-width` | `26rem` | Ancho máximo. |
| `--hub-toast-padding-x` | `var(--hub-ref-space-3, 1rem)` | Padding horizontal. |
| `--hub-toast-padding-y` | `var(--hub-ref-space-3, 1rem)` | Padding vertical. |
| `--hub-toast-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` | Radio de borde. |
| `--hub-toast-border-width` | `var(--hub-ref-border-width, 1px)` | Grosor del borde. |
| `--hub-toast-shadow` | `var(--hub-sys-shadow-md, 0 0.25rem 0.75rem rgba(0,0,0,.1))` | Box shadow. |
| `--hub-toast-gap` | `var(--hub-ref-space-1, 0.25rem)` | Espacio entre título y mensaje. |
| `--hub-toast-font-size` | `var(--hub-ref-font-size-base, 1rem)` | Tamaño de fuente del mensaje. |
| `--hub-toast-title-font-size` | `var(--hub-ref-font-size-base, 1rem)` | Tamaño de fuente del título. |
| `--hub-toast-title-font-weight` | `600` | Peso de fuente del título. |
| `--hub-toast-progress-height` | `0.25rem` | Altura de la barra de progreso. |
| `--hub-toast-progress-bg` | `color-mix(in srgb, var(--hub-toast-accent) 30%, transparent)` | Color de la barra de progreso. |
| `--hub-toast-close-opacity` | `0.5` | Opacidad del botón de cierre. |
| `--hub-toast-close-opacity-hover` | `1` | Opacidad del botón de cierre al hacer hover. |

### Contenedor

| Variable | Por defecto | Descripción |
|---|---|---|
| `--hub-toast-container-gap` | `var(--hub-ref-space-2, 0.5rem)` | Espacio entre toasts apilados. |
| `--hub-toast-container-offset` | `var(--hub-ref-space-3, 1rem)` | Distancia a los bordes de pantalla. |
| `--hub-toast-container-z-index` | `1050` | Orden de apilamiento. |

### Ejemplo de tematización

```css
/* toast oscuro global para todos los tipos */
:root {
  --hub-toast-bg: #1e1e1e;
  --hub-toast-color: #f5f5f5;
  --hub-toast-border-radius: 0.5rem;
  --hub-toast-container-offset: 1.5rem;
}
```

## Tipos de toast personalizados

Pasa cualquier string como argumento `type` en `show()`. Usa `--hub-toast-accent` para activar la derivación automática de colores:

```typescript
this.toast.show('Sincronización en cola.', 'Sin conexión', { timeOut: 0 }, 'offline');
```

```css
/* acento para el tipo personalizado */
hub-toast[data-type='offline'] {
  --hub-toast-accent: #6c757d;
}
```

## Dependencias entre pares

| Paquete | Versión |
|---|---|
| `@angular/core` | `>=22.0.0` |
| `@angular/common` | `>=22.0.0` |
| `@angular/animations` | `>=22.0.0` |

## Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
