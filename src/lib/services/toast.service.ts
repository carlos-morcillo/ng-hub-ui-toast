import { ApplicationRef, ComponentRef, createComponent, inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import type { HubToastConfig, HubToastData, HubToastRef, HubToastType } from '../models/toast.types';
import { ToastConfigService } from './toast-config.service';

/** Monotonically increasing id counter. */
let nextId = 0;

/**
 * Core service for displaying toast notifications.
 * Manages the active toast stack as a signal and lazily mounts the
 * container overlay on the first toast call.
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

	private _containerMounted = false;
	/** Reference to the lazily created container, kept for explicit CD triggers. */
	private _containerRef: ComponentRef<unknown> | null = null;

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
			onTap$: new Subject<void>()
		};

		if (resolved.newestOnTop) {
			this.toasts.update((list) => [data, ...list]);
		} else {
			this.toasts.update((list) => [...list, data]);
		}

		this._ensureContainerMounted();
		this._syncContainer();
		return this._buildRef(data);
	}

	/**
	 * Removes a specific toast by id.
	 * @param toastId - The id returned by the show method.
	 */
	remove(toastId: number): void {
		this._removeById(toastId);
	}

	/** Removes all active toasts immediately. */
	clear(): void {
		this.toasts().forEach((t) => {
			t.onHidden$.next();
			t.onHidden$.complete();
		});
		this.toasts.set([]);
		this._syncContainer();
	}

	// ─── Internal helpers ────────────────────────────────────────────────────

	private _removeById(toastId: number): void {
		const toast = this.toasts().find((t) => t.toastId === toastId);
		if (toast) {
			toast.onHidden$.next();
			toast.onHidden$.complete();
			this.toasts.update((list) => list.filter((t) => t.toastId !== toastId));
			this._syncContainer();
		}
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
					toast.onShown$.next();
				}
			}
		};
	}

	/**
	 * Lazily mounts the `ToastContainerComponent` via Angular's `createComponent`.
	 * Called on the first toast — subsequent calls are no-ops.
	 */
	private _ensureContainerMounted(): void {
		if (this._containerMounted) {
			return;
		}
		this._containerMounted = true;

		import('../components/toast-container/toast-container.component').then(({ ToastContainerComponent }) => {
			const ref = createComponent(ToastContainerComponent, {
				environmentInjector: this._appRef.injector
			});
			this._containerRef = ref;
			this._appRef.attachView(ref.hostView);
			document.body.appendChild(ref.location.nativeElement);
			// Initial render: signal may already hold toasts queued before the import resolved.
			ref.changeDetectorRef.detectChanges();
		});
	}

	/**
	 * Explicitly runs change detection on the container.
	 *
	 * Views created via `createComponent` + `attachView` are not reachable by
	 * Angular's signal-based "mark ancestors dirty" traversal, so they do not
	 * update automatically when a signal changes. Calling `detectChanges()`
	 * directly on the container's `ChangeDetectorRef` is the reliable alternative.
	 */
	private _syncContainer(): void {
		this._containerRef?.changeDetectorRef.detectChanges();
	}
}
