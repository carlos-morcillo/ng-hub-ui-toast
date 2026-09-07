import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import type { ToastContainerComponent } from '../components/toast-container/toast-container.component';
import type { HubToastConfig, HubToastData, HubToastRef, HubToastType } from '../models/toast.types';
import { ToastConfigService } from './toast-config.service';

/** Monotonically increasing id counter. */
let nextId = 0;

/**
 * Core service for displaying toast notifications.
 * Manages the active toast stack as a signal and lazily mounts one container
 * overlay per position class, the first time a toast asks for that position.
 *
 * `maxOpened` caps the stack as a whole, not one corner of it: the cap is on how
 * much of the screen notifications may occupy, and that is not divisible by corner.
 *
 * @example
 * ```typescript
 * constructor(private toastr: ToastService) {}
 *
 * save() {
 *   this.toastr.success('Record saved', 'Success');
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
	private readonly _config = inject(ToastConfigService);
	private readonly _appRef = inject(ApplicationRef);

	/** Read-only signal of all currently active toasts. */
	readonly toasts = signal<HubToastData[]>([]);

	/**
	 * One lazily created container per position class in use, kept for explicit CD
	 * triggers. A single shared container would have to pick one position for every
	 * toast on screen, so opening a notification in another corner moved the ones
	 * the user was already reading.
	 */
	private readonly _containers = new Map<string, ComponentRef<ToastContainerComponent>>();

	/** Positions whose container is being imported; guards against a double mount. */
	private readonly _mountingPositions = new Set<string>();

	// ─── Public shorthand methods ───────────────────────────────────────────

	/**
	 * Shows a success toast.
	 * @param message - Notification body.
	 * @param title - Optional heading.
	 * @param config - Per-call config overrides.
	 */
	success(message: string, title = '', config: Partial<HubToastConfig> = {}): HubToastRef {
		return this.show(message, title, config, 'success');
	}

	/**
	 * Shows an error toast.
	 * @param message - Notification body.
	 * @param title - Optional heading.
	 * @param config - Per-call config overrides.
	 */
	error(message: string, title = '', config: Partial<HubToastConfig> = {}): HubToastRef {
		return this.show(message, title, config, 'error');
	}

	/**
	 * Shows a warning toast.
	 * @param message - Notification body.
	 * @param title - Optional heading.
	 * @param config - Per-call config overrides.
	 */
	warning(message: string, title = '', config: Partial<HubToastConfig> = {}): HubToastRef {
		return this.show(message, title, config, 'warning');
	}

	/**
	 * Shows an informational toast.
	 * @param message - Notification body.
	 * @param title - Optional heading.
	 * @param config - Per-call config overrides.
	 */
	info(message: string, title = '', config: Partial<HubToastConfig> = {}): HubToastRef {
		return this.show(message, title, config, 'info');
	}

	/**
	 * Shows a toast with a custom or built-in type.
	 * The type string is applied as `data-type` on the toast host element
	 * and drives the SCSS `@each` accent loop.
	 *
	 * @param message - Notification body.
	 * @param title - Optional heading.
	 * @param config - Per-call config overrides.
	 * @param type - Semantic type or any custom string.
	 */
	show(
		message: string,
		title = '',
		config: Partial<HubToastConfig> = {},
		type: HubToastType | (string & {}) = 'info'
	): HubToastRef {
		const resolved = this._config.resolve(config);

		if (resolved.preventDuplicates) {
			const duplicate = this.toasts().some((t) => t.message === message && t.type === type);
			if (duplicate) {
				return this._refForExisting(message, type);
			}
		}

		if (resolved.maxOpened > 0 && this.toasts().length >= resolved.maxOpened) {
			if (resolved.autoDismiss) {
				const oldest = resolved.newestOnTop ? this.toasts()[this.toasts().length - 1] : this.toasts()[0];
				this._removeById(oldest.toastId);
			} else {
				return this._buildRef({ toastId: -1 } as any);
			}
		}

		const data: HubToastData = {
			toastId: ++nextId,
			type,
			message,
			title,
			config: resolved,
			onShown$: new Subject<void>(),
			onHidden$: new Subject<void>(),
			onTap$: new Subject<void>(),
			restartToken: signal(0)
		};

		if (resolved.newestOnTop) {
			this.toasts.update((list) => [data, ...list]);
		} else {
			this.toasts.update((list) => [...list, data]);
		}

		this._ensureContainerMounted(resolved.positionClass);
		this._syncContainers();
		return this._buildRef(data);
	}

	/**
	 * Removes a specific toast by id.
	 * @param toastId - The id returned by the show method.
	 */
	remove(toastId: number): void {
		this._removeById(toastId);
	}

	/** Removes all active toasts immediately, in every position. */
	clear(): void {
		this.toasts().forEach((t) => this._endLifecycle(t));
		this.toasts.set([]);
		this._syncContainers();
	}

	// ─── Internal helpers ────────────────────────────────────────────────────

	private _removeById(toastId: number): void {
		const toast = this.toasts().find((t) => t.toastId === toastId);
		if (toast) {
			this._endLifecycle(toast);
			this.toasts.update((list) => list.filter((t) => t.toastId !== toastId));
			this._syncContainers();
		}
	}

	/**
	 * Closes the lifecycle of a toast that is leaving: `onHidden$` fires and every
	 * subject completes. A gone toast can never emit again, so leaving `onShown$`
	 * or `onTap$` open would keep a consumer's subscription — and the toast behind
	 * it — alive for the rest of the session, with no teardown signal to react to.
	 */
	private _endLifecycle(toast: HubToastData): void {
		toast.onHidden$.next();
		toast.onHidden$.complete();
		toast.onShown$.complete();
		toast.onTap$.complete();
	}

	private _refForExisting(message: string, type: string): HubToastRef {
		const existing = this.toasts().find((t) => t.message === message && t.type === type);
		return existing ? this._buildRef(existing) : this._buildRef({ toastId: -1 } as any);
	}

	private _buildRef(data: HubToastData): HubToastRef {
		const svc = this;
		return {
			toastId: data.toastId,
			onShown: data.onShown$?.asObservable() ?? new Subject<void>().asObservable(),
			onHidden: data.onHidden$?.asObservable() ?? new Subject<void>().asObservable(),
			onTap: data.onTap$?.asObservable() ?? new Subject<void>().asObservable(),
			manualClose() {
				svc.remove(data.toastId);
			},
			resetTimeout() {
				const toast = svc.toasts().find((t) => t.toastId === data.toastId);
				if (toast) {
					toast.restartToken.update((token) => token + 1);
				}
			}
		};
	}

	/**
	 * Lazily mounts the `ToastContainerComponent` that owns `position`, via Angular's
	 * `createComponent`. Called on every toast — a position already mounted, or already
	 * being imported, is a no-op. Containers are kept once created: they are inert while
	 * empty, and re-creating one would cost a fresh import on the next toast of that corner.
	 *
	 * @param position - The `positionClass` of the toast that needs a container.
	 */
	private _ensureContainerMounted(position: string): void {
		if (this._containers.has(position) || this._mountingPositions.has(position)) {
			return;
		}
		this._mountingPositions.add(position);

		import('../components/toast-container/toast-container.component').then(({ ToastContainerComponent }) => {
			this._mountingPositions.delete(position);
			// The dynamic import resolves on a later microtask, by which time the application may
			// already be gone — a toast raised just before teardown, a destroyed TestBed, an HMR
			// reload. Touching the environment injector then throws NG0205.
			if (this._appRef.destroyed) {
				return;
			}

			const ref = createComponent(ToastContainerComponent, {
				environmentInjector: this._appRef.injector
			});
			ref.setInput('position', position);
			this._containers.set(position, ref);
			this._appRef.attachView(ref.hostView);
			document.body.appendChild(ref.location.nativeElement);
			// Initial render: signal may already hold toasts queued before the import resolved.
			ref.changeDetectorRef.detectChanges();
		});
	}

	/**
	 * Explicitly runs change detection on every mounted container.
	 *
	 * Views created via `createComponent` + `attachView` are not reachable by
	 * Angular's signal-based "mark ancestors dirty" traversal, so they do not
	 * update automatically when a signal changes. Calling `detectChanges()`
	 * directly on each container's `ChangeDetectorRef` is the reliable alternative.
	 */
	private _syncContainers(): void {
		this._containers.forEach((ref) => ref.changeDetectorRef.detectChanges());
	}
}
