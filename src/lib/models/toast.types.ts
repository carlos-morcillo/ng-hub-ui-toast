import type { WritableSignal } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Built-in semantic toast types. Each maps to the matching
 * `--hub-sys-color-<type>-*` design-system token family.
 */
export type HubToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Position of the toast container on screen.
 */
export type HubToastPosition =
	| 'toast-top-right'
	| 'toast-top-left'
	| 'toast-top-center'
	| 'toast-bottom-right'
	| 'toast-bottom-left'
	| 'toast-bottom-center';

/**
 * Per-toast configuration. All fields are optional — missing fields
 * fall back to the global defaults set via `provideToast()`.
 */
export interface HubToastConfig {
	/** Duration in ms before auto-dismiss. 0 = persistent. @default 5000 */
	timeOut: number;
	/** Extra ms added while the user hovers. @default 2500 */
	extendedTimeOut: number;
	/** Show a close button. @default true */
	closeButton: boolean;
	/**
	 * Accessible name of the close button. The `×` glyph is decorative, so this
	 * string is the only name a screen reader has for the toast's single control;
	 * applications that are not in English must be able to translate it.
	 * @default 'Close'
	 */
	closeButtonAriaLabel: string;
	/** Show a progress bar counting down to dismissal. @default false */
	progressBar: boolean;
	/** Close on click anywhere on the toast. @default true */
	tapToDismiss: boolean;
	/**
	 * Disable auto-dismiss.
	 * - `true` / `'timeOut'`: disable the initial timer.
	 * - `'extendedTimeOut'`: disable the hover extension only.
	 * @default false
	 */
	disableTimeOut: boolean | 'timeOut' | 'extendedTimeOut';
	/**
	 * Newest toast appears at the top of its stack. Regardless of this order, a toast
	 * that has just opened is always painted above the ones already on screen.
	 * @default true
	 */
	newestOnTop: boolean;
	/**
	 * Corner this toast is shown in. Each position gets its own container, mounted the
	 * first time a toast asks for it, so a toast never moves because of a later one.
	 * @default 'toast-top-right'
	 */
	positionClass: HubToastPosition | string;
	/**
	 * Max simultaneous toasts, counted across every position rather than per corner:
	 * the cap is on how much of the screen notifications may take, which is not
	 * divisible by corner. 0 = unlimited.
	 * @default 0
	 */
	maxOpened: number;
	/**
	 * When maxOpened is reached, auto-remove the oldest toast on screen — which, since
	 * the cap is global, may be one shown in a different corner.
	 * @default false
	 */
	autoDismiss: boolean;
	/** Ignore duplicate messages already visible. @default false */
	preventDuplicates: boolean;
}

/**
 * Internal representation of one active toast.
 * Created by `ToastService` and consumed by `ToastComponent`.
 */
export interface HubToastData {
	/** Monotonically increasing identifier. */
	toastId: number;
	/** Semantic or custom type string. */
	type: HubToastType | (string & {});
	/** Notification body text. */
	message: string;
	/** Optional heading. */
	title?: string;
	/** Resolved config for this specific toast. */
	config: HubToastConfig;
	/** Subject fired once when the toast enters the DOM. */
	onShown$: Subject<void>;
	/** Subject fired once when the toast leaves the DOM. */
	onHidden$: Subject<void>;
	/** Subject fired when the user taps the toast. */
	onTap$: Subject<void>;
	/**
	 * Restart nonce for the auto-dismiss countdown, bumped by
	 * {@link HubToastRef.resetTimeout}. The data object keeps its identity for
	 * the whole life of the toast, so a signal is what carries the order from
	 * the service to the rendered component, whose timer effect reads it.
	 */
	restartToken: WritableSignal<number>;
}

/**
 * Handle returned to callers of `ToastService`. Provides reactive
 * observables for the toast lifecycle and imperative control methods.
 *
 * The three observables complete when the toast closes, so a subscription
 * taken on a handle releases itself without an explicit teardown.
 *
 * A call is not guaranteed to open a notification: with the stack already at
 * `maxOpened` and `autoDismiss` off, the call is dropped and the handle stands for
 * a toast that never reached the screen. {@link HubToastRef.dropped} is how a caller
 * tells the two apart — see it for what such a handle does.
 */
export interface HubToastRef {
	/** Unique id of this toast instance, or `-1` when the notification was dropped. */
	readonly toastId: number;
	/**
	 * Whether the notification was dropped instead of shown, which happens when the stack
	 * is already at `maxOpened` and `autoDismiss` is off.
	 *
	 * A dropped handle is inert and says so at once rather than waiting for something that
	 * will never happen: `onHidden` emits and completes immediately, so awaiting the close
	 * resolves instead of hanging for the rest of the session; `onShown` and `onTap`
	 * complete without ever emitting, because neither event can occur; and `manualClose()`
	 * and `resetTimeout()` do nothing.
	 */
	readonly dropped: boolean;
	/** Emits once when the toast becomes visible. */
	readonly onShown: import('rxjs').Observable<void>;
	/** Emits once when the toast is removed from the DOM. */
	readonly onHidden: import('rxjs').Observable<void>;
	/** Emits each time the user clicks on the toast body. */
	readonly onTap: import('rxjs').Observable<void>;
	/** Immediately removes the toast. */
	manualClose(): void;
	/** Restart the auto-dismiss timer from zero. */
	resetTimeout(): void;
}
