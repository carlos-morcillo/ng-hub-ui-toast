import { TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastService } from './toast.service';
import { provideToast } from './toast-config.service';

describe('ToastService', () => {
	let service: ToastService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [provideToast(), provideAnimationsAsync()]
		});
		service = TestBed.inject(ToastService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('success() adds a toast with type "success"', () => {
		service.success('Hello');
		expect(service.toasts().length).toBe(1);
		expect(service.toasts()[0].type).toBe('success');
		expect(service.toasts()[0].message).toBe('Hello');
	});

	it('error() adds a toast with type "error"', () => {
		service.error('Fail');
		expect(service.toasts()[0].type).toBe('error');
	});

	it('warning() adds a toast with type "warning"', () => {
		service.warning('Watch out');
		expect(service.toasts()[0].type).toBe('warning');
	});

	it('info() adds a toast with type "info"', () => {
		service.info('FYI');
		expect(service.toasts()[0].type).toBe('info');
	});

	it('show() accepts a custom type string', () => {
		service.show('msg', '', {}, 'brand');
		expect(service.toasts()[0].type).toBe('brand');
	});

	it('remove() removes a toast by id', () => {
		const ref = service.success('Hi');
		expect(service.toasts().length).toBe(1);
		service.remove(ref.toastId);
		expect(service.toasts().length).toBe(0);
	});

	it('clear() removes all toasts', () => {
		service.success('A');
		service.error('B');
		expect(service.toasts().length).toBe(2);
		service.clear();
		expect(service.toasts().length).toBe(0);
	});

	it('preventDuplicates blocks identical messages', () => {
		service.success('Saved', '', { preventDuplicates: true });
		service.success('Saved', '', { preventDuplicates: true });
		expect(service.toasts().length).toBe(1);
	});

	it('maxOpened with autoDismiss removes the oldest', () => {
		service.success('A', '', { maxOpened: 2, autoDismiss: true });
		service.success('B', '', { maxOpened: 2, autoDismiss: true });
		service.success('C', '', { maxOpened: 2, autoDismiss: true });
		expect(service.toasts().length).toBe(2);
		expect(service.toasts()[0].message).toBe('C');
	});

	it('returned HubToastRef contains the correct toastId', () => {
		const ref = service.info('Test');
		expect(ref.toastId).toBe(service.toasts()[0].toastId);
	});

	it('HubToastRef.manualClose() removes the toast', () => {
		const ref = service.success('Bye');
		ref.manualClose();
		expect(service.toasts().length).toBe(0);
	});
});
