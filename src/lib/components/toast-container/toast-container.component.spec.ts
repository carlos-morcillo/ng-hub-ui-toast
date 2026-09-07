import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastService } from '../../services/toast.service';
import { provideToast } from '../../services/toast-config.service';
import { ToastContainerComponent } from './toast-container.component';

/**
 * The container used to render every active toast and take its corner from whichever
 * toast happened to be first in the list. These specs pin the two properties that
 * replaced that: a container answers only for its own position, and recency — not DOM
 * order — decides which toast is painted on top.
 */
describe('ToastContainerComponent', () => {
	let fixture: ComponentFixture<ToastContainerComponent>;
	let service: ToastService;

	beforeEach(() => {
		// timeOut 0 keeps every toast persistent, so no auto-dismiss timer outlives the test.
		TestBed.configureTestingModule({ providers: [provideToast({ timeOut: 0 })] });
		service = TestBed.inject(ToastService);
		fixture = TestBed.createComponent(ToastContainerComponent);
	});

	afterEach(async () => {
		// The service mounts its own containers from a dynamic import; let those land before
		// clearing, or they reach document.body after the test that created them is over.
		await new Promise((resolve) => setTimeout(resolve));
		document.querySelectorAll('hub-toast-container').forEach((element) => element.remove());
	});

	/** The toast hosts this container has actually rendered, in DOM order. */
	function renderedToasts(): HTMLElement[] {
		return [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('hub-toast')];
	}

	it('wears its position as the class that anchors it to a corner', () => {
		fixture.componentRef.setInput('position', 'toast-bottom-center');
		fixture.detectChanges();

		const host = fixture.nativeElement as HTMLElement;
		expect(host.classList.contains('hub-toast-container')).toBe(true);
		expect(host.classList.contains('toast-bottom-center')).toBe(true);
	});

	it('renders only the toasts configured for its own position', () => {
		fixture.componentRef.setInput('position', 'toast-bottom-left');
		service.success('Mine', '', { positionClass: 'toast-bottom-left' });
		service.success('Someone else’s', '', { positionClass: 'toast-top-right' });
		fixture.detectChanges();

		expect(renderedToasts()).toHaveLength(1);
		expect(renderedToasts()[0].textContent).toContain('Mine');
	});

	it('paints a toast that has just opened above the ones already on screen', () => {
		fixture.componentRef.setInput('position', 'toast-top-right');
		service.success('Older', '', { positionClass: 'toast-top-right' });
		service.success('Newer', '', { positionClass: 'toast-top-right' });
		fixture.detectChanges();

		const [first, second] = renderedToasts();
		// newestOnTop renders the newest first, where without an explicit level it would
		// paint underneath the sibling that follows it.
		expect(first.textContent).toContain('Newer');
		expect(Number(first.style.zIndex)).toBeGreaterThan(Number(second.style.zIndex));
	});
});
