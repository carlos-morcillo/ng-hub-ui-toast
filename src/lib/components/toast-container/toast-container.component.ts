import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toastAnimation } from '../../animations/toast.animations';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

/**
 * Fixed-corner container that renders all active toasts.
 *
 * Mounted once by `ToastService._ensureContainerMounted()` and appended
 * directly to `document.body` — never declared in user templates.
 * The `positionClass` from the first toast's config drives the CSS class
 * that positions the container in the viewport corner.
 */
@Component({
	selector: 'hub-toast-container',
	templateUrl: './toast-container.component.html',
	styleUrl: './toast-container.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [toastAnimation],
	imports: [ToastComponent],
	host: {
		class: 'hub-toast-container',
		'[class]': 'positionClass()'
	}
})
export class ToastContainerComponent {
	protected readonly toastService = inject(ToastService);

	/** Active toast list from the service signal. */
	protected readonly toasts = this.toastService.toasts;

	/**
	 * Position class derived from the first active toast's config.
	 * Uses the first toast so the container position stays stable across updates.
	 */
	protected readonly positionClass = () => {
		const list = this.toasts();
		return list.length > 0 ? list[0].config.positionClass : 'toast-top-right';
	};

	/** Delegates toast removal to `ToastService`. */
	protected onClosed(toastId: number): void {
		this.toastService.remove(toastId);
	}
}
