import { inject, Injectable, InjectionToken, Provider } from '@angular/core';
import type { HubToastConfig, HubToastPosition } from '../models/toast.types';

/** Default configuration applied to every toast unless overridden. */
export const HUB_TOAST_DEFAULT_CONFIG: HubToastConfig = {
	timeOut: 5000,
	extendedTimeOut: 2500,
	closeButton: true,
	progressBar: false,
	tapToDismiss: true,
	disableTimeOut: false,
	newestOnTop: true,
	positionClass: 'toast-top-right' as HubToastPosition,
	maxOpened: 0,
	autoDismiss: false,
	preventDuplicates: false
};

/** Injection token for the global toast configuration. */
export const HUB_TOAST_CONFIG = new InjectionToken<Partial<HubToastConfig>>('HUB_TOAST_CONFIG');

/**
 * Registers the toast library providers.
 * Call inside `ApplicationConfig.providers` or a route's `providers` array.
 *
 * @param config - Partial global defaults merged over {@link HUB_TOAST_DEFAULT_CONFIG}.
 *
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [provideToast({ timeOut: 3000, progressBar: true })]
 * };
 * ```
 */
export function provideToast(config: Partial<HubToastConfig> = {}): Provider[] {
	return [{ provide: HUB_TOAST_CONFIG, useValue: config }];
}

/**
 * Resolves per-toast config by merging global defaults, the provider override,
 * and any per-call overrides. Injected by `ToastService`.
 */
@Injectable({ providedIn: 'root' })
export class ToastConfigService {
	private readonly _override = inject(HUB_TOAST_CONFIG, { optional: true }) ?? {};

	/** Returns the merged global config (default ← provider override). */
	get defaults(): HubToastConfig {
		return { ...HUB_TOAST_DEFAULT_CONFIG, ...this._override };
	}

	/**
	 * Merges global defaults with per-call overrides into a final config.
	 *
	 * @param perCall - Per-call partial overrides.
	 * @returns Fully resolved config for one toast.
	 */
	resolve(perCall: Partial<HubToastConfig> = {}): HubToastConfig {
		return { ...this.defaults, ...perCall };
	}
}
