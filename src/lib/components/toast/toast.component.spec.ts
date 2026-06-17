import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
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

	it('accentToken() returns css var for custom types', () => {
		componentRef.setInput('data', makeToastData({ type: 'brand' }));
		fixture.detectChanges();
		expect(component.accentToken()).toBe('var(--hub-sys-color-brand)');
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
});
