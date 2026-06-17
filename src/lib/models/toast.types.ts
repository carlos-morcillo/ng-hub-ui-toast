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
	/** Newest toast appears at the top of the stack. @default true */
	newestOnTop: boolean;
	/** Container position. @default 'toast-top-right' */
	positionClass: HubToastPosition | string;
	/** Max simultaneous toasts. 0 = unlimited. @default 0 */
	maxOpened: number;
	/** When maxOpened is reached, auto-remove the oldest. @default false */
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
}

/**
 * Handle returned to callers of `ToastService`. Provides reactive
 * observables for the toast lifecycle and imperative control methods.
 */
export interface HubToastRef {
	/** Unique id of this toast instance. */
	readonly toastId: number;
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
