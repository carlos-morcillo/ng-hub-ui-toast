import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef, signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { Subject } from 'rxjs';
import { ToastComponent } from './toast.component';
import { HubToastData } from '../../models/toast.types';
import { HUB_TOAST_DEFAULT_CONFIG } from '../../services/toast-config.service';

function makeToastData(overrides: Partial<HubToastData> = {}): HubToastData {
	return {
		toastId: 1,
		type: 'success',
		message: 'Test message',
		title: 'Test title',
		config: { ...HUB_TOAST_DEFAULT_CONFIG },
		onShown$: new Subject<void>(),
		onHidden$: new Subject<void>(),
		onTap$: new Subject<void>(),
		restartToken: signal(0),
		...overrides
	};
}

describe('ToastComponent', () => {
	let component: ToastComponent;
	let componentRef: ComponentRef<ToastComponent>;
	let fixture: ComponentFixture<ToastComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ToastComponent],
			providers: [provideAnimationsAsync()]
		}).compileComponents();

		fixture = TestBed.createComponent(ToastComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should create', () => {
		componentRef.setInput('data', makeToastData());
		fixture.detectChanges();
		expect(component).toBeTruthy();
	});

	it('accentToken() returns null for built-in types', () => {
		componentRef.setInput('data', makeToastData({ type: 'success' }));
		fixture.detectChanges();
		expect(component.accentToken()).toBeNull();
	});

	it('accentToken() resolves a custom name to its ds token with a raw fallback', () => {
		componentRef.setInput('data', makeToastData({ type: 'brand' }));
		fixture.detectChanges();
		expect(component.accentToken()).toBe('var(--hub-sys-color-brand, brand)');
	});

	it('accentToken() passes a literal colour through unchanged', () => {
		componentRef.setInput('data', makeToastData({ type: '#ff0000' }));
		fixture.detectChanges();
		expect(component.accentToken()).toBe('#ff0000');
	});

	it('names the close button with the label the config carries', () => {
		componentRef.setInput(
			'data',
			makeToastData({ config: { ...HUB_TOAST_DEFAULT_CONFIG, closeButton: true, closeButtonAriaLabel: 'Cerrar' } })
		);
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('.hub-toast__close') as HTMLButtonElement;
		expect(closeButton.getAttribute('aria-label')).toBe('Cerrar');
	});

	it('falls back to the default English label when the config does not override it', () => {
		componentRef.setInput('data', makeToastData({ config: { ...HUB_TOAST_DEFAULT_CONFIG, closeButton: true } }));
		fixture.detectChanges();

		const closeButton = fixture.nativeElement.querySelector('.hub-toast__close') as HTMLButtonElement;
		expect(closeButton.getAttribute('aria-label')).toBe('Close');
	});

	it('emits closed output on tap when tapToDismiss is true', () => {
		const data = makeToastData({ config: { ...HUB_TOAST_DEFAULT_CONFIG, tapToDismiss: true } });
		componentRef.setInput('data', data);
		fixture.detectChanges();
		const closedSpy = vi.fn();
		component.closed.subscribe(closedSpy);
		component.onTap();
		expect(closedSpy).toHaveBeenCalledWith(1);
	});

	it('does not emit closed on tap when tapToDismiss is false', () => {
		const data = makeToastData({ config: { ...HUB_TOAST_DEFAULT_CONFIG, tapToDismiss: false } });
		componentRef.setInput('data', data);
		fixture.detectChanges();
		const closedSpy = vi.fn();
		component.closed.subscribe(closedSpy);
		component.onTap();
		expect(closedSpy).not.toHaveBeenCalled();
	});

	it('bumping restartToken counts the full timeOut again from zero', () => {
		vi.useFakeTimers();
		const data = makeToastData({ config: { ...HUB_TOAST_DEFAULT_CONFIG, timeOut: 3000 } });
		componentRef.setInput('data', data);
		fixture.detectChanges();
		const closedSpy = vi.fn();
		component.closed.subscribe(closedSpy);

		vi.advanceTimersByTime(2000);
		data.restartToken.update((token) => token + 1);
		fixture.detectChanges();

		// 4000 ms after the toast appeared: without the restart it would already be gone.
		vi.advanceTimersByTime(2000);
		expect(closedSpy).not.toHaveBeenCalled();

		// 3000 ms after the restart: the full timeOut has elapsed again.
		vi.advanceTimersByTime(1000);
		expect(closedSpy).toHaveBeenCalledWith(1);
	});

	it('bumping restartToken keeps a toast with auto-dismiss disabled persistent', () => {
		vi.useFakeTimers();
		const data = makeToastData({ config: { ...HUB_TOAST_DEFAULT_CONFIG, timeOut: 3000, disableTimeOut: true } });
		componentRef.setInput('data', data);
		fixture.detectChanges();
		const closedSpy = vi.fn();
		component.closed.subscribe(closedSpy);

		data.restartToken.update((token) => token + 1);
		fixture.detectChanges();

		vi.advanceTimersByTime(10_000);
		expect(closedSpy).not.toHaveBeenCalled();
	});
});
