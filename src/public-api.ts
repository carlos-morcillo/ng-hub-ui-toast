/*
 * Public API Surface of ng-hub-ui-toast
 */

export { HubToastService } from './lib/services/toast.service';
export {
	HubToastConfigService,
	provideToast,
	HUB_TOAST_CONFIG,
	HUB_TOAST_DEFAULT_CONFIG
} from './lib/services/toast-config.service';
export { HubToastComponent } from './lib/components/toast/toast.component';
export { HubToastContainerComponent } from './lib/components/toast-container/toast-container.component';
export type { HubToastRef, HubToastConfig, HubToastType, HubToastData, HubToastPosition } from './lib/models/toast.types';

// ─── Deprecated aliases ───────────────────────────────────────────────────────
// Every class in the family carries the `Hub` prefix, so a consumer importing several
// packages into one file cannot end up with two `ToastService`s. The classes behind these
// aliases are unchanged; only the exported names move.

/** @deprecated Renamed to `HubToastService`, and removed under this name in **23.0.0**. */
export { HubToastService as ToastService } from './lib/services/toast.service';
/** @deprecated Renamed to `HubToastConfigService`, and removed under this name in **23.0.0**. */
export { HubToastConfigService as ToastConfigService } from './lib/services/toast-config.service';
/** @deprecated Renamed to `HubToastComponent`, and removed under this name in **23.0.0**. */
export { HubToastComponent as ToastComponent } from './lib/components/toast/toast.component';
/** @deprecated Renamed to `HubToastContainerComponent`, and removed under this name in **23.0.0**. */
export { HubToastContainerComponent as ToastContainerComponent } from './lib/components/toast-container/toast-container.component';
