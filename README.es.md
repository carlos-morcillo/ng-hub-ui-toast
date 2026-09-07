# ng-hub-ui-toast

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-toast.svg)](https://www.npmjs.com/package/ng-hub-ui-toast)
[![Angular](https://img.shields.io/badge/Angular-21%2B-red.svg)](https://angular.dev)
[![License](https://img.shields.io/npm/l/ng-hub-ui-toast.svg)](LICENSE)

Servicio de notificaciones toast para Angular standalone (Angular 21+) — API imperativa, observables de ciclo de vida, barra de progreso, seis posiciones y tematización completa con CSS variables. Sin más dependencia externa que `ng-hub-ui-utils`.

## Documentación y ejemplos en vivo

Este paquete es parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para apps standalone.

- Docs: https://hubui.dev/en/toast/overview/
- Ejemplos en vivo: https://hubui.dev/en/toast/examples/
- Hub UI: https://hubui.dev/en/

## 🧩 Familia de bibliotecas `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **ng-hub-ui**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) _(obsoleta → usa panels)_
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
- [**ng-hub-ui-toast**](https://www.npmjs.com/package/ng-hub-ui-toast) ← Estás aquí
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

---

## 🚀 Inicio rápido

### 1. Instalar

```bash
npm install ng-hub-ui-toast ng-hub-ui-utils
```

> **Tematización (recomendado):** instala los tokens de diseño compartidos para que los toasts — y todas las demás bibliotecas ng-hub-ui — usen la misma paleta y modo oscuro:
>
> ```bash
> npm install ng-hub-ui-ds
> ```
> ```css
> @import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';
> ```
>
> Es una dependencia entre pares **opcional**: el servicio incluye fallbacks CSS sensatos y funciona sin ella.

### 2. Registrar el provider

```typescript
// app.config.ts
import { provideToast } from 'ng-hub-ui-toast';

export const appConfig: ApplicationConfig = {
    providers: [
        provideToast({ progressBar: true, timeOut: 4000 })
    ]
};
```

### 3. Inyectar y llamar

```typescript
import { ToastService } from 'ng-hub-ui-toast';

@Component({ ... })
export class SaveComponent {
    private toast = inject(ToastService);

    save() {
        this.toast.success('Registro guardado.', 'Éxito');
    }
}
```

---

## 📦 Descripción

`ng-hub-ui-toast` es un servicio de notificaciones para Angular 21+ standalone cuya única dependencia entre pares ajena a Angular es `ng-hub-ui-utils`. Llama a `ToastService.success()`, `.error()`, `.warning()` o `.info()` desde cualquier componente o servicio; el contenedor overlay de cada esquina se monta de forma lazy la primera vez que una notificación la pide, de modo que cada posición mantiene su propia pila. Cada llamada devuelve un `HubToastRef` con observables `onShown`, `onHidden` y `onTap`, más `manualClose()` / `resetTimeout()`.

## 🎯 Características

- **Stack basado en signals** — la lista de toasts activos es un `signal<HubToastData[]>`; compatible con `OnPush` y apps sin zones.
- **Montaje lazy del contenedor, uno por posición** — se añade un `ToastContainerComponent` a `document.body` la primera vez que un toast pide esa esquina; nada se ejecuta al arrancar, y una notificación abierta en una esquina no mueve a las que ya se están viendo en otra.
- **`HubToastRef`** — observables de ciclo de vida (`onShown`, `onHidden`, `onTap`) y control imperativo (`manualClose()`, `resetTimeout()`).
- **Overrides por llamada** — define valores globales con `provideToast()` y sobreescríbelos individualmente en cada llamada.
- **Seis posiciones** — superior/inferior × derecha/izquierda/centro, cada una con su contenedor y su propia pila.
- **Barra de progreso y botón de cierre** — controles de dismiss configurables.
- **Tematización con CSS variables** — cada color, radio, sombra y dimensión es un token `--hub-toast-*`.
- **Tipos semánticos integrados** — `success`, `error`, `warning` e `info` son los atajos tipados; la hoja de estilos mapea además `primary`, `secondary`, `neutral`, `light` y `dark`, a los que se llega pasando el nombre a `show()`. Cada uno resuelve automáticamente la familia de acento `--hub-sys-color-*` del DS (`error` se mapea a la familia `danger`).
- **Tipos personalizados** — pasa cualquier string a `show()` y controla el acento con tu propio `--hub-toast-accent`.
- **Capacidad y deduplicación** — `maxOpened` limita el stack entero, contando todas las posiciones; `autoDismiss` elimina el toast más antiguo en pantalla; `preventDuplicates` silencia duplicados.

---

## ⚙️ Configuración

### `provideToast(config?)`

Todas las opciones son opcionales y se fusionan sobre los valores por defecto integrados.

| Opción | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `timeOut` | `number` | `5000` | Tiempo antes del auto-dismiss (ms). `0` = persistente. |
| `extendedTimeOut` | `number` | `2500` | Ms extra mientras el usuario tiene el cursor encima. |
| `closeButton` | `boolean` | `true` | Mostrar botón × de cierre. |
| `closeButtonAriaLabel` | `string` | `'Close'` | Nombre accesible del botón de cierre. Tradúcelo en aplicaciones que no estén en inglés. |
| `progressBar` | `boolean` | `false` | Mostrar barra de progreso de countdown. |
| `tapToDismiss` | `boolean` | `true` | Cerrar al hacer click. |
| `disableTimeOut` | `boolean \| 'timeOut' \| 'extendedTimeOut'` | `false` | Desactivar el temporizador de auto-dismiss. |
| `newestOnTop` | `boolean` | `true` | Los toasts más nuevos aparecen arriba del stack. En cualquier caso, un toast recién abierto se pinta por encima de los que ya estaban. |
| `positionClass` | `HubToastPosition \| string` | `'toast-top-right'` | Esquina en la que se muestra este toast. Cada posición tiene su propio contenedor. |
| `maxOpened` | `number` | `0` | Máximo de toasts simultáneos, **contando todas las posiciones**, no por esquina (`0` = ilimitado). |
| `autoDismiss` | `boolean` | `false` | Eliminar el toast más antiguo en pantalla al alcanzar `maxOpened`; como el límite es global, puede ser uno de otra esquina. |
| `preventDuplicates` | `boolean` | `false` | Ignorar nuevos toasts con un mensaje ya visible. |

---

## 🪄 Referencia de API

### Exportaciones públicas

| Exportación | Tipo | Para qué sirve |
|---|---|---|
| `ToastService` | servicio | Punto de entrada imperativo: `success()`, `error()`, `warning()`, `info()`, `show()`, `remove()`, `clear()` y el signal `toasts`. |
| `provideToast(config?)` | función provider | Registra la biblioteca y fija los valores por defecto globales. |
| `ToastConfigService` | servicio | Resuelve la configuración de cada toast (valores integrados ← override de `provideToast()` ← override por llamada). Lo inyecta `ToastService`; inyéctalo tú para leer `defaults`. |
| `HUB_TOAST_CONFIG` | `InjectionToken<Partial<HubToastConfig>>` | El token que rellena `provideToast()`. Provéelo directamente cuando los valores por defecto vengan de otro sitio (un provider de ruta, una factoría). |
| `HUB_TOAST_DEFAULT_CONFIG` | `HubToastConfig` | Los valores por defecto integrados, exportados para poder leerlos o extenderlos. |
| `ToastComponent` | componente (`hub-toast`) | Renderiza un toast individual. Lo instancia el contenedor; se exporta para tests y para renderizar un toast fuera del overlay. |
| `ToastContainerComponent` | componente (`hub-toast-container`) | La pila del overlay de UNA posición, la que nombra su input `position` (por defecto `'toast-top-right'`). `ToastService` monta uno sobre `document.body` por cada posición en uso; nunca se declara en una plantilla de usuario. |
| `HubToastRef`, `HubToastConfig`, `HubToastType`, `HubToastData`, `HubToastPosition` | tipos | La superficie pública de tipos. |

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

Los tres observables completan al cerrarse el toast, así que un `subscribe()` normal se libera solo: no hacen falta `takeUntil` ni `unsubscribe()` manual.

### Ejemplo de ciclo de vida

```typescript
const ref = this.toast.success('Carga completada', 'Listo', { timeOut: 0 });

ref.onTap.subscribe(() => this.router.navigate(['/uploads']));
ref.onHidden.subscribe(() => console.log('toast cerrado'));

closeBtn.addEventListener('click', () => ref.manualClose());
```

### Posiciones

| Clase | Ubicación |
|---|---|
| `toast-top-right` | Esquina superior derecha (por defecto) |
| `toast-top-left` | Esquina superior izquierda |
| `toast-top-center` | Centro superior |
| `toast-bottom-right` | Esquina inferior derecha |
| `toast-bottom-left` | Esquina inferior izquierda |
| `toast-bottom-center` | Centro inferior |

```typescript
this.toast.info('Mensaje', '', { positionClass: 'toast-bottom-center' });
```

Cada posición tiene su propio `hub-toast-container`, montado la primera vez que un toast pide esa
esquina y conservado el resto de la sesión. Un toast solo lo renderiza el contenedor de su
posición, así que abrir una notificación en otro sitio no puede mover a las que ya están en
pantalla. Dentro de un contenedor, el toast recién abierto se pinta por encima de los que ya
estaban, diga lo que diga `newestOnTop` sobre el orden visual.

`maxOpened` cuenta **todas** las posiciones: el límite es cuánta pantalla pueden ocupar las
notificaciones, y eso no se reparte por esquinas, así que con `autoDismiss` un toast de abajo a
la izquierda puede caer para dejar sitio a uno que llega arriba a la derecha.

Da estilo a los contenedores como `hub-toast-container`, acotando por clase de posición cuando
solo quieras una esquina:

```css
hub-toast-container.toast-bottom-center {
    --hub-toast-container-offset: 2rem;
}
```

---

## 🎨 Estilos

Todos los detalles visuales se controlan mediante CSS custom properties `--hub-toast-*`.

### Elemento toast

| Variable | Por defecto | Descripción |
|---|---|---|
| `--hub-toast-bg` | `var(--hub-sys-surface-page, #fff)` | Color de fondo. |
| `--hub-toast-color` | `var(--hub-sys-text-primary, #212529)` | Color del texto. |
| `--hub-toast-border` | `var(--hub-sys-border-color-default, #dee2e6)` | Color del borde. |
| `--hub-toast-accent` | `var(--hub-sys-border-color-default, #dee2e6)` | Color de acento — controla todo el borde y la barra de progreso. |
| `--hub-toast-min-width` | `18rem` | Ancho mínimo. |
| `--hub-toast-max-width` | `26rem` | Ancho máximo. |
| `--hub-toast-padding-x` | `var(--hub-ref-space-3, 1rem)` | Padding horizontal. |
| `--hub-toast-padding-y` | `var(--hub-ref-space-3, 1rem)` | Padding vertical. |
| `--hub-toast-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` | Radio de borde. |
| `--hub-toast-border-width` | `var(--hub-ref-border-width, 1px)` | Grosor del borde. |
| `--hub-toast-shadow` | `var(--hub-sys-shadow-md, 0 0.5rem 1rem rgba(0, 0, 0, 0.15))` | Box shadow. |
| `--hub-toast-gap` | `var(--hub-ref-space-1, 0.25rem)` | Espacio entre título y mensaje. |
| `--hub-toast-font-size` | `var(--hub-ref-font-size-base, 1rem)` | Tamaño de fuente del mensaje. |
| `--hub-toast-title-font-size` | `var(--hub-ref-font-size-base, 1rem)` | Tamaño de fuente del título. |
| `--hub-toast-title-font-weight` | `var(--hub-ref-font-weight-semibold, 600)` | Peso de fuente del título. |
| `--hub-toast-progress-height` | `0.25rem` | Altura de la barra de progreso. |
| `--hub-toast-progress-bg` | `color-mix(in oklch, var(--hub-toast-accent) 30%, transparent)` | Color de la barra de progreso. |
| `--hub-toast-close-opacity` | `0.5` | Opacidad del botón de cierre. |
| `--hub-toast-close-opacity-hover` | `1` | Opacidad del botón de cierre al hacer hover. |

### Roles de acento

Se derivan del único slot `--hub-toast-accent`: si cambias la base del acento — con un
`data-type`, con el mixin `hub-toast-theme()` o a mano — los tres roles se recalculan en
tiempo de ejecución.

| Variable | Por defecto | Descripción |
|---|---|---|
| `--hub-toast-accent-subtle` | `color-mix(in oklch, var(--hub-toast-accent) 12%, var(--hub-sys-surface-page, #ffffff))` | Superficie tintada que un toast con `data-type` usa como fondo. |
| `--hub-toast-accent-emphasis` | `color-mix(in oklch, var(--hub-toast-accent) 80%, var(--hub-sys-color-ink, #212529))` | Color del texto de un toast con `data-type`. |
| `--hub-toast-accent-on` | `oklch(from var(--hub-toast-accent) clamp(0, (0.62 - l) * 1000, 1) 0 h)` | Color de contraste para lo que se dibuja SOBRE el acento; el salto a blanco o negro lo decide la luminosidad del propio acento. |

### Contenedor

| Variable | Por defecto | Descripción |
|---|---|---|
| `--hub-toast-container-gap` | `var(--hub-ref-space-2, 0.5rem)` | Espacio entre toasts apilados. |
| `--hub-toast-container-offset` | `var(--hub-ref-space-3, 1rem)` | Distancia a los bordes de pantalla. |
| `--hub-toast-container-zindex` | `var(--hub-sys-zindex-toast, 1090)` | Orden de apilamiento. |

### Ejemplo de tematización

```css
:root {
    --hub-toast-border-radius: 0.5rem;
    --hub-toast-container-offset: 1.5rem;
}
```

### Tematización con el mixin `hub-toast-theme()`

En proyectos Sass, el mixin `hub-toast-theme()` permite re-skinnear un toast en una sola llamada. Todos los parámetros son opcionales y por defecto valen `null`, así que solo los que pases se emiten como overrides `--hub-toast-*` — el resto conservan sus valores por defecto. Está basado en tokens y no depende de Bootstrap. Las tintas semánticas por `data-type` se siguen aplicando automáticamente; usa el mixin para re-skinnear el shell compartido o para personalizar un tipo de toast propio en su propio selector.

```scss
@use 'ng-hub-ui-toast/styles/mixins/toast-theme' as *;

// Personaliza el shell compartido:
hub-toast {
    @include hub-toast-theme(
        $border-radius: 0.75rem,
        $border-width: 2px,
        $shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.18)
    );
}

// O un tipo semántico personalizado (data-type="brand"):
hub-toast[data-type='brand'] {
    @include hub-toast-theme($accent: #6f42c1, $bg: #f5f0fb, $color: #4a2c82);
}
```

### Tipos de toast personalizados

```typescript
this.toast.show('Sincronización en cola.', 'Sin conexión', { timeOut: 0 }, 'offline');
```

```css
hub-toast[data-type='offline'] {
    --hub-toast-accent: #6c757d;
}
```

---

## 📦 Dependencias entre pares

```json
{
    "@angular/common": ">=21.0.0",
    "@angular/core": ">=21.0.0",
    "ng-hub-ui-utils": ">=22.7.0"
}
```

`ng-hub-ui-utils` es donde vive `resolveHubAccent()`, la función con la que el toast
resuelve un `type` personalizado en un color de acento. `ng add ng-hub-ui` la instala por ti;
un `npm install` manual tiene que añadirla de forma explícita.

---

## 📊 Changelog

Ver [CHANGELOG.md](./CHANGELOG.md).

---

## 📄 Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
