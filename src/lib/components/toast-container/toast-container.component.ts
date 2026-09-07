import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { HubToastData, HubToastPosition } from '../../models/toast.types';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

/**
 * Fixed-corner container that renders the toasts of ONE position.
 *
 * `ToastService` mounts one instance per position class actually in use and appends
 * it to `document.body` — never declared in user templates. Each container renders
 * only the toasts whose config names its own position, which is what keeps a
 * notification opened in another corner from relocating the ones already on screen.
 */
@Component({
	selector: 'hub-toast-container',
	templateUrl: './toast-container.component.html',
	styleUrl: './toast-container.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ToastComponent],
	host: {
		class: 'hub-toast-container',
		'[class]': 'position()'
	}
})
export class ToastContainerComponent {
	protected readonly toastService = inject(ToastService);

	/** Position this container owns; also the class that anchors it to its corner. */
	readonly position = input<HubToastPosition | string>('toast-top-right');

	/** The active toasts configured for this container's position. */
	protected readonly toasts = computed(() =>
		this.toastService.toasts().filter((toast) => toast.config.positionClass === this.position())
	);

	/**
	 * Paint order keyed by toast id: the more recently opened, the higher.
	 *
	 * With `newestOnTop` the newest toast is rendered FIRST, and a first sibling paints
	 * beneath the ones that follow it — so a toast sliding in would appear under the
	 * shadows of the toasts already there. Recency, not DOM order, decides who is on top.
	 */
	private readonly _stackOrder = computed(() => {
		const oldestFirst = [...this.toasts()].sort((a, b) => a.toastId - b.toastId);
		return new Map(oldestFirst.map((toast, index) => [toast.toastId, index + 1]));
	});

	/** Stacking level of one toast, read from {@link _stackOrder}. */
	protected stackOrder(toast: HubToastData): number {
		return this._stackOrder().get(toast.toastId) ?? 1;
	}

	/** Delegates toast removal to `ToastService`. */
	protected onClosed(toastId: number): void {
		this.toastService.remove(toastId);
	}
}
