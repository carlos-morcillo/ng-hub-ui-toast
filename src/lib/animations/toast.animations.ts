import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

/**
 * Slide-in/out animation for individual toasts.
 * Enter: slides in from the inline-end edge with a fade.
 * Leave: fades out with a slight upward shift.
 */
export const toastAnimation = trigger('toastState', [
	state('in', style({ opacity: 1, transform: 'translateX(0)' })),
	transition(':enter', [
		animate(
			'200ms ease-out',
			keyframes([
				style({ opacity: 0, transform: 'translateX(100%)', offset: 0 }),
				style({ opacity: 1, transform: 'translateX(0)', offset: 1 })
			])
		)
	]),
	transition(':leave', [
		animate(
			'150ms ease-in',
			keyframes([
				style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
				style({ opacity: 0, transform: 'translateY(-0.5rem)', offset: 1 })
			])
		)
	])
]);
