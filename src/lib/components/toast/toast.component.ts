import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
	OnDestroy,
	output,
	signal
} from '@angular/core';
import { toastAnimation } from '../../animations/toast.animations';
import { HubToastData, HubToastType } from '../../models/toast.types';

/** Built-in type names that have exact DS token coverage via `@each`. */
const BUILT_IN_TYPES = new Set<string>(['success', 'error', 'warning', 'info']);

/**
 * Renders a single toast notification.
 *
 * Driven by a {@link HubToastData} input. Manages its own auto-dismiss timer
 * via `signal` + `effect` and emits `(closed)` with the toast id when done.
 *
 * The `data-type` host attribute drives the `@each` SCSS accent loop;
 * `--hub-toast-accent` is set inline only for custom types.
 */
@Component({
	selector: 'hub-toast',
	templateUrl: './toast.component.html',
	styleUrl: './toast.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [toastAnimation],
	host: {
		class: 'hub-toast',
		'[@toastState]': '"in"',
		'[attr.data-type]': 'data().type',
		'[style.--hub-toast-accent]': 'accentToken()',
		'(click)': 'onTap()'
	}
})
export class ToastComponent implements OnDestroy {
	/** Toast data provided by `ToastContainerComponent`. */
	readonly data = input.required<HubToastData>();

	/** Emits the toast id when this toast should be dismissed. */
	readonly closed = output<number>();

	/** Remaining progress as a percentage (100 → 0). Used by the progress bar. */
	readonly progress = signal(100);

	/**
	 * Inline accent token. Null for built-in types (covered by `@each`);
	 * `var(--hub-sys-color-<type>)` for custom types so `color-mix` derives
	 * the other tokens automatically.
	 */
	readonly accentToken = computed<string | null>(() => {
		const type = this.data().type;
		return BUILT_IN_TYPES.has(type) ? null : `var(--hub-sys-color-${type})`;
	});

	private _timerId: ReturnType<typeof setTimeout> | null = null;
	private _intervalId: ReturnType<typeof setInterval> | null = null;

	constructor() {
		effect(() => {
			const cfg = this.data().config;
			this._clearTimers();
			if (cfg.disableTimeOut === true || cfg.disableTimeOut === 'timeOut') {
				return;
			}
			if (cfg.timeOut > 0) {
				this._startTimer(cfg.timeOut);
			}
		});

		effect(() => {
			this.data().onShown$.next();
		});
	}

	/** Called by `(mouseenter)` binding in the template. */
	onMouseEnter(): void {
		const cfg = this.data().config;
		if (cfg.disableTimeOut !== 'extendedTimeOut') {
			this._clearTimers();
		}
	}

	/** Called by `(mouseleave)` binding in the template. */
	onMouseLeave(): void {
		const cfg = this.data().config;
		if (cfg.extendedTimeOut > 0 && cfg.disableTimeOut !== 'extendedTimeOut') {
			this._startTimer(cfg.extendedTimeOut);
		}
	}

	/** Called by the host `(click)` binding. */
	onTap(): void {
		const cfg = this.data().config;
		this.data().onTap$.next();
		if (cfg.tapToDismiss) {
			this._dismiss();
		}
	}

	/** Called by the close button in the template. */
	onClose(event: Event): void {
		event.stopPropagation();
		this._dismiss();
	}

	ngOnDestroy(): void {
		this._clearTimers();
	}

	private _startTimer(duration: number): void {
		const cfg = this.data().config;
		const start = Date.now();

		if (cfg.progressBar) {
			this._intervalId = setInterval(() => {
				const elapsed = Date.now() - start;
				this.progress.set(Math.max(0, 100 - (elapsed / duration) * 100));
			}, 50);
		}

		this._timerId = setTimeout(() => {
			this._dismiss();
		}, duration);
	}

	private _dismiss(): void {
		this._clearTimers();
		this.closed.emit(this.data().toastId);
	}

	private _clearTimers(): void {
		if (this._timerId !== null) {
			clearTimeout(this._timerId);
			this._timerId = null;
		}
		if (this._intervalId !== null) {
			clearInterval(this._intervalId);
			this._intervalId = null;
		}
		this.progress.set(100);
	}
}
