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

	afterEach(async () => {
		// Containers are mounted from the .then() of a dynamic import, so they can reach
		// document.body after the test that raised the toast has already finished.
		await new Promise((resolve) => setTimeout(resolve));
		document.querySelectorAll('hub-toast-container').forEach((element) => element.remove());
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

	it('HubToastRef.resetTimeout() bumps the restart token of its toast', () => {
		const ref = service.success('Still here');
		const toast = service.toasts()[0];
		const before = toast.restartToken();
		ref.resetTimeout();
		expect(toast.restartToken()).toBe(before + 1);
	});

	it('completes the three lifecycle observables when a toast is removed', () => {
		const ref = service.success('Bye');
		const completed = { shown: vi.fn(), hidden: vi.fn(), tap: vi.fn() };
		const subscriptions = [
			ref.onShown.subscribe({ complete: completed.shown }),
			ref.onHidden.subscribe({ complete: completed.hidden }),
			ref.onTap.subscribe({ complete: completed.tap })
		];

		service.remove(ref.toastId);

		expect(completed.shown).toHaveBeenCalled();
		expect(completed.hidden).toHaveBeenCalled();
		expect(completed.tap).toHaveBeenCalled();
		// A completed source tears its subscribers down: no manual unsubscribe is needed.
		expect(subscriptions.every((subscription) => subscription.closed)).toBe(true);
	});

	it('completes the three lifecycle observables of every toast on clear()', () => {
		const first = service.success('A');
		const second = service.error('B');
		const completed = vi.fn();
		const subscriptions = [first, second].flatMap((ref) => [
			ref.onShown.subscribe({ complete: completed }),
			ref.onHidden.subscribe({ complete: completed }),
			ref.onTap.subscribe({ complete: completed })
		]);

		service.clear();

		expect(completed).toHaveBeenCalledTimes(6);
		expect(subscriptions.every((subscription) => subscription.closed)).toBe(true);
	});

	it('HubToastRef.resetTimeout() does not re-emit onShown', () => {
		const ref = service.success('Shown once');
		const shownSpy = vi.fn();
		ref.onShown.subscribe(shownSpy);
		ref.resetTimeout();
		expect(shownSpy).not.toHaveBeenCalled();
	});

	describe('container per position', () => {
		/** Waits for the lazily imported containers to reach the DOM, then returns them. */
		async function mountedContainers(expected: number): Promise<HTMLElement[]> {
			await vi.waitFor(() => {
				expect(document.querySelectorAll('hub-toast-container')).toHaveLength(expected);
			});
			return [...document.querySelectorAll<HTMLElement>('hub-toast-container')];
		}

		it('leaves a toast where it was when the next one opens in another corner', async () => {
			service.success('Reading this', '', { positionClass: 'toast-top-right', timeOut: 0 });
			const [topRight] = await mountedContainers(1);

			expect(topRight.classList.contains('toast-top-right')).toBe(true);
			expect(topRight.querySelectorAll('hub-toast')).toHaveLength(1);

			service.error('Somewhere else', '', { positionClass: 'toast-bottom-left', timeOut: 0 });
			const containers = await mountedContainers(2);

			expect(topRight.classList.contains('toast-top-right'), 'the first toast kept its corner').toBe(true);
			expect(topRight.querySelectorAll('hub-toast'), 'and is still the only one in it').toHaveLength(1);
			expect(containers.map((element) => element.className)).toEqual([
				expect.stringContaining('toast-top-right'),
				expect.stringContaining('toast-bottom-left')
			]);
		});

		it('reuses the container of a position instead of mounting a second one', async () => {
			service.success('First', '', { positionClass: 'toast-top-left', timeOut: 0 });
			service.success('Second', '', { positionClass: 'toast-top-left', timeOut: 0 });
			const [topLeft] = await mountedContainers(1);

			expect(topLeft.querySelectorAll('hub-toast')).toHaveLength(2);
		});
	});
});
